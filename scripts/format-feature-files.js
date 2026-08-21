const fs = require("fs");
const path = require("path");

const featuresDirectory = path.join(process.cwd(), "src", "test", "features");
const featureFiles = fs
    .readdirSync(featuresDirectory)
    .filter((file) => file.endsWith(".feature"))
    .sort();

const stepPattern = /^(Given|When|Then|And|But|\*)\b/;

for (const file of featureFiles) {
    const filePath = path.join(featuresDirectory, file);
    const source = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    const lines = source.split(/\r?\n/);
    const formatted = [];
    let featureSeen = false;
    let inDocString = false;

    for (const originalLine of lines) {
        const text = originalLine.trim();

        if (!text) {
            if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
                formatted.push("");
            }
            continue;
        }

        if (inDocString) {
            formatted.push(`      ${text}`);
            if (text === '"""') inDocString = false;
            continue;
        }

        let indent = "  ";

        if (text.startsWith("Feature:")) {
            indent = "";
            featureSeen = true;
        } else if (text.startsWith("@")) {
            indent = featureSeen ? "  " : "";
        } else if (/^(Scenario|Scenario Outline|Background|Rule):/.test(text)) {
            indent = "  ";
        } else if (text.startsWith("Examples:")) {
            indent = "    ";
        } else if (stepPattern.test(text)) {
            indent = "    ";
        } else if (text.startsWith("|")) {
            indent = "      ";
        } else if (text === '"""') {
            indent = "      ";
            inDocString = true;
        }

        formatted.push(`${indent}${text}`);
    }

    while (formatted[formatted.length - 1] === "") formatted.pop();
    fs.writeFileSync(filePath, `${formatted.join("\n")}\n`, "utf8");
}

console.log(`Formatted ${featureFiles.length} feature files.`);
