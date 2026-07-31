import { Given, When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../utils/pageFixture';
import KYCPage from '../pageObjects/KYCPage';
import { expect } from '@playwright/test';
import LoginPage from '../pageObjects/LoginPage';


const kycPage = new KYCPage();
const loginPage = new LoginPage();

Given('user is logged in to the admin dashboard', async function () {
    await loginPage.enterEmailAndPassword('super_admin@gmail.com', 'Admin@2024!');
    await loginPage.clickSubmit();
    await pageFixture.page.waitForTimeout(5000);
    await loginPage.verifyAdminLoginSuccess();
    pageFixture.logger.info('User is logged in to admin dashboard');

});

When('user clicks KYC Management', async function () {
    await kycPage.navigateToKYCRequests();
});

Then('verify KYC Requests heading is visible', async function () {
    await kycPage.verifyKycRequestsHeadingVisible();
    console.log('KYC Requests heading is visible');
});

Then('verify summary cards are visible', async function () {
    await kycPage.verifySummaryCardsVisible();
});

When('user filters KYC requests by status {string}', async function (status: string) {
    await kycPage.filterKYCRequestsByStatus(status);
});

Then('verify only {string} KYC requests are displayed', async function (status: string) {
    await kycPage.verifyOnlyKYCRequestsWithStatus(status);
});

When('user searches for KYC request by name {string}', async function (name: string) {
    await kycPage.searchKYCRequestByName(name);
});

When('user searches for KYC request by email {string}', async function (email: string) {
    await kycPage.searchKYCRequestByEmail(email);
});

Then('verify search results contain only matching names', async function () {
    await kycPage.verifySearchResultsWithMatchingNames();
});

Then('verify search results contain only matching emails', async function () {
    await kycPage.verifySearchResultsWithMatchingEmails();
});

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

Then('verify KYC details contain name, father name, mother name, NIC, and address', async function () {
    await kycPage.verifyRequiredKYCDetailsVisible();
});

Then('verify all required document fields are visible', async function () {
    await kycPage.verifyRequiredDocumentFieldsVisible();
});

Then('verify document status is either {string} or {string}', async function (status1: string, status2: string) {
    await kycPage.verifyCustomerStatus();
});

Then('verify search results are displayed for {string}', async function (searchName: string) {
    await kycPage.verifySearchResultsDisplayed(searchName);
});

When('user clicks on first search result', async function () {
    await kycPage.clickFirstSearchResult();
});

Then('verify applicant name is {string}', async function (expectedName: string) {
    await kycPage.verifyApplicantName(expectedName);
});
