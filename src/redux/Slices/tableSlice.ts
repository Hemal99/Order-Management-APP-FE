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
  pendingRequests: number;
};

const initialState: TableState = {
  tableData: [],
  loading: false,
  error: null,
  pendingRequests: 0,
};

const fetchDataThunk = createAsyncThunk(
  "table/fetchData",
  async ({ url }: { url: string }) => {
    try {
      const response = await axios.get(`/user/${url}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

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
        let pendingCount = 0;
        action.payload.forEach((element: any) => {
          if (element.status === "pending") {
            pendingCount += 1;
          }
        });
        state.pendingRequests = pendingCount;
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
