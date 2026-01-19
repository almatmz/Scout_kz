const pool = require("../config/database");

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'parent', 'coach', 'scout', 'admin')),
        full_name VARCHAR(100) NOT NULL,
        organization VARCHAR(100),
        city VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        age INTEGER NOT NULL,
        city VARCHAR(50) NOT NULL,
        position VARCHAR(20) NOT NULL,
        height INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        preferred_foot VARCHAR(10) NOT NULL,
        experience_years INTEGER DEFAULT 0,
        club VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        video_url VARCHAR(500) NOT NULL,
        cloudinary_id VARCHAR(200),
        duration INTEGER DEFAULT 0,
        file_size BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        speed INTEGER CHECK (speed BETWEEN 1 AND 10),
        dribbling INTEGER CHECK (dribbling BETWEEN 1 AND 10),
        passing INTEGER CHECK (passing BETWEEN 1 AND 10),
        shooting INTEGER CHECK (shooting BETWEEN 1 AND 10),
        defending INTEGER CHECK (defending BETWEEN 1 AND 10),
        overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 10),
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, rater_id)
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_players_city_pos ON players(city, position);
    `);
    console.log("Database initialized");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    process.exit();
  }
};

createTables();
