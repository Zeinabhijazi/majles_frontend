import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { Order } from "@/types/order";
import { PaginationDto } from "@/types/pagination";
interface OrderState {
  orders: Order[];
  successMessage: string;
  error: string | null;
  pageCount: number;
  itemsCount: number;
}

const initialState: OrderState = {
  orders: [],
  successMessage: "",
  error: null,
  pageCount: 0,
  itemsCount: 0,
};

type FetchOrdersArgs = {
  page?: number;
  limit?: number;
  status?: string;
  start?: number; // timestamp (ms)
  end?: number; // timestamp (ms)
};

export const fetchOrders = createAsyncThunk(
  "FETCHORDERS",
  async (
    { page = 1, limit = 10, status, start, end }: FetchOrdersArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<Order>>>(
        `api/admin/allOrders?page=${page}&limit=${limit}`,
        {
          params: {
            ...(status && status !== "all" ? { status } : {}),
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch orders");
    }
  }
);

export const handleAssignReader = createAsyncThunk<
  { orderId: number; readerId: number; message: string },
  { readerId: number; orderId: number },
  { rejectValue: string }
>("ASSIGNREADER", async ({ readerId, orderId }, { rejectWithValue }) => {
  if (!readerId) {
    return rejectWithValue("Please select a reader first");
  }

  try {
    const response = await api.put(`api/admin/${orderId}`, {
      readerId: readerId,
    });
    if (!response.data.success) {
      return rejectWithValue("Failed to delete order");
    }
    return {
      orderId,
      readerId,
      message: `order of id: ${orderId} assigned successfully`,
    };
  } catch (error: any) {
    return rejectWithValue("Failed to delete order");
  }
});

// Create the slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = "";
      state.error = null;
    },
  }, // Contain the functions which will modify the state
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(handleAssignReader.fulfilled, (state, action) => {
        const { orderId, readerId, message } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.isAccepted = true;
          order.readerId = readerId;
        }
        state.successMessage = message;
      })
      .addCase(handleAssignReader.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { clearSuccessMessage } = orderSlice.actions;

export default orderSlice.reducer;
