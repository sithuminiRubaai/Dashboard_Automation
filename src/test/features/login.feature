Feature: login page validation

 @functional
 Scenario: Verify correct login URL for the current environment
   Then verify the correct environment URL is visible

 @functional @negative
  Scenario: Failed login with invalid credentials-Invalid eamail/Invalid Password
    When enter email as "Invalid@gmail.com"
    And enter password as "Admin@2024!3"
    And click on login button
    Then verify login error message is displayed

@functional @negative
 Scenario: Failed login with invalid credentials-Invalid eamail/Valid Password
    When enter email as "super_admi@gmail.com"
    And enter password as "Admin@2024!"
    Then click on login button
    And click on login button
    Then verify login error message is displayed

  @functional @negative
 Scenario: Failed login with invalid credentials-Valid eamail/Invalid Password
    When enter email as "super_admin@gmail.com"
    And enter password as "Admin@2024!3"
    Then click on login button
    And click on login button
    Then verify login error message is displayed


@functional @positive
 Scenario: verify login success message
    When enter email as "super_admin@gmail.com"
    And enter password as "Admin@2024!"
    Then click on login button
    And verify admin login success
    Then logout from the application
   
@functional @positive
 Scenario Outline: Login with multiple credentials
    When provide valid email as "<email>" and password as "<password>"
    Then click on login button
    And verify admin login success
    Then logout from the application

Examples:
  | email                           | password               |
  | super_admin@gmail.com           | Admin@2024!            |
 
