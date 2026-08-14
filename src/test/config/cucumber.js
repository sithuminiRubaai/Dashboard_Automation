module.exports = {
    default:{
        tags: process.env.npm_config_TAGS || "",
        formateOptions:{
            snippentInterface: "async-await"
        },
        paths:[
            "src/test/features/login.feature",
            "src/test/features/kyc.feature",
            "src/test/features/transaction.feature",
            "src/test/features/customer.feature"
        ],
        publishQuite: true,
        dryRun: false,
        require:[
            "src/test/hooks/hooks.ts",
            "src/test/steps/*.ts"
        ],
        requireModule:[
            "ts-node/register"
        ],
        format:[
            "html:test-result/cucumber-report.html",
            "json:test-result/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 0
    },
    rerun:{
        formateOptions:{
            "snippentInterface": "async-await"
        },
        publishQuite: true,
        dryRun: false,
        require:[
            "src/test/steps/*.ts",
            "src/test/utils/*.ts"
        ],
        requireModule:[
            "ts-node/register"
        ],
        format:[
            "html:test-result/cucumber-report.html",
            "json:test-result/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 0
    }
}