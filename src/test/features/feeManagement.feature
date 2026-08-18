Feature: Fee Management

  @functional
  Scenario: Verify Fee Management page is accessible
    Given administrator is logged in for Fee Management
    When user clicks Fee Management
    Then verify Fee Management heading is visible

  @functional
  Scenario: Verify Fee Management tabs are available
    Then verify Fee Management tabs are visible

  @functional
  Scenario: Verify provider fee slabs are displayed
    Then verify provider fee slabs are displayed

  @functional
  Scenario: Verify wallet fees and calculator
    Then verify wallet fees are displayed
    When user calculates fees for transfer amount "99980"
    Then verify fee breakdown is displayed