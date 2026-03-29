// src/redux/adminAuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  accessToken: null,
  isLoading: true, 
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // 🔥 Standardized name
    setAdminLoginData: (state, action) => {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
    },
    // Same as above, just for convenience
    setAdminCredentials: (state, action) => {
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
  setAdminCredentials,
  logoutAdmin,
  setAdminLoading,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;