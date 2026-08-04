import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const options: LaunchOptions = {
    headless: false,
    channel: process.env.npm_config_BROWSER === "chrome" ? "chrome" : undefined
};

export const invokeBrowser = () => {
    const browserType = process.env.npm_config_BROWSER || "chrome";
    switch (browserType) {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error("please provide valid Browser");
    }
};