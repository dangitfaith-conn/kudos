require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
const authRoutes = require('./routes/auth');
app.use(cors());
app.use(express.json()); // for parsing application/json

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kudos API!' });
});

// API Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
