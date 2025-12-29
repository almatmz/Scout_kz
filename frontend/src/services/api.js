import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Общий инстанс для всего фронта
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // мы используем JWT в заголовке, не cookie
});

// При загрузке приложения попробуем вытащить токен из localStorage
try {
  const stored = localStorage.getItem("scoutkz_auth");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.token) {
      api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
    }
  }
} catch {
  // ignore
}

export default api;
