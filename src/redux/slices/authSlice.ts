import api from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadUserData } from "./userSlice";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  successMessage: string;
}

const initialState: AuthState = {
  isLoading: false, 
  error: null,
  successMessage: "",
};

export const login = createAsyncThunk(
  "LOGIN",
  async ({ email, password }: { email: string; password: string }, { dispatch }) => {
    try {
        const response = await api.post("api/auth/signin", { email, password });

        // Save token to LocalStorage
        const {token, ...userData} = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userDetails", JSON.stringify(userData));
        
        // update userSlice with details
        dispatch(loadUserData(userData));

        return {
          userData,
          message: "Login Successfully"
        };
    } catch (error: any) {
      console.log(error);
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
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to login";
      })
  },
});

export default authSlice.reducer;
