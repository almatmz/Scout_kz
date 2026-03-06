const { Pool } = require("pg");
require("dotenv").config(); // Перенесли наверх

const isProduction = process.env.NODE_ENV === "production";
const isSupabase =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("supabase");

console.log(
  "Connecting with URL:",
  process.env.DATABASE_URL ? "URL found" : "URL NOT FOUND",
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase требует SSL. Локальная база в докере обычно нет.
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

module.exports = pool;
