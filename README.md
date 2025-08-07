# kudos
Kudos credit system prototype (aka CUDOS rewrite)

## Goal
The main goal is to experiment with the AI workflow from the ground up.  The secondary goal is to rapidly prototype a new version of the cudos website.  There's no expectation to launch this by the end of 10% week :) 

## To Run Project

### 1. Database Setup (MySQL)

Before running the application, you need to set up the MySQL database.

1.  **Install and run MySQL:**
    Make sure you have a MySQL server running on your local machine.

2.  **Create the Database:**
    Connect to your MySQL server and run the following command to create the database:
    ```sql
    CREATE DATABASE kudos_dev;
    ```

3.  **Create Tables:**
    Use the `kudos_dev` database and run the following SQL commands to create the necessary tables. These are based on the `techplan.md`.

    ```sql
    USE kudos_dev;

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

    CREATE TABLE `values` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT
    );

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

4.  **Seed Initial Data:**
    Run the following commands to populate the `values` table and create an initial admin and standard user.

    ```sql
    -- Insert company values
    INSERT INTO `values` (name) VALUES
    ('Be Cool'),
    ('Be Courageous'),
    ('Be Connected'),
    ('Be Curious');

    -- Create an admin user
    -- The password 'password' is hashed using bcrypt.
    -- You can log in with: admin@kudos.com / password
    INSERT INTO users (email, password_hash, full_name, is_admin) VALUES
    ('admin@kudos.com', '$2a$14$sQQWXMu56akf6Z6.8dd3Zuc2HllFr0RGEejfv2HpEh4QaXqiA4ThO', 'Admin User', TRUE);
    
    -- Create a standard user
    -- You can log in with: user@kudos.com / password
    INSERT INTO users (email, password_hash, full_name, is_admin) VALUES
    ('user@kudos.com', '$2a$14$sQQWXMu56akf6Z6.8dd3Zuc2HllFr0RGEejfv2HpEh4QaXqiA4ThO', 'Standard User', FALSE);
    ```

### 2. Install Dependencies & Run

Once the database is set up, you can start the client and server.

1.  **Start the Backend Server:**
    ```bash
    cd server
    npm install
    npm start
    ```

2.  **Start the Frontend Client:**
    Open a new terminal window:
    ```bash
    cd client
    npm install
    npm run dev
    ```

