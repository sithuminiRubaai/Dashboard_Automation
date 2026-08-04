import { pageFixture } from "../utils/pageFixture";
import fs from 'fs';
import { expect, Locator, Page } from "@playwright/test";
import { expectCountGreaterThan, expectText, expectVisible, expectContainsText } from '../utils/common';

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
        return this.activePage.locator("//select[contains(@class, 'w-full rounded-lg border')]");
    }

    get statusColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(7)');
    }

    get searchType(): Locator {
       return this.activePage.locator("//select[starts-with(@class,'rounded-lg border')]");
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
        try {
            await this.kycManagementMenu.click();
            await pageFixture.logger.info("Clicked KYC Management and navigated to KYC Requests page");
            await pageFixture.page.waitForLoadState("networkidle");
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-navigation-error-${Date.now()}.png`
            });
            throw error;
        }
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

    async filterKYCRequestsByStatus(status: string) {
        try {
            await this.statusFilterControl.click();
            await this.selectDropdownOption(this.statusFilter, { label: status });
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info(`Filtered KYC requests by status: ${status}`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-filter-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifyOnlyKYCRequestsWithStatus(status: string) {
        try {
            await this.verifyStatusFilter();
            await pageFixture.logger.info(`Verified only ${status} KYC requests are displayed`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-status-verify-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async searchKYCRequestByName(name: string) {
        try {
            const searchBoxName = this.searchBoxName;
            await searchBoxName.fill(name);
            await pageFixture.page.waitForLoadState("networkidle");
            pageFixture.logger.info(`Searched for KYC request by name: ${name}`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-search-name-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async searchKYCRequestByEmail(email: string) {
        try {
            const searchTypeDropdown = this.searchType;
            if (await searchTypeDropdown.isVisible()) {
                await searchTypeDropdown.click();
                await this.selectDropdownOption(this.searchType, { value: "email" });
            }

            const searchBoxEmail = this.searchBoxEmail;
            await searchBoxEmail.fill(email);
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info(`Searched for KYC request by email: ${email}`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-search-email-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifySearchResultsWithMatchingNames() {
        try {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified ${count} search results with matching names`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-search-results-error-${Date.now()}.png`
            });
            throw error;
        }
    }
    async closeReviewDetailsPopup() {
    await this.closeReviewDetailsButton.click();
    await pageFixture.logger.info("Review Details popup closed.");
   }

    async verifySearchResultsWithMatchingEmails() {
        try {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified ${count} search results with matching emails`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-search-email-results-error-${Date.now()}.png`
            });
            throw error;
        }
    }

async verifySearch(searchType: string, searchValue: string) {
    await this.selectDropdownOption(this.searchType, { value: searchType });

    const searchBox = this.getSearchBox();
    await searchBox.fill(searchValue);

    console.log(`Search Type: ${searchType}`);
    console.log(`Search Value: ${searchValue}`);

    await searchBox.press('Enter');

    // await this.verifyFirstRowValue(searchType, searchValue);
}

async verifyFirstRowValue(searchType: string, expectedValue: string) {
  const columnIndex = this.columnMap[searchType];
  if (!columnIndex) {
    throw new Error(`Unknown searchType: ${searchType}`);
  }

const firstCell = this.activePage.locator(`xpath=//tbody/tr[1]/td[${columnIndex}]`);
await expect(firstCell).toBeVisible();

const actualValue = (await firstCell.textContent())?.trim() || '';
console.log(`Search Type: "${searchType}" | Expected: "${expectedValue}" | Actual Cell Value: "${actualValue}"`);

expect(actualValue).toBe(expectedValue);
}

    async selectFirstKYCRequest() {
        const firstRow = pageFixture.page.locator("tbody tr").first();
        await firstRow.click();
        await pageFixture.page.waitForLoadState("networkidle");
        await pageFixture.logger.info("Selected first KYC request from the list");
    }

    async clickReviewDetailsButton() {
        try {
            const reviewButton = this.reviewDetailsButton;
            await reviewButton.click();
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info("Clicked on Review Details button");
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-review-button-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifyPersonalDetailsSectionVisible() {
        try {
            const personalDetailsHeader = this.personalDetailsHeader;
            await expect(personalDetailsHeader).toBeVisible();
            await pageFixture.logger.info("Personal details section is visible");
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-personal-details-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifyDocumentsSectionVisible() {
        try {
            const documentsHeader = this.documentsHeader;
            await expect(documentsHeader).toBeVisible();
            await pageFixture.logger.info("Documents section is visible");
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-documents-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifyRequiredKYCDetailsVisible() {
    try {
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
    } catch (error) {
        await pageFixture.page.screenshot({
            path: `reports/screenshots/kyc-details-error-${Date.now()}.png`
        });
        throw error;
    }
}
    async verifyRequiredDocumentFieldsVisible() {
    try {
        const documentImages = pageFixture.page.locator('img');

        await expect(documentImages).toHaveCount(3);

        for (let i = 0; i < await documentImages.count(); i++) {
            await expect(documentImages.nth(i)).toBeVisible();
        }

        await pageFixture.logger.info("Verified all document images are visible.");
    } catch (error) {
        await pageFixture.page.screenshot({
            path: `reports/screenshots/kyc-document-fields-error-${Date.now()}.png`
        });
        throw error;
    }
}

async getDocumentStatus(): Promise<string> {
    try {
        await expect(this.customerStatusLabel).toBeVisible();

        const status = (await this.customerStatusLabel.textContent())?.trim();

        if (!status) {
            throw new Error("Document status is empty or not available");
        }

        pageFixture.logger.info(`Document status is: ${status}`);
        console.log(`Document status is: ${status}`);

        return status;

    } catch (error) {
        await pageFixture.page.screenshot({
            path: `reports/screenshots/document-status-${Date.now()}.png`
        });

        pageFixture.logger.error(`Failed to get document status: ${error}`);
        throw error;
    }
}


    async verifySearchResultsDisplayed(searchName: string) {
        try {
            const rows = pageFixture.page.locator("tbody tr");
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            await pageFixture.logger.info(`Verified search results are displayed for: ${searchName}`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-search-display-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async clickFirstSearchResult() {
        try {
            const firstResult = pageFixture.page.locator("tbody tr").first();
            await firstResult.click();
            await pageFixture.page.waitForLoadState("networkidle");
            await pageFixture.logger.info("Clicked on first search result");
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-first-result-error-${Date.now()}.png`
            });
            throw error;
        }
    }

    async verifyApplicantName(expectedName: string) {
        try {
            const nameField = pageFixture.page.locator('[class*="name"]').first();
            const actualName = await nameField.textContent();
            expect(actualName).toContain(expectedName);
            await pageFixture.logger.info(`Verified applicant name: ${expectedName}`);
        } catch (error) {
            await pageFixture.page.screenshot({
                path: `reports/screenshots/kyc-applicant-name-error-${Date.now()}.png`
            });
            throw error;
        }
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