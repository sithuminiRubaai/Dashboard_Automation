import { expect, Locator } from '@playwright/test';
import { pageFixture } from './pageFixture';

async function saveScreenshot(name: string) {
    await pageFixture.page.screenshot({
        path: `reports/screenshots/${name}-${Date.now()}.png`
    });
}

async function handleError(name: string, error: unknown) {
    await saveScreenshot(name);
    pageFixture.logger.error(`${name} failed: ${error}`);
    throw error;
}

export async function expectVisible(locator: Locator | string, name: string, timeout = 30000) {
    try {
        const targetLocator = typeof locator === 'string'
            ? pageFixture.page.locator(locator.startsWith('//') || locator.startsWith('(') ? `xpath=${locator}` : locator)
            : locator;

        await targetLocator.waitFor({ state: 'visible', timeout });
        await expect(targetLocator).toBeVisible({ timeout });
        await pageFixture.logger.info(`${name} is visible`);
    } catch (error) {
        await handleError(name, error);
    }
}

export async function expectText(locator: Locator, expected: string, name: string, timeout = 30000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
        await expect(locator).toHaveText(expected, { timeout });
        await pageFixture.logger.info(`${name} text validated: ${expected}`);
    } catch (error) {
        await handleError(name, error);
    }
}

export async function expectContainsText(locator: Locator, expected: string, name: string, timeout = 30000) {
    try {
        await locator.waitFor({ state: 'visible', timeout });
        await expect(locator).toContainText(expected, { timeout });
        await pageFixture.logger.info(`${name} contains text: ${expected}`);
    } catch (error) {
        await handleError(name, error);
    }
}

export async function expectCountGreaterThan(locator: Locator, min: number, name: string) {
    try {
        const count = await locator.count();
        expect(count).toBeGreaterThan(min);
        await pageFixture.logger.info(`${name} count is greater than ${min}: ${count}`);
    } catch (error) {
        await handleError(name, error);
    }
}
