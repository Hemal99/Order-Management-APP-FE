import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type User = {
  name: string;
  email: string;
  role: string;
  id: string;
  isEmailVerified: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

// const sampleUser = {
//   name: "pushpitha",
//   email: "pushpitha@gmail.com",
//   role: "admin",
//   id: "1",
//   isEmailVerified: false,
// };

// const sampleToken = "sda";

const initialState: AuthState = {
  user: JSON.parse(sessionStorage.getItem("user") || "{}"),
  token: sessionStorage.getItem("accessToken") || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentUserRole = (state: RootState) =>
  state.auth.user?.role;
export const selectCurrentToken = (state: RootState) => state.auth.token;
