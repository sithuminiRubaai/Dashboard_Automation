import { Before, After, Status, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { pageFixture } from '../utils/pageFixture';
import { invokeBrowser } from '../../helper/browser';
import { getENV } from '../../helper/env/env';
import { getLoginUrl } from '../../helper/config';
import { createLogger } from 'winston';
import { options } from '../utils/logger';

setDefaultTimeout(60 * 1000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll({ timeout: 60 * 1000 }, async function () {
    getENV();
    browser = await invokeBrowser();
    context = await browser.newContext();
    page = await context.newPage();
    pageFixture.page = page;
    pageFixture.logger = createLogger(options('feature-setup'));

    const loginUrl = getLoginUrl();
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');
    await pageFixture.logger.info(`Opened browser and navigated to ${loginUrl}`);
});

Before(async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(scenarioName));
});

After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED && pageFixture.page) {
        const screenshot = await pageFixture.page.screenshot({
            path: `./test-result/screenshot/${pickle.name}.png`,
            type: 'png',
        });
        await this.attach(screenshot, 'image/png');
    }
});

AfterAll(async function () {
    await browser?.close();
});
