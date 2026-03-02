// frontend/src/hooks/adminQueries.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosAdmin from "../lib/axiosAdmin";
import { useDispatch } from "react-redux";
import { setAdminLoginData } from "../redux/adminAuthSlice";

export const useAdminRegister = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axiosAdmin.post(" ", formData);
      return res.data;
    },
    onSuccess: () => {
      // ❌ is line se admin register ke baad auto-login jaisa ho raha tha
      // queryClient.invalidateQueries(["admin"]);

      // ✔️ FIX: register ke baad admin fetch mat karo
      // login karne ke baad hi admin ko store karna hai
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
      // 👇 FIXED — admin + accessToken Redux me store hoga
      dispatch(
        setAdminLoginData({
          admin: data.admin,
          accessToken: data.accessToken,
        })
      );

      queryClient.invalidateQueries(["admin"]);
    },
  });
};
