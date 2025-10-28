import api from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  isLoading: boolean;
  error: null | string;
  userCounts: { readers: number; clients: number };
  orderStatus: {
    accepted: number;
    deleted: number;
    pending: number;
    completed: number;
    rejected: number;
  };
  userRegistrationStatus: Record<string, number>; // key: month, value: count
}

const initialState: DashboardState = {
  isLoading: false,
  error: null,
  userCounts: { readers: 0, clients: 0 },
  orderStatus: {
    accepted: 0,
    deleted: 0,
    pending: 0,
    completed: 0,
    rejected: 0,
  },
  userRegistrationStatus: {},
};

export const fetchUserCounts = createAsyncThunk(
  "FETCHUSERCOUNTS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("dashboard/counts");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch user counts");
    }
  }
);

export const fetchUserRegistrationStatus = createAsyncThunk(
  "FETCHUSERREGISTRATIONSTATUS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("admin/status");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users registration status");
    }
  }
);

export const fetchOrderStatus = createAsyncThunk(
  "FETCHORDERSTATUS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("order/status");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to orders status");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCounts = action.payload;
      })
      .addCase(fetchUserCounts.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user counts";
      })
      .addCase(fetchUserRegistrationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRegistrationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRegistrationStatus = action.payload;
      })
      .addCase(fetchUserRegistrationStatus.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch users registration status";
      })
      .addCase(fetchOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderStatus = action.payload;
      })
      .addCase(fetchOrderStatus.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch orders status";
      });
  },
});

export default dashboardSlice.reducer;
