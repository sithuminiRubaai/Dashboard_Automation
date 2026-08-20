Feature: Fee Management

  @functional
  Scenario: Verify Fee Management page is accessible
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify Fee Management heading is visible

  @functional
  Scenario: Verify tab-wise navigation works correctly in Fee Management
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify tab navigation works correctly for all Fee Management tabs

  @functional
  Scenario: Verify Fee Management page loads the correct URL for each tab
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify Fee Management URL is loaded correctly
    And verify Fee Management URL is loaded correctly for each tab

  @functional
  Scenario: Verify JustPay provider fee slabs are displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify "JustPay" provider details show subtitle "Pull from bank", status "editable" and "9 slabs"
    And verify "JustPay" provider fee slabs show the following values:
      | slab | range                     | fee       |
      | S1   | Rs. 0 – 50.00             | Rs. 2.00  |
      | S2   | Rs. 50.01 – 100.00        | Rs. 3.00  |
      | S3   | Rs. 100.01 – 250.00       | Rs. 3.00  |
      | S4   | Rs. 250.01 – 1,000.00     | Rs. 5.00  |
      | S5   | Rs. 1,000.01 – 2,000.00   | Rs. 12.00 |
      | S6   | Rs. 2,000.01 – 4,000.00   | Rs. 15.00 |
      | S7   | Rs. 4,000.01 – 6,000.00   | Rs. 22.00 |
      | S8   | Rs. 6,000.01 – 8,000.00   | Rs. 26.00 |
      | S9   | Rs. 8,000.01 – 150,000.00 | Rs. 28.00 |

  @functional
  Scenario: Verify Wallet fees tab transaction rows are displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify wallet fees tab shows the following transaction rows:
      | transactionType                     | providerFees   | status |
      | Wallet to Wallet                    | —              | Active |
      | Sampath account to Wallet (top-up)   | —              | Active |
      | Other bank to Wallet (top-up)        | JustPay        | Active |
      | Wallet to Sampath account            | —              | Active |
      | Wallet to Other bank                 | CEFT           | Active |
      | Sampath account to Other bank        | JustPay, CEFT  | Active |
      | Other bank to Other bank             | JustPay, CEFT  | Active |
      | Wallet to Biller                     | —              | Active |
      | Debit card to Biller (IPG)           | IGP            | Active |
      | Other bank to Biller                 | JustPay        | Active |
      | Sampath to Biller                    | JustPay        | Active |
      | Sampath card to Biller (IPG)         | IGP            | Active |
      | Other bank to Sampath payee          | JustPay        | Active |
      | Sampath to Sampath payee             | JustPay, CEFT  | Active |

  @functional
  Scenario: Verify Rules engine tab rows are displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify rules engine tab shows the following rules:
      | priority | rule                              | condition                | rail                |
      | 2        | Sampath → To → Wallet              | SAMPATH_TO_WALLET         | justpay             |
      | 3        | Other → Bank → To → Wallet         | OTHER_BANK_TO_WALLET      | justpay             |
      | 4        | Wallet → To → Sampath              | WALLET_TO_SAMPATH         | —                   |
      | 5        | Wallet → To → Other → Bank         | WALLET_TO_OTHER_BANK      | ceft                |
      | 6        | Wallet → To → Biller               | WALLET_TO_BILLER          | wallet              |
      | 7        | Other → Bank → To → Biller         | OTHER_BANK_TO_BILLER      | biller_via_justpay  |
      | 8        | Sampath → To → Biller              | SAMPATH_TO_BILLER         | biller_via_justpay  |
      | 9        | Debit → Card → To → Biller         | DEBIT_CARD_TO_BILLER      | igp                 |
      | 10       | Sampath → Card → To → Biller       | SAMPATH_CARD_TO_BILLER    | igp                 |
      | 11       | Other → Bank → To → Sampath        | OTHER_BANK_TO_SAMPATH     | justpay             |
      | 12       | Sampath → To → Other → Bank        | SAMPATH_TO_OTHER_BANK     | flat_justpay_ceft   |
      | 13       | Other → Bank → To → Other → Bank   | OTHER_BANK_TO_OTHER_BANK  | flat_justpay_ceft   |
      | 14       | Sampath → To → Sampath             | SAMPATH_TO_SAMPATH        | justpay             |
      | 15       | Wallet → To → Wallet               | WALLET_TO_WALLET          | —                   |

  @functional
  Scenario: Verify Fee ledger tab transaction type guide is displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify fee ledger tab shows the following transaction type guide entries:
      | code | label                               |
      | W→W  | Wallet to Wallet                    |
      | S→W  | Sampath account to Wallet (top-up)  |
      | O→W  | Other bank to Wallet (top-up)       |
      | W→S  | Wallet to Sampath account           |
      | W→O  | Wallet to Other bank                |
      | S→O  | Sampath account to Other bank       |
      | O→O  | Other bank to Other bank            |
      | W→B  | Wallet to Biller                    |
      | D→B  | Debit card to Biller (IPG)          |
      | O→B  | Other bank to Biller                |
      | S→B  | Sampath to Biller                   |
      | S→B  | Sampath card to Biller (IPG)        |
      | O→S  | Other bank to Sampath payee         |
      | S→S  | Sampath to Sampath payee            |

  @functional
  Scenario Outline: Verify Calculator tab computes fee breakdown for every transaction type
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    And user selects transaction type "<transactionType>" and enters transfer amount "5000" and clicks Calculate Fees
    Then verify fee calculation breakdown is displayed

    Examples:
      | transactionType                     |
      | Wallet to Wallet                    |
      | Sampath account to Wallet (top-up)  |
      | Other bank to Wallet (top-up)       |
      | Wallet to Sampath account           |
      | Wallet to Other bank                |
      | Sampath account to Other bank       |
      | Other bank to Other bank            |
      | Wallet to Biller                    |
      | Debit card to Biller (IPG)          |
      | Other bank to Biller                |
      | Sampath to Biller                   |
      | Sampath card to Biller (IPG)        |
      | Other bank to Sampath payee         |
      | Sampath to Sampath payee             |

  @functional
  Scenario: Verify Overview tab payment rails details are displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify Overview payment rails status is "Operational" with footer note "JustPay + CEFT when Other Bank → Other Bank or any account → Sampath/Other Bank payee" and the following rails:
      | code | name    | fee                            | usedFor                                                              |
      | JP   | JustPay | Rs. 2 – 28 · 9 slabs           | Other Bank / Sampath → Wallet · Biller · Payee account               |
      | CE   | CEFT    | Rs. 10 fixed                   | Wallet / Sampath / Other Bank → Other Bank · Sampath payee           |
      | IP   | IPG     | 2.5% bank + 0.5% platform      | Debit Card (Other Bank or Sampath) → Biller                          |

  @functional
  Scenario: Verify Overview tab summary cards are displayed correctly
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify Overview tab shows the following summary cards:
      | label                 | value      | badge   | subtext                |
      | Fees collected today  | Rs. 1.5K   |         | 0 transactions         |
      | Bank portion          | Rs. 610.00 | Bank    | Rail pass-through      |
      | MoiPay revenue        | Rs. 905.00 | Revenue | Net margin             |
      | Avg fee / txn         | Rs. 0.00   |         | All transaction types  |

