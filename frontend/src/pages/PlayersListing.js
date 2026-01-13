import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Search, Filter, Star, Eye, X, ChevronDown } from "lucide-react";

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
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
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
    fetchPlayers();
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: "",
      position: "",
      age_min: "",
      age_max: "",
      search: "",
    };
    setFilters(emptyFilters);
    // Fetch after clearing
    setTimeout(() => {
      fetchPlayers();
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const formatRating = (rating) => {
    if (!rating || rating === 0) return null;
    return parseFloat(rating).toFixed(1);
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.city || filters.position || filters.age_min || filters.age_max;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">
            Поиск игроков
          </h1>
          <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Найдите талантливых футболистов
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg mb-6 sm: mb-8 p-4 sm: p-6">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Поиск по имени..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus: outline-none focus: ring-2 focus:ring-emerald-500 focus: border-transparent transition text-sm sm: text-base"
                  value={filters.search}
                  onChange={handleFilterChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-2 sm: gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition text-sm sm:text-base ${
                  showFilters || hasActiveFilters
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Фильтры</span>
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-slate-950 font-medium">
                    !
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Search Button */}
              <button
                onClick={applyFilters}
                className="flex-1 sm: flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition text-sm sm:text-base"
              >
                Найти
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="border-t border-slate-800 pt-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Город
                  </label>
                  <select
                    name="city"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    value={filters.city}
                    onChange={handleFilterChange}
                  >
                    <option value="">Все города</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Позиция
                  </label>
                  <select
                    name="position"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus: outline-none focus: ring-2 focus:ring-emerald-500 focus: border-transparent transition text-sm"
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

                {/* Age Range - Combined on mobile */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Возраст от
                  </label>
                  <input
                    type="number"
                    name="age_min"
                    min="10"
                    max="35"
                    placeholder="10"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    value={filters.age_min}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="sm: col-span-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Возраст до
                  </label>
                  <input
                    type="number"
                    name="age_max"
                    min="10"
                    max="35"
                    placeholder="35"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus: ring-emerald-500 focus:border-transparent transition text-sm"
                    value={filters.age_max}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <button
                  onClick={applyFilters}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition text-sm"
                >
                  Применить фильтры
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <X className="w-4 h-4" />
                  Очистить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
            >
              {/* Player Header */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-50 truncate">
                  {player.full_name}
                </h3>
                <p className="text-emerald-400 text-sm">{player.position}</p>
              </div>

              {/* Player Stats */}
              <div className="space-y-2 mb-3 sm:mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Возраст:</span>
                  <span className="text-slate-200">{player.age} лет</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Город:</span>
                  <span className="text-slate-200 truncate ml-2">
                    {player.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Рост/Вес:</span>
                  <span className="text-slate-200">
                    {player.height}см / {player.weight}кг
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Предп. нога:</span>
                  <span className="text-slate-200">
                    {player.preferred_foot}
                  </span>
                </div>
                {player.club && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Клуб:</span>
                    <span className="text-slate-200 truncate ml-2">
                      {player.club}
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-3 sm: mb-4 py-2.5 sm:py-3 px-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2" />
                  <span className="text-sm sm:text-base font-medium text-slate-100">
                    {formatRating(player.avg_rating)
                      ? `${formatRating(player.avg_rating)}/10`
                      : "Нет оценок"}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  ({player.rating_count || 0} оценок)
                </span>
              </div>

              {/* Bio */}
              {player.bio && (
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                  {player.bio}
                </p>
              )}

              {/* View Profile Button */}
              <Link
                to={`/player/${player.id}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition text-sm"
              >
                <Eye className="w-4 h-4" />
                Посмотреть профиль
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {players.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-800 mb-4">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-base sm:text-lg">
              Игроки не найдены
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersListing;
