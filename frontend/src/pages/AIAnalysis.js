import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock, Target, Zap, Shield, Activity } from 'lucide-react';

const AIAnalysis = () => {
  const { videoId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalysisResults();
  }, [videoId]);

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ai-analysis/video/${videoId}/results`);
      
      if (response.data.success) {
        setAnalysis(response.data.data);
      } else {
        setAnalysis(null);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Ошибка при загрузке результатов анализа');
      }
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async () => {
    try {
      setAnalyzing(true);
      const response = await api.post(`/ai-analysis/video/${videoId}`);
      
      if (response.data.success) {
        setAnalysis(response.data.data);
        toast.success('Анализ видео завершен!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка при анализе видео');
    } finally {
      setAnalyzing(false);
    }
  };

  const renderOverview = () => {
    if (!analysis?.analysis) return null;

    const { overall, confidence } = analysis.analysis;
    
    return (
      <div className="space-y-6">
        {/* Общая оценка */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Общая оценка</h3>
              <div className="text-4xl font-bold">{overall?.rating || 0}/10</div>
              <div className="text-sm opacity-90 mt-1">Потенциал: {overall?.potential || 0}/10</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Уверенность анализа</div>
              <div className="text-2xl font-semibold">{confidence}%</div>
            </div>
          </div>
        </div>

        {/* Рекомендуемые позиции */}
        {overall?.position_suitability && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-blue-500" size={20} />
              Рекомендуемые позиции
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {overall.position_suitability.map((pos, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="font-medium">{pos.position}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {pos.match_percentage}% соответствие
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pos.match_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Сильные стороны */}
        {analysis.analysis.strengths && analysis.analysis.strengths.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 text-green-500" size={20} />
              Сильные стороны
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">{strength.skill}</div>
                    <div className="text-sm text-green-600">{strength.level}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{strength.rating}/10</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Зоны роста */}
        {analysis.analysis.weaknesses && analysis.analysis.weaknesses.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="mr-2 text-orange-500" size={20} />
              Зоны роста
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.analysis.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium text-orange-800">{weakness.skill}</div>
                    <div className="text-sm text-orange-600">Приоритет: {weakness.priority}</div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">{weakness.rating}/10</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTechnicalSkills = () => {
    if (!analysis?.analysis?.technical) return null;

    const skills = analysis.analysis.technical;
    const skillIcons = {
      speed: Zap,
      dribbling: Activity,
      passing: Target,
      shooting: Zap,
      defending: Shield
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Технические навыки</h3>
          <div className="space-y-4">
            {Object.entries(skills).map(([skill, value]) => {
              const Icon = skillIcons[skill] || Activity;
              const skillNames = {
                speed: 'Скорость',
                dribbling: 'Дриблинг',
                passing: 'Пас',
                shooting: 'Удар',
                defending: 'Защита'
              };
              
              return (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="mr-2 text-blue-500" size={18} />
                      <span className="font-medium">{skillNames[skill] || skill}</span>
                    </div>
                    <span className="font-bold text-lg">{value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        value >= 8 ? 'bg-green-500' : 
                        value >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPhysicalAttributes = () => {
    if (!analysis?.analysis?.physical) return null;

    const physical = analysis.analysis.physical;
    const physicalIcons = {
      stamina: Activity,
      agility: Zap,
      strength: Shield
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">Физические атрибуты</h3>
          <div className="space-y-4">
            {Object.entries(physical).map(([attr, value]) => {
              if (attr === 'age') return null;
              
              const Icon = physicalIcons[attr] || Activity;
              const attrNames = {
                stamina: 'Выносливость',
                agility: 'Ловкость',
                strength: 'Сила'
              };
              
              return (
                <div key={attr} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="mr-2 text-purple-500" size={18} />
                      <span className="font-medium">{attrNames[attr] || attr}</span>
                    </div>
                    <span className="font-bold text-lg">{value}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        value >= 8 ? 'bg-green-500' : 
                        value >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!analysis?.analysis?.recommendations) return null;

    const recommendations = analysis.analysis.recommendations;
    const typeIcons = {
      improvement: AlertCircle,
      development: TrendingUp,
      position: Target
    };

    const typeColors = {
      improvement: 'orange',
      development: 'blue',
      position: 'green'
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Brain className="mr-2 text-purple-500" size={20} />
            Рекомендации по развитию
          </h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const Icon = typeIcons[rec.type] || Brain;
              const color = typeColors[rec.type] || 'gray';
              
              return (
                <div key={index} className={`border-l-4 border-${color}-500 bg-${color}-50 p-4 rounded-r-lg`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Icon className={`mr-2 text-${color}-600`} size={18} />
                        <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1" size={14} />
                        <span>Время: {rec.estimated_time}</span>
                        <span className="mx-2">•</span>
                        <span className={`font-medium text-${color}-600`}>
                          Приоритет: {rec.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Brain },
    { id: 'technical', label: 'Техника', icon: Target },
    { id: 'physical', label: 'Физика', icon: Activity },
    { id: 'recommendations', label: 'Рекомендации', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка анализа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ИИ-Анализ видео</h1>
          <p className="text-gray-600">Умная оценка футбольных навыков с помощью искусственного интеллекта</p>
        </div>

        {!analysis ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <Brain className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Анализ еще не выполнен</h3>
            <p className="text-gray-600 mb-6">
              Запустите ИИ-анализ для получения детальной оценки технических и физических навыков
            </p>
            <button
              onClick={startAnalysis}
              disabled={analyzing}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Анализируем видео...
                </>
              ) : (
                'Запустить ИИ-анализ'
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="mr-2" size={16} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'technical' && renderTechnicalSkills()}
              {activeTab === 'physical' && renderPhysicalAttributes()}
              {activeTab === 'recommendations' && renderRecommendations()}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={startAnalysis}
                disabled={analyzing}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {analyzing ? 'Анализируем...' : 'Повторить анализ'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
