const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { require: true, rejectUnauthorized: false }
      : false,
});

module.exports = pool;
