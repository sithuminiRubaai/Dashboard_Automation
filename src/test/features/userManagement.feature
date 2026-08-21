@userManagement
Feature: User Management


  # ============================================================
  # TARGET 1 - NAVIGATE TO USER MANAGEMENT
  # ============================================================

  @smoke @userManagementNavigation
  Scenario: Verify that the administrator can navigate to User Management

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    Then verify the User Management page is displayed


  # ============================================================
  # TARGET 2 - DASHBOARD AND SUMMARY STATISTICS
  # ============================================================

  @regression @userManagementDashboard
  Scenario: Verify that the administrator can view the User Management dashboard and use search and filters

    Given administrator is logged in for User Management
    When administrator navigates to User Management

    Then verify the User Management dashboard and summary statistics are displayed
    And verify the Admin Access Registry controls are displayed

    When administrator filters User Management users by role "Compliance Officer"
    Then verify the User Management role filter is applied as "Compliance Officer"

    When administrator resets User Management filters
    Then verify the User Management filters are reset

    When administrator filters User Management users by status "Suspended"
    Then verify the User Management status filter is applied as "Suspended"

    When administrator resets User Management filters
    Then verify the User Management filters are reset

    When administrator searches User Management users using "Regana Selvaranjan"
    Then verify the User Management search result contains "Regana Selvaranjan"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


  # ============================================================
  # TARGET 3 - USERS
  # ============================================================

  @regression @adminUsers
  Scenario: Verify that the administrator can view, search, filter, reset, and export admin-user records

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Users tab

    Then verify all admin-user records are displayed


    # ==========================================================
    # SEARCH BY NAME
    # ==========================================================

    When administrator searches admin users by "name" using "Regana Selvaranjan"
    Then verify admin-user search results contain "Regana Selvaranjan"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


    # ==========================================================
    # SEARCH BY USERNAME
    # ==========================================================

    When administrator searches admin users by "username" using "Rega25"
    Then verify admin-user search results contain "Rega25"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


    # ==========================================================
    # SEARCH BY EMAIL
    # ==========================================================

    When administrator searches admin users by "email" using "karikalanrega@gmail.com"
    Then verify admin-user search results contain "karikalanrega@gmail.com"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


    # ==========================================================
    # FILTER BY ROLE
    # ==========================================================

    When administrator filters User Management users by role "Auditor"
    Then verify the User Management role filter is applied as "Auditor"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


    # ==========================================================
    # FILTER BY STATUS
    # ==========================================================

    When administrator filters User Management users by status "Suspended"
    Then verify the User Management status filter is applied as "Suspended"

    When administrator resets User Management filters
    Then verify the User Management filters are reset


    # ==========================================================
    # EXPORT USERS
    # ==========================================================

    When administrator exports admin users as Excel
    Then verify the admin-user Excel file is downloaded successfully

    When administrator exports admin users as PDF
    Then verify the admin-user PDF file is downloaded successfully

    When administrator exports admin users using Export both
    Then verify both admin-user export files are downloaded successfully


  # ============================================================
  # TARGET 4 - INVITATIONS - VIEW
  # ============================================================

  @regression @invitationView
  Scenario: Verify that the administrator can view all user invitations

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Invitations tab

    Then verify all user invitation records are displayed


  # ============================================================
  # TARGET 4 - INVITATIONS - SEARCH
  # ============================================================

  @regression @invitationSearch
  Scenario: Verify that the administrator can search invitations using the available search criteria

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Invitations tab
    And administrator resets invitation filters


    # ==========================================================
    # SEARCH BY INVITATION CODE
    # ==========================================================

    When administrator searches invitations by "invitation code" using "INV-20260818-659773"
    Then verify invitation search results contain "INV-20260818-659773"

    When administrator resets invitation filters


    # ==========================================================
    # SEARCH BY EMAIL
    # ==========================================================

    When administrator searches invitations by "email" using "karikalanrega@gmail.com"
    Then verify invitation search results contain "karikalanrega@gmail.com"

    When administrator resets invitation filters


    # ==========================================================
    # SEARCH BY NAME
    # ==========================================================

    When administrator searches invitations by "name" using "Regana"
    Then verify invitation search results contain "Regana"

    When administrator resets invitation filters


    # ==========================================================
    # SEARCH BY USERNAME
    # ==========================================================

    When administrator searches invitations by "username" using "Rega25"
    Then verify invitation search results contain "Rega25"

    When administrator resets invitation filters


  # ============================================================
  # TARGET 4 - INVITATIONS - FILTER
  # ============================================================

  @regression @invitationFilter
  Scenario: Verify that the administrator can filter invitations by role and invitation status

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Invitations tab
    And administrator resets invitation filters


    # ==========================================================
    # FILTER BY ROLE
    # ==========================================================

    When administrator filters invitations by role "Operations Manager"
    Then verify the invitation role filter is applied as "Operations Manager"

    When administrator resets invitation filters
    Then verify invitation filters are reset


    # ==========================================================
    # FILTER BY STATUS
    # ==========================================================

    When administrator filters invitations by status "Expired"
    Then verify the invitation status filter is applied as "Expired"

    When administrator resets invitation filters
    Then verify invitation filters are reset


  # ============================================================
  # TARGET 4 - INVITATION DETAILS AND RESEND
  # ============================================================

  @regression @invitationDetails
  Scenario: Verify that the administrator can view invitation details and resend an eligible invitation

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Invitations tab
    And administrator resets invitation filters

    When administrator opens an invitation record
    Then verify invitation details are displayed

    When administrator closes the invitation details

    And administrator resends a pending or expired invitation
    Then verify the invitation resend completed successfully


  # ============================================================
  # TARGET 5 - ROLES & PERMISSIONS
  # ============================================================

  @regression @rolesPermissions
  Scenario: Verify that the administrator can view all available roles and the Role Access Matrix

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Roles and Permissions tab

    Then verify all available User Management roles are displayed
    And verify the Role Access Matrix is displayed


  # ============================================================
  # TARGET 6 - AUDIT LOGS - VIEW
  # ============================================================

  @regression @auditLogsView
  Scenario: Verify that the administrator can view all User Management audit logs

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Audit Logs tab

    Then verify all User Management audit logs are displayed


  # ============================================================
  # TARGET 6 - AUDIT LOGS - SEARCH
  # ============================================================

  @regression @auditLogsSearch
  Scenario: Verify that the administrator can search User Management audit logs using the available search criteria

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Audit Logs tab

    When administrator filters audit logs by date range "Last 30 Days"
    Then verify the audit log date filter is applied as "Last 30 Days"


    # ==========================================================
    # SEARCH BY ACTOR
    # ==========================================================

    When administrator searches User Management audit logs by "actor" using "Super Admin"
    Then verify User Management audit search results contain "Super Admin"

    When administrator clears the User Management audit search


    # ==========================================================
    # SEARCH BY ACTION
    # ==========================================================

    When administrator searches User Management audit logs by "action" using "resend invitation"
    Then verify User Management audit search results contain "resend invitation"

    When administrator clears the User Management audit search


    # ==========================================================
    # SEARCH BY TARGET
    # ==========================================================

    When administrator searches User Management audit logs by "target" using "Sithumini Nimesha"
    Then verify User Management audit search results contain "Sithumini Nimesha"

    When administrator clears the User Management audit search


    # ==========================================================
    # SEARCH BY DETAILS
    # ==========================================================

    When administrator searches User Management audit logs by "details" using "Admin invitation resent"
    Then verify User Management audit search results contain "Admin invitation resent"

    When administrator clears the User Management audit search


  # ============================================================
  # TARGET 6 - AUDIT LOGS - DATE FILTER
  # ============================================================

  @regression @auditLogsDateFilter
  Scenario: Verify that the administrator can filter User Management audit logs using the available date ranges

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Audit Logs tab


    # ==========================================================
    # TODAY
    # ==========================================================

    When administrator filters audit logs by date range "Today"
    Then verify the audit log date filter is applied as "Today"


    # ==========================================================
    # LAST 7 DAYS
    # ==========================================================

    When administrator filters audit logs by date range "Last 7 Days"
    Then verify the audit log date filter is applied as "Last 7 Days"


    # ==========================================================
    # LAST 30 DAYS
    # ==========================================================

    When administrator filters audit logs by date range "Last 30 Days"
    Then verify the audit log date filter is applied as "Last 30 Days"


  # ============================================================
  # TARGET 6 - AUDIT LOGS - EXPORT
  # ============================================================

  @regression @auditLogsExport
  Scenario: Verify that the administrator can export User Management audit logs in Excel, PDF, and combined formats

    Given administrator is logged in for User Management
    When administrator navigates to User Management
    And administrator opens the Audit Logs tab

    When administrator filters audit logs by date range "Last 30 Days"
    Then verify the audit log date filter is applied as "Last 30 Days"


    # ==========================================================
    # EXPORT EXCEL
    # ==========================================================

    When administrator exports User Management audit logs as Excel
    Then verify the audit-log Excel file is downloaded successfully


    # ==========================================================
    # EXPORT PDF
    # ==========================================================

    When administrator exports User Management audit logs as PDF
    Then verify the audit-log PDF file is downloaded successfully


    # ==========================================================
    # EXPORT BOTH
    # ==========================================================

    When administrator exports User Management audit logs using Export both
    Then verify both audit-log export files are downloaded successfully