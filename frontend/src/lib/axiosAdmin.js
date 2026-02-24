import axios from "axios";
import store from "../redux/store";
import {
  logoutAdmin,
  setAdminLoginData
} from "../redux/adminAuthSlice";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosAdmin = axios.create({
  baseURL: API,
  withCredentials: true,
});

axiosAdmin.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.adminAuth?.accessToken;

  if (token && !config.url.includes("/refresh-token")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosAdmin.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/admin/refresh-token")) {
      store.dispatch(logoutAdmin());
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const r = await axiosAdmin.post("/admin/refresh-token");

        store.dispatch(
          setAdminLoginData({
            admin: r.data.admin,
            accessToken: r.data.accessToken,
          })
        );

        originalRequest.headers.Authorization =
          `Bearer ${r.data.accessToken}`;

        return axiosAdmin(originalRequest);

      } catch (err) {
        store.dispatch(logoutAdmin());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;