import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const options: LaunchOptions = {
    headless: false
};

export const invokeBrowser = () => {
    const browserType = process.env.npm_config_BROWSER || "chromium";
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
            throw new Error("please provide valid Browser");
    }
};