import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api"
    : (import.meta.env.VITE_API_URL || "https://admin-moderator-backend-staging.up.railway.app/api"),

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
