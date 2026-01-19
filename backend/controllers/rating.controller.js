const ratingService = require("../services/rating.service");
const { ratingSchema } = require("../validators/rating.schema");

class RatingController {
  async createOrUpdateRating(req, res, next) {
    try {
      const { error, value } = ratingSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await ratingService.createOrUpdateRating(
        req.user.id,
        value,
      );
      res.status(result.isNew ? 201 : 200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPlayerRatings(req, res, next) {
    try {
      const ratings = await ratingService.getPlayerRatings(req.params.playerId);
      res.json(ratings);
    } catch (err) {
      next(err);
    }
  }

  async getMyRatings(req, res, next) {
    try {
      const ratings = await ratingService.getMyRatings(req.user.id);
      res.json(ratings);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RatingController();
