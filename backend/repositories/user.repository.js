const pool = require("../config/database");

class UserRepository {
  async findById(id) {
    const result = await pool.query(
      `SELECT id, phone, email, full_name, role, organization, city, bio, created_at
       FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0] || null;
  }

  async findByPhone(phone) {
    const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
      [email],
    );
    return result.rows[0] || null;
  }

  async findByIdentifier(identifier) {
    return identifier.includes("@")
      ? this.findByEmail(identifier)
      : this.findByPhone(identifier.trim());
  }

  async create(userData) {
    const { phone, email, password, role, full_name } = userData;
    const result = await pool.query(
      `INSERT INTO users (phone, email, password, role, full_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, phone, email, role, full_name, created_at`,
      [phone, email, password, role, full_name],
    );
    return result.rows[0];
  }

  async updateProfile(userId, profileData) {
    const { full_name, email, organization, city, bio } = profileData;
    const result = await pool.query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           email = COALESCE($2, email),
           organization = $3, city = $4, bio = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, phone, email, full_name, role, organization, city, bio`,
      [
        full_name,
        email,
        organization || null,
        city || null,
        bio || null,
        userId,
      ],
    );
    return result.rows[0] || null;
  }
}

module.exports = new UserRepository();
