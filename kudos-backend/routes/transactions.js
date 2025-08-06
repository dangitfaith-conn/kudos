// /Users/jonchun/Workspace/kudos/kudos-backend/routes/transactions.js

const express = require('express');
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/transactions
// Creates a new Kudo transaction.
router.post('/', authenticateToken, async (req, res) => {
    const { recipient_id, value_id, amount, message } = req.body;
    const sender_id = req.user.userId;

    // --- Validation ---
    if (!recipient_id || !value_id || !amount) {
        return res.status(400).json({ message: 'Recipient, value, and amount are required.' });
    }

    if (sender_id === parseInt(recipient_id, 10)) {
        return res.status(400).json({ message: 'You cannot give Kudos to yourself.' });
    }

    if (parseInt(amount, 10) <= 0) {
        return res.status(400).json({ message: 'Kudos amount must be positive.' });
    }

    // --- Database Transaction ---
    let connection;
    try {
        // Get a connection from the pool
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Lock the sender's row and check their balance
        const [users] = await connection.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [sender_id]);
        const sender = users[0];

        if (sender.award_balance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient award balance.' });
        }

        // 2. Decrement the sender's award balance
        await connection.query('UPDATE users SET award_balance = award_balance - ? WHERE id = ?', [amount, sender_id]);

        // 3. Create the transaction record
        const transaction = { sender_id, recipient_id, value_id, amount, message };
        await connection.query('INSERT INTO transactions SET ?', transaction);

        // If all queries succeed, commit the transaction
        await connection.commit();

        res.status(201).json({ message: 'Kudo submitted successfully! It is now pending approval.' });

    } catch (error) {
        // If any query fails, roll back the entire transaction
        if (connection) await connection.rollback();
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // ALWAYS release the connection back to the pool
        if (connection) connection.release();
    }
});

// GET /api/transactions
// Retrieves a feed of all *approved* transactions for the global dashboard.
router.get('/', authenticateToken, async (req, res) => {
    try {
        // This query joins the transactions table with users (twice) and values
        // to get the full names of the sender/recipient and the company value name.
        const query = `
            SELECT
                t.id,
                t.amount,
                t.message,
                t.created_at,
                sender.full_name AS sender_name,
                recipient.full_name AS recipient_name,
                v.name AS value_name
            FROM transactions t
                     JOIN users sender ON t.sender_id = sender.id
                     JOIN users recipient ON t.recipient_id = recipient.id
                     JOIN \`values\` v ON t.value_id = v.id
            WHERE t.status = 'approved'
            ORDER BY t.created_at DESC
        `;
        const [transactions] = await db.query(query);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transaction feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to find and lock a pending transaction within a DB transaction.
// This reduces code duplication in the approve/deny routes.
async function findAndLockPendingTransaction(connection, transactionId) {
    const [transactions] = await connection.query('SELECT * FROM transactions WHERE id = ? AND status = "pending" FOR UPDATE', [transactionId]);
    if (transactions.length === 0) {
        return null;
    }
    return transactions[0];
}

// PATCH /api/transactions/:id/approve
// Approves a pending transaction. This is an admin-only route.
router.patch('/:id/approve', [authenticateToken, isAdmin], async (req, res) => {
    const { id } = req.params;
    const moderator_id = req.user.userId;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Find and lock the transaction using our helper
        const transaction = await findAndLockPendingTransaction(connection, id);
        if (!transaction) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pending transaction not found.' });
        }

        // 2. Update the transaction status to 'approved'
        await connection.query(
            'UPDATE transactions SET status = "approved", moderator_id = ?, moderation_timestamp = NOW() WHERE id = ?',
            [moderator_id, id]
        );

        // 3. Increment the recipient's spending_balance
        await connection.query(
            'UPDATE users SET spending_balance = spending_balance + ? WHERE id = ?',
            [transaction.amount, transaction.recipient_id]
        );

        // If all queries succeed, commit the transaction
        await connection.commit();

        res.json({ message: 'Transaction approved successfully.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error approving transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// PATCH /api/transactions/:id/deny
// Denies a pending transaction and refunds the sender. This is an admin-only route.
router.patch('/:id/deny', [authenticateToken, isAdmin], async (req, res) => {
    const { id } = req.params;
    const moderator_id = req.user.userId;
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Find and lock the transaction using our helper
        const transaction = await findAndLockPendingTransaction(connection, id);
        if (!transaction) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pending transaction not found.' });
        }

        // 2. Update the transaction status to 'denied'
        await connection.query(
            'UPDATE transactions SET status = "denied", moderator_id = ?, moderation_timestamp = NOW() WHERE id = ?',
            [moderator_id, id]
        );

        // 3. Refund the kudos amount to the sender's award_balance
        await connection.query(
            'UPDATE users SET award_balance = award_balance + ? WHERE id = ?',
            [transaction.amount, transaction.sender_id]
        );

        await connection.commit();

        res.json({ message: 'Transaction denied successfully.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error denying transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
});

// GET /api/transactions/pending
// Retrieves all pending transactions for the admin moderation queue.
router.get('/pending', [authenticateToken, isAdmin], async (req, res) => {
    try {
        const query = `
            SELECT
                t.id,
                t.amount,
                t.message,
                t.created_at,
                sender.full_name AS sender_name,
                recipient.full_name AS recipient_name,
                v.name AS value_name
            FROM transactions t
                     JOIN users sender ON t.sender_id = sender.id
                     JOIN users recipient ON t.recipient_id = recipient.id
                     JOIN \`values\` v ON t.value_id = v.id
            WHERE t.status = 'pending'
            ORDER BY t.created_at ASC
        `;
        const [transactions] = await db.query(query);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching pending transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;