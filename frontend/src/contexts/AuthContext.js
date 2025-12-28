import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// ВАЖНО: здесь уже есть /api
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("scoutkz_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        axios.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
      } catch {
        localStorage.removeItem("scoutkz_auth");
      }
    }
    setInitialized(true);
  }, []);

  const saveAuth = (data) => {
    const { token, user } = data;
    setUser(user);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("scoutkz_auth", JSON.stringify({ token, user }));
  };

  const clearAuth = () => {
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
    localStorage.removeItem("scoutkz_auth");
  };

  // LOGIN
  const login = async (identifier, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        identifier,
        password,
      }); // -> http://localhost:5000/api/auth/login

      saveAuth(res.data);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Не удалось войти. Проверьте данные.";
      return { success: false, error: msg };
    }
  };

  // REGISTER
  const register = async (payload) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, payload); // -> http://localhost:5000/api/auth/register
      saveAuth(res.data);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.error || "Не удалось зарегистрироваться.";
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    clearAuth();
    toast.success("Вы вышли из аккаунта");
  };

  const value = {
    user,
    initialized,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
