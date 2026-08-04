import { Given, When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../utils/pageFixture';
import LoginPage from '../pageObjects/LoginPage';
import KYCPage from '../pageObjects/KYCPage';

const loginPage = new LoginPage();
const kycPage = new KYCPage();

// -------------------- Login --------------------

Given('user is logged in to the admin dashboard', async function () {
    await loginPage.login('super_admin@gmail.com', 'Admin@2024!');
    await loginPage.verifyAdminLoginSuccess();

    pageFixture.logger.info('User is logged in to the admin dashboard');
});

// -------------------- Navigation --------------------

When('user clicks KYC Management', async function () {
    await kycPage.navigateToKYCRequests();
});

Then('verify KYC Requests heading is visible', async function () {
    await kycPage.verifyKycRequestsHeadingVisible();
});

Then('verify summary cards are visible', async function () {
    await kycPage.verifySummaryCards();
});

// -------------------- Status Filter --------------------

When(
    'user filters KYC requests by status {string}',
    async function (status: string) {
        await kycPage.filterKYCRequestsByStatus(status);
    }
);

Then(
    'verify only {string} KYC requests are displayed',
    async function (status: string) {
        await kycPage.verifyOnlyKYCRequestsWithStatus(status);
    }
);

// -------------------- Search --------------------

When(
    'user searches by {string} using value {string}',
    async function (searchType: string, searchValue: string) {
        await kycPage.verifySearch(searchType, searchValue);
    }
);

Then(
    'verify search results are displayed for {string}',
    async function (searchValue: string) {
        await kycPage.verifySearchResultsDisplayed(searchValue);
        await kycPage.clearSearchField(); // Clear the search field after verification
    }
);

Then(
    'verify no search results are displayed with message {string}',
    async function (message: string) {
        await kycPage.verifyNoSearchResultsDisplayed(message);
        await kycPage.clearSearchField();

    }
);

// -------------------- Review Details --------------------

When('user selects first KYC request from the list', async function () {
    await kycPage.selectFirstKYCRequest();
});

When('user clicks on Review Details button', async function () {
    await kycPage.clickReviewDetailsButton();
});

Then('verify personal details section is displayed', async function () {
    await kycPage.verifyPersonalDetailsSectionVisible();
});

Then('verify documents section is displayed', async function () {
    await kycPage.verifyDocumentsSectionVisible();
});

Then(
    'verify KYC details contain name, father name, mother name, NIC, and address',
    async function () {
        await kycPage.verifyRequiredKYCDetailsVisible();
    }
);

Then('verify all required document fields are visible', async function () {
    await kycPage.verifyRequiredDocumentFieldsVisible();
});

Then('verify document status is either Verified, Rejected, or Pending', async () => {

    const allowedStatuses = [
        'Verified',
        'Rejected',
        'Pending'
    ];

    const actualStatus = await kycPage.getDocumentStatus();

    expect(allowedStatuses).toContain(actualStatus);
});

// -------------------- Search Result --------------------

When('user clicks on first search result', async function () {
    await kycPage.clickFirstSearchResult();
});

Then('verify applicant name is {string}', async function (expectedName: string) {
    await kycPage.verifyApplicantName(expectedName);
});

Then('close the Review Details popup', async function () {
    await kycPage.closeReviewDetailsPopup();
})


function expect(actual: any) {
    return {
        toContain(expected: any) {
            if (!Array.isArray(actual)) {
                throw new Error(`Expected an array but received ${typeof actual}`);
            }
            if (!actual.includes(expected)) {
                throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(expected)}`);
            }
        }
    };
}

