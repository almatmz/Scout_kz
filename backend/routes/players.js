const express = require("express");
const playerController = require("../controllers/player.controller");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/profile",
  auth,
  playerController.createOrUpdateProfile.bind(playerController),
);
router.get(
  "/profile",
  auth,
  playerController.getProfile.bind(playerController),
);
router.get("/me/stats", auth, playerController.getStats.bind(playerController));
router.get(
  "/",
  auth,
  authorize("scout", "coach", "admin"),
  playerController.getAllPlayers.bind(playerController),
);
router.get(
  "/:id",
  auth,
  authorize("scout", "coach", "admin"),
  playerController.getPlayerById.bind(playerController),
);

module.exports = router;
