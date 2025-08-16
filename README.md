# equipment-status-tracker
Equipment status tracker application's functionality. Document of test plan, testing approach and test executions.
Test Automation of the application for UI and API.

# Test Plan 
Tesplan.md detailed test plan is written here.

# Test Cases
Testcase.xlsx

# Bug Report
BugReport.docx

# Supertest+Mocha/Chai (API) automation tests
cd api_tests

ENV 
.env should contain
BASE_URL=https://qa-assignment-omega.vercel.app
PERF_MS=1000


Quick Start
To setup- npm install
To Execute- npm test


Reports- api_tests/reports
Tests- api_tests/tests
api_tests/tests/equipmentlist.js- all api tests, skip the execution of scripts for bugs reported
api_tests/tests/performance.js - Simple performance test written for the api (simple p95)

Reporting using mochawesome
HTML Reports in - api_tests/reports

# Cypress for UI Tests
cd ui_tests

ENV
cypress.config.js has 
baseUrl: 'https://qa-assignment-omega.vercel.app'

Quick Start
To setup- npm install
To Execute- npx cypress run

ui_tests/cypress/e2e/equipmentTests.cy.js - contains the ui test cases
POM followed in framework

Reporting using mochawesome
HTML Reports in - cypress/reports

# NOTE-
GET /api/equipment gives error 500 sometimes


# Test Summary Report
Test_Summary_Report.docx