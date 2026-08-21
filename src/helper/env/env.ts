import * as dotenv from 'dotenv';

export const getENV = () => {
    const env = process.env.ENV || 'dev';
    const envFile = env === 'staging' ? 'stag' : env;

    dotenv.config({
        // Explicit command-line values (for example BROWSER=firefox or
        // HEADLESS=true) must take precedence over defaults in the env file.
        override: false,
        path: `src/helper/env/.env.${envFile}`
    });
};
