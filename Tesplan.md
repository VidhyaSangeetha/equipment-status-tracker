# Equipment Status Tracker Test Plan 
**Project**: Equipment Status Tracker
**Application**: https://qa-assignment-omega.vercel.app


## Objective: 
Test the functionality of the equipment status tracter web application, API reliablitiy, UX quality

## Scope: Equipment Status Tracker
**InScope**:
- Equipment List Display - Data loading, status badges, responsive design
- quipment adding** - modal UX, validations, data persist.  
- Status update: dropdown changes, list refresh, persistence.  
- History: modal, ordering, timestamps, pagination (if present).  
- Error handling: invalid inputs, server errors (API), network failures (simulated).  
- Accessibility: keyboard navigation, loading states, accessibility 
- Performance: UI responsiveness; API p95 ≤ 1000 ms (basic).

API-
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `POST /api/equipment/{id}/status` - Update equipment status
- `GET /api/equipment/{id}/history` - Get status history

**Out of scope**:
Auth, Detailed Security and Performance Testing 


## Test strategy:
**Exploratory Session** - to understand features and risks
**Manual Functional Testing**- Requirement based test cases 
**Automation**-
    -**UI**- Cypress with javascript

    -**API**-Supertest
        - Happy Path Testing - Valid requests and responses
        - Validation Testing - Invalid data, missing fields, wrong formats
        - Error Scenarios - 400, 404, 500 status codes
        - Data Integrity - Verify response schemas and data consistency
        - Performance - Response time validation
**Include basic security and performance tests**

## Environment:
https://qa-assignment-omega.vercel.app/
Test Data - Unique Test Data
Browsers- Cross Browser

## Resources:
Team: 1 QA engineer

## Entry/Exit
**Entry**: App reachable; APIs up.  
**Exit**: Manual Test Execution Results, Bug Report, UI+API suites executed, Automation test execution reports 

## Risks:
- Real-time updates may be flaky - introduce proper waits
- Network variability - allow reasonable timeouts

## Deliverables: 
- Test Plan (this), Manual Test Cases, Bug Reports, Test Summary.  
- Cypress suite + HTML report.  
- Supertest suite + HTML report


## Success Criteria:
100% pass on high-priority cases
Zero critical bugs
Good User Experience

## Documentation: https://qa-assignment-omega.vercel.app/docs