# Kudos Application Test Plan

## 1. Introduction

This document outlines the testing strategy for the Kudos application. The objective is to verify that all functional requirements are met, ensure the application is stable and robust, and identify any defects before deployment. The plan covers multiple levels of testing, from individual components to end-to-end user flows.

## 2. Scope

### In Scope

The following features and components are in scope for this test plan:

-   **User Authentication:** Login for existing users (both regular and admin), logout, and session management (token handling).
-   **Role-Based Access Control:** Differentiating between regular users and admin users, including access to protected routes.
-   **Dashboard:** Viewing personal balances (Award and Spending), viewing the public kudos feed, and accessing the "Give a Kudo" form.
-   **Kudos Transactions:** Creating and submitting a new kudo transaction, including backend validation for sufficient balance.
-   **Admin Moderation:** Viewing the queue of pending kudos, approving kudos (crediting the recipient), and denying kudos (refunding the sender).
-   **API Functionality:** All backend endpoints (`/users`, `/transactions`, `/auth`, `/values`) will be tested for correct responses, status codes, and error handling.
-   **UI/UX:** The overall user interface built with Chakra UI will be tested for usability, consistency, and basic responsiveness on a modern desktop browser.

### Out of Scope

-   User registration (sign-up functionality).
-   Performance, load, and stress testing.
-   Formal cross-browser and cross-device compatibility testing.
-   Security penetration testing.
-   Usability testing with external users.
-   Database performance optimization.

## 3. Testing Levels

### 3.1. Unit Testing

-   **Backend (Python/Pytest):** Test individual API logic functions, database models, and business rules (e.g., `verify_password`, balance calculation logic) in isolation.
-   **Frontend (JS/Vitest):** Test individual React components (`Header`, `KudosFeed`, `GiveKudosForm`) to ensure they render correctly given specific props.

### 3.2. Integration Testing

-   **Backend:** Test the interaction between different parts of the API, such as ensuring that approving a transaction correctly updates user balances in the database.
-   **Frontend:** Test the interaction between multiple components, such as verifying that submitting the `GiveKudosForm` correctly triggers a data refresh on the `DashboardPage`.

### 3.3. End-to-End (E2E) Testing

Simulate complete user journeys from start to finish. This is the primary focus of the use cases listed below. E2E tests will validate the entire application stack, from the UI to the database.

---

## 4. Use Cases & Test Scenarios

### 4.1. Authentication

| Case ID | Use Case                               | Steps                                                                                                                             | Expected Result                                                                                             |
| :------ | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **UC-1**  | Successful Login (Regular User)        | 1. Navigate to `/login`.<br>2. Enter valid regular user credentials.<br>3. Click "Login".                                           | User is redirected to the dashboard (`/`). The header shows user's name and a "Logout" button.              |
| **UC-2**  | Successful Login (Admin User)          | 1. Navigate to `/login`.<br>2. Enter valid admin credentials.<br>3. Click "Login".                                                | User is redirected to the dashboard (`/`). The header shows an "Admin" link and a "Logout" button.          |
| **UC-3**  | Failed Login (Incorrect Password)      | 1. Navigate to `/login`.<br>2. Enter a valid email and an invalid password.<br>3. Click "Login".                                    | An error message "Invalid credentials" is displayed. User remains on the login page.                        |
| **UC-4**  | Failed Login (Unregistered User)       | 1. Navigate to `/login`.<br>2. Enter an email that is not in the database.<br>3. Click "Login".                                     | An error message "Invalid credentials" is displayed. User remains on the login page.                        |
| **UC-5**  | User Logout                            | 1. Log in as any user.<br>2. Click the "Logout" button in the header.                                                             | User is redirected to the `/login` page. The session is terminated.                                         |

### 4.2. Protected Routes

| Case ID | Use Case                               | Steps                                                                                                                             | Expected Result                                                                                             |
| :------ | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **UC-6**  | Access Dashboard while Logged Out      | 1. Ensure you are logged out.<br>2. Attempt to navigate directly to `/`.                                                          | User is redirected to `/login`.                                                                             |
| **UC-7**  | Access Admin Page as Regular User      | 1. Log in as a regular (non-admin) user.<br>2. Attempt to navigate directly to `/admin`.                                          | User is redirected to the dashboard (`/`). The admin page is not displayed.                                 |
| **UC-8**  | Access Admin Page while Logged Out     | 1. Ensure you are logged out.<br>2. Attempt to navigate directly to `/admin`.                                                     | User is redirected to `/login`.                                                                             |
| **UC-9**  | Access Non-Existent Page               | 1. Log in or stay logged out.<br>2. Navigate to a URL that does not exist (e.g., `/foo/bar`).                                     | The "404 Not Found" page is displayed.                                                                      |

### 4.3. Dashboard & Giving Kudos

| Case ID | Use Case                               | Steps                                                                                                                             | Expected Result                                                                                             |
| :------ | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **UC-10** | View Dashboard Data                    | 1. Log in as a regular user.<br>2. Observe the dashboard.                                                                         | The user's full name, Award Balance, and Spending Balance are displayed correctly. The Kudos Feed is visible. |
| **UC-11** | Successful Kudo Submission             | 1. Log in.<br>2. On the dashboard, fill out the "Give a Kudo" form with valid data.<br>3. Click "Send Kudo".                       | A success toast/notification appears. The form resets. The user's Award Balance decreases by the sent amount. |
| **UC-12** | Failed Kudo (Insufficient Balance)     | 1. Log in.<br>2. Attempt to send a kudo with an amount greater than the user's Award Balance.                                     | An error toast/notification appears with a relevant message. The user's balance remains unchanged.          |
| **UC-13** | Failed Kudo (Missing Fields)           | 1. Log in.<br>2. Attempt to submit the form without selecting a recipient or value.<br>3. Click "Send Kudo".                      | An error toast/notification appears. The form remains filled with the user's input.                         |

### 4.4. Admin Moderation

| Case ID | Use Case                               | Steps                                                                                                                             | Expected Result                                                                                             |
| :------ | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **UC-14** | View Moderation Queue                  | 1. Have a user submit a kudo.<br>2. Log in as an admin.<br>3. Navigate to the `/admin` page.                                       | The submitted kudo appears in the "Pending Kudos" list with all relevant details.                           |
| **UC-15** | Approve a Kudo                         | 1. On the `/admin` page, find a pending kudo.<br>2. Click the "Approve" button.                                                   | The kudo is removed from the queue. A success toast appears. The recipient's Spending Balance is increased. |
| **UC-16** | Deny a Kudo                            | 1. On the `/admin` page, find a pending kudo.<br>2. Click the "Deny" button.                                                      | The kudo is removed from the queue. A warning/info toast appears. The sender's Award Balance is refunded.   |
| **UC-17** | View Empty Moderation Queue            | 1. Ensure no kudos are pending.<br>2. Log in as an admin and navigate to `/admin`.                                                | A message "The moderation queue is empty" is displayed.                                                     |