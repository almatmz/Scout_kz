import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    full_name: "",
    role: "player",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        toast.success("Регистрация успешна!");
        if (formData.role === "player") {
          navigate("/player-dashboard");
        } else {
          navigate("/scout-dashboard");
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создать аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Полное имя
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="input-field"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Номер телефона
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+77771234567"
                required
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Пароль (минимум 6 символов)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Роль
              </label>
              <select
                id="role"
                name="role"
                className="input-field"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="player">Игрок</option>
                <option value="parent">Родитель</option>
                <option value="scout">Скаут</option>
                <option value="coach">Тренер</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
