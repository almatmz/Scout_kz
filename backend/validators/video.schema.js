const Joi = require("joi");

module.exports = {
  videoUpdateSchema: Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).allow("", null).optional(),
  }),
};
