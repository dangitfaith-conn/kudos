// /Users/jonchun/Workspace/kudos/kudos-backend/seed.js

const bcrypt = require('bcrypt');
const db = require('./db');

// This is the number of "rounds" bcrypt will use to generate the salt.
// 10 is a good default value.
const saltRounds = 10;

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Reset tables for a clean seed.
        // TRUNCATE is faster than DELETE and it resets the AUTO_INCREMENT counter.
        // We disable foreign key checks temporarily to avoid errors when truncating.
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE transactions');
        await db.query('TRUNCATE TABLE `values`');
        await db.query('TRUNCATE TABLE users');
        await db.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable checks

        // 2. Seed the `values` table
        const values = [
            ['Customer Obsession', 'We start with the customer and work backwards.'],
            ['Ownership', 'We are all owners and we act on behalf of the entire company.'],
            ['Learn and Be Curious', 'We are never done learning and always seek to improve ourselves.'],
            ['Deliver Results', 'We focus on the key inputs for our business and deliver them with the right quality and in a timely fashion.'],
        ];
        await db.query('INSERT INTO `values` (name, description) VALUES ?', [values]);
        console.log('Seeded company values.');

        // 3. Seed the `users` table with a hashed password
        const adminPassword = 'password123'; // A simple password for local dev
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        const adminUser = [
            'admin@kudos.com',
            hashedPassword,
            'Admin User',
            true, // is_admin
        ];

        await db.query(
            'INSERT INTO users (email, password_hash, full_name, is_admin) VALUES (?)',
            [adminUser]
        );
        console.log('Seeded admin user.');

        // 4. Seed a second, non-admin user
        const regularPassword = 'password456';
        const hashedRegularPassword = await bcrypt.hash(regularPassword, saltRounds);

        const regularUser = [
            'jane.doe@kudos.com',
            hashedRegularPassword,
            'Jane Doe',
            false, // is_admin
        ];

        await db.query('INSERT INTO users (email, password_hash, full_name, is_admin) VALUES (?)', [regularUser]);
        console.log('Seeded regular user.');

        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // 5. Close the database connection pool
        db.end();
    }
}

seed();