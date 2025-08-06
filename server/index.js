require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');


app.use(cors());
app.use(express.json()); // for parsing application/json

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kudos API!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
