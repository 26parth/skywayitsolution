// frontend/src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  loading: true, // 🔥 app start pe TRUE
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    },
  },
});


export const { setCredentials, updateAccessToken, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
