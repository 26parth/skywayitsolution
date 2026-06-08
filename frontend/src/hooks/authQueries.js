//C:\Users\hp\OneDrive\Desktop\28 jan skyway\skywayitsolution\frontend\src\hooks\authQueries.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";

export const useRegister = () => {
    return useMutation({
        mutationFn: async (form) => {
            const res = await axiosClient.post("/auth/register", form);
            return res.data;
        },
    });
};

export const useLogin = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (form) => {
            const res = await axiosClient.post("/auth/login", form);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries(["user"]);
        },
    });
};