import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { Order } from "@/types/order";
import { OrderForEdit } from "@/types/orderForEdits";
import { PaginationDto } from "@/types/pagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OrderState {
  isLoading: boolean;
  error: string | null;
  orders: Order[];
  pageCount: number;
  itemsCount: number;
  itemsCountWithDel: number;
  successMessage: string | null;
  successType: "assign" | "cancel" | "update" | null;
}

const initialState: OrderState = {
  isLoading: false,
  error: null,
  orders: [],
  pageCount: 0,
  itemsCount: 0,
  itemsCountWithDel: 0,
  successMessage: null,
  successType: null,
};

type FetchOrdersArgs = {
  page?: number;
  limit?: number;
  status?: string;
  start?: number; // timestamp (ms)
  end?: number;
  search?: string;
};

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "FETCHORDERS",
  async (
    { page = 1, limit = 10, status, start, end }: FetchOrdersArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<Order>>>(
        `admin/allOrders?page=${page}&limit=${limit}`,
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

// Assign reader for order
export const handleAssignReader = createAsyncThunk<
  { orderId: number; readerId: number; message: string }, // return type
  { readerId: number; orderId: number }, // arguments
  { rejectValue: string }
>("ASSIGNREADER", async ({ readerId, orderId }, { rejectWithValue }) => {
  try {
    const response = await api.put(`admin/${orderId}`, {
      readerId: readerId,
    });

    if (!response.data.success) {
      return rejectWithValue("Failed to assign a reader");
    }

    return {
      orderId,
      readerId,
      message: "Assigned successfully",
    };
    
  } catch (error: any) {
    return rejectWithValue("Failed to assign reader");
  }
});

// Fetch the orders of user
export const fetchOrdersForLoggedUser = createAsyncThunk(
  "FETCHORDERSFORLOGGEDUSER",
  async (
    { page = 1, limit = 10, status, search }: FetchOrdersArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<Order>>>(
        `order?page=${page}&limit=${limit}`,
        {
          params: {
            ...(status && status !== "all" ? { status } : {}),
            ...(search ? { search } : {}),
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch orders of this user");
    }
  }
);

// To update an order
export const updateOrder = createAsyncThunk(
  "UPDATEORDER",
  async (
    { formData, orderId }: { formData: OrderForEdit; orderId: number | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`order/${orderId}`, formData);

      if (!response.data.success) {
        return rejectWithValue("Failed to update order");
      }

      return {
        order: response.data.data,
        message: "Order Updated Successfully",
      };
    } catch (error) {
      return rejectWithValue("Failed to update order");
    }
  }
);

// To cancel an order
export const cancelOrder = createAsyncThunk<
  { orderId: number; message: string },
  number,
  { rejectValue: string }
>("DELETEDORDER", async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`order/${orderId}`);
    if (!response.data.success) {
      return rejectWithValue("Failed to delete order");
    }
    return {
      orderId,
      message: "Deleted successfully",
    };
  } catch (error) {
    return rejectWithValue("Failed to delete order");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
        state.itemsCountWithDel = action.payload.itemsCountWithDel;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(handleAssignReader.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(handleAssignReader.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, readerId, message } = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status: "accepted", readerId: readerId }
            : order
        );
        state.successMessage = message;
        state.successType = "assign";
      })
      .addCase(handleAssignReader.rejected, (state, action) => {
        state.error = action.payload || "Failed to assign reader to order ";
      })
      .addCase(fetchOrdersForLoggedUser.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersForLoggedUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(fetchOrdersForLoggedUser.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch orders of this client";
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...updatedOrder,
          };
        }
        state.successType = "update";
        state.successMessage = action.payload.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update an order";
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const { orderId, message } = action.payload;
        state.orders = state.orders.map((o) =>
          o.id === orderId ? { ...o, status: "deleted" } : o
        );
        state.successType = "cancel";
        state.successMessage = message; 
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { clearSuccessMessage } = orderSlice.actions;

export default orderSlice.reducer;
