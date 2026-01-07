import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const PlayerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    profileCompleted: false,
    videosCount: 0,
    averageRating: null,
    ratingsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const res = await api.get("players/me/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-app">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-app min-h-[80vh]">
      <section className="py-8 sm:py-10">
        <div className="app-container space-y-8">
          {/* Заголовок */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
              Добро пожаловать, {user?.full_name || "игрок"}!
            </h1>
            <p className="text-sm text-muted max-w-2xl">
              Управляй своим профилем, загружай видео и следи за оценками.
            </p>
          </div>

          {/* Карточки */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Профиль */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Профиль</h2>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {stats.profileCompleted ? "Готово" : "Важно"}
                </span>
              </div>
              <p className="text-sm text-muted">
                Заполни данные о позиции, клубе, росте, весе и сильных сторонах.
                Это то, что первым видят скауты.
              </p>
              <Link
                to="/profile"
                className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
              >
                {stats.profileCompleted ? "Редактировать" : "Создать профиль"}
              </Link>
            </div>

            {/* Видео */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Мои видео</h2>
                <span className="text-xs text-muted-soft">
                  {stats.videosCount}/2
                </span>
              </div>
              <p className="text-sm text-muted">
                Добавь матчи или хайлайты. Краткое описание поможет скауту
                понять контекст эпизода.
              </p>
              <Link
                to="/upload-video"
                className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
              >
                {stats.videosCount === 0
                  ? "Загрузить видео"
                  : "Управлять видео"}
              </Link>
            </div>

            {/* Оценки */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Средний рейтинг</h2>
              </div>
              {stats.ratingsCount === 0 ? (
                <>
                  <p className="text-sm text-muted">
                    Как только скауты начнут оценивать твои видео, здесь
                    появится детальная статистика по каждому матчу.
                  </p>
                  <p className="text-sm text-muted-weak">
                    Пока нет оценок — всё впереди.
                  </p>
                </>
              ) : (
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-emerald-400">
                    {stats.averageRating}
                  </p>
                  <p className="text-xs text-muted-soft">
                    Оценок: {stats.ratingsCount}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayerDashboard;
