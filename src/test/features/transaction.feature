Feature: Transaction Payment Tabs

@smoke
Scenario Outline: User can navigate to different payment tabs
    Given user is logged in to the admin dashboard
    And user clicks Transaction Management
    Then verify Transaction Management heading is visible
    When user clicks the "<PaymentTab>" payment tab
    Then the "<PaymentTab>" payment tab should be displayed



Examples:
| PaymentTab      |
| Top Up          |
| Withdraw        |
| QR Payment      |
| Bill Payment    |
| Fund Transfer   |