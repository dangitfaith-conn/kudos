// /Users/jonchun/Workspace/kudos/kudos-backend/config.js

// This file will hold our application's configuration.
// For now, it's just database credentials.

module.exports = {
    db: {
        host: '127.0.0.1', // Or 'localhost'
        user: 'jchun', // <-- Replace with your MySQL username
        password: 'testpassword', // <-- Replace with your MySQL password
        database: 'kudos_db', // The database you created
    },
    jwt: {
        secret: 'aVerySecretAndLongKeyThatYouShouldChange', // A secret key for signing JWTs
    },
};