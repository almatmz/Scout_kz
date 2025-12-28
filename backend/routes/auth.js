const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const pool = require("../config/database");

const router = express.Router();

/**
 * Validation schemas
 */

// Registration: now supports email
const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+7\d{10}$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("player", "parent", "coach", "scout")
    .default("player"),
  full_name: Joi.string().min(2).max(100).required(),
});

// Login: identifier can be phone OR email
const loginSchema = Joi.object({
  identifier: Joi.string().required(), // phone or email
  password: Joi.string().required(),
});

/**
 * Helper functions
 */

// Find user by phone or email, based on identifier
async function findUserByIdentifier(identifier) {
  // if looks like email
  if (identifier.includes("@")) {
    const byEmail = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [identifier]
    );
    return byEmail.rows[0] || null;
  }

  // otherwise treat as phone (trim spaces)
  const phone = identifier.trim();
  const byPhone = await pool.query("SELECT * FROM users WHERE phone = $1", [
    phone,
  ]);
  return byPhone.rows[0] || null;
}

/**
 * Register
 */
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { phone, email, password, role, full_name } = value;

    // Check if user exists by phone
    const existingByPhone = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );
    if (existingByPhone.rows.length > 0) {
      return res.status(400).json({
        error: "Пользователь с таким номером уже существует",
      });
    }

    // Check if user exists by email
    const existingByEmail = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    if (existingByEmail.rows.length > 0) {
      return res.status(400).json({
        error: "Пользователь с таким email уже существует",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await pool.query(
      `
      INSERT INTO users (phone, email, password, role, full_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, phone, email, role, full_name, created_at
    `,
      [phone, email, hashedPassword, role, full_name]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * Login (phone or email)
 */
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { identifier, password } = value;

    // ---- HERE is the logic you asked about ----
    const user = await findUserByIdentifier(identifier);
    // -------------------------------------------

    if (!user) {
      return res
        .status(400)
        .json({ error: "Неверный номер телефона / email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Неверный номер телефона / email или пароль" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
