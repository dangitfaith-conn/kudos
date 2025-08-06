const db = require('../config/database');

/**
 * @desc    Get approved transactions for the public feed
 * @route   GET /api/transactions
 * @access  Private
 */
const getApprovedTransactions = async (req, res) => {
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
      WHERE t.status = 'approved'
      ORDER BY t.created_at DESC
      LIMIT 50;
    `;
    const [transactions] = await db.query(query);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching approved transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create a new Kudo transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res) => {
  const { recipientId, amount, valueId, message } = req.body;
  const senderId = req.user.id;

  // --- Input Validation & Parsing ---
  if (!recipientId || !amount || !valueId) {
    return res.status(400).json({ message: 'Recipient, amount, and value are required.' });
  }

  const parsedAmount = parseFloat(amount, 10);
  const parsedRecipientId = parseInt(recipientId, 10);


  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }

  if (senderId === parsedRecipientId) {
    return res.status(400).json({ message: 'You cannot give kudos to yourself.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    
    const [senderRows] = await connection.query('SELECT award_balance FROM users WHERE id = ? FOR UPDATE', [senderId]);
    const sender = senderRows[0];

    if (!sender || sender.award_balance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: 'Insufficient award balance.' });
    }

    // Decrement sender's balance
    await connection.query('UPDATE users SET award_balance = award_balance - ? WHERE id = ?', [parsedAmount, senderId]);


    // Create the new transaction recrod 
    const insertQuery = `
        INSERT INTO transactions
            (sender_id, recipient_id, value_id, amount, message, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertValues = [senderId, parsedRecipientId, valueId, parsedAmount, message, 'pending'];
    await connection.query(insertQuery, insertValues);

    await connection.commit();
    res.status(201).json({ message: 'Kudo successfully submitted for approval!' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transaction creation failed:', error);
    res.status(500).json({ message: 'Server error during transaction.' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getApprovedTransactions, createTransaction };
