import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosAdmin from "../lib/axiosAdmin";

// ---------------- ENQUIRIES ----------------
export const useAdminEnquiries = () =>
  useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const res = await axiosAdmin.get("/enquiry");
      return res.data.enquiries;
    },
  });

export const useDeleteEnquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosAdmin.delete(`/enquiry/${id}`),
    onSuccess: () => qc.invalidateQueries(["admin-enquiries"]),
  });
};

// ---------------- FEEDBACK ----------------
export const useAdminFeedbacks = () =>
  useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: async () => {
      const res = await axiosAdmin.get("/feedback");
      return res.data.feedbacks;
    },
  });

export const useDeleteFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosAdmin.delete(`/feedback/${id}`),
    onSuccess: () => qc.invalidateQueries(["admin-feedbacks"]),
  });
};