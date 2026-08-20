module.exports = {

    default: {

        formatOptions: {
            snippetsInterface: "async-await"
        },

        paths: [
            "src/test/features/case.feature"
        ],

        dryRun: false,

        require: [
            "src/test/hooks/hooks.ts",
            "src/test/steps/*.ts"
        ],

        requireModule: [
            "ts-node/register"
        ],

        format: [
            "progress",
            "html:test-result/cucumber-report.html",
            "json:test-result/cucumber-report.json",
            "rerun:@rerun.txt"
        ],

        timeout: 60000,

        parallel: 0
    },


    rerun: {

        formatOptions: {
            snippetsInterface: "async-await"
        },

        dryRun: false,

        require: [
            "src/test/hooks/hooks.ts",
            "src/test/steps/*.ts"
        ],

        requireModule: [
            "ts-node/register"
        ],

        format: [
            "progress",
            "html:test-result/cucumber-report.html",
            "json:test-result/cucumber-report.json",
            "rerun:@rerun.txt"
        ],

        timeout: 60000,

        parallel: 0
    }
};