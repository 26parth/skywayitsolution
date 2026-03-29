// src/lib/axiosAdmin.js
import axios from "axios";
import store from "../redux/store";
import { logoutAdmin, setAdminLoginData } from "../redux/adminAuthSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosAdmin = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true, 
});

axiosAdmin.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.adminAuth?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 FIX 1: Check specific backend code "TOKEN_EXPIRED"
    const isExpired = error.response?.data?.code === "TOKEN_EXPIRED";

    if (error.response?.status === 401 && isExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔥 FIX 2: Use base 'axios' to avoid infinite interceptor loop
        const r = await axios.post(
          `${API_BASE_URL}/admin/refresh-token`, 
          {}, 
          { withCredentials: true }
        );

        const { admin, accessToken } = r.data;

        store.dispatch(setAdminLoginData({ admin, accessToken }));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosAdmin(originalRequest);

      } catch (err) {
        store.dispatch(logoutAdmin());
        // Admin ko login page pe bhej do
        if (window.location.pathname.startsWith("/admin")) {
           window.location.href = "/admin/login"; 
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAdmin;