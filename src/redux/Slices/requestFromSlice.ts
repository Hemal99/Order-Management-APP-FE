import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type requestFormState = {
  formState: "add" | "edit" | "view";
  initialValues: any;
  requetsId?: string;
};

const initialState: requestFormState = {
  formState: "add",
  initialValues: {},
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
    }
  },
});

export const { setFormState, setRequestId } = requestFormSlice.actions;

export default requestFormSlice.reducer;

export const selectCurrentFromState = (state: RootState) => state.requestForm.formState;
export const selectCurrentValues = (state: RootState) => state.requestForm.initialValues;
export const selectCurrentRequestId = (state: RootState) => state.requestForm.requetsId;
