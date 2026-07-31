Feature: KYC (Know Your Customer) Management

@smoke @kyc
Scenario: Verify KYC Requests page is displayed
  Given user is logged in to the admin dashboard
  And user clicks KYC Management
  Then verify KYC Requests heading is visible
  And verify summary cards are visible

@smoke @kyc
Scenario: View KYC details
  When user selects first KYC request from the list
  And user clicks on Review Details button
  Then verify personal details section is displayed
  And verify documents section is displayed
  And verify KYC details contain name, father name, mother name, NIC, and address

@regression @kyc
Scenario: Verify KYC document visibility
  When user selects first KYC request from the list
  And user clicks on Review Details button
  Then verify all required document fields are visible
  And verify document status is either "Verified" or "Rejected"

|@regression @kyc
Scenario: Search KYC request by name
  When user searches for KYC request by name "Sithumini"
  Then verify search results contain only matching names

  # @regression @kyc
# Scenario: Filter KYC requests by status
#   When user filters KYC requests by status "Pending"
#   Then verify only "Pending" KYC requests are displayed
#   When user filters KYC requests by status "Verified"
#   Then verify only "Verified" KYC requests are displayed
#   When user filters KYC requests by status "Rejected"
#   Then verify only "Rejected" KYC requests are displayed


# @regression @kyc
# Scenario: Search KYC request by email
#   When user searches for KYC request by email "sithumini@rubaai.net"
#   Then verify search results contain only matching emails
