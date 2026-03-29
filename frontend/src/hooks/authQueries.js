// frontend/src/hooks/authQueries.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export const useRegister = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form) => {
      const res = await axiosClient.post("/auth/register", form);
      return res.data;
    },
    onSuccess: () => {

    },
  });
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form) => {
      const res = await axiosClient.post("/auth/login", form);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
      qc.invalidateQueries(["user"]);
    },
  });
};


