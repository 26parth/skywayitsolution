import { useQuery, useMutation } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";

export const useGetProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosClient.get("user/profile");
      return res.data;
    },
  });

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await axiosClient.put("user/edit-profile", data);
      return res.data;
    },
  });
