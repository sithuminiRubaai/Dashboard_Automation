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
let context: BrowserContext | undefined;
let page: Page | undefined;
let currentFeatureName: string | undefined;

BeforeAll(async function () {
    getENV();

    browser = await invokeBrowser();
    pageFixture.logger = createLogger(options("BeforeAll"));
    pageFixture.logger.info("Opened the shared browser");
});

Before(async function ({ pickle }) {
    const featureName = pickle.uri?.split(/[\\/]/).pop()?.replace(/\.feature$/, "") || "default";

    if (!browser?.isConnected()) {
        throw new Error(
            "The shared browser was closed before the test run completed."
        );
    }

    if (currentFeatureName !== featureName) {
        await page?.close();
        await context?.close();

        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        page = await context.newPage();
        currentFeatureName = featureName;

        const loginUrl = getLoginUrl();
        await page.goto(loginUrl, { waitUntil: "networkidle" });
    }

    if (!page || page.isClosed()) {
        throw new Error(`The browser page for feature ${featureName} is unavailable.`);
    }

    pageFixture.page = page;
    pageFixture.logger = createLogger(options(pickle.name));
    pageFixture.logger.info(`Started scenario in the shared ${featureName} feature context`);
});

After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED && page && !page.isClosed()) {
        const screenshot = await page.screenshot({
            path: `./test-result/screenshot/${pickle.name}.png`,
            fullPage: true
        });

        await this.attach(screenshot, "image/png");
    }
});

AfterAll(async function () {
    if (page && !page.isClosed()) {
        await page.close();
    }
    await context?.close();
    await browser?.close();
});
