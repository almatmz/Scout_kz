const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const pool = require("../config/database");

const router = express.Router();

const registerSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\+7\d{10}$/)
    .required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid("player", "parent", "coach", "scout")
    .default("player"),
  full_name: Joi.string().min(2).max(100).required(),
});

const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password, role, full_name } = value;

    // Check if user exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Пользователь с таким номером уже существует" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (phone, password, role, full_name) VALUES ($1, $2, $3, $4) RETURNING id, phone, role, full_name, created_at",
      [phone, hashedPassword, role, full_name]
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
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password } = value;

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "Неверный номер телефона или пароль" });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Неверный номер телефона или пароль" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        full_name: user.full_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
