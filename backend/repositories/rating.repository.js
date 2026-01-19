const pool = require("../config/database");

class RatingRepository {
  async findExisting(playerId, raterId) {
    const result = await pool.query(
      "SELECT id FROM ratings WHERE player_id = $1 AND rater_id = $2",
      [playerId, raterId],
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const result = await pool.query(
      `INSERT INTO ratings (player_id, rater_id, speed, dribbling, passing, 
        shooting, defending, overall_rating, comments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        data.player_id,
        data.rater_id,
        data.speed,
        data.dribbling,
        data.passing,
        data.shooting,
        data.defending,
        data.overall_rating,
        data.comments,
      ],
    );
    return result.rows[0];
  }

  async update(playerId, raterId, data) {
    const result = await pool.query(
      `UPDATE ratings SET speed = $1, dribbling = $2, passing = $3, shooting = $4,
        defending = $5, overall_rating = $6, comments = $7, updated_at = NOW()
       WHERE player_id = $8 AND rater_id = $9 RETURNING *`,
      [
        data.speed,
        data.dribbling,
        data.passing,
        data.shooting,
        data.defending,
        data.overall_rating,
        data.comments,
        playerId,
        raterId,
      ],
    );
    return result.rows[0] || null;
  }

  async findByPlayerId(playerId) {
    const result = await pool.query(
      `SELECT r.*, u.full_name as rater_name, u.role as rater_role
       FROM ratings r JOIN users u ON r.rater_id = u.id
       WHERE r.player_id = $1 ORDER BY r.created_at DESC`,
      [playerId],
    );
    return result.rows;
  }

  async findByRaterId(raterId) {
    const result = await pool.query(
      `SELECT r.*, p.id as player_id, u.full_name as player_name, p.position, p.city
       FROM ratings r JOIN players p ON r.player_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE r.rater_id = $1 ORDER BY r.created_at DESC`,
      [raterId],
    );
    return result.rows;
  }
}

module.exports = new RatingRepository();
