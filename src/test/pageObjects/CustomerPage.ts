import { expect, Locator, Page } from "@playwright/test";
import { pageFixture } from "../utils/pageFixture";

export default class CustomerPage {
    private get activePage(): Page {
        return pageFixture.page;
    }

    get customerManagementMenu(): Locator {
        return this.activePage
            .locator("a:visible, button:visible")
            .filter({
                hasText: /Customer Management|Customers/i
            })
            .first();
    }

    get customerManagementHeading(): Locator {
        return this.activePage
            .locator("h1:visible, h2:visible, h3:visible")
            .filter({
                hasText: /Customer Management|Customers/i
            })
            .first();
    }

    get customerTable(): Locator {
        return this.activePage.locator("table:visible").first();
    }

    get customerSearchBox(): Locator {
        return this.activePage
            .locator(
                [
                    'input[placeholder*="search" i]:visible',
                    'input[type="search"]:visible',
                    'input[name*="search" i]:visible'
                ].join(", ")
            )
            .first();
    }

    get customerRows(): Locator {
        return this.activePage.locator("tbody tr:visible");
    }

    get customerDetailsPopup(): Locator {
        return this.activePage
            .locator(
                [
                    '[role="dialog"]:visible',
                    "div.fixed.inset-0:visible",
                    ".modal:visible",
                    ".drawer:visible",
                    ".sheet:visible"
                ].join(", ")
            )
            .filter({
                hasText:
                    /Customer Details|User Details|Verification|Full Name|Wallet ID/i
            })
            .last();
    }

    get customerVerificationSection(): Locator {
        return this.customerDetailsPopup
            .locator("h1, h2, h3, h4, p, span, div")
            .filter({
                hasText:
                    /Verification|Verification Status|KYC Status/i
            })
            .first();
    }

    async navigateToCustomerManagement(): Promise<void> {
        await this.activePage.waitForLoadState(
            "domcontentloaded"
        );

        await this.customerManagementMenu.waitFor({
            state: "visible",
            timeout: 20000
        });

        await this.customerManagementMenu.click();

        await this.customerManagementHeading.waitFor({
            state: "visible",
            timeout: 20000
        });

        pageFixture.logger.info(
            "Navigated to Customer Management page"
        );
    }

    async verifyCustomerManagementHeading(): Promise<void> {
        await expect(
            this.customerManagementHeading
        ).toBeVisible({
            timeout: 15000
        });

        pageFixture.logger.info(
            "Customer Management heading is visible"
        );
    }

    async verifyCustomerTableVisible(): Promise<void> {
        await expect(this.customerTable).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.customerRows.first()
        ).toBeVisible({
            timeout: 15000
        });

        const rowCount =
            await this.customerRows.count();

        expect(rowCount).toBeGreaterThan(0);

        pageFixture.logger.info(
            `Customer records table is visible with ${rowCount} record(s)`
        );
    }

    async searchCustomer(
        query: string
    ): Promise<void> {
        await this.customerSearchBox.waitFor({
            state: "visible",
            timeout: 15000
        });

        await this.customerSearchBox.clear();
        await this.customerSearchBox.fill(query);

        await this.activePage.waitForTimeout(1500);

        pageFixture.logger.info(
            `Searched customer using query: ${query}`
        );
    }

    async clearCustomerSearch(): Promise<void> {
        await this.customerSearchBox.waitFor({
            state: "visible",
            timeout: 15000
        });

        await this.customerSearchBox.clear();

        await this.activePage.waitForTimeout(1000);

        pageFixture.logger.info(
            "Cleared the customer search field"
        );
    }

    async verifyCustomerSearchResults(
        expectedValue: string
    ): Promise<void> {
        await this.customerRows.first().waitFor({
            state: "visible",
            timeout: 15000
        });

        const rowCount =
            await this.customerRows.count();

        expect(rowCount).toBeGreaterThan(0);

        const expected =
            expectedValue.toLowerCase();

        const rowTexts: string[] = [];
        let matchingRowFound = false;

        for (
            let index = 0;
            index < rowCount;
            index++
        ) {
            const rowText = (
                await this.customerRows
                    .nth(index)
                    .innerText()
            )
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase();

            rowTexts.push(rowText);

            if (rowText.includes(expected)) {
                matchingRowFound = true;
            }
        }

        if (!matchingRowFound) {
            const maskedValueDisplayed =
                rowTexts.some(
                    (rowText) =>
                        /[•●▪◦·*]{3,}/.test(
                            rowText
                        ) ||
                        rowText.includes(
                            "......"
                        )
                );

            if (!maskedValueDisplayed) {
                throw new Error(
                    `No displayed customer result contained "${expectedValue}". Results: ${rowTexts.join(
                        " | "
                    )}`
                );
            }

            pageFixture.logger.info(
                `The search returned records for "${expectedValue}", but the matching value is masked.`
            );
        }

        pageFixture.logger.info(
            `Verified ${rowCount} customer search result(s) for "${expectedValue}"`
        );
    }

    async openFirstCustomerRecord(): Promise<void> {
        await this.customerRows.first().waitFor({
            state: "visible",
            timeout: 15000
        });

        const firstRow =
            this.customerRows.first();

        const viewControl = firstRow
            .locator(
                [
                    'button[aria-label*="view" i]',
                    'button[title*="view" i]',
                    'a[aria-label*="view" i]',
                    'a[title*="view" i]',
                    'button:has-text("View")',
                    'a:has-text("View")',
                    'button:has-text("Details")',
                    'a:has-text("Details")'
                ].join(", ")
            )
            .first();

        if (
            await viewControl
                .isVisible()
                .catch(() => false)
        ) {
            await viewControl.click();
        } else {
            await firstRow.click();
        }

        await this.customerDetailsPopup.waitFor({
            state: "visible",
            timeout: 15000
        });

        pageFixture.logger.info(
            "Opened the first customer record"
        );
    }

    async verifyCustomerDetailsPopupDisplayed(): Promise<void> {
        await expect(
            this.customerDetailsPopup
        ).toBeVisible({
            timeout: 15000
        });

        pageFixture.logger.info(
            "Customer details popup is displayed"
        );
    }

    async verifyCustomerVerificationSectionDisplayed(): Promise<void> {
        await expect(
            this.customerVerificationSection
        ).toBeVisible({
            timeout: 15000
        });

        pageFixture.logger.info(
            "Customer verification section is displayed"
        );
    }

    async verifyRequiredCustomerDetailsDisplayed(): Promise<void> {
        const popup =
            this.customerDetailsPopup;

        const expectedLabels = [
            /Full Name|Customer Name|Name/i,
            /Email/i,
            /Phone Number|Mobile Number|Contact Number/i,
            /NIC Number|NIC/i,
            /Wallet ID|Customer ID|User ID/i,
            /KYC Status|Verification Status|Verification/i,
            /Account Status|Status/i
        ];

        const rawPopupText =
            await popup.innerText();

        const normalizedPopupText =
            rawPopupText
                .replace(/\s+/g, " ")
                .trim();

        let visibleFieldCount = 0;

        for (const label of expectedLabels) {
            if (
                label.test(normalizedPopupText)
            ) {
                visibleFieldCount++;
            }
        }

        expect(
            visibleFieldCount
        ).toBeGreaterThanOrEqual(4);

        this.printCustomerDetailsLineByLine(
            rawPopupText
        );

        pageFixture.logger.info(
            `Verified ${visibleFieldCount} required customer detail field(s)`
        );
    }

    private printCustomerDetailsLineByLine(
        rawPopupText: string
    ): void {
        const detailLines = rawPopupText
            .split(/\r?\n/)
            .map((line) =>
                line
                    .replace(/\s+/g, " ")
                    .trim()
            )
            .filter(
                (line) => line.length > 0
            );

        const sectionHeadings = new Set([
            "USER DETAILS",
            "USER INFO",
            "VERIFICATION",
            "LIMITS",
            "IDENTIFIERS",
            "TIMESTAMPS"
        ]);

        const fieldLabelPattern =
            /^(Full Name|Customer Name|First Name|Last Name|Email|Phone Number|Mobile Number|Contact Number|NIC Number|NIC|Unique Code|KYC Status|Verification Status|Status|Account Status|Email Verified|Phone Verified|Agreed To Terms and Conditions|Daily Transaction Limit|Single Transaction Limit|Wallet ID|Customer ID|User ID|Device IMEI|Created At|Updated At|Deleted At|Disabled At|Enabled At)$/i;

        console.log(
            "\n========================================"
        );

        console.log(
            "            CUSTOMER DETAILS"
        );

        console.log(
            "========================================"
        );

        for (
            let index = 0;
            index < detailLines.length;
            index++
        ) {
            const currentLine =
                detailLines[index];

            const nextLine =
                detailLines[index + 1];

            if (
                sectionHeadings.has(
                    currentLine.toUpperCase()
                )
            ) {
                console.log("");
                console.log(
                    `----- ${currentLine.toUpperCase()} -----`
                );
                continue;
            }

            if (
                fieldLabelPattern.test(
                    currentLine
                ) &&
                nextLine &&
                !fieldLabelPattern.test(
                    nextLine
                ) &&
                !sectionHeadings.has(
                    nextLine.toUpperCase()
                )
            ) {
                console.log(
                    `${currentLine}: ${nextLine}`
                );

                index++;
                continue;
            }

            console.log(currentLine);
        }

        console.log(
            "========================================\n"
        );
    }

    async closeCustomerDetailsPopup(): Promise<void> {
        await expect(
            this.customerDetailsPopup
        ).toBeVisible({
            timeout: 15000
        });

        const popup =
            this.customerDetailsPopup;

        const labelledCloseButton = popup
            .locator(
                [
                    'button[aria-label*="close" i]',
                    'button[title*="close" i]',
                    'button:has-text("Close")',
                    'button:has-text("Cancel")'
                ].join(", ")
            )
            .first();

        if (
            await labelledCloseButton
                .isVisible()
                .catch(() => false)
        ) {
            await labelledCloseButton.click();
        } else {
            const iconCloseButton = popup
                .locator("button:has(svg)")
                .first();

            if (
                await iconCloseButton
                    .isVisible()
                    .catch(() => false)
            ) {
                await iconCloseButton.click();
            } else {
                await this.activePage
                    .keyboard
                    .press("Escape");
            }
        }

        await expect(
            this.customerDetailsPopup
        ).toBeHidden({
            timeout: 15000
        });

        pageFixture.logger.info(
            "Closed the customer details popup"
        );
    }

    async clickDisableActionForFirstCustomer(): Promise<void> {
        await this.clickCustomerStatusAction(
            "Disable"
        );
    }

   async clickEnableActionForFirstCustomer(): Promise<void> {
    const currentSearchValue =
        await this.customerSearchBox
            .inputValue()
            .catch(() => "");

    try {
        await this.clickCustomerStatusAction(
            "Enable"
        );

        return;
    } catch (firstError) {
        pageFixture.logger.info(
            "Enable action was not visible. Switching to the Disabled customer filter and retrying."
        );

        await this.clearCustomerSearch();

        await this.selectCustomerStatusFilter(
            "Disabled"
        );

        if (currentSearchValue.trim()) {
            await this.searchCustomer(
                currentSearchValue
            );
        }

        await this.customerRows.first().waitFor({
            state: "visible",
            timeout: 15000
        });

        await this.clickCustomerStatusAction(
            "Enable"
        );
    }
}

    private getStatusActionPattern(
        action: "Disable" | "Enable"
    ): RegExp {
        if (action === "Disable") {
            return /Disable|Deactivate|Suspend|Block/i;
        }

        return /Enable|Activate|Restore|Unblock/i;
    }

    private async clickCustomerStatusAction(
        action: "Disable" | "Enable"
    ): Promise<void> {
        await this.customerRows.first().waitFor({
            state: "visible",
            timeout: 15000
        });

        const firstRow =
            this.customerRows.first();

        const actionPattern =
            this.getStatusActionPattern(action);

        const directAction = firstRow
            .locator(
                "button, a, [role='button']"
            )
            .filter({
                hasText: actionPattern
            })
            .first();

        const attributeAction = firstRow
            .locator(
                [
                    "button[aria-label]",
                    "button[title]",
                    "a[aria-label]",
                    "a[title]"
                ].join(", ")
            )
            .filter({
                has:
                    firstRow.locator(
                        "*"
                    )
            });

        let actionClicked = false;

        if (
            await directAction
                .isVisible()
                .catch(() => false)
        ) {
            await directAction.click();
            actionClicked = true;
        }

        if (!actionClicked) {
            const attributeCount =
                await attributeAction.count();

            for (
                let index = 0;
                index < attributeCount;
                index++
            ) {
                const control =
                    attributeAction.nth(index);

                const ariaLabel =
                    (await control.getAttribute(
                        "aria-label"
                    )) ?? "";

                const title =
                    (await control.getAttribute(
                        "title"
                    )) ?? "";

                if (
                    actionPattern.test(
                        `${ariaLabel} ${title}`
                    )
                ) {
                    await control.click();
                    actionClicked = true;
                    break;
                }
            }
        }

        if (!actionClicked) {
            const actionMenuButton = firstRow
                .locator(
                    [
                        'button[aria-haspopup="menu"]',
                        'button[aria-label*="action" i]',
                        'button[title*="action" i]',
                        'button[aria-label*="more" i]',
                        'button[title*="more" i]',
                        "button:has(svg)"
                    ].join(", ")
                )
                .last();

            if (
                await actionMenuButton
                    .isVisible()
                    .catch(() => false)
            ) {
                await actionMenuButton.click();

                const menuAction =
                    this.activePage
                        .locator(
                            [
                                '[role="menuitem"]:visible',
                                "button:visible",
                                '[role="button"]:visible',
                                "li:visible"
                            ].join(", ")
                        )
                        .filter({
                            hasText:
                                actionPattern
                        })
                        .last();

                await menuAction.waitFor({
                    state: "visible",
                    timeout: 7000
                });

                await menuAction.click();
                actionClicked = true;
            }
        }

        if (!actionClicked) {
            throw new Error(
                `${action} action was not found for the first customer record.`
            );
        }

        await this.confirmStatusActionWhenDisplayed(
            action
        );

        await this.activePage.waitForTimeout(
            1500
        );

        pageFixture.logger.info(
            `Completed the ${action.toLowerCase()} action for the first customer`
        );
    }

    private async confirmStatusActionWhenDisplayed(
        action: "Disable" | "Enable"
    ): Promise<void> {
        const pastTense =
            action === "Disable"
                ? "disabled"
                : "enabled";

        await this.activePage.waitForTimeout(
            500
        );

        const popup = this.activePage
            .locator(
                [
                    '[role="dialog"]:visible',
                    "div.fixed.inset-0:visible",
                    ".modal:visible"
                ].join(", ")
            )
            .filter({
                hasText: new RegExp(
                    `${action}|${pastTense}|Are you sure|Confirm|Success|Activate|Deactivate`,
                    "i"
                )
            })
            .last();

        const popupVisible =
            await popup
                .isVisible()
                .catch(() => false);

        if (!popupVisible) {
            pageFixture.logger.info(
                `No ${action.toLowerCase()} confirmation popup was displayed`
            );

            return;
        }

        const popupText = (
            await popup
                .innerText()
                .catch(() => "")
        )
            .replace(/\s+/g, " ")
            .trim();

        console.log(
            `[${action} Popup] ${popupText}`
        );

        const successPattern =
            new RegExp(
                `${pastTense} successfully|customer.*${pastTense}|account.*${pastTense}|successfully ${pastTense}|success`,
                "i"
            );

        if (
            successPattern.test(popupText)
        ) {
            await this.closeStatusPopupWhenPossible(
                popup
            );

            pageFixture.logger.info(
                `Customer was ${pastTense} successfully`
            );

            return;
        }

        const allButtons = popup.locator(
            [
                "button:visible",
                "[role='button']:visible",
                "input[type='button']:visible",
                "input[type='submit']:visible"
            ].join(", ")
        );

        const buttonCount =
            await allButtons.count();

        const usableButtons: Locator[] = [];

        const confirmationPattern =
            action === "Disable"
                ? /Disable|Deactivate|Suspend|Block|Confirm|Yes|Proceed|Continue|Submit|OK|Okay/i
                : /Enable|Activate|Restore|Unblock|Confirm|Yes|Proceed|Continue|Submit|OK|Okay/i;

        for (
            let index = 0;
            index < buttonCount;
            index++
        ) {
            const button =
                allButtons.nth(index);

            const buttonText = (
                await button
                    .innerText()
                    .catch(() => "")
            )
                .replace(/\s+/g, " ")
                .trim();

            const value =
                (await button.getAttribute(
                    "value"
                )) ?? "";

            const ariaLabel =
                (await button.getAttribute(
                    "aria-label"
                )) ?? "";

            const title =
                (await button.getAttribute(
                    "title"
                )) ?? "";

            const accessibleText =
                `${buttonText} ${value} ${ariaLabel} ${title}`
                    .replace(/\s+/g, " ")
                    .trim();

            console.log(
                `[Status Popup Button ${index + 1}] ${accessibleText || "<no text>"}`
            );

            if (
                /Cancel|No|Close|Back/i.test(
                    accessibleText
                )
            ) {
                continue;
            }

            if (
                confirmationPattern.test(
                    accessibleText
                )
            ) {
                await button.click();

                await this.handleSuccessPopupAfterStatusChange(
                    action,
                    pastTense
                );

                return;
            }

            if (
                await button
                    .isEnabled()
                    .catch(() => false)
            ) {
                usableButtons.push(button);
            }
        }

        const fallbackButton =
            usableButtons.length > 0
                ? usableButtons[
                      usableButtons.length - 1
                  ]
                : undefined;

        if (fallbackButton) {
            await fallbackButton.click();

            await this.handleSuccessPopupAfterStatusChange(
                action,
                pastTense
            );

            return;
        }

        /*
         * The application may perform the action
         * immediately after the status icon is clicked.
         * Therefore, do not fail only because the popup
         * does not contain another confirmation button.
         */
        if (
            /success|disabled|enabled|activated|deactivated/i.test(
                popupText
            )
        ) {
            await this.closeStatusPopupWhenPossible(
                popup
            );

            return;
        }

        throw new Error(
            `The ${action.toLowerCase()} popup was displayed, but no usable confirmation button was found. Popup text: ${popupText}`
        );
    }

    private async handleSuccessPopupAfterStatusChange(
        action: "Disable" | "Enable",
        pastTense: "disabled" | "enabled"
    ): Promise<void> {
        await this.activePage.waitForTimeout(
            800
        );

        const successPopup =
            this.activePage
                .locator(
                    [
                        '[role="dialog"]:visible',
                        "div.fixed.inset-0:visible",
                        ".modal:visible"
                    ].join(", ")
                )
                .filter({
                    hasText: new RegExp(
                        `${pastTense} successfully|customer.*${pastTense}|account.*${pastTense}|success|activated|deactivated`,
                        "i"
                    )
                })
                .last();

        if (
            await successPopup
                .isVisible()
                .catch(() => false)
        ) {
            const successText = (
                await successPopup
                    .innerText()
                    .catch(() => "")
            )
                .replace(/\s+/g, " ")
                .trim();

            console.log(
                `[${action} Result] ${successText}`
            );

            await this.closeStatusPopupWhenPossible(
                successPopup
            );
        }

        pageFixture.logger.info(
            `${action} confirmation completed successfully`
        );
    }

    private async closeStatusPopupWhenPossible(
        popup: Locator
    ): Promise<void> {
        const closeButton = popup
            .locator(
                [
                    'button:has-text("OK")',
                    'button:has-text("Okay")',
                    'button:has-text("Done")',
                    'button:has-text("Close")',
                    'button:has-text("Continue")',
                    'button[aria-label*="close" i]',
                    'button[title*="close" i]'
                ].join(", ")
            )
            .last();

        if (
            await closeButton
                .isVisible()
                .catch(() => false)
        ) {
            await closeButton.click();
        } else {
            const visibleButtons =
                popup.locator(
                    "button:visible, [role='button']:visible"
                );

            const count =
                await visibleButtons.count();

            if (count > 0) {
                await visibleButtons
                    .nth(count - 1)
                    .click()
                    .catch(() => undefined);
            } else {
                await this.activePage
                    .keyboard
                    .press("Escape")
                    .catch(
                        () => undefined
                    );
            }
        }

        await popup
            .waitFor({
                state: "hidden",
                timeout: 5000
            })
            .catch(() => undefined);
    }

    async verifyCustomerAccountDisabled(): Promise<void> {
        await this.activePage.waitForTimeout(
            1000
        );

        await this.customerRows.first().waitFor({
            state: "visible",
            timeout: 15000
        });

        const firstRow =
            this.customerRows.first();

        const cells =
            firstRow.locator("td");

        const disabledValue = (
            await cells.nth(5).innerText()
        ).trim();

        const actionText = (
            await cells.last().innerText()
        ).trim();

        console.log(
            `[Disabled Verification] Disabled: ${disabledValue}`
        );

        console.log(
            `[Disabled Verification] Available Action: ${actionText}`
        );

        expect(disabledValue).toMatch(
            /^Yes$/i
        );

        expect(actionText).toMatch(
            /Enable/i
        );

        pageFixture.logger.info(
            "Verified that the customer is disabled: Disabled column shows Yes and action shows Enable"
        );
    }

    async verifyCustomerAccountEnabled(): Promise<void> {
    await this.activePage.waitForTimeout(
        1000
    );

    await this.customerRows.first().waitFor({
        state: "visible",
        timeout: 15000
    });

    const firstRow =
        this.customerRows.first();

    const cells =
        firstRow.locator("td");

    const disabledValue = (
        await cells.nth(5).innerText()
    ).trim();

    const actionText = (
        await cells.last().innerText()
    ).trim();

    console.log(
        `[Enabled Verification] Disabled: ${disabledValue}`
    );

    console.log(
        `[Enabled Verification] Available Action: ${actionText}`
    );

    expect(disabledValue).toMatch(
        /^No$/i
    );

    expect(actionText).toMatch(
        /Disable/i
    );

    pageFixture.logger.info(
        "Verified that the customer is enabled: Disabled column shows No and action shows Disable"
    );
    }

    private getStatusFilterPattern(
    status: string
): RegExp {
    switch (status.toLowerCase()) {
        case "all":
            return /^All$/i;

        case "enabled":
            return /^Enabled$/i;

        case "disabled":
            return /^Disabled$/i;

        default:
            throw new Error(
                `Unsupported customer status filter: ${status}`
            );
    }
}

async selectCustomerStatusFilter(
    status: string
): Promise<void> {
    const statusLabels: Record<string, string> = {
        all: "All Statuses",
        enabled: "Enable",
        disabled: "Disabled"
    };

    const normalizedStatus =
        status.trim().toLowerCase();

    const optionLabel =
        statusLabels[normalizedStatus];

    if (!optionLabel) {
        throw new Error(
            `Unsupported customer status filter: ${status}`
        );
    }

    const selectElements =
        this.activePage.locator("select:visible");

    const selectCount =
        await selectElements.count();

    let statusDropdown: Locator | undefined;

    for (
        let index = 0;
        index < selectCount;
        index++
    ) {
        const currentSelect =
            selectElements.nth(index);

        const optionTexts =
            await currentSelect
                .locator("option")
                .allTextContents();

        const containsStatusOptions =
            optionTexts.some(
                (option) =>
                    option.trim() ===
                    "All Statuses"
            ) &&
            optionTexts.some(
                (option) =>
                    option.trim() ===
                    "Enable"
            ) &&
            optionTexts.some(
                (option) =>
                    option.trim() ===
                    "Disabled"
            );

        if (containsStatusOptions) {
            statusDropdown = currentSelect;
            break;
        }
    }

    if (!statusDropdown) {
        throw new Error(
            "Customer status dropdown containing All Statuses, Enable, and Disabled was not found."
        );
    }

    await statusDropdown.waitFor({
        state: "visible",
        timeout: 15000
    });

    await statusDropdown.selectOption({
        label: optionLabel
    });

    await this.activePage.waitForTimeout(
        1500
    );

    const selectedOptionText = (
        await statusDropdown
            .locator("option:checked")
            .innerText()
    ).trim();

    expect(selectedOptionText).toBe(
        optionLabel
    );

    pageFixture.logger.info(
        `Selected the ${status} customer status filter using option "${optionLabel}"`
    );
}

async verifyCustomerRecordsByStatus(
    status: string
): Promise<void> {
    await this.activePage.waitForTimeout(
        1500
    );

    await this.customerTable.waitFor({
        state: "visible",
        timeout: 15000
    });

    const rowCount =
        await this.customerRows.count();

    expect(rowCount).toBeGreaterThan(0);

    console.log(
        `\n========== ${status.toUpperCase()} CUSTOMER RECORDS ==========`
    );

    for (
        let index = 0;
        index < rowCount;
        index++
    ) {
        const row =
            this.customerRows.nth(index);

        const cells =
            row.locator("td");

        const cellCount =
            await cells.count();

        if (cellCount < 7) {
            throw new Error(
                `Customer row ${index + 1} does not contain the expected table columns.`
            );
        }

        const customerName = (
            await cells.nth(0).innerText()
        ).trim();

        const customerEmail = (
            await cells.nth(1).innerText()
        ).trim();

        /*
         * Column order from the dashboard:
         * 0 Name
         * 1 Email
         * 2 Phone Number
         * 3 NIC
         * 4 Unique Code
         * 5 Disabled
         * 6 Created At
         * 7 Actions
         */
        const disabledValue = (
            await cells.nth(5).innerText()
        ).trim();

        const actionText = (
            await cells
                .last()
                .innerText()
        ).trim();

        console.log(
            `[Record ${index + 1}]`
        );

        console.log(
            `Name: ${customerName}`
        );

        console.log(
            `Email: ${customerEmail}`
        );

        console.log(
            `Disabled: ${disabledValue}`
        );

        console.log(
            `Available Action: ${actionText}`
        );

        console.log(
            "----------------------------------------"
        );

        if (
            status.toLowerCase() ===
            "enabled"
        ) {
            expect(
                disabledValue
            ).toMatch(/^No$/i);

            expect(
                actionText
            ).toMatch(/Disable/i);
        }

        if (
            status.toLowerCase() ===
            "disabled"
        ) {
            expect(
                disabledValue
            ).toMatch(/^Yes$/i);

            expect(
                actionText
            ).toMatch(/Enable/i);
        }

        if (
            status.toLowerCase() ===
            "all"
        ) {
            expect(
                disabledValue
            ).toMatch(/^(Yes|No)$/i);

            expect(
                actionText
            ).toMatch(/^(Enable|Disable)$/i);
        }
    }

    console.log(
        "================================================\n"
    );

    pageFixture.logger.info(
        `Verified ${rowCount} customer record(s) using the ${status} status filter`
    );
}
}