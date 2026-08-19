import {
    Given,
    When,
    Then
} from "@cucumber/cucumber";

import CasePage from "../pageObjects/CasePage";
import LoginPage from "../pageObjects/LoginPage";
import { pageFixture } from "../utils/pageFixture";


// =========================================================
// PAGE OBJECT
// =========================================================

const casePage =
    new CasePage();


// =========================================================
// LOGIN
// =========================================================

Given(
    "administrator is logged in to Case Management",
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
                "Playwright page is already closed before Case Management login."
            );
        }

        const emailInput =
            page.locator(
                'input[id="email"]'
            );

        const loginPageVisible =
            await emailInput
                .isVisible({
                    timeout: 5000
                })
                .catch(
                    () => false
                );

        // =====================================================
        // LOGIN IF LOGIN SCREEN IS DISPLAYED
        // =====================================================

        if (loginPageVisible) {

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
                "Administrator logged in for Case Management"
            );

            return;
        }

        // =====================================================
        // USER MAY ALREADY BE LOGGED IN
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
                    timeout: 5000
                })
                .catch(
                    () => false
                );

        if (!dashboardVisible) {

            throw new Error(
                `Neither Login page nor Admin Dashboard is visible. Current URL: ${page.url()}`
            );
        }

        console.log(
            "Administrator already logged in"
        );

        pageFixture.logger.info(
            "Administrator already logged in for Case Management"
        );
    }
);


// =========================================================
// NAVIGATE TO CASE MANAGEMENT
// =========================================================

When(
    "administrator navigates to Case Management",
    async function () {

        await casePage
            .navigateToCaseManagement();
    }
);


// =========================================================
// OPEN QUEUE
// =========================================================

When(
    "administrator opens the Queue tab",
    async function () {

        await casePage
            .openQueueTab();
    }
);


// =========================================================
// SWITCH CASE TYPE
// =========================================================

When(
    "administrator switches to {string} cases",
    async function (
        caseType: string
    ) {

        await casePage
            .switchCaseType(
                caseType
            );
    }
);


// =========================================================
// VERIFY CASE TYPE
// =========================================================

Then(
    "verify {string} cases are displayed in the Queue",
    async function (
        caseType: string
    ) {

        await casePage
            .verifyCaseTypeDisplayed(
                caseType
            );
    }
);


// =========================================================
// VIEW ALL CASE RECORDS
// =========================================================

Then(
    "verify all case records are displayed in the Queue",
    async function () {

        await casePage
            .verifyAllCaseRecordsDisplayed();
    }
);


// =========================================================
// SEARCH CASE RECORDS
// =========================================================

When(
    "administrator searches the case Queue by {string} using {string}",
    async function (
        criteria: string,
        value: string
    ) {

        await casePage
            .searchCaseRecords(
                criteria,
                value
            );
    }
);


// =========================================================
// VERIFY SEARCH RESULTS
// =========================================================

Then(
    "verify Queue search results are displayed for {string} using {string}",
    async function (
        value: string,
        criteria: string
    ) {

        await casePage
            .verifyQueueSearchResults(
                value,
                criteria
            );
    }
);


// =========================================================
// CLEAR SEARCH
// =========================================================

When(
    "administrator clears the Queue search",
    async function () {

        await casePage
            .clearQueueSearch();
    }
);


// =========================================================
// VERIFY NO SEARCH RESULTS
// =========================================================

Then(
    "verify no case records match the Queue search",
    async function () {

        await casePage
            .verifyNoQueueSearchResults();
    }
);


// =========================================================
// RESET FILTERS
// =========================================================

When(
    "administrator resets the Queue filters",
    async function () {

        await casePage
            .resetQueueFilters();
    }
);


// =========================================================
// FILTER QUEUE
// =========================================================

When(
    "administrator filters the Queue by {string} using {string}",
    async function (
        filterName: string,
        value: string
    ) {

        await casePage
            .selectQueueFilter(
                filterName,
                value
            );
    }
);


// =========================================================
// VERIFY FILTER
// =========================================================

Then(
    "verify Queue filter {string} is applied as {string}",
    async function (
        filterName: string,
        value: string
    ) {

        await casePage
            .verifyQueueFilterApplied(
                filterName,
                value
            );
    }
);


// =========================================================
// REFRESH QUEUE
// =========================================================

When(
    "administrator refreshes the case Queue",
    async function () {

        await casePage
            .refreshCaseQueue();
    }
);


// =========================================================
// VERIFY REFRESH
// =========================================================

Then(
    "verify the case Queue refresh completed successfully",
    async function () {

        await casePage
            .verifyQueueRefreshCompleted();
    }
);

// =========================================================
// OPEN SLA TAB
// =========================================================

When(
    "administrator opens the SLA tab",
    async function () {

        await casePage
            .openSLATab();
    }
);


// =========================================================
// VERIFY SLA DASHBOARD
// =========================================================

Then(
    "verify the SLA monitoring dashboard is displayed",
    async function () {

        await casePage
            .verifySLAMonitoringDashboard();
    }
);


// =========================================================
// VERIFY SLA POLICIES
// =========================================================

Then(
    "verify SLA policies are displayed",
    async function () {

        await casePage
            .verifySLAPolicies();
    }
);


// =========================================================
// VERIFY ACTIVE CASE SLA TRACKER
// =========================================================

Then(
    "verify the Active Cases SLA Tracker is displayed",
    async function () {

        await casePage
            .verifyActiveCasesSLATracker();
    }
);


// =========================================================
// OPEN AUDIT TAB
// =========================================================

When(
    "administrator opens the Audit tab",
    async function () {

        await casePage
            .openAuditTab();
    }
);


// =========================================================
// VERIFY AUDIT RECORDS
// =========================================================

Then(
    "verify case audit records are displayed",
    async function () {

        await casePage
            .verifyAuditRecordsDisplayed();
    }
);


// =========================================================
// SEARCH AUDIT
// =========================================================

When(
    "administrator searches audit records by {string} using {string}",
    async function (
        criteria: string,
        value: string
    ) {

        await casePage
            .searchAuditRecords(
                criteria,
                value
            );
    }
);


// =========================================================
// VERIFY AUDIT SEARCH
// =========================================================

Then(
    "verify audit search results are displayed for {string} using {string}",
    async function (
        value: string,
        criteria: string
    ) {

        await casePage
            .verifyAuditSearchResults(
                value,
                criteria
            );
    }
);


// =========================================================
// CLEAR AUDIT SEARCH
// =========================================================

When(
    "administrator clears the audit search",
    async function () {

        await casePage
            .clearAuditSearch();
    }
);

// =========================================================
// OPEN REPORTS TAB
// =========================================================

When(
    "administrator opens the Reports tab",
    async function () {

        await casePage
            .openReportsTab();
    }
);


// =========================================================
// VERIFY REPORTS DASHBOARD
// =========================================================

Then(
    "verify the Case Reports dashboard is displayed",
    async function () {

        await casePage
            .verifyCaseReportsDashboard();
    }
);


// =========================================================
// EXPORT PDF
// =========================================================

When(
    "administrator exports the case report as PDF",
    async function () {

        await casePage
            .exportCaseReportAsPDF();
    }
);


// =========================================================
// VERIFY PDF DOWNLOAD
// =========================================================

Then(
    "verify the PDF case report is downloaded successfully",
    async function () {

        await casePage
            .verifyPDFReportDownloaded();
    }
);


// =========================================================
// EXPORT CSV / EXCEL
// =========================================================

When(
    "administrator exports the case report as CSV or Excel",
    async function () {

        await casePage
            .exportCaseReportAsCSVExcel();
    }
);


// =========================================================
// VERIFY CSV / EXCEL DOWNLOAD
// =========================================================

Then(
    "verify the CSV or Excel case report is downloaded successfully",
    async function () {

        await casePage
            .verifyCSVExcelReportDownloaded();
    }
);


// =========================================================
// DOWNLOAD ALL CASE DATA
// =========================================================

When(
    "administrator downloads all case data",
    async function () {

        await casePage
            .downloadAllCaseData();
    }
);


// =========================================================
// VERIFY ALL CASE DATA
// =========================================================

Then(
    "verify all case data is available successfully",
    async function () {

        await casePage
            .verifyAllCaseDataAvailable();
    }
);