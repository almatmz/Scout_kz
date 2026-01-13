import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Star, Play, MessageSquare, ArrowLeft, User } from "lucide-react";

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [videos, setVideos] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setLoading(true);
      setError(null);

      const [playerRes, videosRes, ratingsRes] = await Promise.all([
        api.get(`/players/${id}`),
        api.get(`/videos/player/${id}`),
        api.get(`/ratings/player/${id}`),
      ]);

      setPlayer(playerRes.data);
      setVideos(videosRes.data);
      setRatings(ratingsRes.data);
    } catch (err) {
      console.error("Error fetching player data:", err);
      setError(err.response?.data?.error || "Ошибка загрузки данных игрока");
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
      fetchPlayerData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Ошибка сохранения оценки");
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatRating = (rating) => {
    if (!rating || rating === 0) return "0. 0";
    return parseFloat(rating).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-50 mb-2">
              Игрок не найден
            </h1>
            <p className="text-slate-400 mb-6">
              {error || "Запрашиваемый игрок не существует"}
            </p>
            <Link
              to="/players"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/players"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку игроков
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Player Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 text-xl sm:text-2xl font-bold flex-shrink-0">
                    {player.full_name?.charAt(0)?.toUpperCase() || "? "}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-50">
                      {player.full_name}
                    </h1>
                    <p className="text-emerald-400 font-medium">
                      {player.position}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRatingForm(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Оценить игрока
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs sm:text-sm">Возраст</p>
                  <p className="text-slate-50 font-semibold text-lg">
                    {player.age} лет
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs sm: text-sm">Город</p>
                  <p className="text-slate-50 font-semibold text-lg truncate">
                    {player.city}
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs sm:text-sm">Рост</p>
                  <p className="text-slate-50 font-semibold text-lg">
                    {player.height} см
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs sm:text-sm">Вес</p>
                  <p className="text-slate-50 font-semibold text-lg">
                    {player.weight} кг
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Предпочитаемая нога: </span>
                  <span className="text-slate-200 font-medium">
                    {player.preferred_foot}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Опыт:</span>
                  <span className="text-slate-200 font-medium">
                    {player.experience_years || 0} лет
                  </span>
                </div>
                {player.club && (
                  <div className="flex justify-between py-2 border-b border-slate-800 sm:col-span-2">
                    <span className="text-slate-400">Клуб:</span>
                    <span className="text-slate-200 font-medium">
                      {player.club}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {player.bio && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">
                    О себе
                  </h3>
                  <p className="text-slate-300">{player.bio}</p>
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                Видео ({videos.length})
              </h2>

              {videos.length > 0 ? (
                <div className="grid gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-slate-800/50 rounded-lg overflow-hidden"
                    >
                      <video
                        src={video.video_url}
                        controls
                        className="w-full aspect-video bg-slate-900"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-slate-100">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="text-sm text-slate-400 mt-1">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Видео пока нет
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - Ratings */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 sticky top-24">
              {/* Average Rating */}
              <div className="text-center mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  <span className="text-4xl font-bold text-slate-50">
                    {formatRating(player.avg_rating)}
                  </span>
                  <span className="text-xl text-slate-400">/10</span>
                </div>
                <p className="text-slate-400 text-sm">
                  {player.rating_count || 0} оценок
                </p>
              </div>

              {/* Ratings List */}
              <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Отзывы
              </h3>

              {ratings.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-slate-800/50 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          {rating.rater_name || "Скаут"}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-slate-200 font-medium">
                            {rating.overall_rating}/10
                          </span>
                        </div>
                      </div>
                      {rating.comments && (
                        <p className="text-sm text-slate-300">
                          {rating.comments}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">
                  Отзывов пока нет
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRatingForm && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-50 mb-6">
                Оценить игрока
              </h2>

              <form onSubmit={submitRating} className="space-y-4">
                {/* Rating Sliders */}
                {[
                  { name: "speed", label: "Скорость" },
                  { name: "dribbling", label: "Дриблинг" },
                  { name: "passing", label: "Пас" },
                  { name: "shooting", label: "Удар" },
                  { name: "defending", label: "Защита" },
                  { name: "overall_rating", label: "Общая оценка" },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-slate-300">
                        {skill.label}
                      </label>
                      <span className="text-sm font-medium text-emerald-400">
                        {ratingForm[skill.name]}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      name={skill.name}
                      min="1"
                      max="10"
                      value={ratingForm[skill.name]}
                      onChange={handleRatingChange}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                ))}

                {/* Comments */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Комментарий
                  </label>
                  <textarea
                    name="comments"
                    value={ratingForm.comments}
                    onChange={handleRatingChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus: ring-emerald-500 resize-none"
                    placeholder="Напишите ваш отзыв..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRatingForm(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRating}
                    className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-medium rounded-lg transition"
                  >
                    {submittingRating ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDetails;
