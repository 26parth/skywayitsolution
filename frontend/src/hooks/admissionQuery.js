// frontend/src/hooks/admissionQuery.js
import { useMutation } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";

export const useAdmissionForm = () => {
  return useMutation({
    mutationFn: (formData) =>
      axiosClient.post("/admission", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
  });
};
