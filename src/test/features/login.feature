Feature: login page validation

Background:

@smoke @login @negative
  Scenario: Failed login with invalid credentials
    When provide invalid email and password
    And click on login button
    Then verify login error message is displayed

@smoke @login
  Scenario: login with valid email and password
    When provide valid email and password
    Then click on login button
    And verify admin login success
    Then logout from the application

# @smoke @login
#  Scenario Outline: verify login success message
#     When enter email as "<email>"
#     And enter password as "<password>"
#     Then click on login button
#     Then logout from the application
   

# @smoke @login @regression
#  Scenario Outline: Login with multiple credentials
#     When provide valid email as "<email>" and password as "<password>"
#     Then click on login button
#     And verify admin login success
#     Then logout from the application

# Examples:
#   | email                   | password       |
#   | super_admin@gmail.com   | Admin@2024!    |


  
