import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/user";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => Promise.reject(error)
);

export const register = (email: string, name: string, password: string) =>
  api.post("register/", { email, name, password });

export const login = (email: string, password: string) =>
  api.post("login/", { email, password });

export const getWatchlist = () => api.get("watchlist/");

export const addToWatchlist = (symbol: string) =>
  api.post("watchlist/add/", { symbol });

export const removeFromWatchlist = (symbol: string) =>
  api.delete(`watchlist/remove/${symbol}/`);

export const getWatchlistStockData = () => api.get("watchlist/data/");
