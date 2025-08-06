const express = require('express');
const router = express.Router();
const { getApprovedTransactions, createTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/transactions
// @desc    Get approved transactions for the public feed   
router.get('/', protect, getApprovedTransactions);

// @route   POST /api/transactions
// @desc    Create a new Kudo transaction
router.post('/', protect, createTransaction);

module.exports = router;