import { Given, When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../utils/pageFixture';
import LoginPage from '../pageObjects/LoginPage';

const loginPage = new LoginPage();

When('provide valid email and password', async function () {
    await loginPage.enterEmailAndPassword('super_admin@gmail.com', 'Admin@2024!');
});


Then('click on login button', async function () {
    await loginPage.clickSubmit();
    await pageFixture.page.waitForTimeout(5000);
});

When('provide valid email as {string} and password as {string}', async function (email: string, password: string) {
    await loginPage.enterEmailAndPassword(email, password);
});



When('verify admin login success', async function () {
    await loginPage.verifyAdminLoginSuccess();
});

Then('logout from the application', async function () {
    await loginPage.logout();
});

;

When('provide invalid email and password', async function () {
    await loginPage.enterEmailAndPassword('invalid_user@example.com', 'invalidPass!');
});

When('enter email as {string}', async function (email: string) {
    await loginPage.enterEmail(email);
});

When('enter password as {string}', async function (password: string) {
    await loginPage.enterPassword(password);
});

Then('verify login error message is displayed', async function () {
    await loginPage.verifyLoginErrorMessageDisplayed();
});





