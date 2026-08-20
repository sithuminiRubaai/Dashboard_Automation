Feature: Customer Management

  @functional
  Scenario: Verify that Customer Management page is accessible and displays customer records
    Given administrator is logged in for Customer Management
    When user clicks Customer Management
    Then verify Customer Management heading is visible

  @functional
  Scenario: Verify Customer Management page loads the correct URL
    Given verify Customer Management URL is loaded correctly

  @functional
  Scenario: Verify Customer Management page is displayed
    Then verify customer records table is visible

  @functional
  Scenario: Verify customer search functionality
    When user searches for customer by name "Nimesha"
    Then verify customer search results contain "Nimesha"

    When user clears the customer search
    And user searches for customer by email "sithumininimesha99@gmail.com"
    Then verify customer search results contain "sithumininimesha99@gmail.com"

    When user clears the customer search
    And user searches for customer by nic "995680719V"
    Then verify customer search results contain "995680719V"

  @functional
  Scenario: Verify customer details and verification section
    When user searches for customer by name "Nimesha"
    And user opens the first customer record
    Then verify customer details popup is displayed
    And verify customer verification section is displayed
    And verify required customer details are displayed
    Then close the customer details popup

  @functional
  Scenario: Filter customer records by account status
    When user clears the customer search
    And user selects the "All" customer status filter
    Then verify customer records match the "All" status filter

    When user selects the "Enabled" customer status filter
    Then verify customer records match the "Enabled" status filter

    When user selects the "Disabled" customer status filter
    Then verify customer records match the "Disabled" status filter

      @functional
  Scenario: Disable and re-enable a customer account
    When user clears the customer search
    And user selects the "Enabled" customer status filter
    And user searches for customer by email "sithumininimesha99@gmail.com"
    And user clicks on disable action for the first customer

    When user clears the customer search
    And user selects the "Disabled" customer status filter
    And user searches for customer by email "sithumininimesha99@gmail.com"
    Then verify customer account is disabled

    When user clicks on enable action for the first customer
    And user clears the customer search
    And user selects the "Enabled" customer status filter
    And user searches for customer by email "sithumininimesha99@gmail.com"
    Then verify customer account is enabled