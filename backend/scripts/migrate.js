const pool = require("../config/database");

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'player' CHECK (role IN ('player', 'parent', 'coach', 'scout', 'admin')),
        full_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Players table
    await pool.query(`
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
    `);

    // Videos table
    await pool.query(`
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
    `);

    // Ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        rater_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        speed INTEGER CHECK (speed >= 1 AND speed <= 10),
        dribbling INTEGER CHECK (dribbling >= 1 AND dribbling <= 10),
        passing INTEGER CHECK (passing >= 1 AND passing <= 10),
        shooting INTEGER CHECK (shooting >= 1 AND shooting <= 10),
        defending INTEGER CHECK (defending >= 1 AND defending <= 10),
        overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(player_id, rater_id)
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
      CREATE INDEX IF NOT EXISTS idx_players_city ON players(city);
      CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
      CREATE INDEX IF NOT EXISTS idx_videos_player_id ON videos(player_id);
      CREATE INDEX IF NOT EXISTS idx_ratings_player_id ON ratings(player_id);
      CREATE INDEX IF NOT EXISTS idx_ratings_rater_id ON ratings(rater_id);
    `);

    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    process.exit();
  }
};

createTables();
