import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type SnackBarState = {
  open: boolean;
  text: string | null;
  type: "success" | "error" | "info" | "warning" | undefined;
};

const initialState: SnackBarState = {
  open: false,
  text: null,
  type: undefined,
};

const snackBarSlice = createSlice({
  name: "snackBar",
  initialState,
  reducers: {
    setSnackbarOpen: (state, action) => {
      state.text = action.payload.text;
      state.type = action.payload.type;
      state.open = true;
    },
    snackBarClose: (state) => {
      state.open = false;
    },
  },
});

export const { setSnackbarOpen, snackBarClose } = snackBarSlice.actions;

export default snackBarSlice.reducer;

export const selectSnackBarText = (state: RootState) => state.snackBar.text;
export const selectSnackBarType = (state: RootState) => state.snackBar.type;
export const selectSnackBarState = (state: RootState) => state.snackBar.open;
