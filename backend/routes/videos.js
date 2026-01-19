const express = require("express");
const videoController = require("../controllers/video.controller");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post(
  "/upload",
  auth,
  upload.single("video"),
  videoController.uploadVideo.bind(videoController),
);
router.get(
  "/my-videos",
  auth,
  videoController.getMyVideos.bind(videoController),
);
router.get(
  "/player/:playerId",
  auth,
  videoController.getPlayerVideos.bind(videoController),
);
router.put("/:id", auth, videoController.updateVideo.bind(videoController));
router.delete("/:id", auth, videoController.deleteVideo.bind(videoController));

module.exports = router;
