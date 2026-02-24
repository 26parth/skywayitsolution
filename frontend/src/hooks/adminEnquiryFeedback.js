import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosAdmin from "../lib/axiosAdmin";

// ---------------- ENQUIRIES ----------------
export const useAdminEnquiries = () =>
  useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const res = await axiosAdmin.get("/enquiry/admin"); // ✅ FIX
      return res.data.enquiries;
    },
  });

export const useDeleteEnquiry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosAdmin.delete(`/enquiry/admin/${id}`), // ✅ FIX
    onSuccess: () => qc.invalidateQueries(["admin-enquiries"]),
  });
};

// ---------------- FEEDBACK ----------------
export const useAdminFeedbacks = () =>
  useQuery({
    queryKey: ["admin-feedbacks"],
    queryFn: async () => {
      const res = await axiosAdmin.get("/feedback/admin"); // ✅ FIX
      return res.data.feedbacks;
    },
  });

export const useDeleteFeedback = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosAdmin.delete(`/feedback/admin/${id}`), // ✅ FIX
    onSuccess: () => qc.invalidateQueries(["admin-feedbacks"]),
  });
};
