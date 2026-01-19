import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const STORAGE_KEY = "scoutkz_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setUser(parsed.user);
          axios.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
          api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setInitialized(true);
  }, []);

  const saveAuth = (data) => {
    const token = data.token;
    const { user } = data;
    if (!token || !user) return;

    setUser(user);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  };

  const clearAuth = () => {
    setUser(null);
    delete axios.defaults.headers.common.Authorization;
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (identifier, password) => {
    try {
      console.log("Attempting login to:", `${API_BASE}/auth/login`);

      const res = await axios.post(`${API_BASE}/auth/login`, {
        identifier,
        password,
      });

      saveAuth(res.data);
      return { success: true, user: res.data.user };
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        return {
          success: false,
          error:
            "Не удается подключиться к серверу. Проверьте, что сервер запущен.",
        };
      }

      const msg =
        err.response?.data?.error || "Не удалось войти. Проверьте данные.";
      return { success: false, error: msg };
    }
  };

  // ✅ IMPROVED REGISTER with better error handling
  const register = async (payload) => {
    try {
      console.log("Attempting registration to:", `${API_BASE}/auth/register`);
      console.log("Payload:", payload);

      const res = await axios.post(`${API_BASE}/auth/register`, payload);

      saveAuth(res.data);
      return { success: true, user: res.data.user };
    } catch (err) {
      console.error("Registration error:", err);

      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        return {
          success: false,
          error:
            "Не удается подключиться к серверу. Проверьте, что сервер запущен.",
        };
      }

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
