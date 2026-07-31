import * as dotenv from 'dotenv';

export const getENV = () => {
    const env = process.env.ENV || 'dev';
    dotenv.config({
        override: true,
        path: `src/helper/env/.env.${env}`
    });
}; 