const express = require('express');
const router = express.Router();
const aiAnalysisController = require('../controllers/aiAnalysis.controller');

/**
 * @route   POST /api/ai-analysis/video/:videoId
 * @desc    Запустить ИИ-анализ видео
 * @access  Private (Player only)
 */
router.post('/video/:videoId', aiAnalysisController.analyzeVideo);

/**
 * @route   GET /api/ai-analysis/video/:videoId/results
 * @desc    Получить результаты анализа видео
 * @access  Private (Player, Scout, Coach)
 */
router.get('/video/:videoId/results', aiAnalysisController.getAnalysisResults);

/**
 * @route   GET /api/ai-analysis/player/:playerId/summary
 * @desc    Получить сводный анализ всех видео игрока
 * @access  Private (Player, Scout, Coach)
 */
router.get('/player/:playerId/summary', aiAnalysisController.getPlayerAnalysisSummary);

/**
 * @route   GET /api/ai-analysis/player/:playerId/progress
 * @desc    Получить прогресс игрока во времени
 * @access  Private (Player, Scout, Coach)
 */
router.get('/player/:playerId/progress', aiAnalysisController.getPlayerProgress);

/**
 * @route   GET /api/ai-analysis/compare/:videoId1/:videoId2
 * @desc    Сравнить два видео одного игрока
 * @access  Private (Player only)
 */
router.get('/compare/:videoId1/:videoId2', aiAnalysisController.compareVideos);

module.exports = router;
