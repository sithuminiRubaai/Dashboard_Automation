import { pageFixture } from "../utils/pageFixture";
import * as fs from 'fs';
import { expect, Locator, Page } from "@playwright/test";
import { expectCountGreaterThan, expectText, expectVisible, expectContainsText, expectRowsHaveExactStatus, withPageAction, captureAndThrow } from '../utils/common';

export default class KYCPage {
    readonly page: Page;
    searchBoxEmail: any;

    private readonly columnMap: Record<string, number> = {
        customerName: 1,
        email: 3,
        mobileNumber: 4,
        nic: 5,
        date: 6,
        status: 7,
        notes: 8,
    };
    private get clearSearchButton(): Locator {
        return this.activePage.locator("//button[@aria-label='Clear search']");
    }

    get totalRequestsCard(): Locator {
        return this.activePage.getByText('Total Requests');
    }

    get pendingCard(): Locator {
        return this.activePage.getByText('Pending').first();
    }

    get approvedCard(): Locator {
        return this.activePage.getByText('Approved').first();
    }

    get customerStatusLabel(): Locator {
    return this.activePage.locator(
        "(//span[     normalize-space()='Pending' or     normalize-space()='Verified' or     normalize-space()='Rejected' ])[1]"
    );
   }

    get rejectedCard(): Locator {
        return this.activePage.getByText('Rejected').first();
    }

    private get activePage(): Page {
        return this.page ?? pageFixture.page;
    }

    constructor(page?: Page) {
        this.page = page ?? (pageFixture.page as Page);
    }

    get kycManagementMenu(): Locator {
        return this.activePage.locator('(//a//span[normalize-space()="KYC Management"])[1]');
    }

    get kycRequestsHeading(): Locator {
        return this.activePage.locator('h1:has-text("KYC Requests")');
    }

    get statusFilter(): Locator {
        return this.statusFilterControl;
    }

    get statusFilterControl(): Locator {
        return this.activePage.locator("//label[normalize-space()='KYC Status']/following-sibling::select");
    }

    get statusColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(7)');
    }

    get searchType(): Locator {
       return this.activePage.locator("//label[normalize-space()='Search']/following::select[1]");
    }
    

    get searchBoxName(): Locator {
        return this.activePage.locator("//input[@placeholder='Search by name...']");
    }

    get nameColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(1)');
    }

    get emailColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(3)');
    }

    get nicColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(5)');
    }

    get mobileColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(4)');
    }

    get reviewDetailsButton(): Locator {
        return this.activePage.locator('button:has-text("Review Details")').first();
    }

    get personalDetailsHeader(): Locator {
        return this.activePage.locator('p:has-text("Personal Details")');
    }

    get documentsHeader(): Locator {
    return this.activePage.getByText('Documents', { exact: true });
}

    get fatherName(): Locator {
        return this.activePage.locator('span:has-text("Father Name")');
    }

    get motherName(): Locator {
        return this.activePage.locator('span:has-text("Mother Name")');
    }

    get dateOfBirth(): Locator {
        return this.activePage.locator('span:has-text("Date of Birth")');
    }

    get nicNumber(): Locator {
        return this.activePage.locator('span:has-text("NIC Number")');
    }

    get nicIssuedDate(): Locator {
        return this.activePage.locator('span:has-text("NIC Issued Date")');
    }

    get address(): Locator {
        return this.activePage.locator('span:has-text("Address")');
    }

    get kycSubmittedDate(): Locator {
        return this.activePage.locator('span:has-text("KYC Submitted Date")');
    }

    get verifiedStatus(): Locator {
        return this.activePage.locator('span:has-text("Verified")');
    }

    get rejectedStatus(): Locator {
        return this.activePage.locator('span:has-text("Rejected")');
    }

    get closeReviewDetailsButton() {
    return this.activePage.locator("//button[contains(@class,'flex-shrink-0') and contains(@class,'rounded-full')]");
    }
 

    getKYCRequestsHeading() {
        return this.kycRequestsHeading;
    }

    async navigateToKYCRequests() {
        return withPageAction('kyc-navigation', async () => {
            await this.kycManagementMenu.click();
            await pageFixture.logger.info("Clicked KYC Management and navigated to KYC Requests page");
            await pageFixture.page.waitForLoadState("networkidle");
        }, 'Failed to navigate to KYC Requests page');
    }

    async verifyKycRequestsHeadingVisible() {
        await expectVisible(this.getKYCRequestsHeading(), 'KYC Requests heading');
    }

    // Robust selector for dropdowns: uses native selectOption when possible,
    // falls back to clicking custom dropdown and choosing visible option by text.
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

        // Fallback for custom dropdowns
        await dropdown.click();
        await pageFixture.page.waitForTimeout(200);

        if (!optionText) {
            throw new Error('No option value or label provided for dropdown selection');
        }

        const optLocator = this.activePage.locator(`text="${optionText}"`).first();
        await optLocator.click();
        await pageFixture.page.waitForLoadState('networkidle');
    }

    getSearchBox(): Locator {
        return this.activePage.locator("input[placeholder*='Search'], input[type='search'], input").first();
    }

    async verifySummaryCardsVisible() {
        await expectVisible(this.totalRequestsCard, 'Total Requests summary card');
        console.log("Total Requests summary card is visible.");
        await expectVisible(this.pendingCard, 'Pending summary card');
        console.log("Pending summary card is visible.");
        await expectVisible(this.approvedCard, 'Approved summary card');
        console.log("Approved summary card is visible.");
        await expectVisible(this.rejectedCard, 'Rejected summary card');
        console.log("Rejected summary card is visible.");
    }

    async verifySummaryCards() {
        await expectVisible(this.pendingCard, 'Pending summary card');
        await expectVisible(this.approvedCard, 'Approved summary card');
        await expectVisible(this.rejectedCard, 'Rejected summary card');
        await pageFixture.logger.info("Summary cards verified successfully.");
    }

    async clearSearchField() {
    await this.clearSearchButton.waitFor({ state: 'visible' });
    await this.clearSearchButton.click();

    pageFixture.logger.info("Clicked Clear Search button.");
    await pageFixture.page.reload();
    await pageFixture.page.waitForLoadState('networkidle');
}

    async filterKYCRequestsByStatus(status: string) {
        return withPageAction('kyc-filter', async () => {
            const expectedValue = status.toUpperCase();
            await this.statusFilterControl.click();
            await this.selectDropdownOption(this.statusFilter, { label: status });
            await expect(this.statusFilter).toHaveValue(expectedValue);
            await this.waitForFilteredStatusRows(status);
            await pageFixture.logger.info(`Filtered KYC requests by status: ${status}`);
        }, `Failed to filter KYC requests by status: ${status}`);
    }

    async verifyOnlyKYCRequestsWithStatus(status: string) {
        return withPageAction('kyc-status-verify', async () => {
            await expect(this.statusFilter).toHaveValue(status.toUpperCase());
            await this.waitForFilteredStatusRows(status);
            await pageFixture.logger.info(`Verified only ${status} KYC requests are displayed`);
        }, `Failed to verify KYC requests status filter: ${status}`);
    }

    async waitForFilteredStatusRows(status: string) {
        const rows = this.activePage.locator('tbody tr');
        await expectRowsHaveExactStatus(rows, this.statusColumn, status, 'filter-status');
    }

    async searchKYCRequestByName(name: string) {
        return withPageAction('kyc-search-name', async () => {
            const searchBoxName = this.searchBoxName;
            await searchBoxName.fill(name);
            await pageFixture.page.waitForLoadState("networkidle");
            pageFixture.logger.info(`Searched for KYC request by name: ${name}`);
        }, `Failed to search KYC request by name: ${name}`);
    }

    async searchKYCRequestByEmail(email: string) {
        return withPageAction('kyc-search-email', async () => {
            const searchTypeDropdown = this.searchType;
            if (await searchTypeDropdown.isVisible()) {
                await searchTypeDropdown.click();
                await this.selectDropdownOption(this.searchType, { value: "email" });
            }

            const searchBoxEmail = this.searchBoxEmail;
            await searchBoxEmail.fill(email);
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info(`Searched for KYC request by email: ${email}`);
        }, `Failed to search KYC request by email: ${email}`);
    }

    async verifySearchResultsWithMatchingNames() {
        return withPageAction('kyc-search-names', async () => {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified ${count} search results with matching names`);
        }, 'Failed to verify search results with matching names');
    }
    async closeReviewDetailsPopup() {
    await this.closeReviewDetailsButton.click();
    await pageFixture.logger.info("Review Details popup closed.");
   }

    async verifySearchResultsWithMatchingEmails() {
        return withPageAction('kyc-search-emails', async () => {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified ${count} search results with matching emails`);
        }, 'Failed to verify search results with matching emails');
    }

async verifySearch(searchType: string, searchValue: string) {
    await this.selectDropdownOption(this.searchType, { value: searchType });

    const searchBox = this.getSearchBox();
    await searchBox.fill(searchValue);

    console.log(`Search Type: ${searchType}`);
    console.log(`Search Value: ${searchValue}`);

    await searchBox.press('Enter');

}


    async selectFirstKYCRequest() {
        const firstRow = pageFixture.page.locator("tbody tr").first();
        await firstRow.click();
        await pageFixture.page.waitForLoadState("networkidle");
        await pageFixture.logger.info("Selected first KYC request from the list");
    }

    async clickReviewDetailsButton() {
        return withPageAction('kyc-review-button', async () => {
            const reviewButton = this.reviewDetailsButton;
            await reviewButton.click();
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info("Clicked on Review Details button");
        }, 'Failed to click Review Details button');
    }

    async verifyPersonalDetailsSectionVisible() {
        return withPageAction('kyc-personal-details', async () => {
            const personalDetailsHeader = this.personalDetailsHeader;
            await expect(personalDetailsHeader).toBeVisible();
            await pageFixture.logger.info("Personal details section is visible");
        }, 'Failed to verify personal details section');
    }

    async verifyDocumentsSectionVisible() {
        return withPageAction('kyc-documents', async () => {
            const documentsHeader = this.documentsHeader;
            await expect(documentsHeader).toBeVisible();
            await pageFixture.logger.info("Documents section is visible");
        }, 'Failed to verify documents section');
    }

    async verifyRequiredKYCDetailsVisible() {
        return withPageAction('kyc-details-visible', async () => {
            await expect(this.fatherName).toBeVisible();
            await expect(this.motherName).toBeVisible();
            await expect(this.dateOfBirth).toBeVisible();
            await expect(this.nicNumber).toBeVisible();
            await expect(this.nicIssuedDate).toBeVisible();
            await expect(this.address).toBeVisible();
            await expect(this.nicNumber).toBeVisible();
            await expect(this.kycSubmittedDate).toBeVisible();

            const fatherNameValue = await this.activePage
                .locator('//span[normalize-space()="Father Name"]/following-sibling::span')
                .innerText();

            const motherNameValue = await this.activePage
                .locator('//span[normalize-space()="Mother Name"]/following-sibling::span')
                .innerText();

            const DOBValue = await this.activePage
                .locator('//span[normalize-space()="Date of Birth"]/following-sibling::span')
                .innerText();

            const nicValue = await this.activePage
                .locator('//span[normalize-space()="NIC Number"]/following-sibling::span')
                .innerText();

            const nicIssueDateValue = await this.activePage
                .locator('//span[normalize-space()="NIC Issued Date"]/following-sibling::span')
                .innerText();   

            const addressValue = await this.activePage
                .locator('//span[normalize-space()="Address"]/following-sibling::span')
                .innerText();
            const KYCSubmittedDateValue = await this.activePage
                .locator('//span[normalize-space()="NIC Issued Date"]/following-sibling::span')
                .innerText();      

            console.log("Father Name:", fatherNameValue);
            console.log("Mother Name:", motherNameValue);
            console.log("NIC:", nicValue);
            console.log("NIC Issued Date:", nicIssueDateValue);
            console.log("Date of Birth:", DOBValue);
            console.log("Address:", addressValue);
            console.log("KYC Submitted Date:", KYCSubmittedDateValue);

            pageFixture.logger.info("All required KYC details are visible");
        }, 'Failed to verify required KYC details are visible');
    }
    async verifyRequiredDocumentFieldsVisible() {
        return withPageAction('kyc-required-document-fields', async () => {
            const documentImages = pageFixture.page.locator('img');

            await expect(documentImages).toHaveCount(3);

            for (let i = 0; i < await documentImages.count(); i++) {
                await expect(documentImages.nth(i)).toBeVisible();
            }

            await pageFixture.logger.info("Verified all required document images are visible.");
        }, 'Failed to verify required document fields are visible');
    }

async getDocumentStatus(): Promise<string> {
    return withPageAction('kyc-document-status', async () => {
        await expect(this.customerStatusLabel).toBeVisible();

        const status = (await this.customerStatusLabel.textContent())?.trim();

        if (!status) {
            throw new Error("Document status is empty or not available");
        }

        pageFixture.logger.info(`Document status is: ${status}`);
        console.log(`Document status is: ${status}`);

        return status;
    }, 'Failed to get document status');
}


    async verifySearchResultsDisplayed(searchName: string) {
        return withPageAction('kyc-search-display', async () => {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified search results are displayed for: ${searchName}`);
        }, `Failed to verify search results are displayed for: ${searchName}`);
    }

    async verifyNoSearchResultsDisplayed(message: string) {
        return withPageAction('kyc-no-search-results', async () => {
            const noResultsSelector = 'tbody tr td[colspan="9"]';
            const noResults = pageFixture.page.locator(noResultsSelector);
            await noResults.waitFor({ state: 'visible', timeout: 15000 });

            const maxAttempts = 30;
            let lastText = '';

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                lastText = (await noResults.textContent())?.trim() ?? '';
                if (lastText === message) {
                    await pageFixture.logger.info(`Verified no search results are displayed with message: ${message}`);
                    return;
                }
                if (lastText !== 'Loading...') {
                    break;
                }
                await pageFixture.page.waitForTimeout(500);
            }

            await expect(noResults).toHaveText(message, { timeout: 15000 });
            await pageFixture.logger.info(`Verified no search results are displayed with message: ${message}`);
        }, `Failed to verify no search results message: ${message}`);
    }

    async clickFirstSearchResult() {
        return withPageAction('kyc-click-first-search-result', async () => {
            const firstResult = pageFixture.page.locator("tbody tr").first();
            await firstResult.click();
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info("Clicked on first search result");
        }, 'Failed to click first search result');
    }

    async verifyApplicantName(expectedName: string) {
        return withPageAction('kyc-applicant-name', async () => {
            const nameField = pageFixture.page.locator('[class*="name"]').first();
            const actualName = await nameField.textContent();
            expect(actualName).toContain(expectedName);
            await pageFixture.logger.info(`Verified applicant name: ${expectedName}`);
        }, `Failed to verify applicant name: ${expectedName}`);
    }

    async verifyStatusFilter() {
        const statuses = [
            { value: "PENDING", text: "Pending" },
            { value: "VERIFIED", text: "Verified" },
            { value: "REJECTED", text: "Rejected" }
        ];

        for (const status of statuses) {
            await this.selectDropdownOption(this.statusFilter, { value: status.value });
            await pageFixture.page.waitForLoadState('networkidle');

            // wait for any loading indicator to disappear
            const loading = this.activePage.locator('text=Loading...').first();
            try { await loading.waitFor({ state: 'hidden', timeout: 10000 }); } catch {}

            const statusCells = this.statusColumn;
            // poll for rows
            let rowCount = await statusCells.count();
            const maxAttempts = 16;
            let attempt = 0;
            while (rowCount === 0 && attempt < maxAttempts) {
                await pageFixture.page.waitForTimeout(500);
                rowCount = await statusCells.count();
                attempt++;
            }

            if (rowCount === 0) {
                const timestamp = Date.now();
                const html = await pageFixture.page.content();
                const debugFile = `reports/debug-statusfilter-${timestamp}.html`;
                try { fs.writeFileSync(debugFile, html); } catch (e) {}
                await pageFixture.page.screenshot({ path: `reports/screenshots/kyc-statusfilter-${timestamp}.png` });
                throw new Error(`No rows found after applying status filter: ${status.text}. Saved HTML: ${debugFile}`);
            }

            for (let i = 0; i < rowCount; i++) {
                const actualStatus = (await statusCells.nth(i).textContent())?.trim();
                if (actualStatus !== status.text) {
                    const timestamp = Date.now();
                    const html = await pageFixture.page.content();
                    const debugFile = `reports/debug-statusfilter-mismatch-${timestamp}.html`;
                    try { fs.writeFileSync(debugFile, html); } catch (e) {}
                    await pageFixture.page.screenshot({ path: `reports/screenshots/kyc-statusfilter-mismatch-${timestamp}.png` });
                    throw new Error(`Expected all rows to be '${status.text}' but found '${actualStatus}'. Saved HTML: ${debugFile}`);
                }
            }

            await pageFixture.logger.info(`${status.text} filter verified.`);
        }

        // Reset to All (try selecting empty value)
        try { await this.statusFilter.selectOption(''); } catch {}
    }

    async verifyReviewDetails() {

        await this.reviewDetailsButton.click();

        await expect(
            this.personalDetailsHeader
        ).toBeVisible();

        await expect(
            this.documentsHeader
        ).toBeVisible();

        await expect(
            this.fatherName
        ).toBeVisible();

        await expect(
            this.motherName
        ).toBeVisible();

        await expect(
            this.dateOfBirth
        ).toBeVisible();

        await expect(
            this.nicNumber
        ).toBeVisible();

        await expect(
            this.nicIssuedDate
        ).toBeVisible();

        await expect(
            this.address
        ).toBeVisible();

        await expect(
            this.kycSubmittedDate
        ).toBeVisible();

        const verified = this.verifiedStatus;
        const rejected = this.rejectedStatus;

        if (await verified.count() > 0) {
            await expect(verified.first()).toBeVisible();
        }

        if (await rejected.count() > 0) {
            await expect(rejected.first()).toBeVisible();
        }

        await pageFixture.logger.info("Review Details verified successfully.");
    }
}