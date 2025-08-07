# Product Requirements Document: Kudos Recognition Platform

**Version:** 1.0

**Status:** Inception

## 1. Overview

The Kudos project is an internal web application designed to foster a culture of appreciation and recognition within an organization. It allows employees (users) to give and receive monetary-based awards tied to core company values. The platform provides a centralized way to manage, track, and celebrate the positive contributions of team members.

## 2. Project Goals

- **Primary Goal:** To create a simple, engaging platform for peer-to-peer recognition.
- **Secondary Goal:** To reinforce company values by associating them with tangible awards.
- **Business Goal:** To improve employee morale, engagement, and retention through consistent positive feedback.

## 3. User Personas

### 3.1. Standard User

- **Description:** A typical employee at the company.
- **Needs & Goals:**
    - Wants to easily give recognition to deserving colleagues.
    - Wants to see their own contributions acknowledged.
    - Wants to view the positive interactions happening across the company.

### 3.2. Administrator (Admin)

- **Description:** An HR representative or team manager with elevated privileges.
- **Needs & Goals:**
    - Wants to oversee the recognition program.
    - Needs to ensure the system is used fairly and appropriately.
    - Needs the ability to manage users and credit allocations.

## 4. Feature Requirements (MVP)

### 4.1. Core User Features

- **F-1: Authentication**
    - Users must log in to access the system using an email and password.

- **F-2: Dashboard & Balances**
    - Upon login, users can view their two distinct balances:
        - **Award Balance:** Credits available to give to others.
        - **Spending Balance:** Credits received from others, which can be redeemed later.

- **F-3: Give Kudos**
    - Users can initiate a new "Kudo" transaction.
    - The form will require:
        - **Recipient:** A searchable field to select another user.
        - **Amount:** The number of credits to give from their Award Balance.
        - **Value:** A selection from a predefined list of company values.
        - **Message:** A public message of recognition.
    - Submitting a Kudo places it in a "pending" state for admin review.

- **F-4: Transaction Feed**
    - A global, public feed will display all approved Kudos transactions.
    - Each entry will show the sender, receiver, message, and the associated value.

### 4.2. Admin Features

- **F-5: User Management**
    - Admins are responsible for creating new user accounts.

- **F-6: Transaction Moderation**
    - Admins can view a queue of all "pending" Kudo transactions.
    - Admins can **approve** a transaction:
        - Sender's Award Balance is debited.
        - Receiver's Spending Balance is credited.
        - The transaction becomes visible on the public feed.
    - Admins can **deny** a transaction:
        - The credits are returned to the sender's Award Balance.
        - The sender receives a simple notification of the denial.

- **F-7: Manual Credit Allocation**
    - Admins can manually grant additional credits to any user's Award Balance at any time.

## 5. Technical Specifications & Assumptions

- **Frontend:** JavaScript, React, Chakra UI
- **Backend:** JavaScript, Node.js
- **Database:** MySQL
- **Credit Value:** 1 Spending Credit is equivalent to $0.50 USD.
- **Company Values (Hardcoded):**
    - "Be Cool"
    - "Be Courageous"
    - "Be Connected"
    - "Be Curious"
- **Admin Role:** A user's admin status is determined by a boolean flag in the database. Multiple admins are supported.
- **Automated Credit Refresh (Hardcoded):**
    - A system process will run on the 1st of every month.
    - This process will grant every user 100 credits to their **Award Balance**.

## 6. Out of Scope for MVP V1.0

The following features are planned for future iterations but will not be included in the initial release:

- Self-service user registration.
- SSO authentication (e.g., Google, Okta).
- A "store" for redeeming Spending Balance credits for gift cards or other items.
- An admin interface for configuring the rules of the automated credit refresh.
- An admin interface for managing the list of company values.
- Automated awards for user-specific events (e.g., birthdays, work anniversaries).
- Migration of data from any previous system.
- **Improved Transaction Handling:** A future version will immediately decrement a sender's `award_balance` into a "pending" state when a Kudo is submitted, rather than upon admin approval, to prevent race conditions.