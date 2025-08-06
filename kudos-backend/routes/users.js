// /Users/jonchun/Workspace/kudos/kudos-backend/routes/users.js

const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me
// This route is protected by our authenticateToken middleware.
router.get('/me', authenticateToken, async (req, res) => {
    try {
        // The user's info (id, email, etc.) was attached to req.user by the middleware.
        const userId = req.user.userId;

        // We select all columns *except* the password hash for security.
        const [users] = await db.query('SELECT id, email, full_name, award_balance, spending_balance, is_admin FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/users
// Gets a list of all users for the recipient dropdown.
// It's protected and excludes the currently logged-in user.
router.get('/', authenticateToken, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // Select only the ID and name, and exclude the current user from the list.
        const [users] = await db.query('SELECT id, full_name FROM users WHERE id != ? ORDER BY full_name ASC', [loggedInUserId]);

        res.json(users);
    } catch (error) {
        console.error('Error fetching user list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;