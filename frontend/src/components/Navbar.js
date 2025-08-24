import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, Upload, Users } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            Scout.kz
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Привет, {user.full_name}</span>

                {user.role === "player" && (
                  <>
                    <Link
                      to="/player-dashboard"
                      className="text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      Сведения
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      <User className="w-4 h-4 mr-1" />
                      Профиль
                    </Link>
                    <Link
                      to="/upload-video"
                      className="flex items-center text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Загрузить видео
                    </Link>
                  </>
                )}

                {(user.role === "scout" || user.role === "coach") && (
                  <>
                    <Link
                      to="/scout-dashboard"
                      className="text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      Сведения
                    </Link>
                    <Link
                      to="/players"
                      className="flex items-center text-gray-700 hover:text-primary-600 transition duration-200"
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Игроки
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition duration-200"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Выход
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition duration-200"
                >
                  Войти
                </Link>
                <Link to="/register" className="btn-primary">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
