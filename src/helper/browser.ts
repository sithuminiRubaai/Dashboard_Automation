import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const isHeadless = process.env.HEADLESS === "true" || process.env.CI === "true";

const options: LaunchOptions = {
    headless: isHeadless ? true : false
};

export const invokeBrowser = () => {
    const browserType = (
        process.env.BROWSER ||
        process.env.npm_config_browser ||
        process.env.npm_config_BROWSER ||
        "chromium"
    ).toLowerCase();
    switch (browserType) {
        case "chrome":
            return chromium.launch({ ...options, channel: "chrome" });
        case "chromium":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error(
                `Unsupported browser '${browserType}'. Use chrome, chromium, firefox, or webkit.`
            );
    }
};
