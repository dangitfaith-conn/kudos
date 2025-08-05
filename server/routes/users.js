const express = require('express');
const router = express.Router();
const { getUserProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
router.get('/me', protect, getUserProfile);

// @route   GET /api/users
// @desc    Get all users for recipient selection
router.get('/', protect, getAllUsers);

module.exports = router;