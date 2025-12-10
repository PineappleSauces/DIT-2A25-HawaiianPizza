const { Pool } = require('pg');
require('dotenv').config({
  path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
