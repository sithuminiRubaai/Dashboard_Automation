import { pageFixture } from "../utils/pageFixture";
import { expect } from '@playwright/test';
import { expectContainsText, expectText, expectVisible } from '../utils/common';

export default class LoginPage {
    private selectors = {
        email: 'input[id="email"]',
        password: 'input[id="password"]',
        submitButton: 'button[type="submit"]',
        adminTitle: 'h1.text-lg.font-semibold',
        loginErrorText: `Your email and password didn't match. Please try again.`,
        loginErrorBox: 'div[class*="border-red-500"][class*="text-red-400"]'
    }

    async enterEmail(email: string) {
        await pageFixture.page.locator(this.selectors.email).fill(email);
        pageFixture.logger.info("providing email");
    }

    async enterPassword(password: string) {
        await pageFixture.page.locator(this.selectors.password).fill(password);
        pageFixture.logger.info("providing password");
    }

    async clickSubmit() {
        await pageFixture.page.locator(this.selectors.submitButton).click();
        pageFixture.logger.info("clicking submit button");
    }

    async enterEmailAndPassword(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
    }

   async verifyLoginErrorMessageDisplayed() {
    try {
        await pageFixture.page.waitForLoadState('networkidle');

        const expected = this.selectors.loginErrorText;
        const textLocator = pageFixture.page.getByText(expected, { exact: true });
        const boxLocator = pageFixture.page.locator(this.selectors.loginErrorBox);

        try {
            await Promise.race([
                textLocator.waitFor({ state: 'visible', timeout: 30000 }),
                boxLocator.waitFor({ state: 'visible', timeout: 30000 })
            ]);

            if (await textLocator.count() > 0) {
                await expectText(textLocator, expected, 'Login error text');
            } else {
                await expectContainsText(boxLocator, expected, 'Login error box');
            }
        } catch (error) {
            throw error;
        }

    } catch (error) {
        await pageFixture.page.screenshot({
            path: `reports/screenshots/login-error-${Date.now()}.png`
        });
        pageFixture.logger.error(`Error message not displayed: ${error}`);
        throw new Error(`Expected login error message not displayed: ${error}`);
    }
}

    async verifyAdminLoginSuccess() {
        try {
            const titleLocator = pageFixture.page.locator(this.selectors.adminTitle, { hasText: 'Dashboard' });
            await expectText(titleLocator, 'Dashboard', 'Admin dashboard title');
            pageFixture.logger.info("Admin login successful");
        } catch (error) {
            pageFixture.logger.error("Admin login failed");
            throw new Error("Admin login failed");
        }
    }

    async logout() {
    await pageFixture.page
        .locator("//button[@class='ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5']")
        .click();
}
}