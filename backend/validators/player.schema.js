const Joi = require("joi");
const { POSITIONS, PREFERRED_FOOT } = require("../utils/constants");

module.exports = {
  playerProfileSchema: Joi.object({
    age: Joi.number().integer().min(10).max(35).required(),
    city: Joi.string().min(2).max(50).required(),
    position: Joi.string()
      .valid(...POSITIONS)
      .required(),
    height: Joi.number().min(140).max(220).required(),
    weight: Joi.number().min(40).max(150).required(),
    preferred_foot: Joi.string()
      .valid(...PREFERRED_FOOT)
      .required(),
    experience_years: Joi.number().integer().min(0).max(25).default(0),
    club: Joi.string().max(100).allow("", null).optional(),
    bio: Joi.string().max(500).allow("", null).optional(),
  }),
};
