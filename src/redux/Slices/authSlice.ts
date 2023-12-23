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

const initialState: AuthState = {
  user: null,
  token: null,
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
