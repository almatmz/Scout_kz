const Joi = require("joi");

module.exports = {
  ratingSchema: Joi.object({
    player_id: Joi.number().integer().required(),
    speed: Joi.number().min(1).max(10).required(),
    dribbling: Joi.number().min(1).max(10).required(),
    passing: Joi.number().min(1).max(10).required(),
    shooting: Joi.number().min(1).max(10).required(),
    defending: Joi.number().min(1).max(10).required(),
    overall_rating: Joi.number().min(1).max(10).required(),
    comments: Joi.string().max(500).allow("", null).optional(),
  }),
};
