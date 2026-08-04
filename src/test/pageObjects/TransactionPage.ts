import { expect, Locator } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";
import { expectVisible } from "../utils/common";

export type PaymentTab =
    | "Top Up"
    | "Withdraw"
    | "QR Payment"
    | "Bill Payment"
    | "Fund Transfer";

export default class TransactionPage {

    private selectors = {
        paymentTab: (tabName: PaymentTab) =>
            `//button[normalize-space()='${tabName}']`,

        transactionManagementMenu:
            "//a[@href='/transactions' and .//span[normalize-space()='Transactions Management']]",

        transactionHeading:
            "//h1[normalize-space()='Transactions Management']"
    };

    get activePage() {
        return pageFixture.page;
    }

    async verifyPaymentTabVisible(tabName: PaymentTab) {
        const tab = this.activePage.locator(
            this.selectors.paymentTab(tabName)
        );

        await expect(tab).toBeVisible();
    }

    async navigateToTransaction() {
        const menu = this.activePage.locator(
            this.selectors.transactionManagementMenu
        ).first();

        await expectVisible(menu, "Transactions Management Menu");
        await menu.click();
        await this.activePage.waitForLoadState("networkidle");
        await this.activePage.waitForURL(/\/transactions/, { timeout: 30000 });

        await pageFixture.logger.info(
            "Navigated to Transactions Management page"
        );
    }

    async verifyTransactionManagementHeadingVisible() {
        const heading = this.activePage.locator(
            "//main//*[contains(normalize-space(), 'Transactions Management') or contains(normalize-space(), 'Transaction Management') or contains(normalize-space(), 'Transactions') or contains(normalize-space(), 'Transaction')]");
        await expectVisible(
            heading,
            "Transactions Management Heading"
        );
    }

    async clickPaymentTab(tabName: PaymentTab) {
        const tab = this.activePage.locator(
            this.selectors.paymentTab(tabName)
        );

        await expectVisible(tab, `${tabName} tab`);
        await tab.click();
    }
}