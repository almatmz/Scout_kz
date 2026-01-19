const Joi = require("joi");

module.exports = {
  registerSchema: Joi.object({
    phone: Joi.string()
      .pattern(/^\+7\d{10}$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid("player", "parent", "coach", "scout")
      .default("player"),
    full_name: Joi.string().min(2).max(100).required(),
  }),
  loginSchema: Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
  }),
  updateProfileSchema: Joi.object({
    full_name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    organization: Joi.string().max(255).allow("", null).optional(),
    city: Joi.string().max(100).allow("", null).optional(),
    bio: Joi.string().max(1000).allow("", null).optional(),
  }),
};
