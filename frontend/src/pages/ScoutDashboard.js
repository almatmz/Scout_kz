import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ScoutDashboard = () => {
  const { user } = useAuth();

  const stats = {
    profileCompleted: false,
    videosCount: 0,
    averageRating: null,
    ratingsCount: 0,
  };

  return (
    <div className="bg-app">
      <section className="py-8 sm:py-10">
        <div className="app-container space-y-8">
          {/* Заголовок */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
              Добро пожаловать, {user?.full_name || "скаут"}!
            </h1>
            <p className="text-sm text-muted">
              Управляй своим профилем, отслеживай игроков и оставляй оценки.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Профиль */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Профиль</h2>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Важно
                </span>
              </div>
              <p className="text-sm text-muted">
                Заполни данные о себе, чтобы игроки и клубы понимали, кто
                оставляет оценки.
              </p>
              <Link
                to="/profile"
                className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
              >
                {stats.profileCompleted ? "Редактировать" : "Создать профиль"}
              </Link>
            </div>

            {/* Игроки */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Игроки</h2>
              </div>
              <p className="text-sm text-muted">
                Фильтруй игроков по городу, позиции и возрасту. Смотри их видео
                и добавляй оценки.
              </p>
              <Link
                to="/players"
                className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
              >
                Найти игроков
              </Link>
            </div>

            {/* Оценки */}
            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Мои оценки</h2>
              </div>
              <p className="text-sm text-muted">
                Здесь появится статистика по игрокам, которых ты уже оценил.
              </p>
              <p className="text-sm text-muted-weak">
                Пока нет оценок — начни с просмотра игроков.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScoutDashboard;
