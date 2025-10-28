import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { Order } from "@/types/order";
import { PaginationDto } from "@/types/pagination";
import { OrderForEdit } from "@/types/orderForEdits";

interface OrderState {
  isLoading: boolean;
  orders: Order[];
  error: string | null;
  successMessage: string | null;
  successType: "assign" | "cancel" | "update" | "accept" | null;
  pageCount: number;
  itemsCount: number;
  itemsCountWithDel: number;
  pendingItemsCount: number;
  completedItemsCount: number;
  totalOrders: number;
}

const initialState: OrderState = {
  isLoading: false,
  orders: [],
  error: null,
  successMessage: null,
  successType: null,
  pageCount: 0,
  itemsCount: 0,
  itemsCountWithDel: 0,
  pendingItemsCount: 0,
  completedItemsCount: 0,
  totalOrders: 0,
};

type FetchOrdersArgs = {
  page?: number;
  limit?: number;
  status?: string;
  start?: number; // timestamp (ms)
  end?: number; // timestamp (ms)
  search?: string;
  thisMonth?: boolean;
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

// Assign reader for order
export const handleAssignReader = createAsyncThunk<
  { orderId: number; readerId: number; message: string }, // return type
  { readerId: number; orderId: number }, // arguments
  { rejectValue: string }
>("ASSIGNREADER", async ({ readerId, orderId }, { rejectWithValue }) => {
  try {
    const response = await api.put(`api/admin/${orderId}`, {
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
    { page = 1, limit = 10, status, search, start, end, thisMonth }: FetchOrdersArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<Order>>>(
        `api/order?page=${page}&limit=${limit}`,
        {
          params: {
            ...(status && status !== "all" ? { status } : {}),
            ...(search ? { search } : {}),
            ...(start ? { start } : {}),
            ...(end ? { end } : {}),
            ...(thisMonth ? { thisMonth } : {}),
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch orders of this user");
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
    const response = await api.delete(`api/order/${orderId}`);
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

// To update an order
export const updateOrder = createAsyncThunk(
  "UPDATEORDER",
  async (
    { formData, orderId }: { formData: OrderForEdit; orderId: number | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`api/order/${orderId}`, formData);

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

// Accept order by reader
export const handleAccept = createAsyncThunk(
  "ACCEPTORDER", 
  async (
    { orderId, readerId } : { orderId: number, readerId: number}, 
    { rejectWithValue }
  ) => {
  try {
    const response = await api.put(`api/order/${orderId}`, {
      readerId: readerId,
    });

    if (!response.data.success) {
      return rejectWithValue("Failed to accept this order");
    }

    return {
      orderId,
      readerId,
      message: "Accepted successfully",
    };
  } catch (error: any) {
    return rejectWithValue("Failed to accept order");
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
        const { orderId, readerId, message } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.isAccepted = true;
          order.readerId = readerId;
        }
        state.successMessage = message;
        state.successType = "assign";
      })
      .addCase(handleAssignReader.rejected, (state, action) => {
        state.error = action.payload || "Failed to assign";
      })
      .addCase(fetchOrdersForLoggedUser.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchOrdersForLoggedUser.fulfilled, (state, action) => {
        state.orders = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
        state.completedItemsCount = action.payload.completedItemsCount;
        state.pendingItemsCount = action.payload.pendingItemsCount;
        state.totalOrders = action.payload.totalOrders;
      })
      .addCase(fetchOrdersForLoggedUser.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch orders of this client";
      })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const { orderId, message } = action.payload;
        state.orders = state.orders.map((o) =>
          o.id === orderId ? { ...o, isDeleted: true } : o
        );
        state.successMessage = message;
        state.successType = "cancel";
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
      })
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
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
        state.error =
          action.error.message || "Failed to update an order";
      })
      .addCase(handleAccept.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleAccept.fulfilled, (state, action) => {
        const { orderId, readerId } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.isAccepted = true;
          order.readerId = readerId;
        }
        state.successType = "accept";
        state.successMessage = action.payload.message;
      })
      .addCase(handleAccept.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to accept order";
      });
  },
});

export const { clearSuccessMessage } = orderSlice.actions;

export default orderSlice.reducer;
