import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { Order } from "@/types/order";

interface OrderState {
  isLoading: boolean;
  orders: Order[];
  error: string | null;
  successMessage: string | null;
  successType: "assign" | "cancel" | "update" | "accept" | null;
  pendingItemsCount: number;
  completedItemsCount: number;
  totalOrders: number;
  monthlyOrders: Order[];
  pendingOrders: Order[];
  itemsCountMonthly: number;
  itemsCountPending: number;
}

const initialState: OrderState = {
  isLoading: false,
  orders: [],
  error: null,
  successMessage: null,
  successType: null,
  pendingItemsCount: 0,
  completedItemsCount: 0,
  totalOrders: 0,
  monthlyOrders: [],
  pendingOrders: [],
  itemsCountMonthly: 0,
  itemsCountPending: 0,
};

// Accept order by reader
export const handleAccept = createAsyncThunk(
  "ACCEPTORDER", 
  async (
    { orderId, readerId } : { orderId: number, readerId: number}, 
    { rejectWithValue }
  ) => {
  try {
    const response = await api.put(`order/${orderId}`, {
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
      
      .addCase(handleAccept.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleAccept.fulfilled, (state, action) => {
        const { orderId, readerId } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          //order.isAccepted = true;
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
