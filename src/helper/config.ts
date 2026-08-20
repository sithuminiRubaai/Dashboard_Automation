import { getENV } from './env/env';

export const getLoginUrl = (): string => {
    return process.env.LOGIN_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/login';
};

export const getFeeManagementUrl = (): string => {
    return process.env.FEE_MANAGEMENT_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/fee-management';
};

export const getCaseManagementUrl = (): string => {
    return process.env.CASE_MANAGEMENT_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/case-management';
};

export const getCustomerManagementUrl = (): string => {
    return process.env.CUSTOMER_MANAGEMENT_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/users';
};

export const getKycManagementUrl = (): string => {
    return process.env.KYC_MANAGEMENT_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/kyc-requests';
};

export const getTransactionsUrl = (): string => {
    return process.env.TRANSACTIONS_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/transactions';
};

export const getUserManagementUrl = (): string => {
    return process.env.USER_MANAGEMENT_URL || 'https://aws-dev.d11zg0rn02l7j9.amplifyapp.com/user-management';
};

export const getConfig = () => {
    getENV();
    return {
        loginUrl: getLoginUrl(),
        feeManagementUrl: getFeeManagementUrl(),
        caseManagementUrl: getCaseManagementUrl(),
        customerManagementUrl: getCustomerManagementUrl(),
        kycManagementUrl: getKycManagementUrl(),
        transactionsUrl: getTransactionsUrl(),
        userManagementUrl: getUserManagementUrl(),
    };
};
