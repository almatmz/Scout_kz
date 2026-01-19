const authService = require("../services/auth.service");
const userRepository = require("../repositories/user.repository");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} = require("../validators/auth.schema");
const { NotFoundError } = require("../utils/errors");

class AuthController {
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await authService.register(value);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await authService.login(value.identifier, value.password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) throw new NotFoundError("Пользователь не найден");
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const updated = await userRepository.updateProfile(req.user.id, value);
      if (!updated) throw new NotFoundError("Пользователь не найден");
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
