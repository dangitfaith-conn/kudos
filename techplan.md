# Technical Proposal & Implementation Plan: Kudos Platform

**Version:** 1.0

**Status:** Proposed

## 1. Introduction

This document outlines the technical architecture, design, and implementation plan for the Kudos Recognition Platform, as defined in `prd.md`. The goal is to build a scalable and maintainable full-stack JavaScript application that meets all MVP requirements.

## 2. Technology Stack

- **Frontend:** React (using Vite) with Chakra UI
- **Backend:** Node.js with the Express.js framework
- **Database:** MySQL
- **Authentication:** JSON Web Tokens (JWT)
- **Process Management:** A scheduler like `node-cron` for automated tasks.

## 3. System Architecture

The application will follow a classic client-server architecture.

- **Client (Frontend):** A React-based Single Page Application (SPA) that runs in the user's browser. It will handle all UI rendering and user interactions. It communicates with the backend via a RESTful API.
- **Server (Backend):** A Node.js/Express application that serves as the API. It will handle all business logic, data processing, database interactions, and user authentication.
- **Database:** A MySQL database will persist all application data, including users, transactions, and balances.



## 4. Database Schema

The following schema provides the necessary tables and relationships to support the application's features.

### `users`

Stores user account information and their credit balances.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    award_balance INT NOT NULL DEFAULT 100,
    spending_balance INT NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### `values`

Stores the company values used for categorizing awards. While hardcoded in the MVP, this table allows for future flexibility.

```sql
CREATE TABLE `values` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);
```

### `transactions`

Records every Kudo given, its status, and associated details.

```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    value_id INT NOT NULL,
    amount INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (value_id) REFERENCES `values`(id)
);
```

## 5. API Endpoints (REST)

The backend will expose the following endpoints. All routes, except for `/auth/login`, will be protected and require a valid JWT.

### Authentication
- `POST /api/auth/login`: Authenticates a user with email/password and returns a JWT.

### Users
- `GET /api/users/me`: Retrieves the profile and balances for the currently logged-in user.
- `GET /api/users`: Retrieves a list of all users (for the recipient selection dropdown).

### Kudos Transactions
- `POST /api/transactions`: Creates a new Kudo transaction (status defaults to `pending`).
- `GET /api/transactions`: Retrieves a feed of all `approved` transactions for the global dashboard.

### Admin
- `POST /api/admin/users`: Creates a new user account. (Admin only)
- `POST /api/admin/users/:userId/award`: Manually adds credits to a specific user's `award_balance`. (Admin only)
- `GET /api/admin/transactions/pending`: Retrieves all transactions with `pending` status for moderation. (Admin only)
- `POST /api/admin/transactions/:transactionId/approve`: Approves a pending transaction. (Admin only)
- `POST /api/admin/transactions/:transactionId/deny`: Denies a pending transaction. (Admin only)

## 6. Implementation Plan

The project will be developed in logical, iterative phases.

### Phase 1: Backend Foundation & Database
- **Tasks:**
    - Initialize Node.js/Express project.
    - Configure database connection to MySQL.
    - Create the database schema and initial migrations.
    - Implement the `users` and `transactions` models.
    - Create seed scripts to populate the database with initial admin users and the four company `values`.

### Phase 2: Backend API & Logic
- **Tasks:**
    - Implement user authentication (login endpoint, password hashing with `bcrypt`, JWT generation).
    - Build middleware for protecting routes and checking for admin privileges.
    - Implement all core API endpoints for users and transactions.
    - Implement the admin-specific endpoints for user creation and transaction moderation.
    - Ensure all balance-changing operations (approve, deny, award) are atomic and correctly update user balances.

### Phase 3: Frontend Foundation
- **Tasks:**
    - Initialize React project using Vite.
    - Set up project structure (components, pages, services/api).
    - Implement routing (e.g., using `react-router-dom`).
    - Build the Login page and authentication logic (API calls, storing JWT in local storage).
    - Create protected route components that redirect unauthenticated users to the login page.

### Phase 4: Frontend Feature Implementation
- **Tasks:**
    - Build the main Dashboard page to display user balances and the global transaction feed.
    - Create the "Give Kudos" page with its form components (recipient search, amount, value selection, message).
    - Develop the Admin page for viewing and acting on pending transactions.
    - Implement a simple notification system for feedback (e.g., "Kudo submitted!", "Transaction denied").

### Phase 5: Automation & Finalization
- **Tasks:**
    - Implement the monthly credit refresh using a scheduler like `node-cron` on the backend. This script will iterate through all users and add 100 credits to their `award_balance`.
    - Conduct thorough end-to-end testing.
    - Refine CSS and ensure a consistent, clean UI.

## 7. Security Considerations

- **Authentication:** Passwords will be securely hashed using `bcrypt` before being stored. Communication will be secured via JWTs.
- **Authorization:** Backend middleware will protect all routes, with an additional layer to verify `is_admin` status for admin-only endpoints.
- **Data Integrity:** All credit modifications will be handled exclusively on the backend within transactional logic to prevent race conditions and ensure balances are always accurate.
- **Input Validation:** All incoming API requests will be validated to prevent common vulnerabilities like SQL injection and Cross-Site Scripting (XSS).

Please review this plan. Once approved, we can begin with Phase 1.