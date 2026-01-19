const pool = require("../config/database");

class VideoRepository {
  async countByPlayerId(playerId) {
    const result = await pool.query(
      "SELECT COUNT(*) FROM videos WHERE player_id = $1",
      [playerId],
    );
    return parseInt(result.rows[0].count);
  }

  async create(data) {
    const result = await pool.query(
      `INSERT INTO videos (player_id, title, description, video_url, 
        cloudinary_id, duration, file_size)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        data.player_id,
        data.title,
        data.description,
        data.video_url,
        data.cloudinary_id,
        data.duration,
        data.file_size,
      ],
    );
    return result.rows[0];
  }

  async findByPlayerId(playerId) {
    const result = await pool.query(
      `SELECT v.*, p.user_id, u.full_name 
       FROM videos v JOIN players p ON v.player_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE v.player_id = $1 ORDER BY v.created_at DESC`,
      [playerId],
    );
    return result.rows;
  }

  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT v.* FROM videos v JOIN players p ON v.player_id = p.id
       WHERE p.user_id = $1 ORDER BY v.created_at DESC`,
      [userId],
    );
    return result.rows;
  }

  async findById(videoId) {
    const result = await pool.query(
      `SELECT v.*, p.user_id FROM videos v 
       JOIN players p ON v.player_id = p.id WHERE v.id = $1`,
      [videoId],
    );
    return result.rows[0] || null;
  }

  async update(videoId, data) {
    const result = await pool.query(
      `UPDATE videos SET title = $1, description = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [data.title, data.description, videoId],
    );
    return result.rows[0] || null;
  }

  async delete(videoId) {
    await pool.query("DELETE FROM videos WHERE id = $1", [videoId]);
  }
}

module.exports = new VideoRepository();
