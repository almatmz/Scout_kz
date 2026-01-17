const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");
const pool = require("../config/database");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Константы для лимитов
const MAX_VIDEOS = 5;
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage (no disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
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
      [req.user.id],
    );
    if (playerCheck.rows.length === 0) {
      return res.status(400).json({ error: "Сначала создайте профиль игрока" });
    }

    const playerId = playerCheck.rows[0].id;

    // Check video limit (5 videos per player)
    const videoCount = await pool.query(
      "SELECT COUNT(*) FROM videos WHERE player_id = $1",
      [playerId],
    );
    if (parseInt(videoCount.rows[0].count) >= MAX_VIDEOS) {
      return res
        .status(400)
        .json({ error: `Максимум ${MAX_VIDEOS} видео на игрока` });
    }

    // Upload to Cloudinary directly from memory buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "scout-kz/videos",
          // Переносим обработку в асинхронный режим
          eager: [{ quality: "auto:good", format: "mp4" }],
          eager_async: true, // Это решает вашу ошибку
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
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
      ],
    );

    res.status(201).json({
      message: "Видео успешно загружено",
      video: videoRecord.rows[0],
    });
  } catch (error) {
    console.error("FULL ERROR:", error); // Посмотри это в терминале сервера
    res
      .status(500)
      .json({ error: error.message || "Ошибка при загрузке видео" });
  }
});

// Get user's videos
router.get("/my-videos", auth, async (req, res) => {
  try {
    const playerResult = await pool.query(
      "SELECT id FROM players WHERE user_id = $1",
      [req.user.id],
    );
    if (playerResult.rows.length === 0) {
      return res.json([]);
    }

    const result = await pool.query(
      "SELECT * FROM videos WHERE player_id = $1 ORDER BY created_at DESC",
      [playerResult.rows[0].id],
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
      SELECT v.*,p.user_id,u.full_name 
      FROM videos v
      JOIN players p ON v.player_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE v.player_id = $1
      ORDER BY v.created_at DESC
      `,
      [req.params.playerId],
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
      SELECT v.*, p. user_id 
      FROM videos v 
      JOIN players p ON v.player_id = p.id 
      WHERE v.id = $1
      `,
      [req.params.id],
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

// Update video title/description (only owner or admin)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const videoId = parseInt(req.params.id);
    if (isNaN(videoId)) {
      return res.status(400).json({ error: "Неверный ID видео" });
    }

    const videoResult = await pool.query(
      `
      SELECT v.*, p.user_id 
      FROM videos v 
      JOIN players p ON v.player_id = p.id 
      WHERE v.id = $1
      `,
      [videoId],
    );

    if (videoResult.rows.length === 0) {
      return res.status(404).json({ error: "Видео не найдено" });
    }

    const video = videoResult.rows[0];

    if (video.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    const newTitle = title !== undefined ? title : video.title;
    const newDescription =
      description !== undefined ? description : video.description;

    const updated = await pool.query(
      `
      UPDATE videos
      SET title = $1,
          description = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [newTitle, newDescription, videoId],
    );

    res.json({ message: "Видео обновлено", video: updated.rows[0] });
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
