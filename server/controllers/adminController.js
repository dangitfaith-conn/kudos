const db = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * @desc    Get all pending transactions for moderation
 * @route   GET /api/admin/transactions/pending
 * @access  Private/Admin
 */
const getPendingTransactions = async (req, res) => {
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
      ORDER BY t.created_at ASC;
    `;
    const [transactions] = await db.query(query);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Approve a pending transaction
 * @route   POST /api/admin/transactions/:transactionId/approve
 * @access  Private/Admin
 */
const approveTransaction = async (req, res) => {
  const { transactionId } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Find the transaction and lock it to prevent race conditions
    const [rows] = await connection.query("SELECT * FROM transactions WHERE id = ? AND status = 'pending' FOR UPDATE", [transactionId]);
    const transaction = rows[0];

    if (!transaction) {
      await connection.rollback();
      return res.status(404).json({ message: 'Pending transaction not found.' });
    }

    // 2. Update transaction status to 'approved'
    await connection.query("UPDATE transactions SET status = 'approved' WHERE id = ?", [transactionId]);

    // 3. Increment recipient's spending_balance
    await connection.query('UPDATE users SET spending_balance = spending_balance + ? WHERE id = ?', [transaction.amount, transaction.recipient_id]);

    await connection.commit();
    res.json({ message: 'Transaction approved successfully.' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error approving transaction:', error);
    res.status(500).json({ message: 'Server error during transaction approval.' });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * @desc    Deny a pending transaction
 * @route   POST /api/admin/transactions/:transactionId/deny
 * @access  Private/Admin
 */
const denyTransaction = async (req, res) => {
  const { transactionId } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Find the transaction and lock it
    const [rows] = await connection.query("SELECT * FROM transactions WHERE id = ? AND status = 'pending' FOR UPDATE", [transactionId]);
    const transaction = rows[0];

    if (!transaction) {
      await connection.rollback();
      return res.status(404).json({ message: 'Pending transaction not found.' });
    }

    // 2. Update transaction status to 'denied'
    await connection.query("UPDATE transactions SET status = 'denied' WHERE id = ?", [transactionId]);

    // 3. Return credits to sender's award_balance
    await connection.query('UPDATE users SET award_balance = award_balance + ? WHERE id = ?', [transaction.amount, transaction.sender_id]);

    await connection.commit();
    res.json({ message: 'Transaction denied successfully.' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error denying transaction:', error);
    res.status(500).json({ message: 'Server error during transaction denial.' });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * @desc    Create a new user
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
const createUser = async (req, res) => {
  const { email, password, fullName, isAdmin } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, password, and full name are required.' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, full_name, is_admin) VALUES (?, ?, ?, ?)',
      [email, passwordHash, fullName, !!isAdmin]
    );

    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error while creating user.' });
  }
};

/**
 * @desc    Manually award credits to a user
 * @route   POST /api/admin/users/:userId/award
 * @access  Private/Admin
 */
const awardCredits = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  const parsedAmount = parseInt(amount, 10);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'A valid positive amount is required.' });
  }

  try {
    const [result] = await db.query('UPDATE users SET award_balance = award_balance + ? WHERE id = ?', [parsedAmount, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: `Successfully awarded ${parsedAmount} credits.` });
  } catch (error) {
    console.error('Error awarding credits:', error);
    res.status(500).json({ message: 'Server error while awarding credits.' });
  }
};

module.exports = {
  getPendingTransactions,
  approveTransaction,
  denyTransaction,
  createUser,
  awardCredits,
};
