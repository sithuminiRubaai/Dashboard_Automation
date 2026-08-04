import { pageFixture } from "../utils/pageFixture";
import {
    expectContainsText,
    expectText,
    expectVisible
} from "../utils/common";

export default class LoginPage {

    // Locators
    private emailInput = () =>
        pageFixture.page.locator('#email');

    private passwordInput = () =>
        pageFixture.page.locator('#password');

    private submitButton = () =>
        pageFixture.page.locator('button[type="submit"]');

    private dashboardTitle = () =>
        pageFixture.page.getByRole('heading', { name: 'Dashboard' });

    private loginErrorBox = () =>
        pageFixture.page.locator('div[class*="border-red-500"][class*="text-red-400"]');

    private logoutButton = () =>
        pageFixture.page.locator("//button[@class='ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5']");

    // Constants
    private readonly loginErrorMessage =
        "Your email and password didn't match. Please try again.";

    // Actions
    async enterEmail(email: string) {
        await this.emailInput().fill(email);
        pageFixture.logger.info(`Entering email: ${email}`);
    }

    async enterPassword(password: string) {
        await this.passwordInput().fill(password);
        pageFixture.logger.info("Entering password");
    }

    async clickSubmit() {
        await this.submitButton().click();
        pageFixture.logger.info("Clicked Login button");
    }

    async enterEmailAndPassword(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
    }

    // Complete login action
    async login(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSubmit();
    }

    // Valid Login Verification
    async verifyAdminLoginSuccess() {
        try {
            await expectVisible(
                this.dashboardTitle(),
                "Dashboard title"
            );

            await expectText(
                this.dashboardTitle(),
                "Dashboard",
                "Dashboard title"
            );

            pageFixture.logger.info("Admin login successful");

        } catch (error) {

            await pageFixture.page.screenshot({
                path: `reports/screenshots/login-success-${Date.now()}.png`
            });

            pageFixture.logger.error(`Admin login failed: ${error}`);
            throw new Error("Admin login verification failed.");
        }
    }

    // Invalid Login Verification
    async verifyLoginErrorMessageDisplayed() {
        try {

            await expectVisible(
                this.loginErrorBox(),
                "Login error message"
            );

            await expectContainsText(
                this.loginErrorBox(),
                this.loginErrorMessage,
                "Login error message"
            );

            pageFixture.logger.info("Login error message verified.");

        } catch (error) {

            await pageFixture.page.screenshot({
                path: `reports/screenshots/login-error-${Date.now()}.png`
            });

            pageFixture.logger.error(`Login error verification failed: ${error}`);

            throw new Error(
                "Expected login error message was not displayed."
            );
        }
    }

    // Logout
    async logout() {
        try {

            await this.logoutButton().click();

            pageFixture.logger.info("Successfully logged out.");

        } catch (error) {

            await pageFixture.page.screenshot({
                path: `reports/screenshots/logout-${Date.now()}.png`
            });

            pageFixture.logger.error(`Logout failed: ${error}`);

            throw new Error("Logout failed.");
        }
    }
}