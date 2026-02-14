const Joi = require('joi');

const validateAnalysisRequest = (req, res, next) => {
  const schema = Joi.object({
    // В будущем можно добавить опции анализа
    analysisType: Joi.string().valid('full', 'technical', 'physical').default('full'),
    includeRecommendations: Joi.boolean().default(true),
    compareWithPrevious: Joi.boolean().default(false)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации',
      details: error.details[0].message
    });
  }

  next();
};

const validateVideoComparison = (req, res, next) => {
  const schema = Joi.object({
    videoId1: Joi.string().uuid().required(),
    videoId2: Joi.string().uuid().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации ID видео',
      details: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateAnalysisRequest,
  validateVideoComparison
};
