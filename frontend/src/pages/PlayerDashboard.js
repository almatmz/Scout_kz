import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const StatCard = ({ title, value, description, icon, accent }) => (
  <div className="card flex flex-col justify-between gap-3">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-sm font-medium">{title}</span>
      </div>
      {accent && (
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          {accent}
        </span>
      )}
    </div>
    <div>
      <p className="text-2xl font-semibold text-slate-50">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  </div>
);

const PlayerDashboard = () => {
  const { user } = useAuth();

  // TODO: реальные данные с API
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
            <h1 className="text-2xl font-semibold text-slate-50 dark:text-slate-50 sm:text-3xl">
              Добро пожаловать, {user?.full_name || "игрок"}!
            </h1>
            <p className="text-sm text-slate-400">
              Управляй своим профилем, загружай видео и следи за оценками.
            </p>
          </div>

          {/* Верхние карточки статистики – адаптивная сетка */}
          <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
            <StatCard
              title="Профиль"
              value={stats.profileCompleted ? "Заполнен" : "Не заполнен"}
              description={
                stats.profileCompleted
                  ? "Ты готов показывать себя скаутам."
                  : "Заполни профиль, чтобы быть заметнее."
              }
              icon="👤"
              accent={stats.profileCompleted ? "Готов к просмотру" : "Важно"}
            />
            <StatCard
              title="Видео"
              value={`${stats.videosCount}/2`}
              description="Рекомендуется минимум 2 видео."
              icon="🎥"
            />
            <StatCard
              title="Средний рейтинг"
              value={stats.averageRating ? `${stats.averageRating}/10` : "—"}
              description={
                stats.averageRating ? "Твой общий рейтинг" : "Пока нет оценок"
              }
              icon="⭐"
            />
            <StatCard
              title="Оценки"
              value={stats.ratingsCount || 0}
              description="Сколько раз тебя оценили"
              icon="📊"
            />
          </div>

          {/* Нижние блоки 2-колоночная сетка */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-50">
                  Профиль игрока
                </h2>
                <Link
                  to="/profile"
                  className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
                >
                  {stats.profileCompleted ? "Редактировать" : "Создать профиль"}
                </Link>
              </div>
              <p className="text-sm text-slate-400">
                Заполни данные о позиции, клубе, росте, весе и сильных сторонах.
                Это то, что первым видят скауты.
              </p>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-50">
                  Мои видео
                </h2>
                <Link
                  to="/upload-video"
                  className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
                >
                  Загрузить видео
                </Link>
              </div>
              <p className="text-sm text-slate-400">
                Добавь матчи или хайлайты. Краткое описание поможет скауту
                понять контекст эпизода.
              </p>
            </div>
          </div>

          {/* Блок с последними оценками – на будущее */}
          <div className="card">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-slate-50">
                Последние оценки
              </h2>
              <span className="text-xs text-slate-400">
                Оценок пока нет — всё впереди.
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Как только скауты начнут оценивать твои видео, здесь появится
              детальная статистика по каждому матчу.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayerDashboard;
