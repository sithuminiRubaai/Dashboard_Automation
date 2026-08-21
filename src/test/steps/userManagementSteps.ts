import {
    Given,
    When,
    Then
} from "@cucumber/cucumber";

import LoginPage from "../pageObjects/LoginPage";
import UserManagementPage from "../pageObjects/UserManagementPage";
import { pageFixture } from "../utils/pageFixture";


const userManagementPage =
    new UserManagementPage();


// =========================================================
// LOGIN / VERIFY AUTHENTICATED SESSION
// =========================================================

Given(
    "administrator is logged in for User Management",
    async function () {

        const page =
            pageFixture.page;

        if (!page) {

            throw new Error(
                "Playwright page was not initialized."
            );
        }

        if (page.isClosed()) {

            throw new Error(
                "Playwright page is already closed before User Management login."
            );
        }


        // =====================================================
        // CHECK LOGIN PAGE
        // =====================================================

        const emailInput =
            page.locator(
                'input[id="email"]'
            );


        const loginPageVisible =
            await emailInput
                .isVisible({
                    timeout: 3000
                })
                .catch(
                    () => false
                );


        // =====================================================
        // LOGIN IF REQUIRED
        // =====================================================

        if (loginPageVisible) {

            console.log(
                "Login page detected"
            );


            const loginPage =
                new LoginPage();


            await loginPage
                .enterEmailAndPassword(
                    "super_admin@gmail.com",
                    "Admin@2024!"
                );


            await loginPage
                .clickSubmit();


            await loginPage
                .verifyAdminLoginSuccess();


            console.log(
                "Administrator login successful"
            );


            pageFixture.logger.info(
                "Administrator logged in for User Management"
            );


            return;
        }


        // =====================================================
        // CHECK EXISTING AUTHENTICATED SESSION
        // =====================================================

        const dashboardVisible =
            await page
                .getByText(
                    "Dashboard",
                    {
                        exact: true
                    }
                )
                .first()
                .isVisible({
                    timeout: 3000
                })
                .catch(
                    () => false
                );


        const userManagementHeadingVisible =
            await page
                .getByRole(
                    "heading",
                    {
                        name: /User Management/i
                    }
                )
                .first()
                .isVisible({
                    timeout: 3000
                })
                .catch(
                    () => false
                );


        const userManagementMenuVisible =
            await page
                .getByRole(
                    "link",
                    {
                        name: /User Management/i
                    }
                )
                .first()
                .isVisible({
                    timeout: 3000
                })
                .catch(
                    () => false
                );


        if (
            dashboardVisible ||
            userManagementHeadingVisible ||
            userManagementMenuVisible
        ) {

            console.log(
                "Administrator already logged in"
            );


            console.log(
                `Current authenticated page: ${page.url()}`
            );


            pageFixture.logger.info(
                "Administrator already logged in for User Management"
            );


            return;
        }


        throw new Error(
            `Unable to confirm administrator login state. Current URL: ${page.url()}`
        );
    }
);


// =========================================================
// TARGET 1
// NAVIGATE TO USER MANAGEMENT
// =========================================================

When(
    "administrator navigates to User Management",
    async function () {

        await userManagementPage
            .navigateToUserManagement();
    }
);


// =========================================================
// TARGET 1
// VERIFY USER MANAGEMENT PAGE
// =========================================================

Then(
    "verify the User Management page is displayed",
    async function () {

        await userManagementPage
            .verifyUserManagementPageDisplayed();
    }
);


// =========================================================
// TARGET 2
// VERIFY DASHBOARD AND SUMMARY STATISTICS
// =========================================================

Then(
    "verify the User Management dashboard and summary statistics are displayed",
    async function () {

        await userManagementPage
            .verifyDashboardAndSummaryStatistics();
    }
);


// =========================================================
// TARGET 2
// VERIFY ADMIN ACCESS REGISTRY CONTROLS
// =========================================================

Then(
    "verify the Admin Access Registry controls are displayed",
    async function () {

        await userManagementPage
            .verifyRegistryControlsDisplayed();
    }
);


// =========================================================
// TARGET 2 / TARGET 3
// FILTER USERS BY ROLE
// =========================================================

When(
    "administrator filters User Management users by role {string}",
    async function (
        role: string
    ) {

        await userManagementPage
            .filterUsersByRole(
                role
            );
    }
);


// =========================================================
// VERIFY USER ROLE FILTER
// =========================================================

Then(
    "verify the User Management role filter is applied as {string}",
    async function (
        role: string
    ) {

        await userManagementPage
            .verifyRoleFilterApplied(
                role
            );
    }
);


// =========================================================
// TARGET 2 / TARGET 3
// FILTER USERS BY STATUS
// =========================================================

When(
    "administrator filters User Management users by status {string}",
    async function (
        status: string
    ) {

        await userManagementPage
            .filterUsersByStatus(
                status
            );
    }
);


// =========================================================
// VERIFY USER STATUS FILTER
// =========================================================

Then(
    "verify the User Management status filter is applied as {string}",
    async function (
        status: string
    ) {

        await userManagementPage
            .verifyStatusFilterApplied(
                status
            );
    }
);


// =========================================================
// TARGET 2
// SEARCH USER MANAGEMENT USERS
// =========================================================

When(
    "administrator searches User Management users using {string}",
    async function (
        query: string
    ) {

        await userManagementPage
            .searchUsers(
                query
            );
    }
);


// =========================================================
// TARGET 2
// VERIFY USER MANAGEMENT SEARCH
// =========================================================

Then(
    "verify the User Management search result contains {string}",
    async function (
        query: string
    ) {

        await userManagementPage
            .verifySearchResult(
                query
            );
    }
);


// =========================================================
// TARGET 2 / TARGET 3
// RESET USER MANAGEMENT FILTERS
// =========================================================

When(
    "administrator resets User Management filters",
    async function () {

        await userManagementPage
            .resetUserManagementFilters();
    }
);


// =========================================================
// VERIFY USER MANAGEMENT FILTER RESET
// =========================================================

Then(
    "verify the User Management filters are reset",
    async function () {

        await userManagementPage
            .verifyUserManagementFiltersReset();
    }
);


// =========================================================
// TARGET 3
// OPEN USERS TAB
// =========================================================

When(
    "administrator opens the Users tab",
    async function () {

        await userManagementPage
            .openUsersTab();
    }
);


// =========================================================
// TARGET 3
// VERIFY ALL ADMIN USERS
// =========================================================

Then(
    "verify all admin-user records are displayed",
    async function () {

        await userManagementPage
            .verifyAllAdminUserRecordsDisplayed();
    }
);


// =========================================================
// TARGET 3
// SEARCH ADMIN USERS
// =========================================================

When(
    "administrator searches admin users by {string} using {string}",
    async function (
        criteria: string,
        value: string
    ) {

        await userManagementPage
            .searchAdminUsersByCriteria(
                criteria,
                value
            );
    }
);


// =========================================================
// TARGET 3
// VERIFY ADMIN USER SEARCH
// =========================================================

Then(
    "verify admin-user search results contain {string}",
    async function (
        value: string
    ) {

        await userManagementPage
            .verifySearchResult(
                value
            );
    }
);


// =========================================================
// TARGET 3
// EXPORT USERS AS EXCEL
// =========================================================

When(
    "administrator exports admin users as Excel",
    async function () {

        await userManagementPage
            .exportAdminUsersAsExcel();
    }
);


Then(
    "verify the admin-user Excel file is downloaded successfully",
    async function () {

        await userManagementPage
            .verifyAdminUserExcelDownloaded();
    }
);


// =========================================================
// TARGET 3
// EXPORT USERS AS PDF
// =========================================================

When(
    "administrator exports admin users as PDF",
    async function () {

        await userManagementPage
            .exportAdminUsersAsPDF();
    }
);


Then(
    "verify the admin-user PDF file is downloaded successfully",
    async function () {

        await userManagementPage
            .verifyAdminUserPDFDownloaded();
    }
);


// =========================================================
// TARGET 3
// EXPORT USERS BOTH
// =========================================================

When(
    "administrator exports admin users using Export both",
    async function () {

        await userManagementPage
            .exportAdminUsersBoth();
    }
);


Then(
    "verify both admin-user export files are downloaded successfully",
    async function () {

        await userManagementPage
            .verifyBothAdminUserExportsDownloaded();
    }
);


// =========================================================
// TARGET 4
// OPEN INVITATIONS TAB
// =========================================================

When(
    "administrator opens the Invitations tab",
    async function () {

        await userManagementPage
            .openInvitationsTab();
    }
);


// =========================================================
// TARGET 4
// VERIFY ALL INVITATIONS
// =========================================================

Then(
    "verify all user invitation records are displayed",
    async function () {

        await userManagementPage
            .verifyAllInvitationRecordsDisplayed();
    }
);


// =========================================================
// TARGET 4
// SEARCH INVITATIONS
// =========================================================

When(
    "administrator searches invitations by {string} using {string}",
    async function (
        criteria: string,
        value: string
    ) {

        await userManagementPage
            .searchInvitations(
                criteria,
                value
            );
    }
);


// =========================================================
// TARGET 4
// VERIFY INVITATION SEARCH
// =========================================================

Then(
    "verify invitation search results contain {string}",
    async function (
        value: string
    ) {

        await userManagementPage
            .verifyInvitationSearchResults(
                value
            );
    }
);


// =========================================================
// TARGET 4
// RESET INVITATION FILTERS
// =========================================================

When(
    "administrator resets invitation filters",
    async function () {

        await userManagementPage
            .resetInvitationFilters();
    }
);


Then(
    "verify invitation filters are reset",
    async function () {

        await userManagementPage
            .verifyInvitationFiltersReset();
    }
);


// =========================================================
// TARGET 4
// FILTER INVITATIONS BY ROLE
// =========================================================

When(
    "administrator filters invitations by role {string}",
    async function (
        role: string
    ) {

        await userManagementPage
            .filterInvitationsByRole(
                role
            );
    }
);


Then(
    "verify the invitation role filter is applied as {string}",
    async function (
        role: string
    ) {

        await userManagementPage
            .verifyInvitationRoleFilterApplied(
                role
            );
    }
);


// =========================================================
// TARGET 4
// FILTER INVITATIONS BY STATUS
// =========================================================

When(
    "administrator filters invitations by status {string}",
    async function (
        status: string
    ) {

        await userManagementPage
            .filterInvitationsByStatus(
                status
            );
    }
);


Then(
    "verify the invitation status filter is applied as {string}",
    async function (
        status: string
    ) {

        await userManagementPage
            .verifyInvitationStatusFilterApplied(
                status
            );
    }
);


// =========================================================
// TARGET 4
// OPEN INVITATION DETAILS
// =========================================================

When(
    "administrator opens an invitation record",
    async function () {

        await userManagementPage
            .openInvitationRecord();
    }
);


// =========================================================
// TARGET 4
// VERIFY INVITATION DETAILS
// =========================================================

Then(
    "verify invitation details are displayed",
    async function () {

        await userManagementPage
            .verifyInvitationDetailsDisplayed();
    }
);


// =========================================================
// TARGET 4
// CLOSE INVITATION DETAILS
// =========================================================

When(
    "administrator closes the invitation details",
    async function () {

        await userManagementPage
            .closeInvitationDetails();
    }
);


// =========================================================
// TARGET 4
// RESEND INVITATION
// =========================================================

When(
    "administrator resends a pending or expired invitation",
    async function () {

        await userManagementPage
            .resendEligibleInvitation();
    }
);


// =========================================================
// TARGET 4
// VERIFY INVITATION RESEND
// =========================================================

Then(
    "verify the invitation resend completed successfully",
    async function () {

        await userManagementPage
            .verifyInvitationResendCompleted();
    }
);


// =========================================================
// TARGET 5
// OPEN ROLES & PERMISSIONS TAB
// =========================================================

When(
    "administrator opens the Roles and Permissions tab",
    async function () {

        await userManagementPage
            .openRolesAndPermissionsTab();
    }
);


// =========================================================
// TARGET 5
// VERIFY AVAILABLE ROLES
// =========================================================

Then(
    "verify all available User Management roles are displayed",
    async function () {

        await userManagementPage
            .verifyAllAvailableRolesDisplayed();
    }
);


// =========================================================
// TARGET 5
// VERIFY ROLE ACCESS MATRIX
// =========================================================

Then(
    "verify the Role Access Matrix is displayed",
    async function () {

        await userManagementPage
            .verifyRoleAccessMatrixDisplayed();
    }
);


// =========================================================
// TARGET 6
// OPEN AUDIT LOGS TAB
// =========================================================

When(
    "administrator opens the Audit Logs tab",
    async function () {

        await userManagementPage
            .openAuditLogsTab();
    }
);


// =========================================================
// TARGET 6
// VERIFY ALL AUDIT LOGS
// =========================================================

Then(
    "verify all User Management audit logs are displayed",
    async function () {

        await userManagementPage
            .verifyAllUserManagementAuditLogs();
    }
);


// =========================================================
// TARGET 6
// SEARCH AUDIT LOGS
// =========================================================

When(
    "administrator searches User Management audit logs by {string} using {string}",
    async function (
        criteria: string,
        value: string
    ) {

        await userManagementPage
            .searchUserManagementAuditLogs(
                criteria,
                value
            );
    }
);


// =========================================================
// TARGET 6
// VERIFY AUDIT SEARCH RESULTS
// =========================================================

Then(
    "verify User Management audit search results contain {string}",
    async function (
        value: string
    ) {

        await userManagementPage
            .verifyUserManagementAuditSearchResults(
                value
            );
    }
);


// =========================================================
// TARGET 6
// CLEAR AUDIT SEARCH
// =========================================================

When(
    "administrator clears the User Management audit search",
    async function () {

        await userManagementPage
            .clearUserManagementAuditSearch();
    }
);


// =========================================================
// TARGET 6
// FILTER AUDIT LOGS BY DATE RANGE
// =========================================================

When(
    "administrator filters audit logs by date range {string}",
    async function (
        range: string
    ) {

        await userManagementPage
            .filterAuditLogsByDateRange(
                range
            );
    }
);


// =========================================================
// TARGET 6
// VERIFY AUDIT DATE RANGE
// =========================================================

Then(
    "verify the audit log date filter is applied as {string}",
    async function (
        range: string
    ) {

        await userManagementPage
            .verifyAuditDateRangeFilterApplied(
                range
            );
    }
);


// =========================================================
// TARGET 6
// EXPORT AUDIT LOGS AS EXCEL
// =========================================================

When(
    "administrator exports User Management audit logs as Excel",
    async function () {

        await userManagementPage
            .exportAuditLogsAsExcel();
    }
);


Then(
    "verify the audit-log Excel file is downloaded successfully",
    async function () {

        await userManagementPage
            .verifyAuditLogExcelDownloaded();
    }
);


// =========================================================
// TARGET 6
// EXPORT AUDIT LOGS AS PDF
// =========================================================

When(
    "administrator exports User Management audit logs as PDF",
    async function () {

        await userManagementPage
            .exportAuditLogsAsPDF();
    }
);


Then(
    "verify the audit-log PDF file is downloaded successfully",
    async function () {

        await userManagementPage
            .verifyAuditLogPDFDownloaded();
    }
);


// =========================================================
// TARGET 6
// EXPORT AUDIT LOGS BOTH
// =========================================================

When(
    "administrator exports User Management audit logs using Export both",
    async function () {

        await userManagementPage
            .exportAuditLogsBoth();
    }
);


Then(
    "verify both audit-log export files are downloaded successfully",
    async function () {

        await userManagementPage
            .verifyBothAuditLogExportsDownloaded();
    }
);