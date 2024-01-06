import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "../../utils/axios";

type TableRow = {
  date: string;
  ItemName: string;
  qty: number;
  price: string;
  CodeNumber: string;
  image: string;
};

type TableState = {
  tableData: TableRow[];
  loading: boolean;
  error: string | null;
};

const initialState: TableState = {
  tableData: [],
  loading: false,
  error: null,
};

const fetchDataThunk = createAsyncThunk("table/fetchData", async () => {
  try {
    const response = await axios.get("/user/get-all-request");
    return response.data;
  } catch (error) {
    throw error;
  }
});

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tableData = action.payload;
      })
      .addCase(fetchDataThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export { fetchDataThunk };

export default tableSlice.reducer;

export const selectTableState = (state: RootState) => state.table;