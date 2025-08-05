require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kudos API!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});