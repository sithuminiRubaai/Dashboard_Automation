import { expect, Locator } from '@playwright/test';
import { pageFixture } from './pageFixture';
import * as fs from 'fs';

async function saveScreenshot(name: string) {
    await pageFixture.page.screenshot({
        path: `reports/screenshots/${name}-${Date.now()}.png`
    });
}

export async function captureAndThrow(name: string, error: unknown, message?: string): Promise<never> {
    await saveScreenshot(name);
    pageFixture.logger.error(`${name} failed: ${error}`);
    if (message) {
        throw new Error(message);
    }
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(String(error));
}

export async function withPageAction<T>(label: string, action: () => Promise<T>, failureMessage?: string): Promise<T> {
    try {
        return await action();
    } catch (error) {
        return captureAndThrow(label, error, failureMessage);
    }
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

export async function expectRowsHaveExactStatus(
    rows: Locator,
    statusCells: Locator,
    expectedStatus: string,
    context: string
) {
    const expectedText = expectedStatus.trim();
    const maxAttempts = 60;
    const retryDelay = 500;
    let lastRowCount = 0;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        lastRowCount = await rows.count();
        if (lastRowCount === 0) {
            await pageFixture.page.waitForTimeout(retryDelay);
            continue;
        }

        let allMatch = true;
        let loaded = true;
        let actualStatus = '';

        for (let i = 0; i < lastRowCount; i++) {
            actualStatus = (await statusCells.nth(i).textContent())?.trim() ?? '';
            if (actualStatus === 'Loading...') {
                loaded = false;
                break;
            }
            if (actualStatus !== expectedText) {
                allMatch = false;
                break;
            }
        }

        if (!loaded) {
            await pageFixture.page.waitForTimeout(retryDelay);
            continue;
        }

        if (allMatch) {
            await pageFixture.logger.info(`${context}: verified ${lastRowCount} rows with status '${expectedText}'`);
            return;
        }

        const timestamp = Date.now();
        const html = await pageFixture.page.content();
        const debugFile = `reports/debug-${context}-mismatch-${timestamp}.html`;
        try { fs.writeFileSync(debugFile, html); } catch (e) {}
        await pageFixture.page.screenshot({ path: `reports/screenshots/${context}-mismatch-${timestamp}.png` });
        throw new Error(`${context}: Expected all rows to be '${expectedText}' but found '${actualStatus}'. Saved HTML: ${debugFile}`);
    }

    throw new Error(`${context}: timed out waiting for ${expectedText} rows. Last row count: ${lastRowCount}`);
}
