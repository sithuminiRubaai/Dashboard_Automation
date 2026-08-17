import { When, Then } from '@cucumber/cucumber';
import LoginPage from '../pageObjects/LoginPage';

const loginPage = new LoginPage();

// --------------------Login --------------------

When('provide valid email as {string} and password as {string}',
    async function (email: string, password: string) {
        await loginPage.enterEmailAndPassword(email, password);
    }
);


When('enter email as {string}', async function (email: string) {
    await loginPage.enterEmail(email);
});

When('enter password as {string}', async function (password: string) {
    await loginPage.enterPassword(password);
});


// -------------------- Actions --------------------

When('click on login button', async function () {
    await loginPage.clickSubmit();
});

// -------------------- Verifications --------------------

Then('verify the correct environment URL is visible', async function () {
    await loginPage.verifyCurrentEnvironmentUrl();
});

Then('verify admin login success', async function () {
    await loginPage.verifyAdminLoginSuccess();
});

Then('verify login error message is displayed', async function () {
    await loginPage.verifyLoginErrorMessageDisplayed();
});

// -------------------- Logout --------------------

Then('logout from the application', async function () {
    await loginPage.logout();
});
