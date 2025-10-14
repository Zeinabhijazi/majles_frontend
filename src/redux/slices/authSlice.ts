import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { loadUserData } from "./userSlice";
interface AuthState {
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "LOGIN",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("api/auth/signin", { email, password });

      // Save token and user data to LocalStorage
      const { token, ...userData } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userDetails", JSON.stringify(userData));

      // update userSlice with details
      dispatch(loadUserData(userData));

      return userData;
    } catch (error: any) {
      return rejectWithValue("Failed to Login");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to login";
      });
  },
});

export default authSlice.reducer;
