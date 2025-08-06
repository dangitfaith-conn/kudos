// /Users/jonchun/Workspace/kudos/kudos-backend/db.js

const mysql = require('mysql2/promise');
const config = require('./config');

// Create a connection pool. Using a pool is more efficient than creating a
// new connection for every single query. The `promise()` wrapper allows us
// to use modern async/await syntax instead of callbacks.
const pool = mysql.createPool(config.db);

// We export the pool. It will be used in other parts of our application
// to run queries on the database.
module.exports = pool;