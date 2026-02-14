const aiAnalysisService = require('../services/aiAnalysis.service');

class AIAnalysisController {
  /**
   * Запускает ИИ-анализ видео
   */
  async analyzeVideo(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;

      // Запускаем ИИ-анализ
      const analysis = await aiAnalysisService.analyzeVideo('mock-video-url', {});

      res.status(200).json({
        success: true,
        message: 'Анализ видео завершен',
        data: analysis
      });

    } catch (error) {
      console.error('AI Analysis Controller Error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при анализе видео',
        error: error.message
      });
    }
  }

  /**
   * Получает результаты анализа видео
   */
  async getAnalysisResults(req, res) {
    try {
      const { videoId } = req.params;

      // Mock данные для демонстрации
      const mockAnalysis = {
        analysis: {
          technical: {
            speed: 7.5,
            dribbling: 8.2,
            passing: 7.8,
            shooting: 6.9,
            defending: 6.5
          },
          physical: {
            stamina: 7.0,
            agility: 8.1,
            strength: 6.8
          },
          overall: {
            rating: 7.4,
            potential: 8.9,
            position_suitability: [
              { position: 'Нападающий', suitability: 85, match_percentage: 85 },
              { position: 'Полузащитник', suitability: 75, match_percentage: 75 }
            ]
          },
          strengths: [
            { skill: 'Дриблинг', rating: 8.2, level: 'Хорошо' },
            { skill: 'Ловкость', rating: 8.1, level: 'Хорошо' }
          ],
          weaknesses: [
            { skill: 'Защита', rating: 6.5, priority: 'Средний' }
          ],
          recommendations: [
            {
              type: 'improvement',
              priority: 'Средний',
              title: 'Улучшить защиту',
              description: 'Тактические упражнения, работа в парах, перехваты',
              estimated_time: '3-6 месяцев'
            }
          ],
          confidence: 78
        }
      };

      res.status(200).json({
        success: true,
        data: mockAnalysis
      });

    } catch (error) {
      console.error('Get Analysis Results Error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении результатов анализа',
        error: error.message
      });
    }
  }

  /**
   * Получает сводный анализ всех видео игрока
   */
  async getPlayerAnalysisSummary(req, res) {
    try {
      const { playerId } = req.params;

      const mockSummary = {
        videosAnalyzed: 3,
        summary: {
          technical: {
            speed: 7.2,
            dribbling: 7.8,
            passing: 7.5,
            shooting: 7.0,
            defending: 6.8
          },
          physical: {
            stamina: 7.1,
            agility: 7.9,
            strength: 6.9
          },
          overall: {
            rating: 7.3,
            videosAnalyzed: 3
          },
          commonStrengths: [
            { name: 'Дриблинг', frequency: 3, percentage: 100 }
          ],
          commonWeaknesses: [
            { name: 'Защита', frequency: 2, percentage: 67 }
          ],
          confidence: 75
        }
      };

      res.status(200).json({
        success: true,
        data: mockSummary
      });

    } catch (error) {
      console.error('Get Player Analysis Summary Error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении сводного анализа',
        error: error.message
      });
    }
  }

  /**
   * Сравнивает два видео игрока
   */
  async compareVideos(req, res) {
    try {
      const { videoId1, videoId2 } = req.params;

      const mockComparison = {
        video1: {
          id: videoId1,
          title: 'Видео 1',
          analysis: { overall: { rating: 7.0 } }
        },
        video2: {
          id: videoId2,
          title: 'Видео 2',
          analysis: { overall: { rating: 7.8 } }
        },
        differences: {
          overall: {
            video1: 7.0,
            video2: 7.8,
            difference: 0.8
          }
        }
      };

      res.status(200).json({
        success: true,
        data: mockComparison
      });

    } catch (error) {
      console.error('Compare Videos Error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при сравнении видео',
        error: error.message
      });
    }
  }

  /**
   * Получает прогресс игрока во времени
   */
  async getPlayerProgress(req, res) {
    try {
      const { playerId } = req.params;

      const mockProgress = {
        progressData: [
          {
            date: '2024-01-01',
            overallRating: 6.5,
            potential: 8.0
          },
          {
            date: '2024-02-01',
            overallRating: 7.0,
            potential: 8.5
          },
          {
            date: '2024-03-01',
            overallRating: 7.3,
            potential: 8.9
          }
        ],
        analysis: {
          trend: 'improving',
          overallImprovement: 0.8,
          potentialChange: 0.9,
          timeSpan: {
            start: '2024-01-01',
            end: '2024-03-01',
            days: 60
          },
          recommendations: [
            {
              type: 'positive',
              priority: 'medium',
              title: 'Отличный прогресс в скорости',
              description: 'Улучшение на 0.8 баллов. Продолжайте в том же духе!'
            }
          ]
        }
      };

      res.status(200).json({
        success: true,
        data: mockProgress
      });

    } catch (error) {
      console.error('Get Player Progress Error:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении прогресса игрока',
        error: error.message
      });
    }
  }
}

module.exports = new AIAnalysisController();
