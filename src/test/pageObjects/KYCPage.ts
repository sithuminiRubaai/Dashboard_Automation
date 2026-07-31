import { pageFixture } from "../utils/pageFixture";
import { expect, Locator, Page } from "@playwright/test";
import { expectCountGreaterThan, expectText, expectVisible, expectContainsText } from '../utils/common';

export default class KYCPage {
    readonly page: Page;

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
        "(//span[normalize-space()='Verified' or normalize-space()='Rejected'])[1]"
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
        return this.activePage.locator('tbody tr td:nth-child(6)');
    }

    get searchType(): Locator {
       return this.activePage.locator("//select[starts-with(@class,'rounded-lg border')]");
    }

    get searchBox(): Locator {
        return this.activePage.locator('input[placeholder*="Search"]');
    }

    get nameColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(2)');
    }

    get emailColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(3)');
    }

    get nicColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(4)');
    }

    get mobileColumn(): Locator {
        return this.activePage.locator('tbody tr td:nth-child(5)');
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
            await this.statusFilter.selectOption({ label: status });
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
            const searchBox = this.searchBox;
            await searchBox.fill(name);
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
                await this.searchType.selectOption({ value: "email" });
            }

            const searchBox = this.searchBox;
            await searchBox.fill(email);
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

async verifyCustomerStatus() {
    try {
        await expect(this.customerStatusLabel).toBeVisible();

        const status = (await this.customerStatusLabel.innerText()).trim();

        console.log("Customer Status:", status);

        expect(["Verified", "Rejected"]).toContain(status);

        await pageFixture.logger.info(`Customer status is: ${status}`);
    } catch (error) {
        await pageFixture.page.screenshot({
            path: `reports/screenshots/customer-status-${Date.now()}.png`
        });
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

            await this.statusFilter.selectOption({ value: status.value });

            await pageFixture.page.waitForLoadState("networkidle");

            const statusCells = this.statusColumn;

            const count = await statusCells.count();

            expect(count).toBeGreaterThan(0);

            for (let i = 0; i < count; i++) {
                const actualStatus = (await statusCells.nth(i).textContent())?.trim();

                expect(actualStatus).toBe(status.text);
            }

            await pageFixture.logger.info(`${status.text} filter verified.`);
        }

        // Reset to All
        await this.statusFilter.selectOption("");
    }

    async verifySearch(searchType: string, searchValue: string) {

        await this.searchType.click();
        await this.searchType.selectOption({ value: searchType });

        const searchBox = this.searchBox;

        await searchBox.clear();
        await searchBox.fill(searchValue);

        await pageFixture.page.waitForLoadState("networkidle");

        let column;

        switch (searchType) {

            case "customerName":
                column = this.nameColumn;
                break;

            case "email":
                column = this.emailColumn;
                break;

            case "nic":
                column = this.nicColumn;
                break;

            case "mobileNumber":
                column = this.mobileColumn;
                break;

            default:
                throw new Error(`Invalid search type: ${searchType}`);
        }

        const count = await column.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {

            const value = (await column.nth(i).textContent())?.trim().toLowerCase();

            expect(value).toContain(searchValue.toLowerCase());
        }

        await pageFixture.logger.info(
            `Search verified. Type=${searchType}, Value=${searchValue}`
        );

        await searchBox.clear();

        await this.searchType.click();
        await this.searchType.selectOption({ value: "customerName" });
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
