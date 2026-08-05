import { When, Then } from "@cucumber/cucumber";
import TransactionPage, { PaymentTab } from "../pageObjects/TransactionPage";

const transactionPage = new TransactionPage();

When("user clicks Transaction Management", async function () {
    await transactionPage.navigateToTransaction();
});

Then("verify Transaction Management heading is visible", async function () {
    await transactionPage.verifyTransactionManagementHeadingVisible();
    console.log("Transaction Management heading is visible");
});

When(
    "user clicks the {string} payment tab",
    async function (paymentTab: PaymentTab) {
        await transactionPage.clickPaymentTab(paymentTab);
    }
);

Then(
    "the {string} payment tab should be displayed",
    async function (paymentTab: PaymentTab) {
        await transactionPage.verifyPaymentTabVisible(paymentTab);
    }
);

When('user searches transactions for {string}', async function (searchValue: string) {
    await transactionPage.searchTransactions(searchValue);
});

Then('verify transaction search results are displayed for {string}', async function (searchValue: string) {
    await transactionPage.verifyTransactionSearchResultsDisplayed(searchValue);
});

Then('verify no transaction search results are displayed for {string}', async function (searchValue: string) {
    await transactionPage.verifyNoTransactionSearchResultsDisplayed(searchValue);
});

When('user filters transactions by status {string}', async function (status: string) {
    await transactionPage.filterTransactionsByStatus(status);
});

When('user filters transactions by date range {string}', async function (dateRange: string) {
    await transactionPage.filterTransactionsByDateRange(dateRange as 'today' | '7days' | '30days');
});

Then('verify transaction date range filter is applied to {string}', async function (dateRange: string) {
    await transactionPage.verifyTransactionDateFilterApplied(dateRange as 'today' | '7days' | '30days');
});

Then('verify only {string} transactions are displayed', async function (status: string) {
    await transactionPage.verifyOnlyTransactionsWithStatus(status);
});

When("user selects the first transaction row", async function () {
    await transactionPage.selectFirstTransaction();
});

Then("verify selected transaction details are displayed", async function () {
    await transactionPage.verifySelectedTransactionDetailsVisible();
});

Then("close the transaction details popup", async function () {
    await transactionPage.closeTransactionDetailsPopup();
});