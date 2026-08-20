import { Given, When, Then, DataTable } from "@cucumber/cucumber";
import LoginPage from "../pageObjects/LoginPage";
import FeeManagementPage from "../pageObjects/FeeManagementPage";
import { pageFixture } from "../utils/pageFixture";

const feeManagementPage = new FeeManagementPage();

Given("administrator is logged in for Fee Management", async function () {
    const page = pageFixture.page;
    const emailInput = page.locator('input[id="email"]');
    const dashboardHeading = page.getByRole("heading", { name: /Dashboard/i }).first();
    const loginPageVisible = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);

    if (loginPageVisible) {
        const loginPage = new LoginPage();
        await loginPage.enterEmailAndPassword("super_admin@gmail.com", "Admin@2024!");
        await loginPage.clickSubmit();
        await loginPage.verifyAdminLoginSuccess();
    } else {
        await dashboardHeading.waitFor({ state: "visible", timeout: 30000 });
    }
});

When("user clicks Fee Management", async function () {
    await feeManagementPage.navigateToFeeManagement();
});

Then("verify Fee Management heading is visible", async function () {
    await feeManagementPage.verifyHeadingVisible();
});

Then("verify Fee Management URL is loaded correctly", async function () {
    await feeManagementPage.verifyPageUrl();
});

Then("verify Fee Management URL is loaded correctly for each tab", async function () {
    for (const tab of ["Overview", "Calculator", "Provider slabs", "Wallet fees", "Rules engine", "Fee ledger"]) {
        await feeManagementPage.verifyTabUrl(tab);
    }
});

Then("verify Fee Management tabs are visible", async function () {
    await feeManagementPage.verifyTabsVisible();
});

Then("verify tab navigation works correctly for all Fee Management tabs", async function () {
    await feeManagementPage.verifyTabNavigation([
        "Overview",
        "Calculator",
        "Provider slabs",
        "Wallet fees",
        "Rules engine",
        "Fee ledger"
    ]);
});

Then("verify provider fee slabs are displayed", async function () {
    await feeManagementPage.verifyProviderSlabsDisplayed();
});

Then(
    "verify {string} provider details show subtitle {string}, status {string} and {string}",
    async function (providerName: string, subtitle: string, status: string, slabsCount: string) {
        await feeManagementPage.verifyProviderCardDetails(providerName, subtitle, status, slabsCount);
    }
);

Then(
    "verify {string} provider fee slabs show the following values:",
    async function (providerName: string, dataTable: DataTable) {
        const slabs = dataTable.hashes() as { slab: string; range: string; fee: string }[];
        await feeManagementPage.verifyProviderSlabValues(providerName, slabs);
    }
);

Then("verify wallet fees tab shows the following transaction rows:", async function (dataTable: DataTable) {
    const rows = dataTable.hashes() as { transactionType: string; providerFees: string; status: string }[];
    await feeManagementPage.verifyWalletFeeRows(rows);
});

Then("verify rules engine tab shows the following rules:", async function (dataTable: DataTable) {
    const rows = dataTable.hashes() as { priority: string; rule: string; condition: string; rail: string }[];
    await feeManagementPage.verifyRulesEngineRows(rows);
});

Then("verify fee ledger tab shows the following transaction type guide entries:", async function (dataTable: DataTable) {
    const entries = dataTable.hashes() as { code: string; label: string }[];
    await feeManagementPage.verifyTransactionTypeGuideEntries(entries);
});

Then("verify wallet fees are displayed", async function () {
    await feeManagementPage.verifyWalletFeesDisplayed();
});

When("user calculates fees for transfer amount {string}", async function (amount: string) {
    await feeManagementPage.calculateFee(amount);
});

When(
    "user selects transaction type {string} and enters transfer amount {string} and clicks Calculate Fees",
    async function (transactionType: string, amount: string) {
        await feeManagementPage.calculateFeeForTransaction(transactionType, amount);
    }
);

Then(
    "verify fee calculation shows customer pays {string}, transfer breakdown {string}, total service fee {string}, MoiPay fee {string} and total bank fee {string}",
    async function (
        customerPays: string,
        transferBreakdown: string,
        totalServiceFee: string,
        moipayFee: string,
        totalBankFee: string
    ) {
        await feeManagementPage.verifyFeeCalculationResult({
            customerPays,
            transferBreakdown,
            totalServiceFee,
            moipayFee,
            totalBankFee
        });
    }
);

Then("verify fee breakdown is displayed", async function () {
    await feeManagementPage.feeBreakdownHeading.waitFor({ state: "visible", timeout: 15000 });
    pageFixture.logger.info("Fee breakdown is displayed");
});

Then("verify fee calculation breakdown is displayed", async function () {
    await feeManagementPage.verifyFeeCalculationDisplayed();
});

Then(
    "verify Overview payment rails status is {string} with footer note {string} and the following rails:",
    async function (status: string, footerNote: string, dataTable: DataTable) {
        const rails = dataTable.hashes() as { code: string; name: string; fee: string; usedFor: string }[];
        await feeManagementPage.verifyPaymentRailsSection(status, rails, footerNote);
    }
);

Then("verify Overview tab shows the following summary cards:", async function (dataTable: DataTable) {
    const cards = dataTable.hashes() as { label: string; value: string; badge: string; subtext: string }[];
    await feeManagementPage.verifyOverviewSummaryCards(cards);
});