import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="page-shell">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40">
              <span className="text-lg font-black">S</span>
            </div>
            <span className="text-base font-semibold text-slate-50">
              Scout.kz
            </span>
          </Link>
          <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
            Football Talent Platform
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-10 py-6 sm:py-10 lg:flex-row">
          {/* Hero */}
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Платформа для поиска футбольных талантов в Казахстане
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Дай себе шанс —{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                загрузи видео,
              </span>{" "}
              и тебя увидят.
            </h1>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              Игроки загружают свои лучшие моменты, скауты и тренеры оценивают
              их и находят новые таланты. Всё в одном удобном интерфейсе.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-1 items-center justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="card">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold text-slate-50">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
                  )}
                </div>
                {children}
              </div>
              <p className="mt-4 text-center text-xs text-slate-500">
                Scout.kz © {new Date().getFullYear()} • Платформа для молодых
                футболистов Казахстана
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
