const ratingRepository = require("../repositories/rating.repository");
const playerRepository = require("../repositories/player.repository");
const { NotFoundError } = require("../utils/errors");

class RatingService {
  async createOrUpdateRating(raterId, ratingData) {
    const { player_id } = ratingData;

    const player = await playerRepository.findById(player_id);
    if (!player) throw new NotFoundError("Игрок не найден");

    const existing = await ratingRepository.findExisting(player_id, raterId);

    if (existing) {
      const updated = await ratingRepository.update(
        player_id,
        raterId,
        ratingData,
      );
      return { message: "Оценка обновлена", rating: updated };
    }

    const created = await ratingRepository.create({
      ...ratingData,
      rater_id: raterId,
    });
    return { message: "Оценка создана", rating: created, isNew: true };
  }

  async getPlayerRatings(playerId) {
    return ratingRepository.findByPlayerId(playerId);
  }

  async getMyRatings(raterId) {
    return ratingRepository.findByRaterId(raterId);
  }
}

module.exports = new RatingService();
