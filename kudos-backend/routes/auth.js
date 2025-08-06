// /Users/jonchun/Workspace/kudos/kudos-backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // 1. Find the user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            // Use a generic error message for security to not reveal which (email/password) was wrong
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // 2. Compare the provided password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. If credentials are correct, create a JWT
        const payload = {
            userId: user.id,
            email: user.email,
            isAdmin: user.is_admin,
        };

        const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' }); // Token expires in 1 hour

        res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;