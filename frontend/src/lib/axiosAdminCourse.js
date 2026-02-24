// frontend/src/lib/axiosAdminCourse.js
import axios from "axios";
import store from "../redux/store";

const axiosAdminCourse = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/course`,
  withCredentials: true,
});

axiosAdminCourse.interceptors.request.use((config) => {
  const token = store.getState().adminAuth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosAdminCourse;
