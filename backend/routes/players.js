const express = require("express");
const Joi = require("joi");
const pool = require("../config/database");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

const playerProfileSchema = Joi.object({
  age: Joi.number().integer().min(10).max(35).required(),
  city: Joi.string().min(2).max(50).required(),
  position: Joi.string()
    .valid("Вратарь", "Защитник", "Полузащитник", "Нападающий")
    .required(),
  height: Joi.number().min(140).max(220).required(),
  weight: Joi.number().min(40).max(150).required(),
  preferred_foot: Joi.string().valid("Левая", "Правая", "Обе").required(),
  experience_years: Joi.number().integer().min(0).max(25).default(0),
  club: Joi.string().max(100).allow("", null),
  bio: Joi.string().max(500).allow("", null),
});

// Create or update player profile
router.post("/profile", auth, async (req, res) => {
  try {
    const { error, value } = playerProfileSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userId = req.user.id;

    // Check if profile exists
    const existing = await pool.query(
      "SELECT id FROM players WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Update existing profile
      const result = await pool.query(
        `
        UPDATE players SET 
          age = $1, city = $2, position = $3, height = $4, weight = $5, 
          preferred_foot = $6, experience_years = $7, club = $8, bio = $9, updated_at = NOW()
        WHERE user_id = $10 
        RETURNING *
      `,
        [
          value.age,
          value.city,
          value.position,
          value.height,
          value.weight,
          value.preferred_foot,
          value.experience_years,
          value.club,
          value.bio,
          userId,
        ]
      );

      res.json({ message: "Профиль обновлен", profile: result.rows[0] });
    } else {
      // Create new profile
      const result = await pool.query(
        `
        INSERT INTO players (
          user_id, age, city, position, height, weight, preferred_foot, 
          experience_years, club, bio
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
      `,
        [
          userId,
          value.age,
          value.city,
          value.position,
          value.height,
          value.weight,
          value.preferred_foot,
          value.experience_years,
          value.club,
          value.bio,
        ]
      );

      res
        .status(201)
        .json({ message: "Профиль создан", profile: result.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get player profile
router.get("/profile", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT p.*, u.full_name, u.phone 
      FROM players p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = $1
    `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Профиль не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get all players (for scouts/coaches)
router.get(
  "/",
  auth,
  authorize("scout", "coach", "admin"),
  async (req, res) => {
    try {
      const {
        city,
        position,
        age_min,
        age_max,
        page = 1,
        limit = 20,
      } = req.query;

      let query = `
      SELECT p.*, u.full_name, 
        COALESCE(AVG(r.overall_rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
      FROM players p 
      JOIN users u ON p.user_id = u.id 
      LEFT JOIN ratings r ON p.id = r.player_id
      WHERE 1=1
    `;
      const params = [];
      let paramCount = 0;

      if (city) {
        paramCount++;
        query += ` AND p.city ILIKE $${paramCount}`;
        params.push(`%${city}%`);
      }

      if (position) {
        paramCount++;
        query += ` AND p.position = $${paramCount}`;
        params.push(position);
      }

      if (age_min) {
        paramCount++;
        query += ` AND p.age >= $${paramCount}`;
        params.push(parseInt(age_min));
      }

      if (age_max) {
        paramCount++;
        query += ` AND p.age <= $${paramCount}`;
        params.push(parseInt(age_max));
      }

      query += ` GROUP BY p.id, u.full_name ORDER BY avg_rating DESC, p.created_at DESC`;

      const offset = (page - 1) * limit;
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
);

// Get specific player by ID
router.get(
  "/:id",
  auth,
  authorize("scout", "coach", "admin"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
      SELECT p.*, u.full_name, u.phone,
        COALESCE(AVG(r.overall_rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
      FROM players p 
      JOIN users u ON p.user_id = u.id 
      LEFT JOIN ratings r ON p.id = r.player_id
      WHERE p.id = $1
      GROUP BY p.id, u.full_name, u.phone
    `,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Игрок не найден" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
);

module.exports = router;
