import {
    expect,
    Locator,
    Page,
    Download
} from "@playwright/test";

import * as fs from "fs";
import * as path from "path";

import { pageFixture } from "../utils/pageFixture";
import { getUserManagementUrl } from "../../helper/config";


export default class UserManagementPage {

    private get activePage(): Page {
        return pageFixture.page;
    }


    // =========================================================
    // DOWNLOAD STATE - USERS
    // =========================================================

    private lastExcelDownloadPath: string = "";
    private lastExcelFileName: string = "";

    private lastPDFDownloadPath: string = "";
    private lastPDFFileName: string = "";

    private lastBothDownloads: {
        fileName: string;
        filePath: string;
    }[] = [];


    // =========================================================
    // DOWNLOAD STATE - AUDIT
    // =========================================================

    private lastAuditExcelDownloadPath: string = "";
    private lastAuditExcelFileName: string = "";

    private lastAuditPDFDownloadPath: string = "";
    private lastAuditPDFFileName: string = "";

    private lastAuditBothDownloads: {
        fileName: string;
        filePath: string;
    }[] = [];


    // =========================================================
    // INVITATION STATE
    // =========================================================

    private lastViewedInvitationCode: string = "";
    private lastResentInvitationCode: string = "";
    private invitationResendSucceeded: boolean = false;


    // =========================================================
    // MAIN USER MANAGEMENT
    // =========================================================

    get userManagementMenu(): Locator {

        return this.activePage
            .getByRole(
                "link",
                {
                    name: /User Management/i
                }
            )
            .first();
    }


    get userManagementHeading(): Locator {

        return this.activePage
            .getByRole(
                "heading",
                {
                    name: /User Management/i
                }
            )
            .first();
    }


    // =========================================================
    // TABS
    // =========================================================

    get overviewTab(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Overview$/i
                }
            )
            .first();
    }


    get usersTab(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Users\s*\d*$/i
                }
            )
            .first();
    }


    get invitationsTab(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Invitations\s*\d*$/i
                }
            )
            .first();
    }


    get rolesAndPermissionsTab(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Roles\s*&\s*Permissions/i
                }
            )
            .first();
    }


    get auditLogsTab(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Audit Logs\s*\d*$/i
                }
            )
            .first();
    }


    // =========================================================
    // OVERVIEW / USERS
    // =========================================================

    get adminAccessRegistryHeading(): Locator {

        return this.activePage
            .getByText(
                "Admin Access Registry",
                {
                    exact: true
                }
            )
            .first();
    }


    get searchBox(): Locator {

        return this.activePage
            .locator(
                'input[placeholder*="Search by name" i]:visible'
            )
            .first();
    }


    get roleFilter(): Locator {

        return this.activePage
            .locator(
                "select:visible"
            )
            .filter({
                hasText: "All roles"
            })
            .first();
    }


    get statusFilter(): Locator {

        return this.activePage
            .locator(
                "select:visible"
            )
            .filter({
                hasText: "All status"
            })
            .first();
    }


    get resetButton(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Reset$/i
                }
            )
            .first();
    }


    get usersTable(): Locator {

        return this.activePage
            .locator(
                "main table:visible"
            )
            .first();
    }


    get userRows(): Locator {

        return this.usersTable
            .locator(
                "tbody tr"
            )
            .filter({
                hasNotText:
                    /Loading admin users/i
            });
    }


    get userLoadingIndicator(): Locator {

        return this.activePage
            .getByText(
                /Loading admin users/i
            )
            .first();
    }


    // =========================================================
    // USER EXPORT
    // =========================================================

    get exportUsersButton(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Export Users/i
                }
            )
            .first();
    }


    get exportAsExcelOption(): Locator {

        return this.activePage
            .getByText(
                "Export as Excel",
                {
                    exact: true
                }
            )
            .last();
    }


    get exportAsPDFOption(): Locator {

        return this.activePage
            .getByText(
                "Export as PDF",
                {
                    exact: true
                }
            )
            .last();
    }


    get exportBothOption(): Locator {

        return this.activePage
            .getByText(
                "Export both",
                {
                    exact: true
                }
            )
            .last();
    }


    // =========================================================
    // INVITATIONS
    // =========================================================

    get invitationsHeading(): Locator {

        return this.activePage
            .getByRole(
                "heading",
                {
                    name: "Invitations",
                    exact: true
                }
            )
            .first();
    }


    get invitationSearchBox(): Locator {

        return this.activePage
            .locator(
                'input[placeholder*="Search email, invitation code, username, or name" i]:visible'
            )
            .first();
    }


    get invitationStatusFilter(): Locator {

        return this.activePage
            .locator(
                "select:visible"
            )
            .filter({
                hasText: "All status"
            })
            .first();
    }


    get invitationRoleFilter(): Locator {

        return this.activePage
            .locator(
                "select:visible"
            )
            .filter({
                hasText: "All roles"
            })
            .first();
    }


    get invitationsTable(): Locator {

        return this.activePage
            .locator(
                "main table:visible"
            )
            .first();
    }


    get invitationRows(): Locator {

        return this.invitationsTable
            .locator(
                "tbody tr"
            )
            .filter({
                hasNotText:
                    /Loading invitations|No invitations found/i
            });
    }


    get invitationLoadingIndicator(): Locator {

        return this.activePage
            .getByText(
                /Loading invitations/i
            )
            .first();
    }


    get invitationCountLabel(): Locator {

        return this.activePage
            .getByText(
                /^\d+\s+invitations\b/i
            )
            .first();
    }


    get invitationDetailsCloseButton(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Close$/i
                }
            )
            .last();
    }


    // =========================================================
    // ROLES & PERMISSIONS
    // =========================================================

    get availableRolesHeading(): Locator {

        return this.activePage
            .getByText(
                "Available Roles",
                {
                    exact: true
                }
            )
            .first();
    }


    get roleAccessMatrixHeading(): Locator {

        return this.activePage
            .getByText(
                "Role Access Matrix",
                {
                    exact: true
                }
            )
            .first();
    }


    get roleAccessMatrixDescription(): Locator {

        return this.activePage
            .getByText(
                /Page-wise permissions across/i
            )
            .first();
    }


    // =========================================================
    // AUDIT LOGS
    //
    // IMPORTANT:
    // Audit Logs visually looks like a table, but the current
    // application does NOT render it as a native <table>.
    // Therefore we verify the visible grid instead.
    // =========================================================

    get adminActivityTimelineHeading(): Locator {

        return this.activePage
            .getByText(
                "Admin Activity Timeline",
                {
                    exact: true
                }
            )
            .first();
    }


    get auditLogSearchBox(): Locator {

        return this.activePage
            .locator(
                'input[placeholder*="Search actor" i]:visible'
            )
            .first();
    }


    get auditDateRangeFilter(): Locator {

        return this.activePage
            .locator(
                "select:visible"
            )
            .filter({
                hasText:
                    /Today|Last 7 Days|Last 30 Days/i
            })
            .first();
    }


    get auditExportLogsButton(): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Export Logs/i
                }
            )
            .first();
    }


    get auditExportExcelOption(): Locator {

        return this.activePage
            .getByText(
                "Export as Excel",
                {
                    exact: true
                }
            )
            .last();
    }


    get auditExportPDFOption(): Locator {

        return this.activePage
            .getByText(
                "Export as PDF",
                {
                    exact: true
                }
            )
            .last();
    }


    get auditExportBothOption(): Locator {

        return this.activePage
            .getByText(
                "Export both",
                {
                    exact: true
                }
            )
            .last();
    }


    get auditRecordCountLabel(): Locator {

        return this.activePage
            .getByText(
                /^\d+\s+records$/i
            )
            .first();
    }


    // =========================================================
    // GENERAL HELPERS
    // =========================================================

    private escapeRegExp(
        value: string
    ): string {

        return value.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    }


    private async visibleTextExists(
        value: string
    ): Promise<boolean> {

        const candidates =
            this.activePage
                .getByText(
                    new RegExp(
                        this.escapeRegExp(
                            value
                        ),
                        "i"
                    )
                );


        const count =
            await candidates
                .count();


        for (
            let index = 0;
            index < count;
            index++
        ) {

            const visible =
                await candidates
                    .nth(index)
                    .isVisible()
                    .catch(
                        () => false
                    );


            if (visible) {
                return true;
            }
        }


        return false;
    }


    // =========================================================
    // WAIT FOR USER DATA
    // =========================================================

    private async waitForUsersSettled():
        Promise<void> {

        await this
            .searchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this.activePage
            .waitForTimeout(
                800
            );


        await expect
            .poll(
                async () => {

                    const loadingVisible =
                        await this
                            .userLoadingIndicator
                            .isVisible()
                            .catch(
                                () => false
                            );


                    const tableText =
                        await this
                            .usersTable
                            .innerText()
                            .catch(
                                () => ""
                            );


                    return (
                        loadingVisible ||
                        /Loading admin users/i
                            .test(
                                tableText
                            )
                    );
                },
                {
                    timeout: 20000
                }
            )
            .toBeFalsy();


        await this.activePage
            .waitForTimeout(
                400
            );
    }


    // =========================================================
    // WAIT FOR INVITATIONS
    // =========================================================

    private async waitForInvitationsSettled():
        Promise<void> {

        await this
            .invitationSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this.activePage
            .waitForTimeout(
                900
            );


        await expect
            .poll(
                async () => {

                    const loadingVisible =
                        await this
                            .invitationLoadingIndicator
                            .isVisible()
                            .catch(
                                () => false
                            );


                    const tableText =
                        await this
                            .invitationsTable
                            .innerText()
                            .catch(
                                () => ""
                            );


                    return (
                        loadingVisible ||
                        /Loading invitations/i
                            .test(
                                tableText
                            )
                    );
                },
                {
                    timeout: 20000
                }
            )
            .toBeFalsy();


        await this.activePage
            .waitForTimeout(
                400
            );
    }


    // =========================================================
    // WAIT FOR AUDIT LOGS
    // =========================================================

    private async waitForAuditLogsSettled():
        Promise<void> {

        await this
            .auditLogSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await expect(
            this.adminActivityTimelineHeading
        ).toBeVisible({
            timeout: 15000
        });


        await this.activePage
            .waitForTimeout(
                1000
            );
    }


    // =========================================================
    // INVITATION BUTTON HELPERS
    // =========================================================

    private getInvitationViewButton(
        row: Locator
    ): Locator {

        return row
            .locator(
                "button"
            )
            .filter({
                hasText: /View/i
            })
            .first();
    }


    private getInvitationResendButton(
        row: Locator
    ): Locator {

        return row
            .locator(
                "button"
            )
            .filter({
                hasText: /Resend/i
            })
            .first();
    }


    // =========================================================
    // TARGET 1
    // NAVIGATE TO USER MANAGEMENT
    // =========================================================

    async navigateToUserManagement():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING USER MANAGEMENT"
        );

        console.log(
            "========================================"
        );


        await this
            .userManagementMenu
            .waitFor({
                state: "visible",
                timeout: 20000
            });


        await this
            .userManagementMenu
            .click();


        await this
            .userManagementHeading
            .waitFor({
                state: "visible",
                timeout: 20000
            });


        console.log(
            "User Management page opened successfully"
        );


        pageFixture.logger.info(
            "Navigated to User Management"
        );
    }


    // =========================================================
    // TARGET 1
    // VERIFY PAGE
    // =========================================================

    async verifyUserManagementPageDisplayed():
        Promise<void> {

        await expect(
            this.userManagementHeading
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            "User Management page verified successfully"
        );
    }


    // =========================================================
    // TARGET 2
    // SUMMARY STATISTICS
    // =========================================================

    private async verifySummaryStatistic(
        label: string
    ): Promise<void> {

        const labelLocator =
            this.activePage
                .getByText(
                    label,
                    {
                        exact: true
                    }
                )
                .first();


        await expect(
            labelLocator
        ).toBeVisible({
            timeout: 15000
        });


        let current =
            labelLocator;


        let numberFound =
            false;


        for (
            let level = 0;
            level < 4;
            level++
        ) {

            current =
                current.locator(
                    ".."
                );


            const text =
                (
                    await current
                        .innerText()
                        .catch(
                            () => ""
                        )
                )
                    .replace(
                        /\s+/g,
                        " "
                    )
                    .trim();


            if (
                /\b\d+\b/
                    .test(
                        text
                    )
            ) {

                numberFound =
                    true;

                break;
            }
        }


        expect(
            numberFound
        ).toBeTruthy();
    }


    async verifyDashboardAndSummaryStatistics():
        Promise<void> {

        await expect(
            this.overviewTab
        ).toBeVisible({
            timeout: 15000
        });


        const statistics = [
            "Total admin users",
            "Active right now",
            "Invitations",
            "Suspended / locked"
        ];


        for (
            const statistic
            of statistics
        ) {

            await this
                .verifySummaryStatistic(
                    statistic
                );


            console.log(
                `Verified summary statistic: ${statistic}`
            );
        }


        await expect(
            this.adminAccessRegistryHeading
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            "User Management dashboard verified"
        );
    }


    async verifyRegistryControlsDisplayed():
        Promise<void> {

        await this
            .waitForUsersSettled();


        await expect(
            this.searchBox
        ).toBeVisible();


        await expect(
            this.roleFilter
        ).toBeVisible();


        await expect(
            this.statusFilter
        ).toBeVisible();


        await expect(
            this.resetButton
        ).toBeVisible();


        console.log(
            "Admin Access Registry controls verified"
        );
    }


    // =========================================================
    // USER ROLE FILTER
    // =========================================================

    async filterUsersByRole(
        role: string
    ): Promise<void> {

        console.log(
            `Filtering users by role: ${role}`
        );


        await this
            .roleFilter
            .selectOption({
                label: role
            });


        await expect(
            this.roleFilter
                .locator(
                    "option:checked"
                )
        ).toHaveText(
            role
        );


        await this
            .waitForUsersSettled();
    }


    async verifyRoleFilterApplied(
        role: string
    ): Promise<void> {

        await this
            .waitForUsersSettled();


        const selected =
            (
                await this
                    .roleFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            selected
        ).toBe(
            role
        );


        const count =
            await this
                .userRows
                .count();


        expect(
            count
        ).toBeGreaterThan(
            0
        );


        for (
            let index = 0;
            index < count;
            index++
        ) {

            await expect(
                this.userRows
                    .nth(
                        index
                    )
            ).toContainText(
                role,
                {
                    timeout: 15000
                }
            );
        }


        console.log(
            `User role filter verified: ${role}`
        );
    }


    // =========================================================
    // USER STATUS FILTER
    // =========================================================

    async filterUsersByStatus(
        status: string
    ): Promise<void> {

        console.log(
            `Filtering users by status: ${status}`
        );


        await this
            .statusFilter
            .selectOption({
                label: status
            });


        await expect(
            this.statusFilter
                .locator(
                    "option:checked"
                )
        ).toHaveText(
            status
        );


        await this
            .waitForUsersSettled();
    }


    async verifyStatusFilterApplied(
        status: string
    ): Promise<void> {

        await this
            .waitForUsersSettled();


        const selected =
            (
                await this
                    .statusFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            selected
        ).toBe(
            status
        );


        const count =
            await this
                .userRows
                .count();


        expect(
            count
        ).toBeGreaterThan(
            0
        );


        for (
            let index = 0;
            index < count;
            index++
        ) {

            await expect(
                this.userRows
                    .nth(
                        index
                    )
            ).toContainText(
                status,
                {
                    timeout: 15000
                }
            );
        }


        console.log(
            `User status filter verified: ${status}`
        );
    }


    // =========================================================
    // USER SEARCH
    // =========================================================

    async searchUsers(
        query: string
    ): Promise<void> {

        await this
            .searchBox
            .fill(
                query
            );


        await expect(
            this.searchBox
        ).toHaveValue(
            query
        );


        await this
            .waitForUsersSettled();
    }


    async searchAdminUsersByCriteria(
        criteria: string,
        value: string
    ): Promise<void> {

        const supportedCriteria = [
            "name",
            "username",
            "email"
        ];


        const normalized =
            criteria
                .trim()
                .toLowerCase();


        if (
            !supportedCriteria.includes(
                normalized
            )
        ) {

            throw new Error(
                `Unsupported admin-user search criteria: ${criteria}`
            );
        }


        console.log(
            `Searching admin users by ${criteria}: ${value}`
        );


        await this
            .searchBox
            .fill(
                value
            );


        await expect(
            this.searchBox
        ).toHaveValue(
            value
        );


        await this
            .waitForUsersSettled();
    }


    async verifySearchResult(
        query: string
    ): Promise<void> {

        await this
            .waitForUsersSettled();


        const matchingRow =
            this.userRows
                .filter({
                    hasText:
                        new RegExp(
                            this.escapeRegExp(
                                query
                            ),
                            "i"
                        )
                })
                .first();


        await expect(
            matchingRow
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            `User search verified: ${query}`
        );
    }


    // =========================================================
    // USER RESET
    // =========================================================

    async resetUserManagementFilters():
        Promise<void> {

        await this
            .resetButton
            .click();


        await expect(
            this.searchBox
        ).toHaveValue(
            ""
        );


        await this
            .waitForUsersSettled();


        console.log(
            "User Management filters reset"
        );
    }


    async verifyUserManagementFiltersReset():
        Promise<void> {

        await this
            .waitForUsersSettled();


        await expect(
            this.searchBox
        ).toHaveValue(
            ""
        );


        const role =
            (
                await this
                    .roleFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        const status =
            (
                await this
                    .statusFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            role
        ).toBe(
            "All roles"
        );


        expect(
            status
        ).toBe(
            "All status"
        );


        console.log(
            "User Management filter reset verified"
        );
    }


    // =========================================================
    // TARGET 3
    // USERS TAB
    // =========================================================

    async openUsersTab():
        Promise<void> {

        await this
            .usersTab
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .usersTab
            .click();


        await this
            .waitForUsersSettled();


        console.log(
            "Users tab opened successfully"
        );
    }


    async verifyAllAdminUserRecordsDisplayed():
        Promise<void> {

        await this
            .waitForUsersSettled();


        await expect(
            this.usersTable
        ).toBeVisible({
            timeout: 15000
        });


        const rows =
            await this
                .userRows
                .count();


        expect(
            rows
        ).toBeGreaterThan(
            0
        );


        console.log(
            `Admin-user records displayed: ${rows}`
        );
    }


    // =========================================================
    // DOWNLOAD HELPERS
    // =========================================================

    private getDownloadDirectory():
        string {

        const directory =
            path.join(
                process.cwd(),
                "test-result",
                "downloads",
                "user-management"
            );


        if (
            !fs.existsSync(
                directory
            )
        ) {

            fs.mkdirSync(
                directory,
                {
                    recursive: true
                }
            );
        }


        return directory;
    }


    private async saveDownload(
        download: Download
    ): Promise<{
        fileName: string;
        filePath: string;
    }> {

        const failure =
            await download.failure();


        if (failure) {

            throw new Error(
                `Download failed: ${failure}`
            );
        }


        const fileName =
            download.suggestedFilename();


        const safeName =
            fileName.replace(
                /[<>:"/\\|?*]/g,
                "_"
            );


        const filePath =
            path.join(
                this.getDownloadDirectory(),
                `${Date.now()}-${safeName}`
            );


        await download.saveAs(
            filePath
        );


        expect(
            fs.existsSync(
                filePath
            )
        ).toBeTruthy();


        expect(
            fs.statSync(
                filePath
            ).size
        ).toBeGreaterThan(
            0
        );


        console.log(
            `Downloaded file: ${fileName}`
        );


        return {
            fileName,
            filePath
        };
    }


    // =========================================================
    // USER EXPORT
    // =========================================================

    private async openUserExportMenu():
        Promise<void> {

        await this
            .exportUsersButton
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .exportUsersButton
            .click();


        await this
            .exportAsExcelOption
            .waitFor({
                state: "visible",
                timeout: 10000
            });
    }


    async exportAdminUsersAsExcel():
        Promise<void> {

        this.lastExcelDownloadPath = "";
        this.lastExcelFileName = "";


        await this
            .openUserExportMenu();


        const downloadPromise =
            this.activePage
                .waitForEvent(
                    "download",
                    {
                        timeout: 30000
                    }
                );


        await this
            .exportAsExcelOption
            .click();


        const saved =
            await this
                .saveDownload(
                    await downloadPromise
                );


        this.lastExcelFileName =
            saved.fileName;

        this.lastExcelDownloadPath =
            saved.filePath;
    }


    async verifyAdminUserExcelDownloaded():
        Promise<void> {

        expect(
            this.lastExcelDownloadPath
        ).not.toBe(
            ""
        );


        expect(
            fs.existsSync(
                this.lastExcelDownloadPath
            )
        ).toBeTruthy();


        expect(
            this.lastExcelFileName
                .toLowerCase()
        ).toMatch(
            /\.(xlsx|xls|csv)$/
        );


        console.log(
            "Admin-user Excel export verified"
        );
    }


    async exportAdminUsersAsPDF():
        Promise<void> {

        this.lastPDFDownloadPath = "";
        this.lastPDFFileName = "";


        await this
            .openUserExportMenu();


        const downloadPromise =
            this.activePage
                .waitForEvent(
                    "download",
                    {
                        timeout: 30000
                    }
                );


        await this
            .exportAsPDFOption
            .click();


        const saved =
            await this
                .saveDownload(
                    await downloadPromise
                );


        this.lastPDFFileName =
            saved.fileName;

        this.lastPDFDownloadPath =
            saved.filePath;
    }


    async verifyAdminUserPDFDownloaded():
        Promise<void> {

        expect(
            this.lastPDFDownloadPath
        ).not.toBe(
            ""
        );


        expect(
            fs.existsSync(
                this.lastPDFDownloadPath
            )
        ).toBeTruthy();


        expect(
            this.lastPDFFileName
                .toLowerCase()
        ).toMatch(
            /\.pdf$/
        );


        console.log(
            "Admin-user PDF export verified"
        );
    }


    async exportAdminUsersBoth():
        Promise<void> {

        this.lastBothDownloads =
            [];


        const downloads: Download[] =
            [];


        const handler =
            (
                download: Download
            ) => {

                downloads.push(
                    download
                );
            };


        this.activePage.on(
            "download",
            handler
        );


        try {

            await this
                .openUserExportMenu();


            await this
                .exportBothOption
                .click();


            const start =
                Date.now();


            while (
                downloads.length < 2 &&
                Date.now() - start < 30000
            ) {

                await this.activePage
                    .waitForTimeout(
                        250
                    );
            }

        }

        finally {

            this.activePage.off(
                "download",
                handler
            );
        }


        if (
            downloads.length < 2
        ) {

            throw new Error(
                `Expected 2 user export downloads but detected ${downloads.length}`
            );
        }


        for (
            const download
            of downloads.slice(
                0,
                2
            )
        ) {

            this.lastBothDownloads
                .push(
                    await this
                        .saveDownload(
                            download
                        )
                );
        }
    }


    async verifyBothAdminUserExportsDownloaded():
        Promise<void> {

        expect(
            this.lastBothDownloads.length
        ).toBe(
            2
        );


        const names =
            this.lastBothDownloads
                .map(
                    item =>
                        item.fileName
                            .toLowerCase()
                );


        expect(
            names.some(
                name =>
                    name.endsWith(
                        ".pdf"
                    )
            )
        ).toBeTruthy();


        expect(
            names.some(
                name =>
                    /\.(xlsx|xls|csv)$/
                        .test(
                            name
                        )
            )
        ).toBeTruthy();


        console.log(
            "Both admin-user exports verified"
        );
    }


    // =========================================================
    // TARGET 4
    // INVITATIONS
    // =========================================================

    async openInvitationsTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING INVITATIONS TAB"
        );

        console.log(
            "========================================"
        );


        await this
            .invitationsTab
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .invitationsTab
            .click();


        await this
            .invitationsHeading
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .waitForInvitationsSettled();


        console.log(
            "Invitations tab opened successfully"
        );
    }


    async verifyAllInvitationRecordsDisplayed():
        Promise<void> {

        await this
            .waitForInvitationsSettled();


        await expect(
            this.invitationsTable
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.invitationCountLabel
        ).toBeVisible({
            timeout: 15000
        });


        const rows =
            await this
                .invitationRows
                .count();


        console.log(
            `Invitation records displayed: ${rows}`
        );
    }


    async searchInvitations(
        criteria: string,
        value: string
    ): Promise<void> {

        const supportedCriteria = [
            "email",
            "invitation code",
            "username",
            "name"
        ];


        const normalized =
            criteria
                .trim()
                .toLowerCase();


        if (
            !supportedCriteria.includes(
                normalized
            )
        ) {

            throw new Error(
                `Unsupported invitation search criteria: ${criteria}`
            );
        }


        await this
            .invitationSearchBox
            .fill(
                ""
            );


        await this.activePage
            .waitForTimeout(
                300
            );


        await this
            .invitationSearchBox
            .fill(
                value
            );


        await expect(
            this.invitationSearchBox
        ).toHaveValue(
            value
        );


        await this
            .waitForInvitationsSettled();


        console.log(
            `Searching invitations by ${criteria}: ${value}`
        );
    }


    async verifyInvitationSearchResults(
        value: string
    ): Promise<void> {

        const regex =
            new RegExp(
                this.escapeRegExp(
                    value
                ),
                "i"
            );


        for (
            let attempt = 1;
            attempt <= 3;
            attempt++
        ) {

            await this
                .waitForInvitationsSettled();


            const rows =
                this.invitationRows
                    .filter({
                        hasText:
                            regex
                    });


            if (
                await rows.count() > 0
            ) {

                await expect(
                    rows.first()
                ).toBeVisible({
                    timeout: 10000
                });


                console.log(
                    `Invitation search verified: ${value}`
                );


                return;
            }


            if (
                attempt < 3
            ) {

                await this
                    .invitationSearchBox
                    .fill(
                        ""
                    );


                await this.activePage
                    .waitForTimeout(
                        300
                    );


                await this
                    .invitationSearchBox
                    .fill(
                        value
                    );
            }
        }


        throw new Error(
            `Invitation search did not return "${value}".`
        );
    }


    async resetInvitationFilters():
        Promise<void> {

        await this
            .resetButton
            .click();


        await expect(
            this.invitationSearchBox
        ).toHaveValue(
            ""
        );


        await this
            .waitForInvitationsSettled();


        console.log(
            "Invitation filters reset"
        );
    }


    async verifyInvitationFiltersReset():
        Promise<void> {

        await this
            .waitForInvitationsSettled();


        await expect(
            this.invitationSearchBox
        ).toHaveValue(
            ""
        );


        const role =
            (
                await this
                    .invitationRoleFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        const status =
            (
                await this
                    .invitationStatusFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            role
        ).toBe(
            "All roles"
        );


        expect(
            status
        ).toBe(
            "All status"
        );
    }


    async filterInvitationsByRole(
        role: string
    ): Promise<void> {

        await this
            .invitationRoleFilter
            .selectOption({
                label: role
            });


        await expect(
            this.invitationRoleFilter
                .locator(
                    "option:checked"
                )
        ).toHaveText(
            role
        );


        await this
            .waitForInvitationsSettled();
    }


    async verifyInvitationRoleFilterApplied(
        role: string
    ): Promise<void> {

        await this
            .waitForInvitationsSettled();


        const selected =
            (
                await this
                    .invitationRoleFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            selected
        ).toBe(
            role
        );


        await expect(
            this.invitationsTable
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            `Invitation role filter verified: ${role}`
        );
    }


    async filterInvitationsByStatus(
        status: string
    ): Promise<void> {

        await this
            .invitationStatusFilter
            .selectOption({
                label: status
            });


        await expect(
            this.invitationStatusFilter
                .locator(
                    "option:checked"
                )
        ).toHaveText(
            status
        );


        await this
            .waitForInvitationsSettled();
    }


    async verifyInvitationStatusFilterApplied(
        status: string
    ): Promise<void> {

        await this
            .waitForInvitationsSettled();


        const selected =
            (
                await this
                    .invitationStatusFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            selected
        ).toBe(
            status
        );


        const rows =
            this.invitationRows;


        const count =
            await rows.count();


        for (
            let index = 0;
            index < count;
            index++
        ) {

            await expect(
                rows.nth(
                    index
                )
            ).toContainText(
                status,
                {
                    timeout: 15000
                }
            );
        }


        console.log(
            `Invitation status filter verified: ${status}`
        );
    }


    async openInvitationRecord():
        Promise<void> {

        await this
            .waitForInvitationsSettled();


        const rows =
            this.invitationRows;


        const count =
            await rows.count();


        if (
            count === 0
        ) {

            throw new Error(
                "No invitation records are currently available to open."
            );
        }


        const firstRow =
            rows.first();


        this.lastViewedInvitationCode =
            (
                await firstRow
                    .locator(
                        "td"
                    )
                    .first()
                    .innerText()
            )
                .trim();


        const viewButton =
            this.getInvitationViewButton(
                firstRow
            );


        await expect(
            viewButton
        ).toBeVisible({
            timeout: 15000
        });


        await viewButton
            .click();


        await expect(
            this.activePage
                .getByText(
                    "Invitation Code",
                    {
                        exact: true
                    }
                )
                .last()
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.invitationDetailsCloseButton
        ).toBeVisible({
            timeout: 15000
        });
    }


    async verifyInvitationDetailsDisplayed():
        Promise<void> {

        const labels = [
            "Invitation Code",
            "Status",
            "Email",
            "Username",
            "First Name",
            "Last Name",
            "Roles",
            "Invited By",
            "Sent At",
            "Expires At"
        ];


        for (
            const label
            of labels
        ) {

            await expect(
                this.activePage
                    .getByText(
                        label,
                        {
                            exact: true
                        }
                    )
                    .last()
            ).toBeVisible({
                timeout: 15000
            });
        }


        console.log(
            "Invitation details verified"
        );
    }


    async closeInvitationDetails():
        Promise<void> {

        await this
            .invitationDetailsCloseButton
            .click();


        await expect(
            this.invitationDetailsCloseButton
        ).toBeHidden({
            timeout: 10000
        });
    }


    async resendEligibleInvitation():
        Promise<void> {

        this.lastResentInvitationCode =
            "";

        this.invitationResendSucceeded =
            false;


        await this
            .resetInvitationFilters();


        await this
            .invitationStatusFilter
            .selectOption({
                label: "Expired"
            });


        await this
            .waitForInvitationsSettled();


        const rows =
            this.invitationRows;


        const count =
            await rows.count();


        let eligibleRow:
            Locator | null =
            null;


        for (
            let index = 0;
            index < count;
            index++
        ) {

            const row =
                rows.nth(
                    index
                );


            const resend =
                this.getInvitationResendButton(
                    row
                );


            if (
                await resend
                    .isVisible()
                    .catch(
                        () => false
                    ) &&
                await resend
                    .isEnabled()
                    .catch(
                        () => false
                    )
            ) {

                eligibleRow =
                    row;

                break;
            }
        }


        if (!eligibleRow) {

            throw new Error(
                "No enabled Resend button was found for an Expired invitation."
            );
        }


        this.lastResentInvitationCode =
            (
                await eligibleRow
                    .locator(
                        "td"
                    )
                    .first()
                    .innerText()
            )
                .trim();


        await this
            .getInvitationResendButton(
                eligibleRow
            )
            .click();


        await this.activePage
            .waitForTimeout(
                1200
            );


        await expect(
            this.invitationSearchBox
        ).toBeVisible({
            timeout: 10000
        });


        this.invitationResendSucceeded =
            true;
    }


    async verifyInvitationResendCompleted():
        Promise<void> {

        expect(
            this.lastResentInvitationCode
        ).not.toBe(
            ""
        );


        expect(
            this.invitationResendSucceeded
        ).toBeTruthy();
    }


    // =========================================================
    // TARGET 5
    // ROLES & PERMISSIONS
    // =========================================================

    async openRolesAndPermissionsTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING ROLES & PERMISSIONS"
        );

        console.log(
            "========================================"
        );


        await this
            .rolesAndPermissionsTab
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .rolesAndPermissionsTab
            .click();


        await this
            .availableRolesHeading
            .waitFor({
                state: "visible",
                timeout: 20000
            });


        await this
            .roleAccessMatrixHeading
            .waitFor({
                state: "visible",
                timeout: 20000
            });


        await this.activePage
            .getByText(
                "Super Admin",
                {
                    exact: true
                }
            )
            .first()
            .waitFor({
                state: "visible",
                timeout: 20000
            });


        console.log(
            "Roles & Permissions page opened successfully"
        );
    }


    async verifyAllAvailableRolesDisplayed():
        Promise<void> {

        const expectedRoles = [
            "Super Admin",
            "Operations Manager",
            "Customer Service",
            "KYC Officer",
            "Risk Officer",
            "Compliance Officer",
            "Auditor",
            "Support User"
        ];


        await expect(
            this.availableRolesHeading
        ).toBeVisible({
            timeout: 15000
        });


        for (
            const role
            of expectedRoles
        ) {

            await expect(
                this.activePage
                    .getByText(
                        role,
                        {
                            exact: true
                        }
                    )
                    .first()
            ).toBeVisible({
                timeout: 15000
            });


            console.log(
                `Verified role: ${role}`
            );
        }


        console.log(
            "All 8 available roles verified"
        );
    }


    async verifyRoleAccessMatrixDisplayed():
        Promise<void> {

        await this
            .roleAccessMatrixHeading
            .scrollIntoViewIfNeeded();


        await expect(
            this.roleAccessMatrixHeading
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.roleAccessMatrixDescription
        ).toBeVisible({
            timeout: 15000
        });


        const description =
            await this
                .roleAccessMatrixDescription
                .innerText();


        console.log(
            `Role Access Matrix: ${description}`
        );


        await expect(
            this.activePage
                .getByText(
                    "Page",
                    {
                        exact: true
                    }
                )
                .last()
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            "Role Access Matrix displayed successfully"
        );
    }


    // =========================================================
    // TARGET 6
    // OPEN AUDIT LOGS
    // =========================================================

    async openAuditLogsTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING USER MANAGEMENT AUDIT LOGS"
        );

        console.log(
            "========================================"
        );


        await this
            .auditLogsTab
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .auditLogsTab
            .click();


        await this
            .adminActivityTimelineHeading
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .auditLogSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .waitForAuditLogsSettled();


        console.log(
            "Audit Logs tab opened successfully"
        );
    }


    // =========================================================
    // TARGET 6
    // VERIFY AUDIT LOGS
    //
    // FIX:
    // No native table locator is used here.
    // =========================================================

    async verifyAllUserManagementAuditLogs():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING USER MANAGEMENT AUDIT LOGS"
        );

        console.log(
            "----------------------------------------"
        );


        await this
            .waitForAuditLogsSettled();


        await expect(
            this.adminActivityTimelineHeading
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.auditLogSearchBox
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.auditDateRangeFilter
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.auditExportLogsButton
        ).toBeVisible({
            timeout: 15000
        });


        await expect(
            this.auditRecordCountLabel
        ).toBeVisible({
            timeout: 15000
        });


        // -----------------------------------------------------
        // VERIFY GRID HEADERS
        // -----------------------------------------------------

        const headers = [
            "MODULE",
            "ACTION",
            "ACTION BY",
            "TARGET BY",
            "DETAILS",
            "DATE & TIME",
            "TIME AGO"
        ];


        for (
            const header
            of headers
        ) {

            const headerLocator =
                this.activePage
                    .getByText(
                        new RegExp(
                            `^${this.escapeRegExp(header)}$`,
                            "i"
                        )
                    )
                    .last();


            await expect(
                headerLocator
            ).toBeVisible({
                timeout: 15000
            });


            console.log(
                `Verified audit grid header: ${header}`
            );
        }


        // -----------------------------------------------------
        // VERIFY RECORD COUNT
        // -----------------------------------------------------

        const countText =
            (
                await this
                    .auditRecordCountLabel
                    .innerText()
            )
                .trim();


        const countMatch =
            countText.match(
                /(\d+)\s+records/i
            );


        if (!countMatch) {

            throw new Error(
                `Unable to read audit-log record count from "${countText}".`
            );
        }


        const recordCount =
            Number(
                countMatch[1]
            );


        expect(
            recordCount
        ).toBeGreaterThan(
            0
        );


        console.log(
            `Audit records available: ${recordCount}`
        );


        console.log(
            "User Management Audit Logs verified successfully"
        );


        pageFixture.logger.info(
            `Verified ${recordCount} User Management audit logs`
        );
    }


    // =========================================================
    // AUDIT SEARCH
    // =========================================================

    async searchUserManagementAuditLogs(
        criteria: string,
        value: string
    ): Promise<void> {

        const supportedCriteria = [
            "actor",
            "action",
            "target",
            "details"
        ];


        const normalized =
            criteria
                .trim()
                .toLowerCase();


        if (
            !supportedCriteria.includes(
                normalized
            )
        ) {

            throw new Error(
                `Unsupported audit-log search criteria: ${criteria}`
            );
        }


        console.log(
            `Searching Audit Logs by ${criteria}: "${value}"`
        );


        await this
            .auditLogSearchBox
            .fill(
                ""
            );


        await this.activePage
            .waitForTimeout(
                300
            );


        await this
            .auditLogSearchBox
            .fill(
                value
            );


        await expect(
            this.auditLogSearchBox
        ).toHaveValue(
            value
        );


        await this
            .waitForAuditLogsSettled();
    }


    // =========================================================
    // VERIFY AUDIT SEARCH
    //
    // Since Audit Logs use a grid/div layout rather than a
    // native table, verify visible filtered text.
    // =========================================================

    async verifyUserManagementAuditSearchResults(
        value: string
    ): Promise<void> {

        await this
            .waitForAuditLogsSettled();


        let found =
            false;


        for (
            let attempt = 1;
            attempt <= 3;
            attempt++
        ) {

            found =
                await this
                    .visibleTextExists(
                        value
                    );


            if (found) {
                break;
            }


            if (
                attempt < 3
            ) {

                console.log(
                    `Audit search result not ready. Retry ${attempt} for "${value}"`
                );


                await this.activePage
                    .waitForTimeout(
                        800
                    );
            }
        }


        if (!found) {

            throw new Error(
                `No visible User Management audit result contains "${value}".`
            );
        }


        console.log(
            `Audit search verified: ${value}`
        );
    }


    // =========================================================
    // CLEAR AUDIT SEARCH
    // =========================================================

    async clearUserManagementAuditSearch():
        Promise<void> {

        await this
            .auditLogSearchBox
            .fill(
                ""
            );


        await expect(
            this.auditLogSearchBox
        ).toHaveValue(
            ""
        );


        await this
            .waitForAuditLogsSettled();


        console.log(
            "Audit search cleared"
        );
    }


    // =========================================================
    // AUDIT DATE FILTER
    // =========================================================

    async filterAuditLogsByDateRange(
        range: string
    ): Promise<void> {

        const supportedRanges = [
            "Today",
            "Last 7 Days",
            "Last 30 Days"
        ];


        if (
            !supportedRanges.includes(
                range
            )
        ) {

            throw new Error(
                `Unsupported audit-log date range: ${range}`
            );
        }


        console.log(
            `Filtering audit logs by date: ${range}`
        );


        await this
            .auditDateRangeFilter
            .selectOption({
                label: range
            });


        await expect(
            this.auditDateRangeFilter
                .locator(
                    "option:checked"
                )
        ).toHaveText(
            range
        );


        await this
            .waitForAuditLogsSettled();
    }


    async verifyAuditDateRangeFilterApplied(
        range: string
    ): Promise<void> {

        const selected =
            (
                await this
                    .auditDateRangeFilter
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();


        expect(
            selected
        ).toBe(
            range
        );


        await expect(
            this.adminActivityTimelineHeading
        ).toBeVisible({
            timeout: 15000
        });


        console.log(
            `Audit date filter verified: ${range}`
        );
    }


    // =========================================================
    // AUDIT EXPORT MENU
    // =========================================================

    private async openAuditExportMenu():
        Promise<void> {

        await this
            .auditExportLogsButton
            .waitFor({
                state: "visible",
                timeout: 15000
            });


        await this
            .auditExportLogsButton
            .click();


        await this
            .auditExportExcelOption
            .waitFor({
                state: "visible",
                timeout: 10000
            });


        await this
            .auditExportPDFOption
            .waitFor({
                state: "visible",
                timeout: 10000
            });


        await this
            .auditExportBothOption
            .waitFor({
                state: "visible",
                timeout: 10000
            });
    }


    // =========================================================
    // AUDIT EXPORT EXCEL
    // =========================================================

    async exportAuditLogsAsExcel():
        Promise<void> {

        this.lastAuditExcelDownloadPath =
            "";

        this.lastAuditExcelFileName =
            "";


        await this
            .openAuditExportMenu();


        const downloadPromise =
            this.activePage
                .waitForEvent(
                    "download",
                    {
                        timeout: 30000
                    }
                );


        await this
            .auditExportExcelOption
            .click();


        const saved =
            await this
                .saveDownload(
                    await downloadPromise
                );


        this.lastAuditExcelFileName =
            saved.fileName;

        this.lastAuditExcelDownloadPath =
            saved.filePath;


        console.log(
            "Audit Excel export completed"
        );
    }


    async verifyAuditLogExcelDownloaded():
        Promise<void> {

        expect(
            this.lastAuditExcelDownloadPath
        ).not.toBe(
            ""
        );


        expect(
            fs.existsSync(
                this.lastAuditExcelDownloadPath
            )
        ).toBeTruthy();


        expect(
            this.lastAuditExcelFileName
                .toLowerCase()
        ).toMatch(
            /\.(xlsx|xls|csv)$/
        );


        expect(
            fs.statSync(
                this.lastAuditExcelDownloadPath
            ).size
        ).toBeGreaterThan(
            0
        );


        console.log(
            `Audit Excel verified: ${this.lastAuditExcelFileName}`
        );
    }


    // =========================================================
    // AUDIT EXPORT PDF
    // =========================================================

    async exportAuditLogsAsPDF():
        Promise<void> {

        this.lastAuditPDFDownloadPath =
            "";

        this.lastAuditPDFFileName =
            "";


        await this
            .openAuditExportMenu();


        const downloadPromise =
            this.activePage
                .waitForEvent(
                    "download",
                    {
                        timeout: 30000
                    }
                );


        await this
            .auditExportPDFOption
            .click();


        const saved =
            await this
                .saveDownload(
                    await downloadPromise
                );


        this.lastAuditPDFFileName =
            saved.fileName;

        this.lastAuditPDFDownloadPath =
            saved.filePath;


        console.log(
            "Audit PDF export completed"
        );
    }


    async verifyAuditLogPDFDownloaded():
        Promise<void> {

        expect(
            this.lastAuditPDFDownloadPath
        ).not.toBe(
            ""
        );


        expect(
            fs.existsSync(
                this.lastAuditPDFDownloadPath
            )
        ).toBeTruthy();


        expect(
            this.lastAuditPDFFileName
                .toLowerCase()
        ).toMatch(
            /\.pdf$/
        );


        expect(
            fs.statSync(
                this.lastAuditPDFDownloadPath
            ).size
        ).toBeGreaterThan(
            0
        );


        console.log(
            `Audit PDF verified: ${this.lastAuditPDFFileName}`
        );
    }


    // =========================================================
    // AUDIT EXPORT BOTH
    // =========================================================

    async exportAuditLogsBoth():
        Promise<void> {

        this.lastAuditBothDownloads =
            [];


        const downloads: Download[] =
            [];


        const handler =
            (
                download: Download
            ) => {

                downloads.push(
                    download
                );
            };


        this.activePage.on(
            "download",
            handler
        );


        try {

            await this
                .openAuditExportMenu();


            await this
                .auditExportBothOption
                .click();


            const start =
                Date.now();


            while (
                downloads.length < 2 &&
                Date.now() - start < 30000
            ) {

                await this.activePage
                    .waitForTimeout(
                        250
                    );
            }

        }

        finally {

            this.activePage.off(
                "download",
                handler
            );
        }


        if (
            downloads.length < 2
        ) {

            throw new Error(
                `Expected 2 audit-log downloads but detected ${downloads.length}`
            );
        }


        for (
            const download
            of downloads.slice(
                0,
                2
            )
        ) {

            this.lastAuditBothDownloads
                .push(
                    await this
                        .saveDownload(
                            download
                        )
                );
        }


        console.log(
            "Audit Export both completed"
        );
    }


    async verifyBothAuditLogExportsDownloaded():
        Promise<void> {

        expect(
            this.lastAuditBothDownloads.length
        ).toBe(
            2
        );


        const names =
            this.lastAuditBothDownloads
                .map(
                    item =>
                        item.fileName
                            .toLowerCase()
                );


        expect(
            names.some(
                name =>
                    name.endsWith(
                        ".pdf"
                    )
            )
        ).toBeTruthy();


        expect(
            names.some(
                name =>
                    /\.(xlsx|xls|csv)$/
                        .test(
                            name
                        )
            )
        ).toBeTruthy();


        for (
            const item
            of this.lastAuditBothDownloads
        ) {

            expect(
                fs.existsSync(
                    item.filePath
                )
            ).toBeTruthy();


            expect(
                fs.statSync(
                    item.filePath
                ).size
            ).toBeGreaterThan(
                0
            );
        }


        console.log(
            "Both Audit Log exports verified successfully"
        );
    }
}