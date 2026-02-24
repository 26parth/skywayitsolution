import axios from "axios";
import store from "../redux/store";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosApi = axios.create({
  baseURL: `${API}/api`,
});

// Attach admin token
axiosApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.adminAuth?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosApi;
