export{

}

declare global{
    namespace NodeJS{
        interface processEnv{
            BROWSER: "chrome" | "firefox" | "webkit"
            ENV: "dev" | "uat" | "stag" | "staging"
            LOGIN_URL: string
        }
    }
}