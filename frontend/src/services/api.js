import axios from "axios";

// Your Render backend base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`, // always append /api here
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on every request dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
