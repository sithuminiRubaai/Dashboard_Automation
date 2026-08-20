import { expect, Locator, Page } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";
import { getUserManagementUrl } from "../../helper/config";

export default class UserManagementPage {
    private get activePage(): Page {
        return pageFixture.page;
    }

    get userManagementMenu(): Locator {
        return this.activePage.getByRole("link", { name: "User Management", exact: true });
    }

    get userManagementHeading(): Locator {
        return this.activePage.locator("main").getByRole("heading", { name: "User Management", exact: true });
    }

    get usersTable(): Locator {
        return this.activePage.locator("main table:visible").first();
    }

    get userRows(): Locator {
        return this.usersTable.locator("tbody tr:visible");
    }

    get searchBox(): Locator {
        return this.activePage.getByRole("textbox", { name: "Search users by name or email" });
    }

    get roleFilter(): Locator {
        return this.activePage.getByRole("combobox", { name: "Filter users by role" });
    }

    get statusFilter(): Locator {
        return this.activePage.getByRole("combobox", { name: "Filter users by status" });
    }

    get createUserModal(): Locator {
        return this.activePage.getByRole("heading", { name: "Create User", exact: true }).locator("..");
    }

    async navigateToUserManagement(): Promise<void> {
        await this.userManagementMenu.waitFor({ state: "visible", timeout: 20000 });
        await this.userManagementMenu.click();
        await this.userManagementHeading.waitFor({ state: "visible", timeout: 20000 });
        pageFixture.logger.info("Navigated to User Management page");
    }

    async verifyHeadingVisible(): Promise<void> {
        await expect(this.userManagementHeading).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info("User Management heading is visible");
    }

    async verifyPageUrl(): Promise<void> {
        const expectedUrl = getUserManagementUrl();
        await expect(this.activePage).toHaveURL(expectedUrl, { timeout: 15000 });
        pageFixture.logger.info(`Verified User Management page URL: ${expectedUrl}`);
    }

    async verifyTabUrl(tab: string | RegExp): Promise<void> {
        await this.activePage.getByRole("button", { name: tab }).click();
        await this.verifyPageUrl();
        pageFixture.logger.info(`Verified URL is unchanged for tab: ${tab}`);
    }

    async verifyRegistryVisible(): Promise<void> {
        await expect(this.activePage.getByRole("heading", { name: "Admin Access Registry", exact: true })).toBeVisible();
        await expect(this.searchBox).toBeVisible();
        await expect(this.roleFilter).toBeVisible();
        await expect(this.statusFilter).toBeVisible();
        await expect(this.usersTable).toBeVisible();
        await expect(this.activePage.getByRole("columnheader", { name: "Email", exact: true })).toBeVisible();
        pageFixture.logger.info("Admin Access Registry is visible");
    }

    async searchUsers(query: string): Promise<void> {
        await this.searchBox.fill(query);
        await this.activePage.waitForTimeout(1000);
        pageFixture.logger.info(`Searched users using query: ${query}`);
    }

    async verifySearchResult(query: string): Promise<void> {
        const matchingRow = this.userRows.filter({ hasText: new RegExp(query, "i") }).first();
        await expect(matchingRow).toBeVisible({ timeout: 15000 });
        pageFixture.logger.info(`Verified user search result for: ${query}`);
    }

    async filterByStatus(status: string): Promise<void> {
        await this.statusFilter.selectOption({ label: status });
        await this.activePage.waitForTimeout(1000);
        pageFixture.logger.info(`Filtered users by status: ${status}`);
    }

    async verifyStatusFilter(status: string): Promise<void> {
        const selectedLabel = await this.statusFilter.locator("option:checked").textContent();
        expect(selectedLabel?.trim()).toBe(status);
        if (status !== "All status") {
            const rows = this.userRows;
            const count = await rows.count();
            expect(count).toBeGreaterThan(0);
            for (let index = 0; index < count; index++) {
                await expect(rows.nth(index)).toContainText(status, { timeout: 15000 });
            }
        }
    }

    async resetFilters(): Promise<void> {
        await this.activePage.getByRole("button", { name: "Reset", exact: true }).click();
        await expect(this.searchBox).toHaveValue("");
        pageFixture.logger.info("Reset User Management filters");
    }

    async verifyTabsVisible(): Promise<void> {
        for (const tab of ["Overview", /Users \d+/, /Invitations \d+/, "Roles & Permissions", /Audit Logs \d+/]) {
            await expect(this.activePage.getByRole("button", { name: tab })).toBeVisible();
        }
    }

    async openCreateUserModal(): Promise<void> {
        await this.activePage.getByRole("button", { name: "Create User", exact: true }).click();
        await expect(this.createUserModal).toBeVisible();
        await expect(this.activePage.getByRole("textbox", { name: "Username" })).toBeVisible();
        await expect(this.activePage.getByRole("textbox", { name: "name@company.com" })).toBeVisible();
    }

    async closeCreateUserModal(): Promise<void> {
        await this.activePage.getByRole("button", { name: "Close create user modal" }).click();
        await expect(this.createUserModal).toBeHidden();
    }
}