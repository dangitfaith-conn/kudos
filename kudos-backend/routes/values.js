// /Users/jonchun/Workspace/kudos/kudos-backend/routes/values.js
const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/values
// Gets a list of all company values for the dropdown.
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [values] = await db.query('SELECT id, name FROM `values` ORDER BY id ASC');
        res.json(values);
    } catch (error) {
        console.error('Error fetching company values:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;