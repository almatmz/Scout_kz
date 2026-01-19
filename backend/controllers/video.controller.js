const videoService = require("../services/video.service");
const { videoUpdateSchema } = require("../validators/video.schema");

class VideoController {
  async uploadVideo(req, res, next) {
    try {
      const { title, description } = req.body;
      const video = await videoService.uploadVideo(
        req.user.id,
        req.file,
        title,
        description,
      );
      res.status(201).json({ message: "Видео успешно загружено", video });
    } catch (err) {
      next(err);
    }
  }

  async getMyVideos(req, res, next) {
    try {
      const videos = await videoService.getMyVideos(req.user.id);
      res.json(videos);
    } catch (err) {
      next(err);
    }
  }

  async getPlayerVideos(req, res, next) {
    try {
      const videos = await videoService.getPlayerVideos(req.params.playerId);
      res.json(videos);
    } catch (err) {
      next(err);
    }
  }

  async updateVideo(req, res, next) {
    try {
      const { error, value } = videoUpdateSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ error: "Неверный ID видео" });
      }

      const updated = await videoService.updateVideo(
        videoId,
        req.user.id,
        req.user.role,
        value,
      );
      res.json({ message: "Видео обновлено", video: updated });
    } catch (err) {
      next(err);
    }
  }

  async deleteVideo(req, res, next) {
    try {
      await videoService.deleteVideo(req.params.id, req.user.id, req.user.role);
      res.json({ message: "Видео удалено" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new VideoController();
