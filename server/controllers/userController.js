const db = require('../config/database');

/**
 * @desc    Get user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    // The user ID is available from the `protect` middleware
    const userId = req.user.id;

    // Fetch user from DB, explicitly selecting fields to avoid sending password hash
    const [rows] = await db.query(
      'SELECT id, email, full_name, award_balance, spending_balance, is_admin FROM users WHERE id = ?',
      [userId]
    );

    const user = rows[0];

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Get all users for selection
 * @route   GET /api/users
 * @access  Private
 */
const getAllUsers = async (req, res) => {
    try {
    // Fetch all users, selecting only necessary fields for the dropdown.
    // Excludes the current user from the list to prevent self-awarding.
    const [users] = await db.query(
        'SELECT id, full_name FROM users WHERE id != ? ORDER BY full_name ASC',
        [req.user.id]
    );
    res.json(users);
    } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, getAllUsers };
