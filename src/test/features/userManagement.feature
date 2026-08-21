Feature: User Management

  @functional @smoke
  Scenario: Verify User Management page is accessible
    Given administrator is logged in for User Management
    When user clicks User Management
    Then verify User Management heading is visible

  @functional @smoke
  Scenario: Verify User Management page loads the correct URL for each tab
    Then verify User Management URL is loaded correctly
    Then verify User Management URL is loaded correctly for the "Overview" tab
    Then verify User Management URL is loaded correctly for the "Roles & Permissions" tab

  @functional
  Scenario: Verify admin user registry and tabs
    Then verify admin user registry is visible
    And verify User Management tabs are visible

  @functional
  Scenario: Search admin users
    When user searches admin users for "karikalanrega@gmail.com"
    Then verify admin user search result contains "karikalanrega@gmail.com"

  @functional
  Scenario: Filter admin users by status
    When user filters admin users by status "Active"
    Then verify admin users match status "Active"
    When user resets User Management filters
    And user filters admin users by status "Suspended"
    Then verify admin users match status "Suspended"

  @functional
  Scenario: Open and close Create User form
    When user opens the Create User form
    Then verify Create User form is displayed
    When user closes the Create User form
