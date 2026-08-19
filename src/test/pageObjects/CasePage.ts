import {
    expect,
    Locator,
    Page,
    Download
} from "@playwright/test";

import * as fs from "fs";
import * as path from "path";

import { pageFixture } from "../utils/pageFixture";
export default class CasePage {

    private get activePage(): Page {
        return pageFixture.page;
    }
    
    // =========================================================
    // REPORT DOWNLOAD STATE
    // =========================================================

    private lastPDFDownloadPath: string = "";
    private lastPDFFileName: string = "";

    private lastSpreadsheetDownloadPath: string = "";
    private lastSpreadsheetFileName: string = "";

    private lastAllDataDownloadPath: string = "";
    private lastAllDataFileName: string = "";

    // =========================================================
    // CASE MANAGEMENT SIDEBAR
    // =========================================================

    get caseManagementMenu(): Locator {
        return this.activePage
            .getByRole("link", {
                name: /Case Management/i
            })
            .first();
    }

    get caseManagementHeading(): Locator {
        return this.activePage
            .getByRole("heading", {
                name: /Case Management/i
            })
            .first();
    }

    // =========================================================
    // QUEUE SEARCH
    // =========================================================

    get queueSearchBox(): Locator {
        return this.activePage
            .locator(
                'input[placeholder*="Search reference" i]:visible'
            )
            .first();
    }

    // =========================================================
    // QUEUE CASE COUNT
    //
    // Examples:
    // 15 cases
    // 8 cases
    // 0 cases
    // =========================================================

    get queueCaseCountLabel(): Locator {
        return this.activePage
            .getByText(
                /^\d+\s+cases$/i
            )
            .first();
    }

    // =========================================================
    // EMPTY RESULT MESSAGE
    // =========================================================

    get noCasesMessage(): Locator {
        return this.activePage
            .getByText(
                /No cases match your filters/i
            )
            .first();
    }

    // =========================================================
    // LOADING MESSAGE
    // =========================================================

    get queueLoadingIndicator(): Locator {
        return this.activePage
            .getByText(
                /^Loading\.\.\.$/i
            )
            .first();
    }

    // =========================================================
    // QUEUE REFRESH BUTTON
    //
    // There are TWO Refresh buttons on the screen.
    //
    // 1. Upper Case Management Refresh
    // 2. Queue-level Refresh beside the filters
    //
    // The Queue Refresh is the SECOND / LAST visible Refresh.
    // =========================================================

    get queueRefreshButton(): Locator {
        return this.activePage
            .getByRole(
                "button",
                {
                    name: /^Refresh$/i
                }
            )
            .last();
    }

    // =========================================================
    // HELPER - ESCAPE REGEX
    // =========================================================

    private escapeRegExp(
        value: string
    ): string {

        return value.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    }

    // =========================================================
    // FIND VISIBLE CONTROL
    //
    // Used for:
    //
    // Queue 15
    // Scam 15
    // Incident 1
    // Support 4
    // =========================================================

    private async findVisibleControl(
        name: string
    ): Promise<Locator> {

        const safeName =
            this.escapeRegExp(name);

        const regex =
            new RegExp(
                `^\\s*${safeName}\\s*\\d*\\s*$`,
                "i"
            );

        // -----------------------------------------------------
        // Standard clickable controls
        // -----------------------------------------------------

        const controls =
            this.activePage.locator(
                [
                    "button:visible",
                    "a:visible",
                    "[role='button']:visible",
                    "[role='tab']:visible"
                ].join(", ")
            );

        const controlCount =
            await controls.count();

        for (
            let index = 0;
            index < controlCount;
            index++
        ) {

            const control =
                controls.nth(index);

            const text = (
                await control
                    .innerText()
                    .catch(() => "")
            )
                .replace(/\s+/g, " ")
                .trim();

            const visible =
                await control
                    .isVisible()
                    .catch(() => false);

            if (
                visible &&
                regex.test(text)
            ) {

                console.log(
                    `${name} control found: "${text}"`
                );

                return control;
            }
        }

        // -----------------------------------------------------
        // Custom div/span controls
        // -----------------------------------------------------

        const customControls =
            this.activePage.locator(
                "div:visible, span:visible"
            );

        const customCount =
            await customControls.count();

        for (
            let index = 0;
            index < customCount;
            index++
        ) {

            const control =
                customControls.nth(index);

            const text = (
                await control
                    .innerText()
                    .catch(() => "")
            )
                .replace(/\s+/g, " ")
                .trim();

            const visible =
                await control
                    .isVisible()
                    .catch(() => false);

            if (
                visible &&
                regex.test(text)
            ) {

                console.log(
                    `${name} custom control found: "${text}"`
                );

                return control;
            }
        }

        throw new Error(
            `Unable to find visible ${name} control`
        );
    }

    // =========================================================
    // NEW CASE BUTTON
    // =========================================================

    private getNewCaseButton(
        caseType: string
    ): Locator {

        return this.activePage
            .getByRole(
                "button",
                {
                    name: new RegExp(
                        `New\\s+${this.escapeRegExp(caseType)}\\s+Case`,
                        "i"
                    )
                }
            )
            .first();
    }

    // =========================================================
    // CASE REFERENCES
    //
    // Examples:
    // CAS-2026-0044
    // CAS-2024-0001
    // =========================================================

    private get caseReferenceCandidates(): Locator {
        return this.activePage
            .getByText(
                /^CAS-\d{4}-\d+$/i
            );
    }

    // =========================================================
    // GET VISIBLE CASE REFERENCES
    // =========================================================

    private async getVisibleCaseReferences():
        Promise<string[]> {

        const references: string[] = [];

        const count =
            await this
                .caseReferenceCandidates
                .count();

        for (
            let index = 0;
            index < count;
            index++
        ) {

            const item =
                this
                    .caseReferenceCandidates
                    .nth(index);

            const visible =
                await item
                    .isVisible()
                    .catch(() => false);

            if (!visible) {
                continue;
            }

            const text = (
                await item.innerText()
            )
                .replace(/\s+/g, " ")
                .trim();

            if (
                text &&
                !references.includes(text)
            ) {

                references.push(text);
            }
        }

        return references;
    }

    // =========================================================
    // GET DISPLAYED CASE COUNT
    // =========================================================

    private async getDisplayedCaseCount():
        Promise<number> {

        await this.queueCaseCountLabel.waitFor({
            state: "visible",
            timeout: 15000
        });

        const text = (
            await this.queueCaseCountLabel
                .innerText()
        )
            .trim();

        const match =
            text.match(/\d+/);

        if (!match) {

            throw new Error(
                `Unable to read Queue case count from "${text}"`
            );
        }

        return Number(
            match[0]
        );
    }

    // =========================================================
    // WAIT FOR QUEUE TO FINISH LOADING
    // =========================================================

    private async waitForQueueSettled():
        Promise<void> {

        const loadingAppeared =
            await this
                .queueLoadingIndicator
                .waitFor({
                    state: "visible",
                    timeout: 1200
                })
                .then(() => true)
                .catch(() => false);

        if (loadingAppeared) {

            console.log(
                "Queue is loading..."
            );

            await this
                .queueLoadingIndicator
                .waitFor({
                    state: "hidden",
                    timeout: 20000
                });
        }

        await this
            .queueSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });

        await this.activePage
            .waitForTimeout(500);
    }

    // =========================================================
    // FILTER CONFIGURATION
    //
    // Order confirmed from the manual-test video:
    //
    // 0 Status
    // 1 Priority
    // 2 Category
    // 3 Assigned Agent
    // 4 SLA
    // =========================================================

    private getFilterIndex(
        filterName: string
    ): number {

        const normalized =
            filterName
                .trim()
                .toLowerCase();

        switch (normalized) {

            case "status":
                return 0;

            case "priority":
                return 1;

            case "category":
                return 2;

            case "assigned agent":
            case "agent":
                return 3;

            case "sla":
            case "sla status":
                return 4;

            default:

                throw new Error(
                    `Unsupported Queue filter: ${filterName}`
                );
        }
    }

    // =========================================================
    // DEFAULT FILTER VALUES
    // =========================================================

    private getDefaultFilterValue(
        filterName: string
    ): string {

        const normalized =
            filterName
                .trim()
                .toLowerCase();

        switch (normalized) {

            case "status":
                return "All Statuses";

            case "priority":
                return "All Priorities";

            case "category":
                return "All Categories";

            case "assigned agent":
            case "agent":
                return "All Agents";

            case "sla":
            case "sla status":
                return "All SLA";

            default:

                throw new Error(
                    `Unsupported Queue filter: ${filterName}`
                );
        }
    }

    // =========================================================
    // GET FILTER CONTROL
    // =========================================================

    private async getQueueFilterControl(
        filterName: string
    ): Promise<Locator> {

        const index =
            this.getFilterIndex(
                filterName
            );

        /*
         * The controls in the video behave like HTML select /
         * combobox controls.
         */

        const selects =
            this.activePage
                .locator(
                    "select:visible"
                );

        const selectCount =
            await selects.count();

        if (
            selectCount >= 5
        ) {

            return selects.nth(
                index
            );
        }

        /*
         * Fallback if the implementation changes from
         * native select to custom combobox.
         */

        const comboboxes =
            this.activePage
                .locator(
                    "[role='combobox']:visible"
                );

        const comboCount =
            await comboboxes.count();

        if (
            comboCount >= 5
        ) {

            return comboboxes.nth(
                index
            );
        }

        throw new Error(
            `Unable to locate Queue filter "${filterName}". Found ${selectCount} select(s) and ${comboCount} combobox(es).`
        );
    }

    // =========================================================
    // GET SELECTED FILTER TEXT
    // =========================================================

    private async getSelectedFilterText(
        filterName: string
    ): Promise<string> {

        const control =
            await this
                .getQueueFilterControl(
                    filterName
                );

        const tagName =
            await control.evaluate(
                element =>
                    element.tagName
                        .toLowerCase()
            );

        if (
            tagName === "select"
        ) {

            return (
                await control
                    .locator(
                        "option:checked"
                    )
                    .innerText()
            )
                .trim();
        }

        return (
            await control.innerText()
        )
            .replace(/\s+/g, " ")
            .trim();
    }

    // =========================================================
    // SELECT QUEUE FILTER
    // =========================================================

    async selectQueueFilter(
        filterName: string,
        value: string
    ): Promise<void> {

        const control =
            await this
                .getQueueFilterControl(
                    filterName
                );

        const tagName =
            await control.evaluate(
                element =>
                    element.tagName
                        .toLowerCase()
            );

        console.log(
            `Applying ${filterName} filter: ${value}`
        );

        // -----------------------------------------------------
        // Native SELECT
        // -----------------------------------------------------

        if (
            tagName === "select"
        ) {

            await control.selectOption({
                label: value
            });
        }

        // -----------------------------------------------------
        // Custom combobox fallback
        // -----------------------------------------------------

        else {

            await control.click();

            const roleOption =
                this.activePage
                    .getByRole(
                        "option",
                        {
                            name: value,
                            exact: true
                        }
                    )
                    .last();

            const roleOptionVisible =
                await roleOption
                    .isVisible()
                    .catch(() => false);

            if (roleOptionVisible) {

                await roleOption.click();
            }

            else {

                await this.activePage
                    .getByText(
                        value,
                        {
                            exact: true
                        }
                    )
                    .last()
                    .click();
            }
        }

        await this.waitForQueueSettled();

        const selected =
            await this
                .getSelectedFilterText(
                    filterName
                );

        console.log(
            `${filterName} selected: ${selected}`
        );
    }

    // =========================================================
    // COUNT VISIBLE EXACT TEXT
    // =========================================================

    private async countVisibleExactText(
        value: string
    ): Promise<number> {

        const regex =
            new RegExp(
                `^${this.escapeRegExp(value)}$`,
                "i"
            );

        const candidates =
            this.activePage
                .getByText(
                    regex
                );

        const count =
            await candidates.count();

        let visibleCount = 0;

        for (
            let index = 0;
            index < count;
            index++
        ) {

            if (
                await candidates
                    .nth(index)
                    .isVisible()
                    .catch(() => false)
            ) {

                visibleCount++;
            }
        }

        return visibleCount;
    }

    // =========================================================
    // NAVIGATE TO CASE MANAGEMENT
    // =========================================================

    async navigateToCaseManagement():
        Promise<void> {

        await this
            .caseManagementMenu
            .waitFor({
                state: "visible",
                timeout: 20000
            });

        console.log(
            "Case Management menu found"
        );

        await this.caseManagementMenu.click();

        await this
            .caseManagementHeading
            .waitFor({
                state: "visible",
                timeout: 20000
            });

        console.log(
            "Case Management page opened"
        );

        pageFixture.logger.info(
            "Navigated to Case Management"
        );
    }

    // =========================================================
    // OPEN QUEUE
    // =========================================================

    async openQueueTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING CASE MANAGEMENT QUEUE"
        );

        console.log(
            "========================================"
        );

        const queueControl =
            await this.findVisibleControl(
                "Queue"
            );

        await queueControl
            .scrollIntoViewIfNeeded();

        await queueControl.click();

        await this
            .queueSearchBox
            .waitFor({
                state: "visible",
                timeout: 20000
            });

        await this.waitForQueueSettled();

        console.log(
            "Queue opened successfully"
        );

        pageFixture.logger.info(
            "Opened Case Management Queue successfully"
        );
    }

    // =========================================================
    // SWITCH CASE TYPE
    // =========================================================

    async switchCaseType(
        caseType: string
    ): Promise<void> {

        const normalizedType =
            caseType
                .trim()
                .toLowerCase();

        if (
            ![
                "scam",
                "incident",
                "support"
            ].includes(normalizedType)
        ) {

            throw new Error(
                `Unsupported case type: ${caseType}`
            );
        }

        console.log(
            `\n========== SWITCHING TO ${caseType.toUpperCase()} ==========`
        );

        const caseControl =
            await this.findVisibleControl(
                caseType
            );

        await caseControl
            .scrollIntoViewIfNeeded();

        await caseControl.click();

        const expectedButton =
            this.getNewCaseButton(
                caseType
            );

        await expect(
            expectedButton
        ).toBeVisible({
            timeout: 20000
        });

        await this
            .queueSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });

        await this.waitForQueueSettled();

        console.log(
            `${caseType} selected successfully`
        );

        pageFixture.logger.info(
            `Successfully switched to ${caseType} cases`
        );
    }

    // =========================================================
    // VERIFY CASE TYPE
    // =========================================================

    async verifyCaseTypeDisplayed(
        caseType: string
    ): Promise<void> {

        console.log(
            `\n========== VERIFYING ${caseType.toUpperCase()} CASES ==========`
        );

        await this
            .queueSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });

        const expectedButton =
            this.getNewCaseButton(
                caseType
            );

        await expect(
            expectedButton
        ).toBeVisible({
            timeout: 15000
        });

        await this.waitForQueueSettled();

        const references =
            await this
                .getVisibleCaseReferences();

        console.log(
            `${caseType} cases displayed: ${references.length}`
        );

        for (
            let index = 0;
            index < references.length;
            index++
        ) {

            console.log(
                `[${caseType} Case ${index + 1}] ${references[index]}`
            );
        }

        pageFixture.logger.info(
            `Verified ${caseType} cases are displayed in Queue`
        );
    }

    // =========================================================
    // VERIFY ALL CASE RECORDS
    // =========================================================

    async verifyAllCaseRecordsDisplayed():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "VERIFYING ALL QUEUE CASE RECORDS"
        );

        console.log(
            "========================================"
        );

        await this.waitForQueueSettled();

        const displayedCount =
            await this
                .getDisplayedCaseCount();

        const references =
            await this
                .getVisibleCaseReferences();

        expect(
            displayedCount
        ).toBeGreaterThan(0);

        expect(
            references.length
        ).toBeGreaterThan(0);

        console.log(
            `Queue count: ${displayedCount}`
        );

        console.log(
            `Case records found: ${references.length}`
        );

        for (
            let index = 0;
            index < references.length;
            index++
        ) {

            console.log(
                `[Case ${index + 1}] ${references[index]}`
            );
        }

        pageFixture.logger.info(
            `Verified ${references.length} Case Management Queue record(s)`
        );
    }

    // =========================================================
    // SEARCH CASE RECORDS
    // =========================================================

    async searchCaseRecords(
        criteria: string,
        value: string
    ): Promise<void> {

        console.log(
            `\nSearching Queue by ${criteria}: "${value}"`
        );

        await this
            .queueSearchBox
            .fill(value);

        await this.waitForQueueSettled();

        const count =
            await this
                .getDisplayedCaseCount();

        console.log(
            `Search result count: ${count}`
        );

        pageFixture.logger.info(
            `Searched Case Queue by ${criteria} using ${value}`
        );
    }

    // =========================================================
    // VERIFY SEARCH RESULTS
    // =========================================================

    async verifyQueueSearchResults(
        value: string,
        criteria: string
    ): Promise<void> {

        await this.waitForQueueSettled();

        const displayedCount =
            await this
                .getDisplayedCaseCount();

        expect(
            displayedCount
        ).toBeGreaterThan(0);

        // -----------------------------------------------------
        // Reference search
        // -----------------------------------------------------

        if (
            criteria
                .toLowerCase()
                .includes("reference")
        ) {

            const references =
                await this
                    .getVisibleCaseReferences();

            const matching =
                references.filter(
                    reference =>
                        reference
                            .toLowerCase()
                            .includes(
                                value.toLowerCase()
                            )
                );

            expect(
                matching.length
            ).toBeGreaterThan(0);

            console.log(
                `Reference search verified: ${matching.length} matching case(s)`
            );
        }

        // -----------------------------------------------------
        // Title / Customer search
        // -----------------------------------------------------

        else {

            const regex =
                new RegExp(
                    this.escapeRegExp(value),
                    "i"
                );

            const candidates =
                this.activePage
                    .getByText(
                        regex
                    );

            const candidateCount =
                await candidates.count();

            let visibleMatchFound =
                false;

            for (
                let index = 0;
                index < candidateCount;
                index++
            ) {

                if (
                    await candidates
                        .nth(index)
                        .isVisible()
                        .catch(() => false)
                ) {

                    visibleMatchFound =
                        true;

                    break;
                }
            }

            expect(
                visibleMatchFound
            ).toBeTruthy();

            console.log(
                `${criteria} search verified for "${value}"`
            );
        }

        pageFixture.logger.info(
            `Verified Queue search results for ${value}`
        );
    }

    // =========================================================
    // VERIFY NO SEARCH RESULTS
    // =========================================================

    async verifyNoQueueSearchResults():
        Promise<void> {

        await this.waitForQueueSettled();

        const displayedCount =
            await this
                .getDisplayedCaseCount();

        expect(
            displayedCount
        ).toBe(0);

        await expect(
            this.noCasesMessage
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            "Verified: No cases match the Queue search"
        );

        pageFixture.logger.info(
            "Verified no Case Queue records matched the search"
        );
    }

    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    async clearQueueSearch():
        Promise<void> {

        await this
            .queueSearchBox
            .fill("");

        await this.waitForQueueSettled();

        console.log(
            "Queue search cleared"
        );
    }

    // =========================================================
    // RESET ALL QUEUE FILTERS
    // =========================================================

    async resetQueueFilters():
        Promise<void> {

        console.log(
            "\nResetting Queue filters..."
        );

        await this
            .queueSearchBox
            .fill("");

        const filterNames = [
            "status",
            "priority",
            "category",
            "assigned agent",
            "SLA status"
        ];

        for (
            const filterName
            of filterNames
        ) {

            const defaultValue =
                this.getDefaultFilterValue(
                    filterName
                );

            const currentValue =
                await this
                    .getSelectedFilterText(
                        filterName
                    );

            if (
                currentValue
                    .toLowerCase() !==
                defaultValue
                    .toLowerCase()
            ) {

                await this
                    .selectQueueFilter(
                        filterName,
                        defaultValue
                    );
            }
        }

        await this.waitForQueueSettled();

        console.log(
            "Queue filters reset successfully"
        );

        pageFixture.logger.info(
            "Reset all Case Queue filters"
        );
    }

    // =========================================================
    // VERIFY FILTER
    // =========================================================

    async verifyQueueFilterApplied(
        filterName: string,
        value: string
    ): Promise<void> {

        await this.waitForQueueSettled();

        const selectedValue =
            await this
                .getSelectedFilterText(
                    filterName
                );

        expect(
            selectedValue.toLowerCase()
        ).toBe(
            value.toLowerCase()
        );

        const displayedCount =
            await this
                .getDisplayedCaseCount();

        console.log(
            `${filterName}: ${selectedValue}`
        );

        console.log(
            `Filtered Queue cases: ${displayedCount}`
        );

        /*
         * Status, Category and Agent are directly displayed
         * in the Queue rows, so we perform an additional
         * visible-data verification for them.
         */

        const normalizedFilter =
            filterName
                .toLowerCase();

        if (
            displayedCount > 0 &&
            (
                normalizedFilter === "status" ||
                normalizedFilter === "category" ||
                normalizedFilter === "assigned agent" ||
                normalizedFilter === "agent"
            )
        ) {

            const visibleMatches =
                await this
                    .countVisibleExactText(
                        value
                    );

            expect(
                visibleMatches
            ).toBeGreaterThan(0);

            console.log(
                `Verified visible Queue data contains "${value}"`
            );
        }

        pageFixture.logger.info(
            `Verified Queue ${filterName} filter is applied as ${value}`
        );
    }

    // =========================================================
    // REFRESH CASE QUEUE
    // =========================================================

    async refreshCaseQueue():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "REFRESHING CASE QUEUE"
        );

        console.log(
            "========================================"
        );

        const beforeCount =
            await this
                .getDisplayedCaseCount();

        const beforeReferences =
            await this
                .getVisibleCaseReferences();

        console.log(
            `Cases before refresh: ${beforeCount}`
        );

        await this
            .queueRefreshButton
            .waitFor({
                state: "visible",
                timeout: 15000
            });

        await this
            .queueRefreshButton
            .click();

        await this.waitForQueueSettled();

        const afterCount =
            await this
                .getDisplayedCaseCount();

        const afterReferences =
            await this
                .getVisibleCaseReferences();

        console.log(
            `Cases after refresh: ${afterCount}`
        );

        expect(
            afterCount
        ).toBeGreaterThanOrEqual(0);

        if (
            beforeReferences.length > 0
        ) {

            expect(
                afterReferences.length
            ).toBeGreaterThan(0);
        }

        console.log(
            "Case Queue refresh completed"
        );

        pageFixture.logger.info(
            "Refreshed Case Management Queue successfully"
        );
    }

    // =========================================================
    // VERIFY QUEUE REFRESH
    // =========================================================

    async verifyQueueRefreshCompleted():
        Promise<void> {

        await this
            .queueSearchBox
            .waitFor({
                state: "visible",
                timeout: 15000
            });

        await this.waitForQueueSettled();

        const count =
            await this
                .getDisplayedCaseCount();

        expect(
            count
        ).toBeGreaterThanOrEqual(0);

        console.log(
            `Queue available after refresh with ${count} case(s)`
        );

        pageFixture.logger.info(
            "Verified Case Queue remained available after refresh"
        );
    }
        // =========================================================
    // SLA MONITORING
    // =========================================================

    get slaComplianceLabel(): Locator {
        return this.activePage
            .getByText(
                "SLA Compliance",
                { exact: true }
            )
            .first();
    }

    get slaBreachedLabel(): Locator {
        return this.activePage
            .getByText(
                "Breached",
                { exact: true }
            )
            .first();
    }

    get slaAtRiskLabel(): Locator {
        return this.activePage
            .getByText(
                /At Risk.*75%/i
            )
            .first();
    }

    get slaHealthyLabel(): Locator {
        return this.activePage
            .getByText(
                "Healthy",
                { exact: true }
            )
            .first();
    }

    get slaPoliciesHeading(): Locator {
        return this.activePage
            .getByText(
                "SLA Policies",
                { exact: true }
            )
            .first();
    }

    get activeCasesSLATrackerHeading(): Locator {
        return this.activePage
            .getByText(
                /Active Cases\s*[–-]\s*SLA Tracker/i
            )
            .first();
    }

    // =========================================================
    // OPEN SLA TAB
    // =========================================================

    async openSLATab(): Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING SLA MONITORING"
        );

        console.log(
            "========================================"
        );

        const slaTab =
            await this.findVisibleControl(
                "SLA"
            );

        await slaTab
            .scrollIntoViewIfNeeded();

        console.log(
            "Clicking SLA tab..."
        );

        await slaTab.click();

        // -----------------------------------------------------
        // Confirm SLA page loaded
        // -----------------------------------------------------

        await this.slaComplianceLabel.waitFor({
            state: "visible",
            timeout: 20000
        });

        await this.slaPoliciesHeading.waitFor({
            state: "visible",
            timeout: 20000
        });

        console.log(
            "SLA Monitoring page opened successfully"
        );

        pageFixture.logger.info(
            "Opened Case Management SLA tab"
        );
    }

    // =========================================================
    // VERIFY SLA DASHBOARD
    // =========================================================

    async verifySLAMonitoringDashboard():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING SLA DASHBOARD"
        );

        console.log(
            "----------------------------------------"
        );

        await expect(
            this.slaComplianceLabel
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.slaBreachedLabel
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.slaAtRiskLabel
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.slaHealthyLabel
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            "Verified: SLA Compliance"
        );

        console.log(
            "Verified: Breached"
        );

        console.log(
            "Verified: At Risk"
        );

        console.log(
            "Verified: Healthy"
        );

        console.log(
            "SLA dashboard verified successfully"
        );

        pageFixture.logger.info(
            "Verified SLA Monitoring dashboard"
        );
    }

    // =========================================================
    // VERIFY SLA POLICIES
    // =========================================================

    async verifySLAPolicies():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING SLA POLICIES"
        );

        console.log(
            "----------------------------------------"
        );

        await expect(
            this.slaPoliciesHeading
        ).toBeVisible({
            timeout: 15000
        });

        // -----------------------------------------------------
        // Priority policies shown in the manual test:
        //
        // Critical
        // High
        // Medium
        // Low
        // -----------------------------------------------------

        const priorities = [
            "Critical",
            "High",
            "Medium",
            "Low"
        ];

        for (
            const priority
            of priorities
        ) {

            const priorityLocator =
                this.activePage
                    .getByText(
                        priority,
                        { exact: true }
                    )
                    .first();

            await expect(
                priorityLocator
            ).toBeVisible({
                timeout: 15000
            });

            console.log(
                `Verified SLA policy: ${priority}`
            );
        }

        // -----------------------------------------------------
        // Verify policy information fields
        // -----------------------------------------------------

        const firstResponse =
            this.activePage
                .getByText(
                    "First Response",
                    { exact: true }
                )
                .first();

        const resolutionTarget =
            this.activePage
                .getByText(
                    "Resolution Target",
                    { exact: true }
                )
                .first();

        const activeCompliance =
            this.activePage
                .getByText(
                    /Active compliance/i
                )
                .first();

        await expect(
            firstResponse
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            resolutionTarget
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            activeCompliance
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            "Verified: First Response"
        );

        console.log(
            "Verified: Resolution Target"
        );

        console.log(
            "Verified: Active Compliance"
        );

        console.log(
            "SLA Policies verified successfully"
        );

        pageFixture.logger.info(
            "Verified SLA Policies"
        );
    }

    // =========================================================
    // VERIFY ACTIVE CASE SLA TRACKER
    // =========================================================

    async verifyActiveCasesSLATracker():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING ACTIVE CASES SLA TRACKER"
        );

        console.log(
            "----------------------------------------"
        );

        await this
            .activeCasesSLATrackerHeading
            .scrollIntoViewIfNeeded();

        await expect(
            this.activeCasesSLATrackerHeading
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            "Active Cases - SLA Tracker is displayed"
        );

        pageFixture.logger.info(
            "Verified Active Cases SLA Tracker"
        );
    }

    // =========================================================
    // AUDIT
    // =========================================================

    get auditSearchBox(): Locator {
        return this.activePage
            .locator(
                'input[placeholder*="Search case, actor or action" i]:visible'
            )
            .first();
    }

    get auditEntryCount(): Locator {
        return this.activePage
            .getByText(
                /^\d+\s+entries$/i
            )
            .first();
    }

    get auditLoadingIndicator(): Locator {
        return this.activePage
            .getByText(
                /^Loading\.\.\.$/i
            )
            .first();
    }

    // =========================================================
    // WAIT FOR AUDIT TO FINISH LOADING
    // =========================================================

    private async waitForAuditSettled():
        Promise<void> {

        const loadingAppeared =
            await this.auditLoadingIndicator
                .waitFor({
                    state: "visible",
                    timeout: 1200
                })
                .then(() => true)
                .catch(() => false);

        if (loadingAppeared) {

            console.log(
                "Audit records are loading..."
            );

            await this.auditLoadingIndicator
                .waitFor({
                    state: "hidden",
                    timeout: 20000
                });
        }

        await this.auditSearchBox.waitFor({
            state: "visible",
            timeout: 15000
        });

        await this.activePage
            .waitForTimeout(500);
    }

    // =========================================================
    // GET AUDIT ENTRY COUNT
    // =========================================================

    private async getAuditEntryCount():
        Promise<number> {

        await this.auditEntryCount.waitFor({
            state: "visible",
            timeout: 15000
        });

        const text = (
            await this.auditEntryCount
                .innerText()
        ).trim();

        const match =
            text.match(/\d+/);

        if (!match) {

            throw new Error(
                `Unable to read audit entry count from "${text}"`
            );
        }

        return Number(
            match[0]
        );
    }

    // =========================================================
    // OPEN AUDIT TAB
    // =========================================================

    async openAuditTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING CASE AUDIT"
        );

        console.log(
            "========================================"
        );

        const auditTab =
            await this.findVisibleControl(
                "Audit"
            );

        await auditTab
            .scrollIntoViewIfNeeded();

        console.log(
            "Clicking Audit tab..."
        );

        await auditTab.click();

        await this.auditSearchBox.waitFor({
            state: "visible",
            timeout: 20000
        });

        await this.waitForAuditSettled();

        console.log(
            "Case Audit opened successfully"
        );

        pageFixture.logger.info(
            "Opened Case Management Audit tab"
        );
    }

    // =========================================================
    // VERIFY AUDIT RECORDS
    // =========================================================

    async verifyAuditRecordsDisplayed():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING CASE AUDIT RECORDS"
        );

        console.log(
            "----------------------------------------"
        );

        await this.waitForAuditSettled();

        // =====================================================
        // VERIFY THAT AUDIT PAGE CONTENT IS PRESENT
        // =====================================================

        await expect(
            this.auditSearchBox
        ).toBeVisible({
            timeout: 15000
        });

        const entryCount =
            await this.getAuditEntryCount();

        expect(
            entryCount
        ).toBeGreaterThan(0);

        console.log(
            `Audit entries displayed: ${entryCount}`
        );

        // =====================================================
        // VERIFY AUDIT RECORDS EXIST
        //
        // We avoid using the visual column header "CASE"
        // because the UI does not expose it reliably as exact
        // text in the DOM.
        // =====================================================

        const auditCaseReferences =
            this.activePage
                .getByText(
                    /CAS-\d{4}-\d+/i
                );

        const totalCandidates =
            await auditCaseReferences.count();

        let visibleRecords = 0;

        for (
            let index = 0;
            index < totalCandidates;
            index++
        ) {

            const candidate =
                auditCaseReferences.nth(index);

            const visible =
                await candidate
                    .isVisible()
                    .catch(() => false);

            if (visible) {

                visibleRecords++;

                const text = (
                    await candidate.innerText()
                )
                    .replace(/\s+/g, " ")
                    .trim();

                console.log(
                    `[Audit Record ${visibleRecords}] ${text}`
                );
            }
        }

        expect(
            visibleRecords
        ).toBeGreaterThan(0);

        console.log(
            `Visible Audit records: ${visibleRecords}`
        );

        console.log(
            "Case Audit records verified successfully"
        );

        console.log(
            "----------------------------------------\n"
        );

        pageFixture.logger.info(
            `Verified Case Audit records. Total entries: ${entryCount}`
        );
    }

    // =========================================================
    // SEARCH AUDIT RECORDS
    // =========================================================

    async searchAuditRecords(
        criteria: string,
        value: string
    ): Promise<void> {

        console.log(
            `\nSearching Audit by ${criteria}: "${value}"`
        );

        await this.auditSearchBox.fill(
            value
        );

        await this.waitForAuditSettled();

        console.log(
            `Audit search completed for "${value}"`
        );

        pageFixture.logger.info(
            `Searched Case Audit by ${criteria} using ${value}`
        );
    }

    // =========================================================
    // VERIFY AUDIT SEARCH RESULTS
    // =========================================================

    async verifyAuditSearchResults(
        value: string,
        criteria: string
    ): Promise<void> {

        await this.waitForAuditSettled();

        const entryCount =
            await this
                .getAuditEntryCount();

        expect(
            entryCount
        ).toBeGreaterThan(0);

        console.log(
            `Audit search returned ${entryCount} record(s)`
        );

        // -----------------------------------------------------
        // Search by CASE
        // -----------------------------------------------------

        if (
            criteria
                .toLowerCase() ===
            "case"
        ) {

            const matchingCases =
                this.activePage
                    .getByText(
                        new RegExp(
                            this.escapeRegExp(value),
                            "i"
                        )
                    );

            const count =
                await matchingCases.count();

            let visibleMatchFound =
                false;

            for (
                let index = 0;
                index < count;
                index++
            ) {

                const visible =
                    await matchingCases
                        .nth(index)
                        .isVisible()
                        .catch(() => false);

                if (visible) {

                    visibleMatchFound =
                        true;

                    break;
                }
            }

            expect(
                visibleMatchFound
            ).toBeTruthy();

            console.log(
                `Verified Audit CASE search: ${value}`
            );
        }

        // -----------------------------------------------------
        // Search by ACTION
        // -----------------------------------------------------

        else if (
            criteria
                .toLowerCase() ===
            "action"
        ) {

            const matchingActions =
                this.activePage
                    .getByText(
                        new RegExp(
                            `^${this.escapeRegExp(value)}$`,
                            "i"
                        )
                    );

            const count =
                await matchingActions.count();

            let visibleMatchFound =
                false;

            for (
                let index = 0;
                index < count;
                index++
            ) {

                const visible =
                    await matchingActions
                        .nth(index)
                        .isVisible()
                        .catch(() => false);

                if (visible) {

                    visibleMatchFound =
                        true;

                    break;
                }
            }

            expect(
                visibleMatchFound
            ).toBeTruthy();

            console.log(
                `Verified Audit ACTION search: ${value}`
            );
        }

        else {

            throw new Error(
                `Unsupported Audit search criteria: ${criteria}`
            );
        }

        pageFixture.logger.info(
            `Verified Audit search results for ${value}`
        );
    }

    // =========================================================
    // CLEAR AUDIT SEARCH
    // =========================================================

    async clearAuditSearch():
        Promise<void> {

        await this.auditSearchBox.fill(
            ""
        );

        await this.waitForAuditSettled();

        console.log(
            "Audit search cleared"
        );

        pageFixture.logger.info(
            "Cleared Case Audit search"
        );
    }
        // =========================================================
    // REPORTS
    // =========================================================

    get exportPDFButton(): Locator {
        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Export PDF/i
                }
            )
            .first();
    }

    get exportCSVExcelButton(): Locator {
        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Export CSV|Export Excel|CSV\s*\/\s*Excel/i
                }
            )
            .first();
    }

    get downloadAllDataButton(): Locator {
        return this.activePage
            .getByRole(
                "button",
                {
                    name: /Download All Data/i
                }
            )
            .first();
    }

    // =========================================================
    // DOWNLOAD DIRECTORY
    // =========================================================

    private getCaseReportDownloadDirectory():
        string {

        const downloadDirectory =
            path.join(
                process.cwd(),
                "test-result",
                "downloads",
                "case-reports"
            );

        if (
            !fs.existsSync(
                downloadDirectory
            )
        ) {

            fs.mkdirSync(
                downloadDirectory,
                {
                    recursive: true
                }
            );
        }

        return downloadDirectory;
    }

    // =========================================================
    // SAVE DOWNLOADED FILE
    // =========================================================

    private async saveCaseReportDownload(
        download: Download
    ): Promise<{
        fileName: string;
        filePath: string;
        fileSize: number;
    }> {

        const failure =
            await download.failure();

        if (failure) {

            throw new Error(
                `Case Report download failed: ${failure}`
            );
        }

        const fileName =
            download.suggestedFilename();

        if (!fileName) {

            throw new Error(
                "Downloaded file does not have a filename."
            );
        }

        const safeFileName =
            fileName.replace(
                /[<>:"/\\|?*]/g,
                "_"
            );

        const filePath =
            path.join(
                this.getCaseReportDownloadDirectory(),
                `${Date.now()}-${safeFileName}`
            );

        await download.saveAs(
            filePath
        );

        if (
            !fs.existsSync(
                filePath
            )
        ) {

            throw new Error(
                `Downloaded file was not saved: ${filePath}`
            );
        }

        const fileSize =
            fs.statSync(
                filePath
            ).size;

        expect(
            fileSize
        ).toBeGreaterThan(0);

        console.log(
            `Downloaded file: ${fileName}`
        );

        console.log(
            `Downloaded size: ${fileSize} bytes`
        );

        console.log(
            `Downloaded location: ${filePath}`
        );

        return {
            fileName,
            filePath,
            fileSize
        };
    }

    // =========================================================
    // OPEN REPORTS TAB
    // =========================================================

    async openReportsTab():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "OPENING CASE REPORTS"
        );

        console.log(
            "========================================"
        );

        const reportsTab =
            await this.findVisibleControl(
                "Reports"
            );

        await reportsTab
            .scrollIntoViewIfNeeded();

        console.log(
            "Clicking Reports tab..."
        );

        await reportsTab.click();

        // -----------------------------------------------------
        // Prove Reports page loaded using its three functions.
        // -----------------------------------------------------

        await this.exportPDFButton.waitFor({
            state: "visible",
            timeout: 20000
        });

        await this.exportCSVExcelButton.waitFor({
            state: "visible",
            timeout: 20000
        });

        await this.downloadAllDataButton.waitFor({
            state: "visible",
            timeout: 20000
        });

        console.log(
            "Case Reports page opened successfully"
        );

        pageFixture.logger.info(
            "Opened Case Management Reports tab"
        );
    }

    // =========================================================
    // VERIFY REPORTS DASHBOARD
    // =========================================================

    async verifyCaseReportsDashboard():
        Promise<void> {

        console.log(
            "\n----------------------------------------"
        );

        console.log(
            "VERIFYING CASE REPORTS DASHBOARD"
        );

        console.log(
            "----------------------------------------"
        );

        await expect(
            this.exportPDFButton
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.exportCSVExcelButton
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.downloadAllDataButton
        ).toBeVisible({
            timeout: 15000
        });

        console.log(
            "Verified: Export PDF"
        );

        console.log(
            "Verified: Export CSV / Excel"
        );

        console.log(
            "Verified: Download All Data"
        );

        /*
         * Verify some of the report summary information
         * visible in the Reports dashboard.
         *
         * Values are NOT hard-coded because case data changes.
         */

        const reportLabels = [
            "Total Cases",
            "Resolution Rate",
            "Avg. Resolution",
            "SLA Compliance"
        ];

        for (
            const label
            of reportLabels
        ) {

            const locator =
                this.activePage
                    .getByText(
                        label,
                        {
                            exact: true
                        }
                    )
                    .first();

            await expect(
                locator
            ).toBeVisible({
                timeout: 15000
            });

            console.log(
                `Verified Reports section: ${label}`
            );
        }

        console.log(
            "Case Reports dashboard verified successfully"
        );

        pageFixture.logger.info(
            "Verified Case Reports dashboard"
        );
    }

    // =========================================================
    // EXPORT PDF
    // =========================================================

    async exportCaseReportAsPDF():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "EXPORTING CASE REPORT AS PDF"
        );

        console.log(
            "========================================"
        );

        this.lastPDFDownloadPath =
            "";

        this.lastPDFFileName =
            "";

        const downloadPromise =
            this.activePage.waitForEvent(
                "download",
                {
                    timeout: 30000
                }
            );

        await this.exportPDFButton.click();

        const download =
            await downloadPromise;

        const saved =
            await this
                .saveCaseReportDownload(
                    download
                );

        this.lastPDFFileName =
            saved.fileName;

        this.lastPDFDownloadPath =
            saved.filePath;

        console.log(
            "PDF Case Report export completed"
        );

        pageFixture.logger.info(
            "Exported Case Report as PDF"
        );
    }

    // =========================================================
    // VERIFY PDF DOWNLOAD
    // =========================================================

    async verifyPDFReportDownloaded():
        Promise<void> {

        expect(
            this.lastPDFDownloadPath
        ).not.toBe("");

        expect(
            fs.existsSync(
                this.lastPDFDownloadPath
            )
        ).toBeTruthy();

        const fileName =
            this.lastPDFFileName
                .toLowerCase();

        expect(
            fileName
        ).toMatch(
            /\.pdf$/
        );

        const fileSize =
            fs.statSync(
                this.lastPDFDownloadPath
            ).size;

        expect(
            fileSize
        ).toBeGreaterThan(0);

        console.log(
            `PDF filename verified: ${this.lastPDFFileName}`
        );

        console.log(
            `PDF file size verified: ${fileSize} bytes`
        );

        console.log(
            "PDF Case Report downloaded successfully"
        );

        pageFixture.logger.info(
            "Verified PDF Case Report download"
        );
    }

    // =========================================================
    // EXPORT CSV / EXCEL
    // =========================================================

    async exportCaseReportAsCSVExcel():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "EXPORTING CASE REPORT AS CSV / EXCEL"
        );

        console.log(
            "========================================"
        );

        this.lastSpreadsheetDownloadPath =
            "";

        this.lastSpreadsheetFileName =
            "";

        const downloadPromise =
            this.activePage.waitForEvent(
                "download",
                {
                    timeout: 30000
                }
            );

        await this
            .exportCSVExcelButton
            .click();

        const download =
            await downloadPromise;

        const saved =
            await this
                .saveCaseReportDownload(
                    download
                );

        this.lastSpreadsheetFileName =
            saved.fileName;

        this.lastSpreadsheetDownloadPath =
            saved.filePath;

        console.log(
            "CSV / Excel export completed"
        );

        pageFixture.logger.info(
            "Exported Case Report as CSV / Excel"
        );
    }

    // =========================================================
    // VERIFY CSV / EXCEL DOWNLOAD
    // =========================================================

    async verifyCSVExcelReportDownloaded():
        Promise<void> {

        expect(
            this.lastSpreadsheetDownloadPath
        ).not.toBe("");

        expect(
            fs.existsSync(
                this.lastSpreadsheetDownloadPath
            )
        ).toBeTruthy();

        const fileName =
            this.lastSpreadsheetFileName
                .toLowerCase();

        expect(
            fileName
        ).toMatch(
            /\.(csv|xlsx|xls)$/
        );

        const fileSize =
            fs.statSync(
                this.lastSpreadsheetDownloadPath
            ).size;

        expect(
            fileSize
        ).toBeGreaterThan(0);

        console.log(
            `Spreadsheet filename verified: ${this.lastSpreadsheetFileName}`
        );

        console.log(
            `Spreadsheet file size verified: ${fileSize} bytes`
        );

        console.log(
            "CSV / Excel Case Report downloaded successfully"
        );

        pageFixture.logger.info(
            "Verified CSV / Excel Case Report download"
        );
    }

    // =========================================================
    // DOWNLOAD ALL CASE DATA
    // =========================================================

    async downloadAllCaseData():
        Promise<void> {

        console.log(
            "\n========================================"
        );

        console.log(
            "DOWNLOADING ALL CASE DATA"
        );

        console.log(
            "========================================"
        );

        this.lastAllDataDownloadPath =
            "";

        this.lastAllDataFileName =
            "";

        /*
         * The manual flow produces a downloadable dataset.
         * Playwright captures the download directly instead
         * of interacting with the Windows Save As dialog.
         */

        const downloadPromise =
            this.activePage.waitForEvent(
                "download",
                {
                    timeout: 30000
                }
            );

        await this
            .downloadAllDataButton
            .click();

        const download =
            await downloadPromise;

        const saved =
            await this
                .saveCaseReportDownload(
                    download
                );

        this.lastAllDataFileName =
            saved.fileName;

        this.lastAllDataDownloadPath =
            saved.filePath;

        console.log(
            "All Case Data download completed"
        );

        pageFixture.logger.info(
            "Downloaded all Case Management data"
        );
    }

    // =========================================================
    // VERIFY ALL CASE DATA DOWNLOAD
    // =========================================================

    async verifyAllCaseDataAvailable():
        Promise<void> {

        expect(
            this.lastAllDataDownloadPath
        ).not.toBe("");

        expect(
            fs.existsSync(
                this.lastAllDataDownloadPath
            )
        ).toBeTruthy();

        const fileSize =
            fs.statSync(
                this.lastAllDataDownloadPath
            ).size;

        expect(
            fileSize
        ).toBeGreaterThan(0);

        const extension =
            path.extname(
                this.lastAllDataFileName
            )
                .toLowerCase();

        expect(
            extension.length
        ).toBeGreaterThan(0);

        console.log(
            `All Case Data filename: ${this.lastAllDataFileName}`
        );

        console.log(
            `All Case Data file size: ${fileSize} bytes`
        );

        console.log(
            "All Case Data verified successfully"
        );

        pageFixture.logger.info(
            "Verified All Case Data download"
        );
    }
}