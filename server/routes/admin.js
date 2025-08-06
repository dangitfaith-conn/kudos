const express = require('express');
const router = express.Router();
const {
  getPendingTransactions,
  approveTransaction,
  denyTransaction,
  createUser,
  awardCredits,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All routes in this file are protected and require admin privileges
router.use(protect, isAdmin);

// --- Transaction Moderation ---
// @route   GET /api/admin/transactions/pending
// @desc    Get all pending transactions
router.get('/transactions/pending', getPendingTransactions);

// @route   POST /api/admin/transactions/:transactionId/approve
// @desc    Approve a transaction
router.post('/transactions/:transactionId/approve', approveTransaction);

// @route   POST /api/admin/transactions/:transactionId/deny
// @desc    Deny a transaction
router.post('/transactions/:transactionId/deny', denyTransaction);

// --- User Management ---
// @route   POST /api/admin/users
// @desc    Create a new user
router.post('/users', createUser);

// @route   POST /api/admin/users/:userId/award
// @desc    Manually award credits to a user
router.post('/users/:userId/award', awardCredits);

module.exports = router;
