import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { userApi } from "../api/user.api";
import { valueApi } from "../api";
import { authApi } from "../api/auth.api";
import authReducer from "../redux/Slices/authSlice";
import tableReducer from "../redux/Slices/tableSlice";
import requestFormreducer from "./Slices/requestFormSlice";
import snackBarReducer from "./Slices/snackBarslice";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [valueApi.reducerPath]: valueApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    table: tableReducer,
    requestForm: requestFormreducer,
    snackBar: snackBarReducer,
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
