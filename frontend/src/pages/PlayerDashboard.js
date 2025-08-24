import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { User, Upload, Play, Star } from "lucide-react";

const PlayerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, videosRes] = await Promise.all([
        api.get("/players/profile"),
        api.get("/videos/my-videos"),
      ]);

      setProfile(profileRes.data);
      setVideos(videosRes.data);

      if (profileRes.data?.id) {
        const ratingsRes = await api.get(
          `/ratings/player/${profileRes.data.id}`
        );
        setRatings(ratingsRes.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.overall_rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Добро пожаловать, {user.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">Управляй своим профилем и видео</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Stats */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Профиль</p>
                  <p className="text-xl font-semibold">
                    {profile ? "Заполнен" : "Не заполнен"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Play className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Видео</p>
                  <p className="text-xl font-semibold">{videos.length}/2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Средний рейтинг</p>
                  <p className="text-xl font-semibold">{avgRating}/10</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Оценки</p>
                  <p className="text-xl font-semibold">{ratings.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Профиль игрока</h2>
              <Link to="/profile" className="btn-primary">
                {profile ? "Редактировать" : "Создать профиль"}
              </Link>
            </div>

            {profile ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Возраст</p>
                  <p className="font-medium">{profile.age} лет</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Город</p>
                  <p className="font-medium">{profile.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Позиция</p>
                  <p className="font-medium">{profile.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Рост/Вес</p>
                  <p className="font-medium">
                    {profile.height}см / {profile.weight}кг
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Предпочитаемая нога</p>
                  <p className="font-medium">{profile.preferred_foot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Опыт</p>
                  <p className="font-medium">{profile.experience_years} лет</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Создайте профиль, чтобы начать</p>
            )}
          </div>

          {/* Videos Section */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Мои видео</h2>
              <Link to="/upload-video" className="btn-primary">
                Загрузить видео
              </Link>
            </div>

            {videos.length > 0 ? (
              <div className="grid gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {video.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Загружено:{" "}
                          {new Date(video.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm"
                      >
                        Смотреть
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Видео не загружены</p>
            )}
          </div>
        </div>

        {/* Ratings Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Последние оценки</h2>

          {ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.slice(0, 5).map((rating) => (
                <div key={rating.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{rating.rater_name}</p>
                      <p className="text-xs text-gray-500">
                        {rating.rater_role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {rating.overall_rating}/10
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Скорость: {rating.speed}/10</div>
                    <div>Дриблинг: {rating.dribbling}/10</div>
                    <div>Передачи: {rating.passing}/10</div>
                    <div>Удары: {rating.shooting}/10</div>
                    <div>Защита: {rating.defending}/10</div>
                  </div>

                  {rating.comments && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{rating.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Оценок пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
