Feature: APP Application

  @login
  Scenario: Login to APP with token session
    Given User navigates to APP Home with token session
    Then Login should be successful
