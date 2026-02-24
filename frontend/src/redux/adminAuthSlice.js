// src/redux/adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  accessToken: null,
  isLoading: true, // 🔥 VERY IMPORTANT
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminLoginData: (state, action) => {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.isLoading = false;
    },
    setAdminLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAdminLoginData,
  logoutAdmin,
  setAdminLoading,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
