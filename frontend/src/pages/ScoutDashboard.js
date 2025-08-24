import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Users, Star, Eye, TrendingUp } from "lucide-react";

const ScoutDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPlayers: 0,
    myRatings: 0,
    avgRating: 0,
  });
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [playersRes, ratingsRes] = await Promise.all([
        api.get("/players?limit=5"),
        api.get("/ratings/my-ratings"),
      ]);

      setRecentPlayers(playersRes.data);
      setMyRatings(ratingsRes.data);

      // Calculate stats
      const totalPlayers = playersRes.data.length;
      const myRatingsCount = ratingsRes.data.length;
      const avgRating =
        myRatingsCount > 0
          ? (
              ratingsRes.data.reduce((sum, r) => sum + r.overall_rating, 0) /
              myRatingsCount
            ).toFixed(1)
          : 0;

      setStats({
        totalPlayers,
        myRatings: myRatingsCount,
        avgRating,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">
          Добро пожаловать, {user.full_name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Панель {user.role === "scout" ? "скаута" : "тренера"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Доступно игроков</p>
              <p className="text-2xl font-bold">{stats.totalPlayers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Мои оценки</p>
              <p className="text-2xl font-bold">{stats.myRatings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Средняя оценка</p>
              <p className="text-2xl font-bold">{stats.avgRating}/10</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Players */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Новые игроки</h2>
            <Link
              to="/players"
              className="text-primary-600 hover:text-primary-700"
            >
              Смотреть всех
            </Link>
          </div>

          <div className="space-y-4">
            {recentPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">{player.full_name}</h3>
                  <p className="text-sm text-gray-600">
                    {player.position} • {player.city} • {player.age} лет
                  </p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">
                      {player.avg_rating > 0
                        ? `${player.avg_rating}/10`
                        : "Нет оценок"}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({player.rating_count} оценок)
                    </span>
                  </div>
                </div>
                <Link
                  to={`/player/${player.id}`}
                  className="btn-secondary text-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Посмотреть
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* My Recent Ratings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Мои последние оценки</h2>

          <div className="space-y-4">
            {myRatings.slice(0, 5).map((rating) => (
              <div
                key={rating.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">{rating.player_name}</h3>
                  <p className="text-sm text-gray-600">
                    {rating.position} • {rating.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {rating.overall_rating}/10
                  </div>
                  <div className="text-xs text-gray-500">Общая оценка</div>
                </div>
              </div>
            ))}

            {myRatings.length === 0 && (
              <p className="text-gray-600">Оценок пока нет</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
