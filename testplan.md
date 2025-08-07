# Test Plan: Kudos Platform

**Version:** 1.0
**Status:** Draft

## 1. Introduction

This document outlines the testing strategy for the Kudos Recognition Platform MVP. The goal is to ensure the application is functional, reliable, secure, and meets all requirements defined in the PRD and technical specification.

## 2. Scope

### In-Scope Features for Testing
- User Authentication (Login)
- Dashboard view (Balances)
- Giving Kudos (creating pending transactions)
- Global Transaction Feed (viewing approved transactions)
- Admin: User Creation
- Admin: Transaction Moderation (Approve/Deny)
- Admin: Manual Credit Allocation
- Automated monthly credit refresh

### Out-of-Scope Features
- SSO, Store integration, self-service registration, and other features listed as "Out of Scope" in the PRD.

## 3. Testing Types

- **Unit Testing:** Individual functions and components (both frontend and backend) will be tested in isolation.
- **Integration Testing:** Backend services will be tested to ensure API endpoints work as expected with the database. Frontend components will be tested to ensure they correctly call and handle API responses.
- **End-to-End (E2E) Testing:** Automated tests will simulate full user workflows from the browser, covering all major user stories (e.g., logging in, giving a kudo, admin approving it, balances updating).
- **Manual/Exploratory Testing:** Manual testing will be performed to catch issues not covered by automated tests and to verify the overall user experience.

## 4. Detailed Test Scenarios

The following scenarios will be tested through a combination of automated (unit, integration, E2E) and manual tests.

### 4.1. User Authentication
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| AUTH-01 | User logs in with correct credentials. | Login is successful. User is redirected to the dashboard. A valid JWT is stored. |
| AUTH-02 | User logs in with incorrect password. | Login fails. User sees "Cannot login" error message. |
| AUTH-03 | User logs in with an email that does not exist. | Login fails. User sees "Cannot login" error message. |

### 4.2. Standard User Workflow
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| USER-01 | Logged-in user views the dashboard. | User's `award_balance` and `spending_balance` are correctly displayed. |
| USER-02 | User views the global transaction feed. | Feed displays only `approved` transactions. Each entry shows sender, recipient, message, and value. |
| USER-03 | User successfully gives a Kudo. | Form submits successfully. A `pending` transaction is created in the database. User is notified of success. |
| USER-04 | User attempts to give more credits than their `award_balance`. | Form submission fails. User sees "You cannot give more credits than you have" error. |
| USER-05 | User attempts to give kudos to themselves. | Form submission fails. User sees "You cannot give kudos to yourself" error. |
| USER-06 | User attempts to submit the "Give Kudo" form with missing fields. | Form submission fails. User sees "please fill out all required fields" error. |

### 4.3. Admin Workflow
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| ADMIN-01 | Admin creates a new standard user. | User is created in the database with `is_admin=false`. |
| ADMIN-02 | Admin creates a new admin user. | User is created in the database with `is_admin=true`. |
| ADMIN-03 | Admin approves a pending transaction. | Transaction status becomes `approved`. Sender's `award_balance` is debited. Recipient's `spending_balance` is credited. Transaction appears on the global feed. |
| ADMIN-04 | Admin denies a pending transaction. | Transaction status becomes `denied`. Sender's and recipient's balances are unchanged. Sender receives a toast/snackbar notification. |
| ADMIN-05 | Admin manually awards credits to a user. | The target user's `award_balance` is correctly increased by the specified amount. |
| ADMIN-06 | **Race Condition:** User with 100 credits sends two 75-credit kudos. Admin approves the first, then the second. | The first approval succeeds. The second approval fails, and the admin sees a warning about insufficient funds. The user's balances reflect only the first successful transaction. |

### 4.4. Automation
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| AUTO-01 | Manually trigger the monthly credit refresh job. | All users in the database have their `award_balance` increased by 100. |

### 4.5. Security
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| SEC-01 | A non-admin user attempts to call an admin API endpoint directly (e.g., `POST /api/admin/users`). | The API returns a 403 Forbidden or 401 Unauthorized error. No data is changed. |
| SEC-02 | A non-admin user attempts to call the transaction approval endpoint directly. | The API returns a 403 Forbidden or 401 Unauthorized error. The transaction status is unchanged. |
| SEC-03 | A user submits a Kudo with a message containing a `<script>` tag. | The script tag is rendered as plain text on the transaction feed and is not executed by the browser (XSS prevention). |

### 4.6. Performance
| Test Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| PERF-01 | With 200+ users in the database, a user loads the "Give Kudo" page. | The API call to `GET /api/users` responds in under 500ms. The recipient dropdown is populated successfully. |

---

## 5. Appendix: Resolved Questions

<details>
<summary>View initial Q&A</summary>

1.  **Q: Transaction Logic & Race Conditions:** What happens if a user with 100 credits sends two 75-credit kudos, and an admin tries to approve both?
    -   **A:** The first approval succeeds, but the second one fails. The admin receives a warning that the user has insufficient credits. A future iteration will introduce a "pending credits" system to handle this more proactively.

2.  **Q: User Transaction History:** Should users have a personal view of their `pending` or `denied` transactions?
    -   **A:** No, this is out of scope for the MVP and will be considered for a future iteration.

3.  **Q: Notification Mechanism:** What is the "simple notification" for a denied transaction?
    -   **A:** A temporary toast/snackbar message in the UI is sufficient.

4.  **Q: User-Facing Error Handling:** What are the specific error messages for common failures?
    -   **A:**
        -   Incorrect login: "Cannot login"
        -   Missing form fields: "please fill out all required fields"
        -   Giving more credits than available: "You cannot give more credits than you have"
        -   Giving kudos to yourself: "You cannot give kudos to yourself"

5.  **Q: Performance Testing:** Should the MVP test plan include performance/load testing?
    -   **A:** Yes, initial performance testing should be included.

6.  **Q: Security Test Cases:** Should we explicitly test for common application-level vulnerabilities?
    -   **A:** Yes, tests should be included for unauthorized API access and potential XSS in user-provided text fields.

7.  **Q: Performance Benchmarks:** For the initial performance testing of `GET /api/users` with 200+ users, what would be an acceptable API response time to test against?
    -   **A:** Under 500ms.

</details>