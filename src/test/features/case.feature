@case
Feature: Case Management

  # ============================================================
  # URL VERIFICATION
  # ============================================================

  @functional @url
  Scenario: Verify Case Management page loads the correct URL for each tab
    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    Then verify Case Management URL is loaded correctly

    When administrator opens the Queue tab
    Then verify Case Management URL is loaded correctly

    When administrator opens the SLA tab
    Then verify Case Management URL is loaded correctly

    When administrator opens the Audit tab
    Then verify Case Management URL is loaded correctly

    When administrator opens the Reports tab
    Then verify Case Management URL is loaded correctly

  # ============================================================
  # CASE TYPE SWITCHING
  # ============================================================

  @smoke @caseSwitch
  Scenario: Verify that the administrator can switch between Scam, Incident, and Support cases

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Queue tab

    Then verify "Scam" cases are displayed in the Queue

    When administrator switches to "Incident" cases
    Then verify "Incident" cases are displayed in the Queue

    When administrator switches to "Support" cases
    Then verify "Support" cases are displayed in the Queue

    When administrator switches to "Scam" cases
    Then verify "Scam" cases are displayed in the Queue


  # ============================================================
  # VIEW CASE RECORDS
  # ============================================================

  @regression @queueView
  Scenario: Verify that the administrator can view all case records

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Queue tab

    Then verify all case records are displayed in the Queue


  # ============================================================
  # SEARCH CASE RECORDS
  # Search field supports:
  # Reference | Title | Customer / Reporter
  # ============================================================

  @regression @queueSearch
  Scenario: Verify that the administrator can search case records using the available search criteria

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Queue tab
    And administrator resets the Queue filters

    When administrator searches the case Queue by "reference" using "CAS-2026-00"
    Then verify Queue search results are displayed for "CAS-2026-00" using "reference"

    When administrator clears the Queue search
    And administrator searches the case Queue by "title" using "test"
    Then verify Queue search results are displayed for "test" using "title"

    When administrator clears the Queue search
    And administrator searches the case Queue by "customer" using "Regana Selvaranjan"
    Then verify Queue search results are displayed for "Regana Selvaranjan" using "customer"

    When administrator clears the Queue search
    And administrator searches the case Queue by "reference" using "doesnotexist"
    Then verify no case records match the Queue search

    When administrator clears the Queue search


  # ============================================================
  # FILTER CASE RECORDS
  # ============================================================

  @regression @queueFilter
  Scenario: Verify that the administrator can filter case records by status, priority, category, assigned agent, and SLA status

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Queue tab
    And administrator resets the Queue filters

    When administrator filters the Queue by "status" using "Cancelled"
    Then verify Queue filter "status" is applied as "Cancelled"

    When administrator resets the Queue filters
    And administrator filters the Queue by "priority" using "Medium"
    Then verify Queue filter "priority" is applied as "Medium"

    When administrator resets the Queue filters
    And administrator filters the Queue by "category" using "Identity Theft"
    Then verify Queue filter "category" is applied as "Identity Theft"

    When administrator resets the Queue filters
    And administrator filters the Queue by "assigned agent" using "Unassigned"
    Then verify Queue filter "assigned agent" is applied as "Unassigned"

    When administrator resets the Queue filters
    And administrator filters the Queue by "SLA status" using "SLA Breached"
    Then verify Queue filter "SLA status" is applied as "SLA Breached"

    When administrator resets the Queue filters


  # ============================================================
  # REFRESH QUEUE
  # ============================================================

  @regression @queueRefresh
  Scenario: Verify that the administrator can refresh the case queue

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Queue tab
    And administrator resets the Queue filters

    Then verify all case records are displayed in the Queue

    When administrator refreshes the case Queue
    Then verify the case Queue refresh completed successfully

    # ============================================================
  # SLA MONITORING
  # ============================================================

  @regression @slaMonitoring
  Scenario: Verify that the administrator can view the SLA dashboard, SLA policies, and active-case SLA tracker

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the SLA tab

    Then verify the SLA monitoring dashboard is displayed
    And verify SLA policies are displayed
    And verify the Active Cases SLA Tracker is displayed


  # ============================================================
  # AUDIT
  # ============================================================

  @regression @caseAudit
  Scenario: Verify that the administrator can view and search case audit records by case and action

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Audit tab

    Then verify case audit records are displayed

    When administrator searches audit records by "case" using "CAS-2026-0044"
    Then verify audit search results are displayed for "CAS-2026-0044" using "case"

    When administrator clears the audit search
    And administrator searches audit records by "action" using "Case Created"
    Then verify audit search results are displayed for "Case Created" using "action"

    When administrator clears the audit search

      # ============================================================
  # REPORTS
  # ============================================================

  @regression @caseReports
  Scenario: Verify that the administrator can export case reports and download all case data

    Given administrator is logged in to Case Management
    When administrator navigates to Case Management
    And administrator opens the Reports tab

    Then verify the Case Reports dashboard is displayed

    When administrator exports the case report as PDF
    Then verify the PDF case report is downloaded successfully

    When administrator exports the case report as CSV or Excel
    Then verify the CSV or Excel case report is downloaded successfully

    When administrator downloads all case data
    Then verify all case data is available successfully