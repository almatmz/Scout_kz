import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDashboard =
    location.pathname.startsWith("/player-dashboard") ||
    location.pathname.startsWith("/scout-dashboard");

  const toggleMobile = () => setMobileOpen((v) => !v);

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "font-semibold text-emerald-300" : "hover:text-emerald-200"
        }
        onClick={() => setMobileOpen(false)}
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
            onClick={() => setMobileOpen(false)}
          >
            Панель
          </NavLink>

          {/* ВОТ ТУТ ИСПРАВЛЕНИЕ */}
          <NavLink
            to={
              user.role === "scout" || user.role === "coach"
                ? "/players" // для скаута — список игроков
                : "/upload-video" // для игрока — страница видео
            }
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-emerald-300"
                : "hover:text-emerald-200"
            }
            onClick={() => setMobileOpen(false)}
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
            onClick={() => setMobileOpen(false)}
          >
            Профиль
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl dark:bg-slate-950/80">
      <div className="app-container flex items-center justify-between gap-3 py-3">
        {/* Логотип + навигация */}
        <div className="flex items-center gap-4">
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

          {/* Десктопное меню */}
          <nav className="hidden items-center gap-4 text-sm text-slate-300 sm:flex">
            {navLinks}
          </nav>
        </div>

        {/* Справа: тема + профиль / кнопки + бургер */}
        <div className="flex items-center gap-2">
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
              <div className="hidden items-center gap-3 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1.5 text-xs sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200">
                  {user.full_name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-50">
                    {user.full_name || "Пользователь"}
                  </span>
                  <span className="text-[11px] text-muted">
                    {user.role?.toUpperCase() || "USER"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="btn-ghost hidden text-sm sm:inline-flex"
              >
                Выйти
              </button>
            </>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Link to="/login" className="btn-ghost text-sm">
                Войти
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Регистрация
              </Link>
            </div>
          )}

          {/* Бургер для мобильных */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-200 sm:hidden"
            onClick={toggleMobile}
            aria-label="Открыть меню"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="border-t border-slate-800/60 bg-slate-950/95 sm:hidden">
          <div className="app-container flex flex-col gap-3 py-3 text-sm text-slate-200">
            <nav className="flex flex-col gap-2">{navLinks}</nav>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="btn-ghost mt-1 w-full justify-center"
              >
                Выйти
              </button>
            ) : (
              <div className="mt-1 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="btn-ghost w-full justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
