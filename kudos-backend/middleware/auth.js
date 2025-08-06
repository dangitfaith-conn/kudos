// /Users/jonchun/Workspace/kudos/kudos-backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
    // The token is expected to be in the 'Authorization' header, formatted as 'Bearer TOKEN'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // No token was provided
        return res.status(401).json({ message: 'Access token is required' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            // The token is invalid (e.g., expired or tampered with)
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        // The token is valid. Attach the decoded user payload to the request object.
        req.user = user;
        next(); // Proceed to the actual route handler
    });
}

function isAdmin(req, res, next) {
    // This middleware should run *after* authenticateToken,
    // so we can rely on `req.user` being present.
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed.
    } else {
        res.status(403).json({ message: 'Forbidden: Requires admin privileges' });
    }
}

module.exports = {
    authenticateToken,
    isAdmin,
};