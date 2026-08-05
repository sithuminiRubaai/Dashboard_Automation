
# MoiPay Admin Dashboard Automation

## Overview

This repository contains the automated test framework for the MoiPay Admin Dashboard, developed using Playwright, Cucumber (BDD), and TypeScript. The framework is designed to support scalable, maintainable, and reliable end-to-end testing of the MoiPay administrative platform.

## Objectives

- Validate critical business workflows across the Admin Dashboard.
- Ensure application stability through automated regression testing.
- Support Behavior-Driven Development (BDD) using Gherkin syntax.
- Enable cross-browser and parallel test execution.
- Integrate seamlessly with CI/CD pipelines.

## Technology Stack

- Playwright
- Cucumber (BDD)
- TypeScript
- Node.js
- Gherkin
- GitHub Actions
- Jenkins (Optional)

## Project Structure

```text
├── src
│   ├── features
│   │   ├── login.feature
│   │   ├── user-management.feature
│   │   ├── kyc.feature
│   │   └── transaction-monitoring.feature
│   │
│   ├── step-definitions
│   ├── pages
│   ├── hooks
│   ├── utils
│   ├── test-data
│   └── config
│
├── reports
├── screenshots
├── package.json
├── cucumber.js
├── playwright.config.ts
└── README.md
```

## Key Features

### BDD Testing
- Feature files written in Gherkin syntax.
- Easy collaboration between QA, Business Analysts, and Developers.

### Playwright Automation
- Fast and reliable browser automation.
- Supports Chromium, Firefox, and WebKit.

### Page Object Model (POM)
- Reusable page components.
- Improved maintainability and scalability.

### Reporting
- Detailed execution reports.
- Automatic screenshot capture on failures.

### CI/CD Ready
- Supports automated execution through GitHub Actions, Jenkins, or other CI/CD platforms.

## Covered Modules

- Authentication & Authorization
- User Management
- Role & Permission Management
- KYC Verification
- Compliance Operations
- Risk Management
- Transaction Monitoring
- Customer Service Functions
- Audit Logs
- Dashboard Analytics & Reporting

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Moipay_Admin_Dashboard_Automation
```

### Install Dependencies

```bash
npm install
```

## Running Tests

### Execute All Tests

```bash
npm test
```

### Execute Specific Feature

```bash
npx cucumber-js src/features/login.feature
```

### Execute Tests in Headed Mode

```bash
npx playwright test --headed
```

## Test Execution Flow

1. Load environment configuration.
2. Launch browser instance.
3. Execute feature scenarios.
4. Capture screenshots on failure.
5. Generate execution reports.
6. Publish results to CI/CD pipeline.

## Best Practices

- Follow Page Object Model (POM) principles.
- Keep feature files business-readable.
- Reuse step definitions whenever possible.
- Store test data separately from test logic.
- Maintain independent and repeatable test scenarios.

## Contributors

MoiPay Quality Assurance Team

## License

This project is intended for internal use within the MoiPay platform and its authorized development and QA teams.
=======
# Moipay_Admin_Dashboard
>>>>>>> 17a2e7bf1a8244f37072a355f1e72ca12b1c949a
