import { expect, Locator, Page } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";

export default class FeeManagementPage {
    private get activePage(): Page {
        return pageFixture.page;
    }

    get feeManagementMenu(): Locator {
        return this.activePage.getByRole("link", { name: "Fee Management", exact: true });
    }

    get feeManagementHeading(): Locator {
        return this.activePage.getByRole("heading", { name: "Fee Management", exact: true });
    }

    get calculatorAmount(): Locator {
        return this.activePage.getByRole("spinbutton").first();
    }

    get feeBreakdownHeading(): Locator {
        return this.activePage.getByRole("heading", { name: "Fee breakdown", exact: true });
    }

    get visibleTables(): Locator {
        return this.activePage.locator("main table:visible");
    }

    async navigateToFeeManagement(): Promise<void> {
        await this.feeManagementMenu.waitFor({ state: "visible", timeout: 20000 });
        await this.feeManagementMenu.click();
        await this.feeManagementHeading.waitFor({ state: "visible", timeout: 20000 });
        pageFixture.logger.info("Navigated to Fee Management page");
    }

    async verifyHeadingVisible(): Promise<void> {
        await expect(this.feeManagementHeading).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info("Fee Management heading is visible");
    }

    async verifyTabsVisible(): Promise<void> {
        for (const tab of ["Overview", "Calculator", "Provider slabs", "Wallet fees", "Rules engine", "Fee ledger"]) {
            await expect(this.activePage.getByRole("button", { name: tab, exact: true })).toBeVisible();
        }
        pageFixture.logger.info("All Fee Management tabs are visible");
    }

    async openTab(tab: string): Promise<void> {
        await this.activePage.getByRole("button", { name: tab, exact: true }).click();
        pageFixture.logger.info(`Opened Fee Management tab: ${tab}`);
    }

    async verifyProviderSlabsDisplayed(): Promise<void> {
        await this.openTab("Provider slabs");
        await expect(this.visibleTables.first()).toBeVisible({ timeout: 15000 });
        await expect(this.activePage.getByRole("columnheader", { name: "Service fee", exact: true })).toBeVisible();
        await expect(this.activePage.getByRole("row").filter({ hasText: "S1" }).first()).toBeVisible();
        pageFixture.logger.info("Provider fee slabs table is visible");
    }

    async verifyWalletFeesDisplayed(): Promise<void> {
        await this.openTab("Wallet fees");
        await expect(this.visibleTables.first()).toBeVisible({ timeout: 15000 });
        await expect(this.activePage.getByRole("columnheader", { name: "Status", exact: true })).toBeVisible();
        await expect(this.activePage.getByRole("row").filter({ hasText: "Active" }).first()).toBeVisible();
        pageFixture.logger.info("Wallet fees table is visible");
    }

    async calculateFee(amount: string): Promise<void> {
        await this.openTab("Calculator");
        await this.calculatorAmount.fill(amount);
        await this.activePage.getByRole("button", { name: "Calculate Fees", exact: true }).click();
        await expect(this.feeBreakdownHeading).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info(`Calculated fees for amount: ${amount}`);
    }
}