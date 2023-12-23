import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { userApi } from "../api/user.api";
import { valueApi } from "../api";
import { authApi } from "../api/auth.api";
import authReducer from "../redux/Slices/authSlice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [valueApi.reducerPath]: valueApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (gDM) =>
    gDM().concat(userApi.middleware, valueApi.middleware, authApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
