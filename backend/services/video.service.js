const videoRepository = require("../repositories/video.repository");
const playerRepository = require("../repositories/player.repository");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const { MAX_VIDEOS } = require("../utils/constants");

class VideoService {
  async uploadVideo(userId, file, title, description) {
    if (!file) throw new ValidationError("Видео файл обязателен");

    const player = await playerRepository.findByUserId(userId);
    if (!player) throw new ValidationError("Сначала создайте профиль игрока");

    const videoCount = await videoRepository.countByPlayerId(player.id);
    if (videoCount >= MAX_VIDEOS) {
      throw new ValidationError(`Максимум ${MAX_VIDEOS} видео на игрока`);
    }

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "scout-kz/videos",
          eager: [{ quality: "auto:good", format: "mp4" }],
          eager_async: true,
        },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    return videoRepository.create({
      player_id: player.id,
      title: title || "Видео",
      description: description || "",
      video_url: cloudinaryResult.secure_url,
      cloudinary_id: cloudinaryResult.public_id,
      duration: cloudinaryResult.duration || 0,
      file_size: cloudinaryResult.bytes || 0,
    });
  }

  async getMyVideos(userId) {
    return videoRepository.findByUserId(userId);
  }

  async getPlayerVideos(playerId) {
    return videoRepository.findByPlayerId(playerId);
  }

  async updateVideo(videoId, userId, userRole, updateData) {
    const video = await videoRepository.findById(videoId);
    if (!video) throw new NotFoundError("Видео не найдено");
    if (video.user_id !== userId && userRole !== "admin") {
      throw new ForbiddenError("Доступ запрещен");
    }
    return videoRepository.update(videoId, updateData);
  }

  async deleteVideo(videoId, userId, userRole) {
    const video = await videoRepository.findById(videoId);
    if (!video) throw new NotFoundError("Видео не найдено");
    if (video.user_id !== userId && userRole !== "admin") {
      throw new ForbiddenError("Доступ запрещен");
    }

    if (video.cloudinary_id) {
      await cloudinary.uploader.destroy(video.cloudinary_id, {
        resource_type: "video",
      });
    }
    await videoRepository.delete(videoId);
  }
}

module.exports = new VideoService();
