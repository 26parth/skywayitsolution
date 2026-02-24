import axios from "axios";
import store from "../redux/store";
import { updateAccessToken, logout } from "../redux/authSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // for HttpOnly cookies
});

// ----------------------
// Request Interceptor: Attach Access Token
// ---------------------- 
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// Response Interceptor: Refresh Token Logic
// ----------------------
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // -----------------------------------------
    // ❌ FIX: NEVER refresh after REGISTER CALL
    // -----------------------------------------
    if (originalRequest?.url?.includes("/auth/register")) {
      return Promise.reject(error);
    }

    // If access token expired → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosClient.post("/auth/refresh");

        const newAccessToken = refreshResponse.data.accessToken;

        // Update Redux
        store.dispatch(updateAccessToken(newAccessToken));

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
