import { Given, When, Then } from "@cucumber/cucumber";
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

Then("verify Fee Management tabs are visible", async function () {
    await feeManagementPage.verifyTabsVisible();
});

Then("verify provider fee slabs are displayed", async function () {
    await feeManagementPage.verifyProviderSlabsDisplayed();
});

Then("verify wallet fees are displayed", async function () {
    await feeManagementPage.verifyWalletFeesDisplayed();
});

When("user calculates fees for transfer amount {string}", async function (amount: string) {
    await feeManagementPage.calculateFee(amount);
});

Then("verify fee breakdown is displayed", async function () {
    await feeManagementPage.feeBreakdownHeading.waitFor({ state: "visible", timeout: 15000 });
    pageFixture.logger.info("Fee breakdown is displayed");
});