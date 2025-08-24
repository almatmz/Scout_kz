const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const pool = require("../config/database");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads (disk storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // папка "uploads" должна существовать
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

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
      // удаляем файл, если профиль не найден
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Сначала создайте профиль игрока" });
    }

    const playerId = playerCheck.rows[0].id;

    // Check video limit (2 videos per player)
    const videoCount = await pool.query(
      "SELECT COUNT(*) FROM videos WHERE player_id = $1",
      [playerId]
    );
    if (parseInt(videoCount.rows[0].count) >= 2) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Максимум 2 видео на игрока" });
    }

    // Upload to Cloudinary with stream
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

      fs.createReadStream(req.file.path).pipe(uploadStream);
    });

    // Удаляем временный файл после загрузки
    fs.unlinkSync(req.file.path);

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
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // удаляем файл, если ошибка
    }
    res.status(500).json({ error: "Ошибка при загрузке видео" });
  }
});

// Get user's videos
router.get("/my-videos", auth, async (req, res) => {
  try {
    const playerResult = await pool.query(
      "SELECT id FROM players WHERE user_id = $1",
      [req.user.id]
    );
    if (playerResult.rows.length === 0) {
      return res.json([]);
    }

    const result = await pool.query(
      `SELECT * FROM videos WHERE player_id = $1 ORDER BY created_at DESC`,
      [playerResult.rows[0].id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Get videos by player ID (for scouts/coaches)
router.get("/player/:playerId", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT v.*, p.user_id, u.full_name 
      FROM videos v
      JOIN players p ON v.player_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE v.player_id = $1
      ORDER BY v.created_at DESC
    `,
      [req.params.playerId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Delete video
router.delete("/:id", auth, async (req, res) => {
  try {
    const videoResult = await pool.query(
      `
      SELECT v.*, p.user_id 
      FROM videos v 
      JOIN players p ON v.player_id = p.id 
      WHERE v.id = $1
    `,
      [req.params.id]
    );

    if (videoResult.rows.length === 0) {
      return res.status(404).json({ error: "Видео не найдено" });
    }

    const video = videoResult.rows[0];

    // Check ownership
    if (video.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    // Delete from Cloudinary
    if (video.cloudinary_id) {
      await cloudinary.uploader.destroy(video.cloudinary_id, {
        resource_type: "video",
      });
    }

    // Delete from database
    await pool.query("DELETE FROM videos WHERE id = $1", [req.params.id]);

    res.json({ message: "Видео удалено" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
