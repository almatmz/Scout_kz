import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-app">
      <main className="relative overflow-hidden">
        <section className="py-10 sm:py-16 lg:py-20">
          <div className="app-container grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Левая часть */}
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
                Дай себе шанс —{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
                  загрузи видео,
                </span>
                <br />и тебя увидят.
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-muted">
                Scout.kz — цифровая платформа для поиска молодых футбольных
                талантов в Казахстане. Загружай свои матчи и хайлайты, получай
                оценки от скаутов и тренеров и будь замечен.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary">
                  Зарегистрироваться
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost border-emerald-500/60 text-emerald-600 hover:border-emerald-500 dark:text-emerald-200"
                >
                  Войти
                </Link>
              </div>

              <div className="mt-6 grid max-w-xl grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
                    Игроки
                  </h3>
                  <p className="text-sm text-muted">
                    Создавай профиль, указывай позицию, клуб и статистику.
                    Загружай свои лучшие моменты.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
                    Скауты и тренеры
                  </h3>
                  <p className="text-sm text-muted">
                    Фильтруй игроков по городу, возрасту и позиции. Оценивай и
                    добавляй комментарии.
                  </p>
                </div>
              </div>
            </div>

            {/* Правая часть – статистика */}
            <div className="flex items-center justify-center">
              <div className="card w-full max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Live stats
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3 dark:bg-slate-900/80">
                    <dt className="text-muted-soft">Загружено видео</dt>
                    <dd className="font-semibold text-emerald-300">1 248+</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3 dark:bg-slate-900/80">
                    <dt className="text-muted-soft">Активных игроков</dt>
                    <dd className="font-semibold text-emerald-300">670+</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3 dark:bg-slate-900/80">
                    <dt className="text-muted-soft">Скаутов и тренеров</dt>
                    <dd className="font-semibold text-emerald-300">80+</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-muted-weak">
                  Цифры примерные, но настроение реальное:{" "}
                  <span className="text-emerald-300">будь замечен</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
