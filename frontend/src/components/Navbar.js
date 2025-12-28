import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/player-dashboard") ||
    location.pathname.startsWith("/scout-dashboard");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl dark:bg-slate-950/80">
      <div className="app-container flex items-center justify-between gap-4 py-3">
        {/* Logo + навигация слева */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40">
              <span className="text-lg font-black">S</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-slate-50 dark:text-slate-50">
                Scout.kz
              </span>
              <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Talent discovery for Kazakhstan
              </span>
            </div>
          </Link>

          {/* Основные ссылки (для широких экранов) */}
          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-emerald-300"
                  : "hover:text-emerald-200"
              }
            >
              Главная
            </NavLink>
            {user && (
              <>
                <NavLink
                  to={
                    user.role === "scout" || user.role === "coach"
                      ? "/scout-dashboard"
                      : "/player-dashboard"
                  }
                  className={({ isActive }) =>
                    isActive
                      ? "font-semibold text-emerald-300"
                      : "hover:text-emerald-200"
                  }
                >
                  Панель
                </NavLink>
                {user.role === "scout" || user.role === "coach" ? (
                  <NavLink
                    to="/players"
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold text-emerald-300"
                        : "hover:text-emerald-200"
                    }
                  >
                    Игроки
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/upload-video"
                      className={({ isActive }) =>
                        isActive
                          ? "font-semibold text-emerald-300"
                          : "hover:text-emerald-200"
                      }
                    >
                      Видео
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive
                          ? "font-semibold text-emerald-300"
                          : "hover:text-emerald-200"
                      }
                    >
                      Профиль
                    </NavLink>
                  </>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Справа: тема + профиль/кнопки */}
        <div className="flex items-center gap-3">
          {/* Тема */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost h-9 w-9 items-center justify-center rounded-full p-0 text-lg"
            aria-label="Переключить тему"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {user ? (
            <>
              {isDashboard && (
                <div className="hidden items-center gap-3 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-xs sm:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 text-sm font-bold">
                    {user.full_name?.[0] || "U"}
                  </div>
                  <div className="leading-tight">
                    <p className="font-medium text-slate-50">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      {user.role === "scout" || user.role === "coach"
                        ? "Скаут / тренер"
                        : "Игрок"}
                    </p>
                  </div>
                </div>
              )}
              <button onClick={logout} className="btn-ghost text-xs sm:text-sm">
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="hidden text-sm font-medium text-slate-200 hover:text-emerald-300 sm:inline-flex"
              >
                Войти
              </NavLink>
              <NavLink
                to="/register"
                className="btn-primary text-xs sm:text-sm"
              >
                Регистрация
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
