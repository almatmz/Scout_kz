const playerService = require("../services/player.service");
const { playerProfileSchema } = require("../validators/player.schema");

class PlayerController {
  async createOrUpdateProfile(req, res, next) {
    try {
      const { error, value } = playerProfileSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await playerService.createOrUpdateProfile(
        req.user.id,
        value,
      );
      res.status(result.isNew ? 201 : 200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await playerService.getProfile(req.user.id);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async getAllPlayers(req, res, next) {
    try {
      const players = await playerService.getPlayers(req.query);
      res.json(players);
    } catch (err) {
      next(err);
    }
  }

  async getPlayerById(req, res, next) {
    try {
      const player = await playerService.getPlayerById(req.params.id);
      res.json(player);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await playerService.getStats(req.user.id);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PlayerController();
