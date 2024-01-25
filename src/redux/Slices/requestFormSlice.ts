import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type requestFormState = {
  formState: "add" | "edit" | "view";
  values: any;
  requetsId?: string;
};

const initialState: requestFormState = {
  formState: "add",
  values: {},
  requetsId: undefined,
};

const requestFormSlice = createSlice({
  name: "requestForm",
  initialState,
  reducers: {
    setFormState: (state, action) => {
      state.formState = action.payload;
    },
    setRequestId: (state, action) => {
      state.requetsId = action.payload;
    },
    setCurrentValues: (state, action) => {
      state.values = action.payload;
    },
  },
});

export const { setFormState, setRequestId, setCurrentValues } =
  requestFormSlice.actions;

export default requestFormSlice.reducer;

export const selectCurrentFromState = (state: RootState) =>
  state.requestForm.formState;
export const selectCurrentValues = (state: RootState) =>
  state.requestForm.values;
export const selectCurrentRequestId = (state: RootState) =>
  state.requestForm.requetsId;
