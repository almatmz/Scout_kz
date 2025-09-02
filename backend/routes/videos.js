const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const pool = require("../config/database");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage (no local uploads folder)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

// Upload video
router.post("/upload", auth, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Видео файл обязателен" });
    }

    const { title, description } = req.body;

    // Check if user has a player profile
    const playerCheck = await pool.query(
      "SELECT id FROM players WHERE user_id = $1",
      [req.user.id]
    );
    if (playerCheck.rows.length === 0) {
      return res.status(400).json({ error: "Сначала создайте профиль игрока" });
    }

    const playerId = playerCheck.rows[0].id;

    // Check video limit
    const videoCount = await pool.query(
      "SELECT COUNT(*) FROM videos WHERE player_id = $1",
      [playerId]
    );
    if (parseInt(videoCount.rows[0].count) >= 2) {
      return res.status(400).json({ error: "Максимум 2 видео на игрока" });
    }

    // Upload to Cloudinary directly from memory
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "scout-kz/videos",
          quality: "auto:good",
          format: "mp4",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    // Save to database
    const videoRecord = await pool.query(
      `
      INSERT INTO videos (player_id, title, description, video_url, cloudinary_id, duration, file_size)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        playerId,
        title || "Видео",
        description || "",
        result.secure_url,
        result.public_id,
        result.duration || 0,
        result.bytes || 0,
      ]
    );

    res.status(201).json({
      message: "Видео успешно загружено",
      video: videoRecord.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при загрузке видео" });
  }
});
