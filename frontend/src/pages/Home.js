import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Дай себе шанс —{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                загрузи видео,
              </span>{" "}
              и тебя увидят.
            </h1>
            <p className="max-w-xl text-base text-slate-300 sm:text-lg">
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
                className="btn-ghost border-emerald-500/60 text-emerald-200 hover:border-emerald-400"
              >
                Войти
              </Link>
            </div>
            <dl className="mt-6 grid max-w-xl grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <dt className="text-slate-400">Игроки</dt>
                <dd className="mt-1 font-semibold text-slate-50">
                  Создавай профиль, указывай позицию, клуб и статистику.
                  Загружай свои лучшие моменты.
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <dt className="text-slate-400">Скауты и тренеры</dt>
                <dd className="mt-1 font-semibold text-slate-50">
                  Фильтруй игроков по городу, возрасту и позиции. Оценивай и
                  добавляй комментарии.
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -translate-x-10 translate-y-6 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/80">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
                LIVE STATS
              </p>
              <div className="mt-4 space-y-3 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                  <span>Загружено видео</span>
                  <span className="font-semibold text-emerald-300">1 248+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                  <span>Активных игроков</span>
                  <span className="font-semibold text-emerald-300">670+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                  <span>Скаутов и тренеров</span>
                  <span className="font-semibold text-emerald-300">80+</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Цифры примерные, но настроение реальное:{" "}
                <span className="text-emerald-300">будь замечен</span>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
