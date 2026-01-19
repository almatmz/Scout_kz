const express = require("express");
const ratingController = require("../controllers/rating.controller");
const { auth, authorize } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  auth,
  authorize("scout", "coach"),
  ratingController.createOrUpdateRating.bind(ratingController),
);
router.get(
  "/player/:playerId",
  auth,
  ratingController.getPlayerRatings.bind(ratingController),
);
router.get(
  "/my-ratings",
  auth,
  authorize("scout", "coach"),
  ratingController.getMyRatings.bind(ratingController),
);

module.exports = router;
