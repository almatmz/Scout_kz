const pool = require("../config/database");

class PlayerRepository {
  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT p.*, u.full_name, u.phone 
       FROM players p JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [userId],
    );
    return result.rows[0] || null;
  }

  async findById(playerId) {
    const result = await pool.query(
      `SELECT p.*, u.full_name, u.phone,
        COALESCE(AVG(r.overall_rating), 0) as avg_rating,
        COUNT(r.id) as rating_count
       FROM players p 
       JOIN users u ON p.user_id = u.id 
       LEFT JOIN ratings r ON p.id = r.player_id
       WHERE p.id = $1
       GROUP BY p.id, u.full_name, u.phone`,
      [playerId],
    );
    return result.rows[0] || null;
  }

  async create(userId, data) {
    const result = await pool.query(
      `INSERT INTO players (user_id, age, city, position, height, weight, 
        preferred_foot, experience_years, club, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        data.age,
        data.city,
        data.position,
        data.height,
        data.weight,
        data.preferred_foot,
        data.experience_years,
        data.club,
        data.bio,
      ],
    );
    return result.rows[0];
  }

  async update(userId, data) {
    const result = await pool.query(
      `UPDATE players SET age = $1, city = $2, position = $3, height = $4, 
        weight = $5, preferred_foot = $6, experience_years = $7, club = $8, 
        bio = $9, updated_at = NOW()
       WHERE user_id = $10 RETURNING *`,
      [
        data.age,
        data.city,
        data.position,
        data.height,
        data.weight,
        data.preferred_foot,
        data.experience_years,
        data.club,
        data.bio,
        userId,
      ],
    );
    return result.rows[0] || null;
  }

  async findAll(filters) {
    const { city, position, age_min, age_max, page = 1, limit = 20 } = filters;
    let query = `
      SELECT p.*, u.full_name, 
        COALESCE(AVG(r.overall_rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as rating_count
      FROM players p 
      JOIN users u ON p.user_id = u.id 
      LEFT JOIN ratings r ON p.id = r.player_id WHERE 1=1`;

    const params = [];
    let paramCount = 0;

    if (city) {
      params.push(`%${city}%`);
      query += ` AND p.city ILIKE $${++paramCount}`;
    }
    if (position) {
      params.push(position);
      query += ` AND p.position = $${++paramCount}`;
    }
    if (age_min) {
      params.push(parseInt(age_min));
      query += ` AND p.age >= $${++paramCount}`;
    }
    if (age_max) {
      params.push(parseInt(age_max));
      query += ` AND p.age <= $${++paramCount}`;
    }

    query += ` GROUP BY p.id, u.full_name ORDER BY avg_rating DESC, p.created_at DESC`;

    const validLimit = Math.min(parseInt(limit) || 20, 100);
    const offset = (Math.max(parseInt(page) || 1, 1) - 1) * validLimit;

    params.push(validLimit, offset);
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getStats(userId) {
    const profileResult = await pool.query(
      "SELECT id FROM players WHERE user_id = $1",
      [userId],
    );

    if (profileResult.rows.length === 0) {
      return {
        profileCompleted: false,
        videosCount: 0,
        averageRating: null,
        ratingsCount: 0,
      };
    }

    const playerId = profileResult.rows[0].id;
    const [videosResult, ratingsResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM videos WHERE player_id = $1", [
        playerId,
      ]),
      pool.query(
        "SELECT COUNT(*) AS count, AVG(overall_rating) AS avg FROM ratings WHERE player_id = $1",
        [playerId],
      ),
    ]);

    return {
      profileCompleted: true,
      videosCount: parseInt(videosResult.rows[0].count, 10),
      ratingsCount: parseInt(ratingsResult.rows[0].count || 0, 10),
      averageRating: ratingsResult.rows[0].avg
        ? Number(ratingsResult.rows[0].avg).toFixed(1)
        : null,
    };
  }
}

module.exports = new PlayerRepository();
