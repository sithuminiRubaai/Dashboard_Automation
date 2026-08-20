Feature: KYC (Know Your Customer) Management

@functional
Scenario: Verify that KYC Management page is accessible and displays KYC requests
    Given user is logged in to the admin dashboard
    When user clicks KYC Management
    Then verify KYC Requests heading is visible

@functional
Scenario: Verify KYC Management page loads the correct URL
    Given verify KYC Management URL is loaded correctly

@functional
Scenario: Verify KYC Requests page is displayed
    And verify summary cards are visible

@functional
Scenario: View KYC details
    When user selects first KYC request from the list
    And user clicks on Review Details button
    Then verify personal details section is displayed
    And verify documents section is displayed
    And verify KYC details contain name, father name, mother name, NIC, and address
    Then close the Review Details popup

@functional
Scenario: Verify KYC document visibility
    When user selects first KYC request from the list
    And user clicks on Review Details button
    Then verify all required document fields are visible
    And verify document status is either Verified, Rejected, or Pending
    Then close the Review Details popup

@functional
Scenario: Search KYC request by customer name
    When user searches by "customerName" using value "Sithumini"
    Then verify search results are displayed for "Sithumini"
    When user searches by "email" using value "sithumini@rubaai.net"
    Then verify search results are displayed for "sithumini@rubaai.net"
    When user searches by "nic" using value "995680718V"
    Then verify search results are displayed for "995680718V"
    When user searches by "mobileNumber" using value "+94710369362"
    Then verify search results are displayed for "+94710369362"

@functional
Scenario Outline: Search KYC request with no matching results
    When user searches by "<searchType>" using value "<searchValue>"
    Then verify no search results are displayed with message "No requests found."

    Examples:
      | searchType    | searchValue       |
      | customerName  | doesnotexist      |
      | email         | doesnotexist      |
      | nic           | doesnotexist      |
      | mobileNumber  | doesnotexist      |

@functional
Scenario: Filter KYC requests by status
    When user filters KYC requests by status "Verified"
    Then verify only "Verified" KYC requests are displayed
    When user filters KYC requests by status "Pending"
    Then verify only "Pending" KYC requests are displayed
    When user filters KYC requests by status "Rejected"
    Then verify only "Rejected" KYC requests are displayed

@functional
Scenario: Search and filter, select first record and view KYC details
    When user filters KYC requests by status "Verified"
    When user selects first KYC request from the list
    And user clicks on Review Details button
    Then verify all required document fields are visible
    And verify document status is either Verified, Rejected, or Pending
    Then close the Review Details popup
    And user searches by "customerName" using value "Sithumini"
    When user selects first KYC request from the list
    And user clicks on Review Details button
    Then verify all required document fields are visible
    And verify document status is either Verified, Rejected, or Pending
    Then close the Review Details popup
