import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const closeMobile = () => setMobileOpen(false);

  // Определяем ссылки в зависимости от роли
  const getNavLinks = () => {
    if (!user) {
      // Для неавторизованных пользователей
      return (
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block py-2 md:py-0 ${
              isActive
                ? "font-semibold text-emerald-300"
                : "text-slate-300 hover:text-emerald-200"
            }`
          }
          onClick={closeMobile}
        ></NavLink>
      );
    }

    const isScoutOrCoach = user.role === "scout" || user.role === "coach";

    return (
      <>
        {/* Панель - для всех авторизованных */}
        <NavLink
          to={isScoutOrCoach ? "/scout-dashboard" : "/player-dashboard"}
          className={({ isActive }) =>
            `block py-2 md:py-0 ${
              isActive
                ? "font-semibold text-emerald-300"
                : "text-slate-300 hover:text-emerald-200"
            }`
          }
          onClick={closeMobile}
        >
          Панель
        </NavLink>

        {/* Для скаутов/тренеров:  Поиск, для игроков:  Видео */}
        {isScoutOrCoach ? (
          <NavLink
            to="/players"
            className={({ isActive }) =>
              `block py-2 md:py-0 ${
                isActive
                  ? "font-semibold text-emerald-300"
                  : "text-slate-300 hover: text-emerald-200"
              }`
            }
            onClick={closeMobile}
          >
            Поиск
          </NavLink>
        ) : (
          <NavLink
            to="/upload-video"
            className={({ isActive }) =>
              `block py-2 md: py-0 ${
                isActive
                  ? "font-semibold text-emerald-300"
                  : "text-slate-300 hover:text-emerald-200"
              }`
            }
            onClick={closeMobile}
          >
            Видео
          </NavLink>
        )}

        {/* Профиль - для всех авторизованных */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `block py-2 md:py-0 ${
              isActive
                ? "font-semibold text-emerald-300"
                : "text-slate-300 hover:text-emerald-200"
            }`
          }
          onClick={closeMobile}
        >
          Профиль
        </NavLink>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40">
              <span className="text-lg font-black">S</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-slate-50">
                Scout. kz
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400">
                Talent discovery for Kazakhstan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {getNavLinks()}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-xs font-bold text-slate-950">
                    {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium text-slate-100 max-w-[120px] truncate">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      {user.role === "scout"
                        ? "Скаут"
                        : user.role === "coach"
                          ? "Тренер"
                          : user.role === "player"
                            ? "Игрок"
                            : user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100 hover:bg-slate-800"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-slate-100"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobile}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile Navigation Links */}
            <nav className="space-y-1 text-sm">{getNavLinks()}</nav>

            {/* Mobile User Section */}
            <div className="pt-4 mt-4 border-t border-slate-800">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">
                      {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-100">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {user.role === "scout"
                          ? "Скаут"
                          : user.role === "coach"
                            ? "Тренер"
                            : user.role === "player"
                              ? "Игрок"
                              : user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobile();
                    }}
                    className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover: text-slate-100 hover:bg-slate-800"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="block w-full rounded-lg border border-slate-700 px-4 py-2.5 text-center text-sm font-medium text-slate-300 transition hover: border-slate-600 hover:text-slate-100"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="block w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-medium text-slate-950 transition hover:bg-emerald-400"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
