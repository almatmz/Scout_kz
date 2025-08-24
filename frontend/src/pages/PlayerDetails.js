import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Star, Play, MessageSquare } from "lucide-react";

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [videos, setVideos] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    speed: 5,
    dribbling: 5,
    passing: 5,
    shooting: 5,
    defending: 5,
    overall_rating: 5,
    comments: "",
  });
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchPlayerData();
  }, [id]);

  const fetchPlayerData = async () => {
    try {
      const [playerRes, videosRes, ratingsRes] = await Promise.all([
        api.get(`/players/${id}`),
        api.get(`/videos/player/${id}`),
        api.get(`/ratings/player/${id}`),
      ]);

      setPlayer(playerRes.data);
      setVideos(videosRes.data);
      setRatings(ratingsRes.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      toast.error("Ошибка загрузки данных игрока");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm((prev) => ({
      ...prev,
      [name]: name === "comments" ? value : parseInt(value),
    }));
  };

  const submitRating = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);

    try {
      await api.post("/ratings", {
        player_id: parseInt(id),
        ...ratingForm,
      });

      toast.success("Оценка сохранена!");
      setShowRatingForm(false);
      setRatingForm({
        speed: 5,
        dribbling: 5,
        passing: 5,
        shooting: 5,
        defending: 5,
        overall_rating: 5,
        comments: "",
      });
      fetchPlayerData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка сохранения оценки");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Игрок не найден</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Player Info */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {player.full_name}
                </h1>
                <p className="text-xl text-gray-600 mt-1">{player.position}</p>
                <div className="flex items-center mt-2">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="text-lg font-medium">
                    {player.avg_rating > 0
                      ? `${player.avg_rating}/10`
                      : "Нет оценок"}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({player.rating_count} оценок)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowRatingForm(true)}
                className="btn-primary"
              >
                Оценить игрока
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Возраст:</span>
                  <span className="ml-2 font-medium">{player.age} лет</span>
                </div>
                <div>
                  <span className="text-gray-600">Город:</span>
                  <span className="ml-2 font-medium">{player.city}</span>
                </div>
                <div>
                  <span className="text-gray-600">Рост:</span>
                  <span className="ml-2 font-medium">{player.height} см</span>
                </div>
                <div>
                  <span className="text-gray-600">Вес:</span>
                  <span className="ml-2 font-medium">{player.weight} кг</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Предпочитаемая нога:</span>
                  <span className="ml-2 font-medium">
                    {player.preferred_foot}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Опыт:</span>
                  <span className="ml-2 font-medium">
                    {player.experience_years} лет
                  </span>
                </div>
                {player.club && (
                  <div>
                    <span className="text-gray-600">Текущий клуб:</span>
                    <span className="ml-2 font-medium">{player.club}</span>
                  </div>
                )}
              </div>
            </div>

            {player.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-2">О игроке:</h3>
                <p className="text-gray-700">{player.bio}</p>
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Видео</h2>

            {videos.length > 0 ? (
              <div className="grid gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        {video.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Смотреть
                      </a>
                    </div>
                    <p className="text-xs text-gray-500">
                      Загружено:{" "}
                      {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Видео не загружены</p>
            )}
          </div>
        </div>

        {/* Ratings Sidebar */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Оценки</h2>

          {ratings.length > 0 ? (
            <div className="space-y-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{rating.rater_name}</p>
                      <p className="text-xs text-gray-500">
                        {rating.rater_role}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-600">
                        {rating.overall_rating}/10
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>Скорость: {rating.speed}/10</div>
                    <div>Дриблинг: {rating.dribbling}/10</div>
                    <div>Передачи: {rating.passing}/10</div>
                    <div>Удары: {rating.shooting}/10</div>
                    <div className="col-span-2">
                      Защита: {rating.defending}/10
                    </div>
                  </div>

                  {rating.comments && (
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-start">
                        <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <p className="text-sm text-gray-700 italic">
                          "{rating.comments}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Оценок пока нет</p>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Оценить {player.full_name}
              </h3>

              <form onSubmit={submitRating} className="space-y-4">
                {["speed", "dribbling", "passing", "shooting", "defending"].map(
                  (skill) => (
                    <div key={skill}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {skill === "speed" && "Скорость"}
                        {skill === "dribbling" && "Дриблинг"}
                        {skill === "passing" && "Передачи"}
                        {skill === "shooting" && "Удары"}
                        {skill === "defending" && "Защита"}: {ratingForm[skill]}
                        /10
                      </label>
                      <input
                        type="range"
                        name={skill}
                        min="1"
                        max="10"
                        value={ratingForm[skill]}
                        onChange={handleRatingChange}
                        className="w-full"
                      />
                    </div>
                  )
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Общая оценка: {ratingForm.overall_rating}/10
                  </label>
                  <input
                    type="range"
                    name="overall_rating"
                    min="1"
                    max="10"
                    value={ratingForm.overall_rating}
                    onChange={handleRatingChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Комментарий (необязательно)
                  </label>
                  <textarea
                    name="comments"
                    rows="3"
                    className="input-field"
                    value={ratingForm.comments}
                    onChange={handleRatingChange}
                    placeholder="Ваши наблюдения и рекомендации..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submittingRating ? "Сохранение..." : "Сохранить оценку"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRatingForm(false)}
                    className="btn-secondary"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetails;
