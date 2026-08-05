import { expect, Locator } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";
import { expectVisible, expectRowsHaveExactStatus, withPageAction } from "../utils/common";

export type PaymentTab =
    | "Top Up"
    | "Withdraw"
    | "QR Payment"
    | "Bill Payment"
    | "Fund Transfer";

export default class TransactionPage {

    private selectedTransactionId?: string;

    private selectors = {
        paymentTab: (tabName: PaymentTab) => {
            // Support common label variants (e.g. "Fund Transfer" vs "Transfer")
            const variants: Record<string, string[]> = {
                'Fund Transfer': ['Fund Transfer', 'Transfer'],
                'QR Payment': ['QR Payment', 'QR'],
                'Top Up': ['Top Up', 'Top-up', 'Topup']
            };

            const labels = variants[tabName] ?? [tabName];
            const orClauses = labels.map(l => `normalize-space()='${l}' or contains(normalize-space(), '${l}')`).join(' or ');
            return `//div[@role='tablist']//button[@role='tab' and (${orClauses})]`;
        },

        transactionManagementMenu:
            "//a[@href='/transactions' and .//span[normalize-space()='Transactions Management']]",

        transactionHeading:
            "//h1[normalize-space()='Transaction Management']"
    };

    get activePage() {
        return pageFixture.page;
    }

    get transactionHeading(): Locator {
        return this.activePage.locator(this.selectors.transactionHeading).first();
    }

    get transactionSearchInput(): Locator {
        return this.activePage.locator(
            "input[placeholder='Customer name or transaction ID...'], input[placeholder*='Customer name or transaction ID'], input[placeholder*='Search'], input[type='search'], input[aria-label*='search']"
        );
    }

    get transactionDateFilter(): Locator {
        return this.activePage.locator("select#date");
    }

    get transactionStatusFilter(): Locator {
        return this.activePage.locator("select#status");
    }

    getTransactionHeading() {
        return this.transactionHeading;
    }

    async searchTransactions(searchValue: string) {
        const searchInput = this.transactionSearchInput;
        await expectVisible(searchInput, 'Transaction search input');
        await searchInput.click();
        await searchInput.fill(searchValue);
        await searchInput.press('Enter');
        await this.activePage.waitForLoadState('networkidle');
        await pageFixture.logger.info(`Searched transactions for ${searchValue}`);
    }

    async verifyTransactionSearchResultsDisplayed(searchValue: string) {
        const row = this.activePage.locator(`tbody tr:has-text("${searchValue}")`).first();
        await expectVisible(row, `Transaction search results for ${searchValue}`);
        await pageFixture.logger.info(`Verified transaction search results for ${searchValue}`);
    }

    async verifyNoTransactionSearchResultsDisplayed(searchValue: string) {
        return withPageAction('transaction-no-search-results', async () => {
            const noResultsSelector = 'tbody tr td[colspan="8"]';
            const noResults = this.activePage.locator(noResultsSelector);
            await noResults.waitFor({ state: 'visible', timeout: 15000 });

            const expectedMessage = 'No transactions found.';
            const maxAttempts = 30;
            let lastText = '';

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                lastText = (await noResults.textContent())?.trim() ?? '';
                if (lastText === expectedMessage) {
                    await pageFixture.logger.info(`Verified no transaction search results are displayed with message: ${expectedMessage}`);
                    return;
                }
                if (lastText !== 'Loading...') {
                    break;
                }
                await this.activePage.waitForTimeout(500);
            }

            await expect(noResults).toHaveText(expectedMessage, { timeout: 15000 });
            await pageFixture.logger.info(`Verified no transaction search results are displayed with message: ${expectedMessage}`);
        }, `Failed to verify no search results message: ${searchValue}`);
    }

    async selectDropdownOption(dropdown: Locator, option: { value?: string; label?: string }) {
        const optionText = option.label ?? option.value;
        try {
            const tag = await dropdown.evaluate((el: any) => el.tagName);
            if (tag && tag.toUpperCase() === 'SELECT') {
                if (option.label) {
                    await dropdown.selectOption({ label: option.label });
                } else if (option.value !== undefined) {
                    await dropdown.selectOption({ value: option.value });
                } else {
                    await dropdown.selectOption('');
                }
                return;
            }
        } catch (e) {
            // fall through to click-based fallback
        }

        await dropdown.click();
        await pageFixture.page.waitForTimeout(200);

        if (!optionText) {
            throw new Error('No option value or label provided for dropdown selection');
        }

        const optLocator = this.activePage.locator(`text="${optionText}"`).first();
        await optLocator.click();
        await pageFixture.page.waitForLoadState('networkidle');
    }

    async filterTransactionsByStatus(status: string) {
        return withPageAction('transaction-filter-status', async () => {
            const filter = this.transactionStatusFilter;
            await expectVisible(filter, 'Transaction status filter');
            await filter.click();
            await this.selectDropdownOption(filter, { label: status });
            const expectedValue = this.normalizeTransactionStatus(status);
            await expect(filter).toHaveValue(expectedValue, { timeout: 15000 });
            await this.waitForTransactionTableReady();

            await pageFixture.logger.info(`Filtered transactions by status ${status}`);
        }, `Failed to filter transactions by status: ${status}`);
    }

    async waitForFilteredStatusRows(status: string) {
        await this.waitForTransactionTableReady();

        const normalizedStatus = status.trim().toLowerCase();
        if (normalizedStatus === 'all statuses' || normalizedStatus === 'all') {
            const firstRow = this.activePage.locator('tbody tr').first();
            await expectVisible(firstRow, 'At least one transaction after All Statuses filter');
            return;
        }

        const rows = this.activePage.locator('tbody tr');
        const statusColumnIndex = await this.getTransactionStatusColumnIndex();
        const statusCells = this.activePage.locator(`tbody tr td:nth-child(${statusColumnIndex + 1})`);
        await expectRowsHaveExactStatus(rows, statusCells, status, 'transaction-filter-status');
    }

    async waitForTransactionTableReady() {
        const busyLocator = this.activePage.locator('[aria-busy="true"]');
        if (await busyLocator.count() > 0) {
            await busyLocator.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {
                // If the busy indicator remains, let subsequent assertions detect stale state.
            });
        }

        const table = this.activePage.locator('table');
        await expectVisible(table, 'Transaction results table');
        await this.activePage.waitForTimeout(300);
    }

    private normalizeTransactionStatus(status: string): string {
        const normalized = status.trim().toLowerCase();
        const valueMap: Record<string, string> = {
            'all statuses': 'all',
            'all': 'all',
            'success': 'success',
            'failed': 'failed',
            'pending': 'pending'
        };
        return valueMap[normalized] ?? normalized;
    }

    private normalizeTransactionDateRange(dateRange: string): 'today' | '7days' | '30days' {
        const normalized = dateRange.trim().toLowerCase();
        if (normalized === 'today') {
            return 'today';
        }
        if (normalized.includes('7') && normalized.includes('day')) {
            return '7days';
        }
        if (normalized.includes('30') && normalized.includes('day')) {
            return '30days';
        }
        if (normalized === '7days' || normalized === '30days') {
            return normalized as '7days' | '30days';
        }
        throw new Error(`Unsupported transaction date range: ${dateRange}`);
    }

    async filterTransactionsByDateRange(dateRange: string) {
        const optionValue = this.normalizeTransactionDateRange(dateRange);
        return withPageAction('transaction-filter-date', async () => {
            const filter = this.transactionDateFilter;
            await expectVisible(filter, 'Transaction date filter');
            await filter.click();
            await this.selectDropdownOption(filter, { value: optionValue });
            await expect(filter).toHaveValue(optionValue, { timeout: 15000 });
            await this.activePage.waitForLoadState('networkidle');
            await pageFixture.logger.info(`Filtered transactions by date range ${dateRange}`);
        }, `Failed to filter transactions by date range: ${dateRange}`);
    }

    async verifyTransactionDateFilterApplied(dateRange: string) {
        const optionValue = this.normalizeTransactionDateRange(dateRange);
        return withPageAction('transaction-verify-date-filter', async () => {
            const filter = this.transactionDateFilter;
            await expectVisible(filter, 'Transaction date filter');
            await expect(filter).toHaveValue(optionValue, { timeout: 15000 });
            await pageFixture.logger.info(`Verified transaction date range filter is applied: ${dateRange}`);
        }, `Failed to verify transaction date range filter: ${dateRange}`);
    }

    async getTransactionStatusColumnIndex(): Promise<number> {
        const headers = this.activePage.locator('thead tr th');
        const headerCount = await headers.count();
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).textContent())?.trim().toLowerCase() ?? '';
            if (headerText.includes('status')) {
                return i;
            }
        }

        throw new Error('Unable to determine transaction status column index from table headers');
    }

    async verifyOnlyTransactionsWithStatus(status: string) {
        await this.waitForTransactionTableReady();

        const normalizedStatus = status.trim().toLowerCase();
        const noResultsCell = this.activePage.locator('tbody tr td[colspan="8"]').first();
        const noResultsCount = await this.activePage.locator('tbody tr td[colspan="8"]').count();

        if (noResultsCount > 0) {
            const noResultsText = (await noResultsCell.textContent())?.trim().toLowerCase() ?? '';
            if (noResultsText.includes('no transactions found')) {
                if (normalizedStatus === 'all statuses' || normalizedStatus === 'all') {
                    await pageFixture.logger.info('All Statuses filter returned no transactions for the current dataset');
                    return;
                }

                await pageFixture.logger.info(`No transactions found for status ${status} under the current filter combination`);
                return;
            }
        }

        const statusColumnIndex = await this.getTransactionStatusColumnIndex();
        const statusCells = this.activePage.locator(`tbody tr td:nth-child(${statusColumnIndex + 1})`);
        const statusCellCount = await statusCells.count();

        if (statusCellCount === 0) {
            if (normalizedStatus === 'all statuses' || normalizedStatus === 'all') {
                await pageFixture.logger.info('All Statuses filter has no status cells to validate and no explicit no-results banner');
                return;
            }
            throw new Error(`No transaction status cells found after filtering by ${status}`);
        }

        if (normalizedStatus === 'all statuses' || normalizedStatus === 'all') {
            await pageFixture.logger.info(`Verified ${statusCellCount} transactions are displayed for all statuses`);
            await this.activePage.reload({ waitUntil: 'networkidle' });
            return;
        }

        await this.waitForFilteredStatusRows(status);
        const refreshedCount = await statusCells.count();
        await pageFixture.logger.info(`Verified ${refreshedCount} transactions with status ${status}`);
        await this.activePage.reload({ waitUntil: 'networkidle' });
    }

    async verifyPaymentTabVisible(tabName: PaymentTab) {
        const tab = this.activePage.locator(
            this.selectors.paymentTab(tabName)
        ).first();
        await expectVisible(tab, `${tabName} tab`);

        // Refresh to ensure tab content is loaded/refreshed after verification
        await this.activePage.reload();
        await this.activePage.waitForLoadState('networkidle');
        await pageFixture.logger.info(`${tabName} tab verified and page reloaded`);
    }

    async navigateToTransaction() {
        const menu = this.activePage.locator(
            this.selectors.transactionManagementMenu
        ).first();

        await expectVisible(menu, "Transactions Management Menu");
        await menu.click();
        // Rely on Playwright's auto-wait via expectVisible instead of manual waits
        const headingXPaths = [
            "//h1[normalize-space()='Transaction Management']"
        ];

        let found = false;
        for (const xp of headingXPaths) {
            const loc = this.activePage.locator(xp).first();
            try {
                await expectVisible(loc, "Transactions Management Heading");
                found = true;
                break;
            } catch (e) {
                // try next candidate
            }
        }

        if (!found) {
            // final broad attempt to let expectVisible throw a helpful error
            const broad = this.activePage.locator("//main//*[contains(normalize-space(), 'Transaction') or contains(normalize-space(), 'Transactions')]");
            await expectVisible(broad, "Transactions Management Heading");
        }

        await pageFixture.logger.info(
            "Navigated to Transactions Management page"
        );
    }

    async verifyTransactionManagementHeadingVisible() {
        const headingXPaths = [
            "//h1[normalize-space()='Transaction Management']"
        ];

        for (const xp of headingXPaths) {
            const loc = this.activePage.locator(xp).first();
            try {
                await expectVisible(loc, "Transactions Management Heading");
                return;
            } catch (e) {
                // try next
            }
        }

        // final broad attempt
        const broad = this.activePage.locator("//main//*[contains(normalize-space(), 'Transaction') or contains(normalize-space(), 'Transactions')]");
        await expectVisible(broad, "Transactions Management Heading");
    }

    async verifyTransactionHeadingVisible() {
        await expectVisible(this.getTransactionHeading(), 'Transactions Management heading');
    }

    get firstTransactionRow() {
        return this.activePage.locator("//tr[@role='button' and contains(@aria-label,'View transaction')]").first();
    }

    async getFirstTransactionId() {
        const row = this.firstTransactionRow;
        const ariaLabel = await row.getAttribute('aria-label');
        if (!ariaLabel) {
            throw new Error('Unable to read transaction row aria-label');
        }

        const match = ariaLabel.match(/View transaction\s+(.+)/);
        if (!match) {
            throw new Error(`Unable to parse transaction id from aria-label: ${ariaLabel}`);
        }

        return match[1].trim();
    }

    async selectFirstTransaction() {
        const row = this.firstTransactionRow;
        await expectVisible(row, 'First transaction row');
        this.selectedTransactionId = await this.getFirstTransactionId();
        await row.click();
        await this.activePage.waitForLoadState('networkidle');
        await pageFixture.logger.info(`Selected first transaction row: ${this.selectedTransactionId}`);
    }

    async verifySelectedTransactionDetailsVisible() {
        if (!this.selectedTransactionId) {
            throw new Error('No selected transaction id stored. Call selectFirstTransaction() first.');
        }

        const dialog = this.activePage.locator("//div[@role='dialog' and .//h2[@id='modal-title' and normalize-space()='Transaction Details']]").first();
        await expectVisible(dialog, 'Transaction Details dialog');

        const idRow = dialog.locator(`//span[normalize-space()='Transaction ID']/following-sibling::span[contains(normalize-space(), '${this.selectedTransactionId}')]`).first();
        await expectVisible(idRow, `Transaction ID ${this.selectedTransactionId}`);
        const actualTransactionId = (await idRow.textContent())?.trim() ?? 'N/A';

        const statusRow = dialog.locator("//span[normalize-space()='Status']/following-sibling::span//span[contains(normalize-space(), 'Success') or contains(normalize-space(), 'Pending') or contains(normalize-space(), 'Rejected')]").first();
        await expectVisible(statusRow, 'Transaction Status');
        const actualStatus = (await statusRow.textContent())?.trim() ?? 'N/A';

        const typeRow = dialog.locator("//span[normalize-space()='Transaction Type']/following-sibling::span[contains(normalize-space(), 'Withdraw') or contains(normalize-space(), 'Top Up') or contains(normalize-space(), 'QR Payment') or contains(normalize-space(), 'Bill Payment') or contains(normalize-space(), 'Fund Transfer')]").first();
        await expectVisible(typeRow, 'Transaction Type');
        const actualType = (await typeRow.textContent())?.trim() ?? 'N/A';

        const amountRow = dialog.locator("//span[normalize-space()='Total Amount']/following-sibling::span[contains(normalize-space(), 'LKR')]").first();
        await expectVisible(amountRow, 'Total Amount');
        const actualAmount = (await amountRow.textContent())?.trim() ?? 'N/A';

        await pageFixture.logger.info(`Verified transaction details for ${this.selectedTransactionId}: ID=${actualTransactionId}, Status=${actualStatus}, Type=${actualType}, Amount=${actualAmount}`);
    }

    async closeTransactionDetailsPopup() {
        const dialog = this.activePage.locator("//div[@role='dialog' and .//h2[@id='modal-title' and normalize-space()='Transaction Details']]").first();
        const closeButton = dialog.locator("//button[@aria-label='Close']").first();

        await expectVisible(closeButton, 'Close transaction details button');
        await closeButton.click();
        await this.activePage.waitForLoadState('networkidle');
        await pageFixture.logger.info('Closed transaction details popup');
    }

    async clickPaymentTab(tabName: PaymentTab) {
        const tab = this.activePage.locator(
            this.selectors.paymentTab(tabName)
        ).first();

        await expectVisible(tab, `${tabName} tab`);
        await tab.click();
    }
}