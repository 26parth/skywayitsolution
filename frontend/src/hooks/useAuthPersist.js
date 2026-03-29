import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosClient from "../lib/axiosClient";
import { setCredentials, setLoading, logout } from "../redux/authSlice";

// C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\hooks\useAuthPersist.js

export default function useAuthPersist() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      dispatch(setLoading(false)); // Agar admin page hai toh user loading band karo
      return;
    }

    const restoreUser = async () => {
      try {
        // Bina manual loading start kiye call karo kyunki initial state true hai
        const res = await axiosClient.post("/auth/refresh-token");
        
        dispatch(setCredentials({ 
          user: res.data.user, 
          accessToken: res.data.accessToken 
        }));
      } catch (err) {
        // 🔥 FIX: Agar 401 hai toh chup-chap loading false karo, redirect axios interceptor karega
        dispatch(logout()); 
      } finally {
        dispatch(setLoading(false)); 
      }
    };

    restoreUser();
  }, [dispatch]);

  return null;
}