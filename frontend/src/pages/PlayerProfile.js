import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const PlayerProfile = () => {
  const [formData, setFormData] = useState({
    age: "",
    city: "",
    position: "",
    height: "",
    weight: "",
    preferred_foot: "",
    experience_years: "",
    club: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const positions = ["Вратарь", "Защитник", "Полузащитник", "Нападающий"];
  const feet = ["Левая", "Правая", "Обе"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("api/players/profile");
      setFormData({
        age: response.data.age || "",
        city: response.data.city || "",
        position: response.data.position || "",
        height: response.data.height || "",
        weight: response.data.weight || "",
        preferred_foot: response.data.preferred_foot || "",
        experience_years: response.data.experience_years || "",
        club: response.data.club || "",
        bio: response.data.bio || "",
      });
    } catch (error) {
      // Profile doesn't exist yet, that's okay
    } finally {
      setInitialLoading(false);
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
      await api.post("api/players/profile", formData);
      toast.success("Профиль сохранен!");
      navigate("/player-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка сохранения профиля");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Профиль игрока</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Возраст *
              </label>
              <input
                type="number"
                name="age"
                min="10"
                max="35"
                required
                className="input-field"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Город *
              </label>
              <input
                type="text"
                name="city"
                required
                className="input-field"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Позиция *
              </label>
              <select
                name="position"
                required
                className="input-field"
                value={formData.position}
                onChange={handleChange}
              >
                <option value="">Выберите позицию</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Предпочитаемая нога *
              </label>
              <select
                name="preferred_foot"
                required
                className="input-field"
                value={formData.preferred_foot}
                onChange={handleChange}
              >
                <option value="">Выберите ногу</option>
                {feet.map((foot) => (
                  <option key={foot} value={foot}>
                    {foot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Рост (см) *
              </label>
              <input
                type="number"
                name="height"
                min="140"
                max="220"
                required
                className="input-field"
                value={formData.height}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вес (кг) *
              </label>
              <input
                type="number"
                name="weight"
                min="40"
                max="150"
                required
                className="input-field"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Опыт (лет)
              </label>
              <input
                type="number"
                name="experience_years"
                min="0"
                max="25"
                className="input-field"
                value={formData.experience_years}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Текущий клуб
              </label>
              <input
                type="text"
                name="club"
                className="input-field"
                value={formData.club}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              О себе
            </label>
            <textarea
              name="bio"
              rows="4"
              maxLength="500"
              className="input-field"
              placeholder="Расскажите о своих достижениях, целях и особенностях игры..."
              value={formData.bio}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 символов
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Сохранение..." : "Сохранить профиль"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/player-dashboard")}
              className="btn-secondary"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerProfile;
