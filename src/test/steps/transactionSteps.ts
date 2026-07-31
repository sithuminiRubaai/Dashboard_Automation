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