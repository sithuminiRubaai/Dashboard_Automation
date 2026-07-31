import {
    Before,
    After,
    BeforeAll,
    AfterAll,
    Status,
    setDefaultTimeout
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";
import { invokeBrowser } from "../../helper/browser";
import { getENV } from "../../helper/env/env";
import { getLoginUrl } from "../../helper/config";
import { createLogger } from "winston";
import { options } from "../utils/logger";

setDefaultTimeout(60 * 1000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
    getENV();

    browser = await invokeBrowser();

    context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    page = await context.newPage();

    pageFixture.page = page;
    pageFixture.logger = createLogger(options("BeforeAll"));

    const loginUrl = getLoginUrl();

    await page.goto(loginUrl, {
        waitUntil: "networkidle"
    });

    pageFixture.logger.info(`Opened browser and navigated to ${loginUrl}`);
});

Before(async function ({ pickle }) {
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(pickle.name));
});

After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED) {
        const screenshot = await page.screenshot({
            path: `./test-result/screenshot/${pickle.name}.png`,
            fullPage: true
        });

        await this.attach(screenshot, "image/png");
    }
});

AfterAll(async function () {
    await page?.close();
    await context?.close();
    await browser?.close();
});