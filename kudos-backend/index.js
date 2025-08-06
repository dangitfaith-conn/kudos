// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Import our database connection
const authRoutes = require('./routes/auth'); // Import our new auth routes
const userRoutes = require('./routes/users'); // Import our new user routes
const transactionRoutes = require('./routes/transactions'); // Import transaction routes
const valueRoutes = require('./routes/values'); // Import value routes

const app = express();
const port = 3001; // Use 3001 to avoid conflict with React's default 3000

// Enable CORS for all routes, allowing our frontend to make requests.
app.use(cors());

// Middleware to parse JSON bodies. This is how we get `req.body`.
app.use(bodyParser.json());

// We make this an `async` function to use `await` inside
app.get('/api', async (req, res) => {
    try {
        // Run a simple query to get the current time from the database
        const [results] = await db.query('SELECT NOW() as now');
        res.json({
            message: 'Kudos API server is connected to the database!',
            db_time: results[0].now,
        });
    } catch (err) {
        console.error('Database query failed:', err);
        res.status(500).send('Error connecting to the database');
    }
});

// Tell our app to use the auth routes for any request starting with /api/auth
app.use('/api/auth', authRoutes);

// Tell our app to use the user routes for any request starting with /api/users
app.use('/api/users', userRoutes);

// Tell our app to use the transaction routes
app.use('/api/transactions', transactionRoutes);

// Tell our app to use the value routes
app.use('/api/values', valueRoutes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
