const express = require('express');
const router = express.Router();
const { getApprovedTransactions, createTransaction, getCompanyValues } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/transactions
// @desc    Get approved transactions for the public feed   
router.get('/', protect, getApprovedTransactions);

// @route   POST /api/transactions
// @desc    Create a new Kudo transaction
router.post('/', protect, createTransaction);

// @route   GET /api/transactions/values
// @desc    Get all company values
router.get('/values', protect, getCompanyValues);

module.exports = router;