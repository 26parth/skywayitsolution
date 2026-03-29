import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";

export const useGetProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosClient.get("user/profile");
      return res.data;
    },
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient(); // 🔥 Cache refresh karne ke liye

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axiosClient.put("user/edit-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      // 🔥 Ye line "profile" data ko refresh kar degi UI par automatic
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};