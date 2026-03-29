// frontend/src/hooks/adminQueries.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosAdmin from "../lib/axiosAdmin";
import { useDispatch } from "react-redux";
import { setAdminLoginData } from "../redux/adminAuthSlice";

export const useAdminRegister = () => {
  return useMutation({
    mutationFn: async (formData) => {
      // ✔️ Path fixed to /register
      const res = await axiosAdmin.post("/register", formData);
      return res.data;
    },
    onSuccess: () => {
      // Register ke baad auto-login nahi karwana, manual login is safer for admin
    },
  });
};

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axiosAdmin.post("/login", formData);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setAdminLoginData({
        admin: data.admin,
        accessToken: data.accessToken,
      }));
      queryClient.invalidateQueries(["admin"]);
    },
  });
};