import { createSlice } from "@reduxjs/toolkit";
import { clearStoredToken, getStoredToken } from "../services/setupAxiosAuth";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string)
  : null;

const tokenFromStorage = getStoredToken();

const initialState = {
  user: userFromStorage,
  loggedIn: !!userFromStorage && !!tokenFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
      localStorage.removeItem("user");
      clearStoredToken();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
