import { expect, Locator, Page } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";
import { getFeeManagementUrl } from "../../helper/config";

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

    get paymentRailsCard(): Locator {
        return this.activePage.locator("div.rounded-xl").filter({ hasText: "Payment rails" }).first();
    }

    providerSlabCard(providerName: string): Locator {
        return this.activePage.locator("div.rounded-xl").filter({ hasText: providerName }).first();
    }

    private tabButton(tab: string): Locator {
        return this.activePage
            .locator("button.whitespace-nowrap.border-b-2")
            .filter({ hasText: new RegExp(`^${this.escapeRegExp(tab)}$`) });
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

    async verifyPageUrl(): Promise<void> {
        const expectedUrl = getFeeManagementUrl();
        await expect(this.activePage).toHaveURL(expectedUrl, { timeout: 15000 });
        pageFixture.logger.info(`Verified Fee Management page URL: ${expectedUrl}`);
    }

    async verifyTabUrl(tab: string): Promise<void> {
        await this.openTab(tab);
        await this.verifyPageUrl();
        pageFixture.logger.info(`Verified URL is unchanged for tab: ${tab}`);
    }

    async verifyTabsVisible(): Promise<void> {
        for (const tab of ["Overview", "Calculator", "Provider slabs", "Wallet fees", "Rules engine", "Fee ledger"]) {
            await expect(this.tabButton(tab)).toBeVisible();
        }
        pageFixture.logger.info("All Fee Management tabs are visible");
    }

    async openTab(tab: string): Promise<void> {
        await this.tabButton(tab).click();
        pageFixture.logger.info(`Opened Fee Management tab: ${tab}`);
    }

    async verifyTabActive(tab: string): Promise<void> {
        const button = this.tabButton(tab);
        await expect(button).toHaveCSS("border-bottom-color", "rgb(99, 102, 241)");
        pageFixture.logger.info(`Verified tab is active: ${tab}`);
    }

    async verifyTabNavigation(tabs: string[]): Promise<void> {
        for (const tab of tabs) {
            await this.openTab(tab);
            await this.verifyTabActive(tab);
        }
        pageFixture.logger.info(`Verified tab navigation for: ${tabs.join(", ")}`);
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

    async verifyProviderCardDetails(
        providerName: string,
        subtitle: string,
        status: string,
        slabsCount: string
    ): Promise<void> {
        await this.openTab("Provider slabs");
        const card = this.providerSlabCard(providerName);
        await expect(card).toBeVisible({ timeout: 15000 });
        await expect(card.getByText(subtitle, { exact: true })).toBeVisible();
        await expect(card.getByText(status, { exact: true })).toBeVisible();
        await expect(card.getByText(slabsCount, { exact: true })).toBeVisible();
        pageFixture.logger.info(`Verified provider card details for ${providerName}`);
    }

    async verifyProviderSlabValues(
        providerName: string,
        slabs: { slab: string; range: string; fee: string }[]
    ): Promise<void> {
        await this.openTab("Provider slabs");
        const card = this.providerSlabCard(providerName);
        await expect(card).toBeVisible({ timeout: 15000 });

        for (const { slab, range, fee } of slabs) {
            const row = card.getByRole("row").filter({ hasText: slab });
            await expect(row).toBeVisible({ timeout: 10000 });
            await expect(row.getByText(range, { exact: true })).toBeVisible();
            await expect(row.getByRole("button", { name: fee, exact: true })).toBeVisible();
        }
        pageFixture.logger.info(`Verified ${slabs.length} fee slab rows for ${providerName}`);
    }

    async verifyWalletFeeRows(
        rows: { transactionType: string; providerFees: string; status: string }[]
    ): Promise<void> {
        await this.openTab("Wallet fees");
        await expect(this.visibleTables.first()).toBeVisible({ timeout: 15000 });

        for (const { transactionType, providerFees, status } of rows) {
            const row = this.activePage.getByRole("row").filter({ hasText: transactionType });
            await expect(row).toBeVisible({ timeout: 10000 });

            if (providerFees === "—") {
                await expect(row.getByText("—", { exact: true })).toBeVisible();
            } else {
                for (const fee of providerFees.split(",").map((f) => f.trim())) {
                    await expect(row.getByText(fee, { exact: true })).toBeVisible();
                }
            }
            await expect(row.getByText(status, { exact: true })).toBeVisible();
        }
        pageFixture.logger.info(`Verified ${rows.length} wallet fee rows`);
    }

    async verifyRulesEngineRows(
        rows: { priority: string; rule: string; condition: string; rail: string }[]
    ): Promise<void> {
        await this.openTab("Rules engine");
        await expect(this.visibleTables.first()).toBeVisible({ timeout: 15000 });

        for (const { priority, rule, condition, rail } of rows) {
            const row = this.activePage.getByRole("row").filter({ hasText: condition });
            await expect(row).toBeVisible({ timeout: 10000 });

            const cells = row.locator("td");
            await expect(cells.nth(0).getByText(priority, { exact: true })).toBeVisible();
            await expect(cells.nth(1).getByText(rule, { exact: true })).toBeVisible();
            await expect(cells.nth(3).getByText(condition, { exact: true })).toBeVisible();
            await expect(cells.nth(5).getByText(rail, { exact: true })).toBeVisible();
        }
        pageFixture.logger.info(`Verified ${rows.length} rules engine rows`);
    }

    async verifyTransactionTypeGuideEntries(entries: { code: string; label: string }[]): Promise<void> {
        await this.openTab("Fee ledger");

        for (const { code, label } of entries) {
            const item = this.activePage.locator("div.flex.items-start.gap-3").filter({ hasText: label }).first();
            await expect(item).toBeVisible({ timeout: 15000 });
            await expect(item.getByText(code, { exact: true })).toBeVisible();
            await expect(item.getByText(label, { exact: true }).first()).toBeVisible();
        }
        pageFixture.logger.info(`Verified ${entries.length} transaction type guide entries`);
    }

    async calculateFee(amount: string): Promise<void> {
        await this.openTab("Calculator");
        await this.calculatorAmount.fill(amount);
        await this.activePage.getByRole("button", { name: "Calculate Fees", exact: true }).click();
        await expect(this.feeBreakdownHeading).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info(`Calculated fees for amount: ${amount}`);
    }

    async selectTransactionType(transactionType: string): Promise<void> {
        await this.activePage.getByRole("button").filter({ hasText: transactionType }).first().click();
        pageFixture.logger.info(`Selected transaction type: ${transactionType}`);
    }

    async calculateFeeForTransaction(transactionType: string, amount: string): Promise<void> {
        await this.openTab("Calculator");
        await this.selectTransactionType(transactionType);
        await this.calculatorAmount.fill(amount);
        await this.activePage.getByRole("button", { name: "Calculate Fees", exact: true }).click();
        await expect(this.feeBreakdownHeading).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info(`Calculated fees for ${transactionType} with amount: ${amount}`);
    }

    async verifyFeeCalculationResult(details: {
        customerPays: string;
        transferBreakdown: string;
        totalServiceFee: string;
        moipayFee: string;
        totalBankFee: string;
    }): Promise<void> {
        await expect(this.activePage.getByText("Customer pays", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText(details.customerPays, { exact: true }).first()).toBeVisible();
        await expect(this.activePage.getByText(details.transferBreakdown, { exact: true })).toBeVisible();
        await expect(this.activePage.getByText("Total Service Fee", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText(details.totalServiceFee, { exact: true }).first()).toBeVisible();
        await expect(this.activePage.getByText("MoiPay Fee", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText(details.moipayFee, { exact: true }).first()).toBeVisible();
        await expect(this.activePage.getByText("Total Bank Fee", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText(details.totalBankFee, { exact: true }).first()).toBeVisible();
        pageFixture.logger.info("Verified fee calculation result details");
    }

    async verifyFeeCalculationDisplayed(): Promise<void> {
        await expect(this.activePage.getByText("Customer pays", { exact: true })).toBeVisible({ timeout: 15000 });
        await expect(this.activePage.getByText("Total Service Fee", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText("MoiPay Fee", { exact: true })).toBeVisible();
        await expect(this.activePage.getByText("Total Bank Fee", { exact: true })).toBeVisible();
        await expect(this.feeBreakdownHeading).toBeVisible();
        pageFixture.logger.info("Verified fee calculation breakdown is displayed");
    }

    async verifyPaymentRailsSection(
        status: string,
        rails: { code: string; name: string; fee: string; usedFor: string }[],
        footerNote: string
    ): Promise<void> {
        await this.openTab("Overview");
        const card = this.paymentRailsCard;
        await expect(card).toBeVisible({ timeout: 15000 });
        await expect(card.getByRole("heading", { name: "Payment rails", exact: true })).toBeVisible();
        await expect(card.getByText(status, { exact: true })).toBeVisible();

        for (const { code, name, fee, usedFor } of rails) {
            const row = card.locator("div.px-4.py-3").filter({ hasText: name });
            await expect(row).toBeVisible({ timeout: 10000 });
            await expect(row.getByText(code, { exact: true })).toBeVisible();
            await expect(row.getByText(name, { exact: true })).toBeVisible();
            await expect(row.getByText(fee, { exact: true })).toBeVisible();
            await expect(row.getByText(usedFor)).toBeVisible();
        }

        await expect(card.getByText(footerNote)).toBeVisible();
        pageFixture.logger.info(`Verified payment rails section with ${rails.length} rails`);
    }

    async verifyOverviewSummaryCards(
        cards: { label: string; value: string; badge: string; subtext: string }[]
    ): Promise<void> {
        await this.openTab("Overview");

        for (const { label, value, badge, subtext } of cards) {
            const card = this.activePage.locator("div.rounded-xl.border").filter({ hasText: label }).first();
            await expect(card).toBeVisible({ timeout: 15000 });
            await expect(card.getByText(label, { exact: true })).toBeVisible();
            await expect(card.getByText(value, { exact: true })).toBeVisible();
            if (badge) {
                await expect(card.getByText(badge, { exact: true })).toBeVisible();
            }
            await expect(card.getByText(subtext, { exact: true })).toBeVisible();
        }
        pageFixture.logger.info(`Verified ${cards.length} overview summary cards`);
    }
}
