import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordFields";
import RoleToggle from "../components/RoleToggle";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "player",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Пароль должен быть минимум 6 символов");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      };

      const result = await register(payload);

      if (result.success) {
        toast.success("Регистрация успешна!");
        if (payload.role === "scout" || payload.role === "coach") {
          navigate("/scout-dashboard");
        } else {
          navigate("/player-dashboard");
        }
      } else {
        toast.error(result.error || "Не удалось зарегистрироваться");
      }
    } catch {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Зарегистрируйтесь как игрок, родитель, скаут или тренер."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField
          label="Полное имя"
          htmlFor="full_name"
          type="text"
          placeholder="Фамилия и Имя "
          required
          value={formData.full_name}
          onChange={handleChange}
          autoComplete="name"
        />

        <FormField
          label="Email"
          htmlFor="email"
          type="email"
          placeholder="you@mail.kz"
          required
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          helpText="Email поможет для входа и восстановления доступа."
        />

        <FormField
          label="Номер телефона"
          htmlFor="phone"
          type="tel"
          placeholder="+7 777 123 45 67"
          required
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />

        <PasswordField
          label="Пароль"
          htmlFor="password"
          placeholder="Минимум 6 символов"
          required
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <PasswordField
          label="Повторите пароль"
          htmlFor="confirmPassword"
          placeholder="Введите пароль ещё раз"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <RoleToggle value={formData.role} onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Создаем аккаунт..." : "Зарегистрироваться"}
        </button>

        <p className="text-center text-sm text-slate-300 dark:text-slate-300">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            Войти
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
