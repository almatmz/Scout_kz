const playerRepository = require("../repositories/player.repository");
const { NotFoundError, ForbiddenError } = require("../utils/errors");

class PlayerService {
  async createOrUpdateProfile(userId, profileData) {
    const existing = await playerRepository.findByUserId(userId);

    if (existing) {
      const updated = await playerRepository.update(userId, profileData);
      return { message: "Профиль обновлен", profile: updated };
    }

    const created = await playerRepository.create(userId, profileData);
    return { message: "Профиль создан", profile: created, isNew: true };
  }

  async getProfile(userId) {
    const profile = await playerRepository.findByUserId(userId);
    if (!profile) throw new NotFoundError("Профиль не найден");
    return profile;
  }

  async getPlayers(filters) {
    return playerRepository.findAll(filters);
  }

  async getPlayerById(playerId) {
    const player = await playerRepository.findById(playerId);
    if (!player) throw new NotFoundError("Игрок не найден");
    return player;
  }

  async getStats(userId) {
    return playerRepository.getStats(userId);
  }
}

module.exports = new PlayerService();
