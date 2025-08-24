import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, Filter, Star, Eye } from "lucide-react";

const PlayersListing = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    position: "",
    age_min: "",
    age_max: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const positions = ["Вратарь", "Защитник", "Полузащитник", "Нападающий"];

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await api.get(`/players?${params.toString()}`);
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchPlayers();
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      position: "",
      age_min: "",
      age_max: "",
      search: "",
    });
    setLoading(true);
    fetchPlayers();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Поиск игроков</h1>
        <p className="text-gray-600 mt-2">Найдите талантливых футболистов</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Поиск по имени..."
                className="pl-10 input-field"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </button>

          <button onClick={applyFilters} className="btn-primary">
            Найти
          </button>
        </div>

        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Город
                </label>
                <input
                  type="text"
                  name="city"
                  className="input-field"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Алматы, Астана..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Позиция
                </label>
                <select
                  name="position"
                  className="input-field"
                  value={filters.position}
                  onChange={handleFilterChange}
                >
                  <option value="">Все позиции</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Возраст от
                </label>
                <input
                  type="number"
                  name="age_min"
                  min="10"
                  max="35"
                  className="input-field"
                  value={filters.age_min}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Возраст до
                </label>
                <input
                  type="number"
                  name="age_max"
                  min="10"
                  max="35"
                  className="input-field"
                  value={filters.age_max}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={applyFilters} className="btn-primary">
                Применить фильтры
              </button>
              <button onClick={clearFilters} className="btn-secondary">
                Очистить
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Players Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{player.full_name}</h3>
              <p className="text-gray-600">{player.position}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Возраст:</span>
                <span>{player.age} лет</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Город:</span>
                <span>{player.city}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Рост/Вес:</span>
                <span>
                  {player.height}см / {player.weight}кг
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Предп. нога:</span>
                <span>{player.preferred_foot}</span>
              </div>
              {player.club && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Клуб:</span>
                  <span>{player.club}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium">
                  {player.avg_rating > 0
                    ? `${player.avg_rating}/10`
                    : "Нет оценок"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({player.rating_count} оценок)
                </span>
              </div>
            </div>

            {player.bio && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {player.bio}
              </p>
            )}

            <Link
              to={`/player/${player.id}`}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Посмотреть профиль
            </Link>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Игроки не найдены</p>
        </div>
      )}
    </div>
  );
};

export default PlayersListing;
