import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ roles, children }) => {
  const { user, initialized } = useAuth();

  // Пока не знаем, есть ли юзер – показываем простой лоадер и НИЧЕГО не редиректим
  if (!initialized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Загружаем аккаунт...
        </p>
      </div>
    );
  }

  // Если нет пользователя после инициализации – на логин
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если указаны роли и роль пользователя не подходит – на главную
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
