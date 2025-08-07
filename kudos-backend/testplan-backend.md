# Kudos Backend Test Plan

This document outlines the test plan for the Kudos backend application.

## 1. Overall Test Strategy

The testing strategy will focus on API-level tests. We will use a combination of automated integration tests and manual testing to ensure the application is working correctly. The primary goal is to verify the functionality of each API endpoint and ensure data integrity.

## 2. Test Environment

-   **Runtime**: Node.js
-   **Database**: MySQL
-   **Testing Framework**: TBD (e.g., Jest, Mocha)
-   **HTTP Client**: TBD (e.g., Postman, Insomnia, or a library like Axios)

## 3. Test Cases

### 3.1. Authentication (`/api/auth`)

| Endpoint | Method | Description | Success Criteria | Failure Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| `/login` | `POST` | Authenticate a user. | - Returns a 200 OK status.<br>- Returns a valid JWT token.<br>- Response body includes a success message. | - Invalid email or password (401).<br>- Missing email or password (400).<br>- Server error (500). |

### 3.2. Users (`/api/users`)

| Endpoint | Method | Description | Success Criteria | Failure Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| `/me` | `GET` | Get the current user\'s profile. | - Returns a 200 OK status.<br>- Returns the user\'s profile information (excluding password).<br>- Requires a valid JWT token. | - No token or invalid token (401/403).<br>- User not found (404).<br>- Server error (500). |
| `/` | `GET` | Get a list of all users. | - Returns a 200 OK status.<br>- Returns a list of all users (id and full\_name).<br>- Excludes the currently logged-in user.<br>- Requires a valid JWT token. | - No token or invalid token (401/403).<br>- Server error (500). |

### 3.3. Values (`/api/values`)

| Endpoint | Method | Description | Success Criteria | Failure Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | Get a list of company values. | - Returns a 200 OK status.<br>- Returns a list of all company values.<br>- Requires a valid JWT token. | - No token or invalid token (401/403).<br>- Server error (500). |

### 3.4. Transactions (`/api/transactions`)

| Endpoint | Method | Description | Success Criteria | Failure Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `POST` | Create a new Kudo transaction. | - Returns a 201 Created status.<br>- Creates a new transaction in the database with "pending" status.<br>- Decrements the sender\'s `award_balance`.<br>- Requires a valid JWT token. | - Missing required fields (400).<br>- Sender gives kudos to themselves (400).<br>- Negative or zero kudos amount (400).<br>- Insufficient `award_balance` (400).<br>- No token or invalid token (401/403).<br>- Server error (500). |
| `/` | `GET` | Get a feed of approved transactions. | - Returns a 200 OK status.<br>- Returns a list of all "approved" transactions.<br>- Requires a valid JWT token. | - No token or invalid token (401/403).<br>- Server error (500). |
| `/:id/approve` | `PATCH` | Approve a pending transaction. | - Returns a 200 OK status.<br>- Updates the transaction status to "approved".<br>- Increments the recipient\'s `spending_balance`.<br>- Requires a valid JWT token with admin privileges. | - Transaction not found or not pending (404).<br>- No token or invalid token (401/403).<br>- User is not an admin (403).<br>- Server error (500). |
| `/:id/deny` | `PATCH` | Deny a pending transaction. | - Returns a 200 OK status.<br>- Updates the transaction status to "denied".<br>- Refunds the kudos amount to the sender\'s `award_balance`.<br>- Requires a valid JWT token with admin privileges. | - Transaction not found or not pending (404).<br>- No token or invalid token (401/403).<br>- User is not an admin (403).<br>- Server error (500). |
| `/pending` | `GET` | Get a list of pending transactions. | - Returns a 200 OK status.<br>- Returns a list of all "pending" transactions.<br>- Requires a valid JWT token with admin privileges. | - No token or invalid token (401/403).<br>- User is not an admin (403).<br>- Server error (500). |

## 4. Use Cases

### 4.1. User Login

1.  A user enters their email and password.
2.  The system validates the credentials.
3.  If valid, the system returns a JWT token.
4.  The user can then use this token to access protected routes.

### 4.2. Give a Kudo

1.  A user is logged in.
2.  The user selects a recipient, a company value, and an amount of kudos to give.
3.  The user submits the kudo.
4.  The system creates a new transaction with a "pending" status.
5.  The user\'s `award_balance` is decremented.

### 4.3. Admin Approves a Kudo

1.  An admin is logged in.
2.  The admin views the list of pending kudos.
3.  The admin approves a kudo.
4.  The system updates the transaction status to "approved".
5.  The recipient\'s `spending_balance` is incremented.

### 4.4. Admin Denies a Kudo

1.  An admin is logged in.
2.  The admin views the list of pending kudos.
3.  The admin denies a kudo.
4.  The system updates the transaction status to "denied".
5.  The kudos amount is refunded to the sender\'s `award_balance`.

### 4.5. View the Kudos Feed

1.  A user is logged in.
2.  The user views the main dashboard.
3.  The system displays a feed of all "approved" kudos transactions.

## 5. Edge Cases

### 5.1. Authentication
*   **Login:**
    *   Attempting to log in with an empty email or password.
    *   Attempting to log in with a malformed email.
    *   Brute-force attacks on the login endpoint.
    *   Concurrent login attempts with the same user.

### 5.2. Users
*   **`/me`:**
    *   Requesting the user profile with an expired or malformed JWT token.
*   **`/`:**
    *   Requesting the user list with an expired or malformed JWT token.

### 5.3. Transactions
*   **Create Transaction:**
    *   Sending a kudo with a floating-point number.
    *   Sending a kudo with a negative number.
    *   Sending a kudo with an amount greater than the `award_balance`.
    *   Sending a kudo to a user that does not exist.
    *   Sending a kudo with a value that does not exist.
    *   Concurrent kudo submissions from the same user.
*   **Approve/Deny Transaction:**
    *   Attempting to approve/deny a transaction that has already been approved/denied.
    *   Attempting to approve/deny a transaction that does not exist.
    *   Concurrent approval/denial of the same transaction by multiple admins.
