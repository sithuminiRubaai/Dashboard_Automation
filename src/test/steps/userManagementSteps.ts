import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import LoginPage from "../pageObjects/LoginPage";
import UserManagementPage from "../pageObjects/UserManagementPage";
import { pageFixture } from "../utils/pageFixture";

const userManagementPage = new UserManagementPage();

Given("administrator is logged in for User Management", async function () {
    const page = pageFixture.page;
    const loginPageVisible = await page.locator('input[id="email"]').isVisible({ timeout: 5000 }).catch(() => false);
    if (loginPageVisible) {
        const loginPage = new LoginPage();
        await loginPage.enterEmailAndPassword("super_admin@gmail.com", "Admin@2024!");
        await loginPage.clickSubmit();
        await loginPage.verifyAdminLoginSuccess();
    } else {
        await page.getByRole("heading", { name: /Dashboard/i }).first().waitFor({ state: "visible", timeout: 30000 });
    }
});

When("user clicks User Management", async function () {
    await userManagementPage.navigateToUserManagement();
});

Then("verify User Management heading is visible", async function () {
    await userManagementPage.verifyHeadingVisible();
});

Then("verify admin user registry is visible", async function () {
    await userManagementPage.verifyRegistryVisible();
});

Then("verify User Management tabs are visible", async function () {
    await userManagementPage.verifyTabsVisible();
});

When("user searches admin users for {string}", async function (query: string) {
    await userManagementPage.searchUsers(query);
});

Then("verify admin user search result contains {string}", async function (query: string) {
    await userManagementPage.verifySearchResult(query);
});

When("user filters admin users by status {string}", async function (status: string) {
    await userManagementPage.filterByStatus(status);
});

Then("verify admin users match status {string}", async function (status: string) {
    await userManagementPage.verifyStatusFilter(status);
});

When("user resets User Management filters", async function () {
    await userManagementPage.resetFilters();
});

When("user opens the Create User form", async function () {
    await userManagementPage.openCreateUserModal();
});

Then("verify Create User form is displayed", async function () {
    await expect(userManagementPage.createUserModal).toBeVisible();
    pageFixture.logger.info("Create User form is displayed");
});

When("user closes the Create User form", async function () {
    await userManagementPage.closeCreateUserModal();
});