import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordFields";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.identifier, formData.password);

      if (result.success) {
        toast.success("Добро пожаловать!");
        if (result.user?.role === "scout" || result.user?.role === "coach") {
          navigate("/scout-dashboard");
        } else {
          navigate("/player-dashboard");
        }
      } else {
        toast.error(result.error || "Неверный логин или пароль");
      }
    } catch {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Войти в аккаунт"
      subtitle="Продолжите с номером телефона или электронной почтой."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          label="Телефон или email"
          htmlFor="identifier"
          type="text"
          placeholder="+7 777 123 45 67 или you@mail.kz"
          required
          value={formData.identifier}
          onChange={handleChange}
          autoComplete="username"
        />

        <PasswordField
          label="Пароль"
          htmlFor="password"
          placeholder="Введите пароль"
          required
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Минимум 6 символов.</span>
          <button
            type="button"
            className="text-emerald-300 hover:text-emerald-200"
            onClick={() =>
              toast("Восстановление пароля пока не реализовано.", {
                icon: "ℹ️",
              })
            }
          >
            Забыли пароль?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Входим..." : "Войти"}
        </button>

        <p className="text-center text-sm text-slate-300">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
