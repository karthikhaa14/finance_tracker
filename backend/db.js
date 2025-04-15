// config/db.js
const { Pool } = require('pg');
require('dotenv').config();


// Connection string format: 
// postgres://username:password@host:port/database
const connectionString = process.env.DB_CONNECTION_STRING;
const pool = new Pool({
  connectionString,
});


module.exports = pool;