import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string)
  : null;

const initialState = {
  user: userFromStorage,
  loggedIn: !!userFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); // salva
    },
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
      localStorage.removeItem("user"); // remove
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
