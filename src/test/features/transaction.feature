Feature: Transaction Payment Tabs

@smoke
Scenario: User can navigate to Top Up payment tab
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "Top Up" payment tab
    Then the "Top Up" payment tab should be displayed
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can navigate to Withdraw payment tab
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "Withdraw" payment tab
    Then the "Withdraw" payment tab should be displayed
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can navigate to QR Payment tab
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "QR Payment" payment tab
    Then the "QR Payment" payment tab should be displayed
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can navigate to Bill Payment tab
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "Bill Payment" payment tab
    Then the "Bill Payment" payment tab should be displayed
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can navigate to Fund Transfer tab
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "Fund Transfer" payment tab
    Then the "Fund Transfer" payment tab should be displayed
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can view the first transaction details and close the popup
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can search transaction by ID and view the first result details
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user searches transactions for "MP0114072600253"
    Then verify transaction search results are displayed for "MP0114072600253"
    When user selects the first transaction row
    Then verify selected transaction details are displayed
    Then close the transaction details popup

@smoke
Scenario: User can search by customer name and see matching transaction records
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user searches transactions for "Regana Selvaranjan"
    Then verify transaction search results are displayed for "Regana Selvaranjan"

@smoke
Scenario: User can search by customer name "balu" and see no matching transaction records
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user searches transactions for "doesnotexist"
    Then verify no transaction search results are displayed for "doesnotexist"

@smoke
Scenario: User can filter transactions by multiple date ranges sequentially
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user filters transactions by date range "Today"
    Then verify transaction date range filter is applied to "Today"
    When user filters transactions by date range "Last 7 Days"
    Then verify transaction date range filter is applied to "Last 7 Days"
    When user filters transactions by date range "Last 30 Days"
    Then verify transaction date range filter is applied to "Last 30 Days"

@smoke
Scenario: User can filter transactions by multiple statuses sequentially
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user filters transactions by status "Success"
    Then verify only "Success" transactions are displayed
    When user filters transactions by status "Failed"
    Then verify only "Failed" transactions are displayed
    When user filters transactions by status "Pending"
    Then verify only "Pending" transactions are displayed
    When user filters transactions by status "All Statuses"
    Then verify only "All Statuses" transactions are displayed

@smoke
Scenario Outline: User can filter transactions by date and status combinations
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user filters transactions by date range "<dateRange>"
    And user filters transactions by status "<status>"
    Then verify transaction date range filter is applied to "<dateRange>"
    And verify only "<status>" transactions are displayed

    Examples:
        | dateRange    | status  |
        | Today        | Failed  |
        | Last 7 Days  | Pending |
        | Last 30 Days | Success |

