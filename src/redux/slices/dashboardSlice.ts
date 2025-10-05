import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface DashboardState {
  userCounts: { readers: number; clients: number };
  orderStatus: { accepted: number; cancelled: number; pending: number };
  error: string | null;
}

const initialState: DashboardState = {
  userCounts: { readers: 0, clients: 0 },
  orderStatus: { accepted: 0, cancelled: 0, pending: 0 },
  error: null,
};

export const fetchUserCounts = createAsyncThunk(
  "FETCHUSERCOUNTS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("api/dashboard/counts");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch counts");
    }
  }
);

export const fetchStatus = createAsyncThunk(
  "FETCHSTATUS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("api/order/status");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.userCounts = action.payload;
      })
      .addCase(fetchUserCounts.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchStatus.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      })
      .addCase(fetchStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch order status";
      });
  },
});

export default dashboardSlice.reducer;
