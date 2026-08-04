import { When, Then } from '@cucumber/cucumber';
import LoginPage from '../pageObjects/LoginPage';

const loginPage = new LoginPage();

// -------------------- Valid Login --------------------

When('provide valid email and password', async function () {
    await loginPage.enterEmailAndPassword(
        'super_admin@gmail.com',
        'Admin@2024!'
    );
});

When(
    'provide valid email as {string} and password as {string}',
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

// -------------------- Invalid Login --------------------

When('provide invalid email and password', async function () {
    await loginPage.enterEmailAndPassword(
        'invalid_user@example.com',
        'invalidPass!'
    );
});

// -------------------- Actions --------------------

When('click on login button', async function () {
    await loginPage.clickSubmit();
});

// -------------------- Verifications --------------------

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