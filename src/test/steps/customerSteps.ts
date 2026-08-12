import {
    Given,
    When,
    Then
} from "@cucumber/cucumber";

import CustomerPage from "../pageObjects/CustomerPage";
import LoginPage from "../pageObjects/LoginPage";
import { pageFixture } from "../utils/pageFixture";

Given(
    "administrator is logged in for Customer Management",
    async function () {
        const page = pageFixture.page;

        if (!page) {
            throw new Error(
                "Playwright page was not initialized by the Before hook."
            );
        }

        if (page.isClosed()) {
            throw new Error(
                "Playwright page is already closed before Customer Management login."
            );
        }

        const emailInput = page.locator(
            'input[id="email"]'
        );

        const dashboardHeading = page
            .locator("h1")
            .filter({
                hasText: /Dashboard/i
            })
            .first();

        const loginPageVisible = await emailInput
            .isVisible({
                timeout: 5000
            })
            .catch(() => false);

        if (loginPageVisible) {
            const loginPage = new LoginPage();

            await loginPage.enterEmailAndPassword(
                "super_admin@gmail.com",
                "Admin@2024!"
            );

            await loginPage.clickSubmit();

            await dashboardHeading.waitFor({
                state: "visible",
                timeout: 30000
            });

            await loginPage.verifyAdminLoginSuccess();

            pageFixture.logger.info(
                "Administrator logged in for Customer Management"
            );

            return;
        }

        const dashboardVisible = await dashboardHeading
            .isVisible({
                timeout: 5000
            })
            .catch(() => false);

        if (!dashboardVisible) {
            throw new Error(
                `Neither the login page nor the Admin Dashboard is displayed. Current URL: ${page.url()}`
            );
        }

        pageFixture.logger.info(
            "Administrator is already on the Admin Dashboard"
        );
    }
);

When(
    "user clicks Customer Management",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.navigateToCustomerManagement();
    }
);

Then(
    "verify Customer Management heading is visible",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerManagementHeading();
    }
);

Then(
    "verify customer records table is visible",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerTableVisible();
    }
);

When(
    "user searches for customer by name {string}",
    async function (customerName: string) {
        const customerPage = new CustomerPage();

        await customerPage.searchCustomer(
            customerName
        );
    }
);

When(
    "user searches for customer by email {string}",
    async function (email: string) {
        const customerPage = new CustomerPage();

        await customerPage.searchCustomer(
            email
        );
    }
);

When(
    "user searches for customer by nic {string}",
    async function (nic: string) {
        const customerPage = new CustomerPage();

        await customerPage.searchCustomer(
            nic
        );
    }
);

When(
    "user clears the customer search",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.clearCustomerSearch();
    }
);

Then(
    "verify customer search results contain {string}",
    async function (expectedValue: string) {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerSearchResults(
            expectedValue
        );
    }
);

When(
    "user opens the first customer record",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.openFirstCustomerRecord();
    }
);

Then(
    "verify customer details popup is displayed",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerDetailsPopupDisplayed();
    }
);

Then(
    "verify customer verification section is displayed",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage
            .verifyCustomerVerificationSectionDisplayed();
    }
);

Then(
    "verify required customer details are displayed",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage
            .verifyRequiredCustomerDetailsDisplayed();
    }
);

Then(
    "close the customer details popup",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.closeCustomerDetailsPopup();
    }
);

When(
    "user clicks on disable action for the first customer",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage
            .clickDisableActionForFirstCustomer();
    }
);

Then(
    "verify customer account is disabled",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerAccountDisabled();
    }
);

When(
    "user clicks on enable action for the first customer",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage
            .clickEnableActionForFirstCustomer();
    }
);

Then(
    "verify customer account is enabled",
    async function () {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerAccountEnabled();
    }
);

When(
    "user selects the {string} customer status filter",
    async function (status: string) {
        const customerPage = new CustomerPage();

        await customerPage.selectCustomerStatusFilter(
            status
        );
    }
);

Then(
    "verify customer records match the {string} status filter",
    async function (status: string) {
        const customerPage = new CustomerPage();

        await customerPage.verifyCustomerRecordsByStatus(
            status
        );
    }
);