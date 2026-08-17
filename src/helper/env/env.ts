import * as dotenv from 'dotenv';

export const getENV = () => {
    const env = process.env.ENV || 'dev';
    const envFile = env === 'staging' ? 'stag' : env;

    dotenv.config({
        override: true,
        path: `src/helper/env/.env.${envFile}`
    });
}; 