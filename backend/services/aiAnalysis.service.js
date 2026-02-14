// const cloudinary = require('cloudinary').v2;
// const axios = require('axios');

class AIAnalysisService {
  constructor() {
    // В реальном проекте здесь будет API ключ к ML сервису
    this.mlApiUrl = process.env.ML_API_URL || 'http://localhost:8000';
  }

  /**
   * Анализирует видео и возвращает оценку навыков футболиста
   * @param {string} videoUrl - URL видео из Cloudinary
   * @param {Object} playerInfo - Информация о игроке
   * @returns {Promise<Object>} - Результат анализа
   */
  async analyzeVideo(videoUrl, playerInfo = {}) {
    try {
      // 1. Извлекаем кадры из видео
      const frames = await this.extractFrames(videoUrl);
      
      // 2. Анализируем технические навыки
      const technicalSkills = await this.analyzeTechnicalSkills(frames);
      
      // 3. Анализируем физические показатели
      const physicalAttributes = await this.analyzePhysicalAttributes(frames, playerInfo);
      
      // 4. Определяем сильные и слабые стороны
      const analysis = this.generateAnalysis(technicalSkills, physicalAttributes);
      
      // 5. Создаем рекомендации
      const recommendations = this.generateRecommendations(analysis);

      return {
        success: true,
        analysis: {
          ...analysis,
          recommendations,
          confidence: this.calculateConfidence(technicalSkills, physicalAttributes),
          processedAt: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze video');
    }
  }

  /**
   * Извлечение ключевых кадров из видео
   */
  async extractFrames(videoUrl) {
    try {
      // В реальном проекте используем FFmpeg или Python OpenCV
      // Для MVP симулируем извлечение кадров
      
      // const response = await axios.post(`${this.mlApiUrl}/extract-frames`, {
      //   video_url: videoUrl,
      //   max_frames: 10
      // });

      // return response.data.frames || [];
      return this.simulateFrameExtraction(videoUrl);
    } catch (error) {
      // Fallback: симуляция для разработки
      return this.simulateFrameExtraction(videoUrl);
    }
  }

  /**
   * Анализ технических навыков через компьютерное зрение
   */
  async analyzeTechnicalSkills(frames) {
    try {
      // const response = await axios.post(`${this.mlApiUrl}/analyze-skills`, {
      //   frames: frames
      // });

      // return response.data.skills || this.getDefaultSkills();
      return this.simulateSkillAnalysis();
    } catch (error) {
      // Fallback: симуляция для разработки
      return this.simulateSkillAnalysis();
    }
  }

  /**
   * Анализ физических атрибутов
   */
  async analyzePhysicalAttributes(frames, playerInfo) {
    try {
      // const response = await axios.post(`${this.mlApiUrl}/analyze-physical`, {
      //   frames: frames,
      //   player_info: playerInfo
      // });

      // return response.data.physical || this.getDefaultPhysical();
      return this.simulatePhysicalAnalysis();
    } catch (error) {
      // Fallback: симуляция для разработки
      return this.simulatePhysicalAnalysis();
    }
  }

  /**
   * Генерация комплексного анализа
   */
  generateAnalysis(technicalSkills, physicalAttributes) {
    const overallRating = this.calculateOverallRating(technicalSkills, physicalAttributes);
    
    return {
      technical: technicalSkills,
      physical: physicalAttributes,
      overall: {
        rating: overallRating,
        potential: this.calculatePotential(technicalSkills, physicalAttributes),
        position_suitability: this.analyzePositionSuitability(technicalSkills, physicalAttributes)
      },
      strengths: this.identifyStrengths(technicalSkills, physicalAttributes),
      weaknesses: this.identifyWeaknesses(technicalSkills, physicalAttributes)
    };
  }

  /**
   * Расчет общей оценки
   */
  calculateOverallRating(technical, physical) {
    const weights = {
      speed: 0.15,
      dribbling: 0.20,
      passing: 0.15,
      shooting: 0.20,
      defending: 0.15,
      stamina: 0.10,
      agility: 0.05
    };

    const score = 
      technical.speed * weights.speed +
      technical.dribbling * weights.dribbling +
      technical.passing * weights.passing +
      technical.shooting * weights.shooting +
      technical.defending * weights.defending +
      physical.stamina * weights.stamina +
      physical.agility * weights.agility;

    return Math.round(score * 10) / 10;
  }

  /**
   * Расчет потенциала развития
   */
  calculatePotential(technical, physical) {
    const age = physical.age || 20;
    const currentRating = this.calculateOverallRating(technical, physical);
    
    // Модель потенциала учитывает возраст и текущий уровень
    let potentialMultiplier = 1.0;
    
    if (age <= 18) potentialMultiplier = 1.4;
    else if (age <= 21) potentialMultiplier = 1.25;
    else if (age <= 25) potentialMultiplier = 1.15;
    else if (age <= 30) potentialMultiplier = 1.05;
    
    const potential = Math.min(10, currentRating * potentialMultiplier);
    return Math.round(potential * 10) / 10;
  }

  /**
   * Анализ подходящих позиций
   */
  analyzePositionSuitability(technical, physical) {
    const positions = {
      'Нападающий': {
        required: ['shooting', 'speed', 'dribbling'],
        score: this.calculatePositionScore(technical, ['shooting', 'speed', 'dribbling'])
      },
      'Полузащитник': {
        required: ['passing', 'dribbling', 'stamina'],
        score: this.calculatePositionScore(technical, ['passing', 'dribbling'], physical, ['stamina'])
      },
      'Защитник': {
        required: ['defending', 'passing'],
        score: this.calculatePositionScore(technical, ['defending', 'passing'])
      },
      'Вратарь': {
        required: [], // Отдельная логика для вратарей
        score: 0
      }
    };

    return Object.entries(positions)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 3)
      .map(([name, data]) => ({
        position: name,
        suitability: Math.round(data.score * 10) / 10,
        match_percentage: Math.round(data.score * 10)
      }));
  }

  /**
   * Расчет соответствия позиции
   */
  calculatePositionScore(technical, techSkills, physical = {}, physSkills = []) {
    const techScore = techSkills.reduce((sum, skill) => sum + (technical[skill] || 0), 0) / techSkills.length;
    const physScore = physSkills.length > 0 
      ? physSkills.reduce((sum, skill) => sum + (physical[skill] || 0), 0) / physSkills.length 
      : 0;
    
    return (techScore + physScore) / (physSkills.length > 0 ? 2 : 1);
  }

  /**
   * Определение сильных сторон
   */
  identifyStrengths(technical, physical) {
    const allSkills = { ...technical, ...physical };
    const strengths = [];

    Object.entries(allSkills).forEach(([skill, value]) => {
      if (value >= 8) {
        strengths.push({
          skill: this.translateSkillName(skill),
          rating: value,
          level: value >= 9 ? 'Отлично' : 'Хорошо'
        });
      }
    });

    return strengths.sort((a, b) => b.rating - a.rating);
  }

  /**
   * Определение слабых сторон
   */
  identifyWeaknesses(technical, physical) {
    const allSkills = { ...technical, ...physical };
    const weaknesses = [];

    Object.entries(allSkills).forEach(([skill, value]) => {
      if (value <= 6) {
        weaknesses.push({
          skill: this.translateSkillName(skill),
          rating: value,
          priority: value <= 4 ? 'Высокий' : 'Средний'
        });
      }
    });

    return weaknesses.sort((a, b) => a.rating - b.rating);
  }

  /**
   * Генерация рекомендаций
   */
  generateRecommendations(analysis) {
    const recommendations = [];
    const { weaknesses, strengths, overall } = analysis;

    // Рекомендации на основе слабых сторон
    weaknesses.forEach(weakness => {
      recommendations.push({
        type: 'improvement',
        priority: weakness.priority,
        title: `Улучшить ${weakness.skill}`,
        description: this.getImprovementAdvice(weakness.skill),
        estimated_time: this.getImprovementTime(weakness.rating)
      });
    });

    // Рекомендации на основе сильных сторон
    strengths.slice(0, 2).forEach(strength => {
      recommendations.push({
        type: 'development',
        priority: 'Средний',
        title: `Развить ${strength.skill} дальше`,
        description: this.getDevelopmentAdvice(strength.skill),
        estimated_time: '3-6 месяцев'
      });
    });

    // Позиционные рекомендации
    if (overall.position_suitability.length > 0) {
      const bestPosition = overall.position_suitability[0];
      recommendations.push({
        type: 'position',
        priority: 'Высокий',
        title: `Фокус на позиции ${bestPosition.position}`,
        description: `Ваши навыки лучше всего подходят для игры на позиции ${bestPosition.position} (${bestPosition.match_percentage}% соответствия)`,
        estimated_time: 'Постоянно'
      });
    }

    return recommendations;
  }

  /**
   * Расчет уверенности в анализе
   */
  calculateConfidence(technical, physical) {
    // Уверенность зависит от качества данных и количества кадров
    const baseConfidence = 0.75;
    const dataQuality = 0.9; // В реальном проекте рассчитывается на основе качества видео
    
    return Math.round((baseConfidence + dataQuality) / 2 * 100);
  }

  // Helper методы
  translateSkillName(skill) {
    const translations = {
      speed: 'Скорость',
      dribbling: 'Дриблинг',
      passing: 'Пас',
      shooting: 'Удар',
      defending: 'Защита',
      stamina: 'Выносливость',
      agility: 'Ловкость',
      strength: 'Сила'
    };
    return translations[skill] || skill;
  }

  getImprovementAdvice(skill) {
    const advice = {
      'Скорость': 'Спринтерские тренировки, работа с утяжелениями, plyometrics',
      'Дриблинг': 'Упражнения с конусами, работа в ограниченном пространстве',
      'Пас': 'Тренировки точности паса, работа с обеими ногами',
      'Удар': 'Удары по воротам с разных позиций, работа над техникой',
      'Защита': 'Тактические упражнения, работа в парах, перехваты',
      'Выносливость': 'Кардио тренировки, интервальный бег',
      'Ловкость': 'Координационные упражнения, работа с лестницей',
      'Сила': 'Силовые тренировки, работа с весом'
    };
    return advice[skill] || 'Индивидуальные тренировки с тренером';
  }

  getDevelopmentAdvice(skill) {
    return `Продолжайте развивать ${skill} через специализированные упражнения и игровую практику`;
  }

  getImprovementTime(rating) {
    if (rating <= 4) return '6-12 месяцев';
    if (rating <= 6) return '3-6 месяцев';
    return '1-3 месяца';
  }

  // Fallback методы для разработки
  simulateFrameExtraction(videoUrl) {
    return Array(10).fill(null).map((_, i) => ({
      frame_id: i,
      timestamp: i * 3,
      url: `${videoUrl}#frame=${i}`
    }));
  }

  simulateSkillAnalysis() {
    return {
      speed: 7 + Math.random() * 2,
      dribbling: 6 + Math.random() * 3,
      passing: 7 + Math.random() * 2,
      shooting: 6 + Math.random() * 3,
      defending: 5 + Math.random() * 3
    };
  }

  simulatePhysicalAnalysis() {
    return {
      stamina: 6 + Math.random() * 3,
      agility: 6 + Math.random() * 3,
      strength: 5 + Math.random() * 4,
      age: 16 + Math.floor(Math.random() * 10)
    };
  }

  getDefaultSkills() {
    return {
      speed: 5.0,
      dribbling: 5.0,
      passing: 5.0,
      shooting: 5.0,
      defending: 5.0
    };
  }

  getDefaultPhysical() {
    return {
      stamina: 5.0,
      agility: 5.0,
      strength: 5.0,
      age: 20
    };
  }
}

module.exports = new AIAnalysisService();
