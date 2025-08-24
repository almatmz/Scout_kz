const express = require("express");
const Joi = require("joi");
const pool = require("../config/database");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

const ratingSchema = Joi.object({
  player_id: Joi.number().integer().required(),
  speed: Joi.number().min(1).max(10).required(),
  dribbling: Joi.number().min(1).max(10).required(),
  passing: Joi.number().min(1).max(10).required(),
  shooting: Joi.number().min(1).max(10).required(),
  defending: Joi.number().min(1).max(10).required(),
  overall_rating: Joi.number().min(1).max(10).required(),
  comments: Joi.string().max(500).allow("", null),
});

// Create rating (scouts/coaches only)
router.post("/", auth, authorize("scout", "coach"), async (req, res) => {
  try {
    const { error, value } = ratingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const {
      player_id,
      speed,
      dribbling,
      passing,
      shooting,
      defending,
      overall_rating,
      comments,
    } = value;

    // Check if player exists
    const playerCheck = await pool.query(
      "SELECT id FROM players WHERE id = $1",
      [player_id]
    );
    if (playerCheck.rows.length === 0) {
      return res.status(404).json({ error: "Игрок не найден" });
    }

    // Check if already rated by this scout/coach
    const existingRating = await pool.query(
      "SELECT id FROM ratings WHERE player_id = $1 AND rater_id = $2",
      [player_id, req.user.id]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      const result = await pool.query(
        `
        UPDATE ratings SET 
          speed = $1, dribbling = $2, passing = $3, shooting = $4, defending = $5,
          overall_rating = $6, comments = $7, updated_at = NOW()
        WHERE player_id = $8 AND rater_id = $9
        RETURNING *
      `,
        [
          speed,
          dribbling,
          passing,
          shooting,
          defending,
          overall_rating,
          comments,
          player_id,
          req.user.id,
        ]
      );

      res.json({ message: "Оценка обновлена", rating: result.rows[0] });
    } else {
      // Create new rating
      const result = await pool.query(
        `
        INSERT INTO ratings (
          player_id, rater_id, speed, dribbling, passing, shooting, defending, overall_rating, comments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
        [
          player_id,
          req.user.id,
          speed,
          dribbling,
          passing,
          shooting,
          defending,
          overall_rating,
          comments,
        ]
      );

      res
        .status(201)
        .json({ message: "Оценка создана", rating: result.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get ratings for a player
router.get("/player/:playerId", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT r.*, u.full_name as rater_name, u.role as rater_role
      FROM ratings r
      JOIN users u ON r.rater_id = u.id
      WHERE r.player_id = $1
      ORDER BY r.created_at DESC
    `,
      [req.params.playerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get my ratings (what I've given)
router.get(
  "/my-ratings",
  auth,
  authorize("scout", "coach"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
      SELECT r.*, p.id as player_id, u.full_name as player_name, p.position, p.city
      FROM ratings r
      JOIN players p ON r.player_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE r.rater_id = $1
      ORDER BY r.created_at DESC
    `,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
);

module.exports = router;
