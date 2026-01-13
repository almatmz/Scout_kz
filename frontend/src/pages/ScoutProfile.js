import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Save,
  Shield,
} from "lucide-react";

const ScoutProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    city: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stats, setStats] = useState({
    ratingsGiven: 0,
    playersViewed: 0,
  });

  const cities = [
    "Алматы",
    "Астана",
    "Шымкент",
    "Караганда",
    "Актобе",
    "Тараз",
    "Павлодар",
    "Усть-Каменогорск",
    "Семей",
    "Атырау",
    "Костанай",
    "Кызылорда",
    "Уральск",
    "Петропавловск",
    "Актау",
    "Темиртау",
    "Туркестан",
    "Кокшетау",
    "Талдыкорган",
    "Экибастуз",
  ];

  useEffect(() => {
    // Сначала заполняем данные из контекста user (данные регистрации)
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
    fetchProfile();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data) {
        setFormData({
          full_name: response.data.full_name || user?.full_name || "",
          email: response.data.email || user?.email || "",
          phone: response.data.phone || user?.phone || "",
          organization: response.data.organization || "",
          city: response.data.city || "",
          bio: response.data.bio || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Если API не работает, используем данные из контекста
      if (user) {
        setFormData((prev) => ({
          ...prev,
          full_name: user.full_name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/ratings/my-ratings");
      if (response.data) {
        setStats({
          ratingsGiven: response.data.length || 0,
          playersViewed:
            new Set(response.data.map((r) => r.player_id)).size || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

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
      await api.put("/auth/profile", {
        full_name: formData.full_name,
        email: formData.email,
        organization: formData.organization,
        city: formData.city,
        bio: formData.bio,
      });
      toast.success("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Ошибка обновления профиля");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const displayName = formData.full_name || user?.full_name || "Имя не указано";
  const displayInitial = displayName.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">
            Мой профиль
          </h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm: text-base">
            {user?.role === "scout" ? "Профиль скаута" : "Профиль тренера"}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 mb-6">
          {/* Avatar and Role Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-slate-950 text-xl sm:text-2xl font-bold flex-shrink-0">
                {displayInitial}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full uppercase">
                    {user?.role === "scout" ? "Скаут" : "Тренер"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4" />
                Полное имя
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="Введите ваше имя"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone - Read Only */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Phone className="w-4 h-4" />
                Телефон
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 cursor-not-allowed text-sm sm:text-base"
                disabled
                readOnly
              />
              <p className="text-xs text-slate-500 mt-1">
                Телефон нельзя изменить
              </p>
            </div>

            {/* Organization */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Briefcase className="w-4 h-4" />
                Организация / Клуб
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus: ring-emerald-500 focus:border-transparent transition text-sm sm:text-base"
                placeholder="Название клуба или организации"
              />
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <MapPin className="w-4 h-4" />
                Город
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm sm: text-base"
              >
                <option value="">Выберите город</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                О себе
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus: ring-emerald-500 focus:border-transparent transition resize-none text-sm sm:text-base"
                placeholder="Расскажите о своем опыте работы..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-slate-950 font-medium rounded-lg transition text-sm sm:text-base"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Сохранить изменения
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm: p-6">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">
            Статистика
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                {stats.ratingsGiven}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Оценок дано
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl sm: text-3xl font-bold text-emerald-400">
                {stats.playersViewed}
              </p>
              <p className="text-xs sm: text-sm text-slate-400 mt-1">
                Игроков оценено
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutProfile;
