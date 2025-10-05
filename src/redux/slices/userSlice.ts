import api from "@/lib/axios";
import { ApiResponse } from "@/types/apiResponse";
import { PaginationDto } from "@/types/pagination";
import { UpdateUser } from "@/types/updateUser";
import { User } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserDetails {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  addressOne: string;
  addressTwo?: string;
  country: string;
  city: string;
  postNumber: number;
  email?: string;
  userType?: string;
}

interface UserState {
  users: User[];
  userDetails: UserDetails;
  successMessage: string;
  isLoading: boolean;
  error: string | null;
  pageCount: number;
  itemsCount: number;
}

// Define the initial state using User type
const initialState: UserState = {
  users: [],
  userDetails: {
    firstName: "",
    lastName: "",
    gender: "",
    latitude: 0,
    longitude: 0,
    addressOne: "",
    addressTwo: "",
    country: "",
    city: "",
    postNumber: 0,
    phoneNumber: "",
    email: "",
  },
  successMessage: "",
  isLoading: false,
  error: null,
  pageCount: 0,
  itemsCount: 0,
};

type FetchUsersArgs = {
  page?: number;
  limit?: number;
  userType?: string;
  isDeleted?: string;
  search?: string;
};

// Fetch all users or filters
export const fetchUsers = createAsyncThunk(
  "FETCHUSERS",
  async (
    { page = 1, limit = 10, userType, isDeleted, search }: FetchUsersArgs,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<User>>>(
        `api/admin/allUsers?page=${page}&limit=${limit}`,
        {
          params: {
            ...(userType && userType !== "all" ? { userType } : {}),
            ...(isDeleted && isDeleted !== "all" ? { isDeleted } : {}),
            ...(search ? { search } : {}),
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

// Fetch specific user details
export const fetchUserDetails = createAsyncThunk(
  "FETCHUSERSDETAILS",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<UserDetails>>("api/user");
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

// Fetch all reader
export const fetchReaders = createAsyncThunk(
  "FETCHREADERS",
  async ({ page = 1, limit = 10 }: FetchUsersArgs, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<PaginationDto<User>>>(
        `api/dashboard/allReaders?page=${page}&limit=${limit}&userType=reader`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

// To delete a user
export const deleteUser = createAsyncThunk<
  { userId: number; message: string },
  number,
  { rejectValue: string }
>("DELETEDUSER", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`api/admin/${userId}`);
    if (!response.data.success) {
      return rejectWithValue("Failed to delete user");
    }
    return {
      userId,
      message: `User of id: ${userId} deleted successfully`,
    };
  } catch (error) {
    return rejectWithValue("Failed to delete users");
  }
});

// To update a user
export const updateUser = createAsyncThunk<
  { user: UserDetails; message: string }, // return type
  UpdateUser, // argument type
  { rejectValue: string }
>("UPDATEUSER", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.put("api/user", formData);

    if (!response.data.success) {
      return rejectWithValue("Failed to update user");
    }
    return {
      user: response.data.data,
      message: `User Updated successfully`,
    };
  } catch (error) {
    return rejectWithValue("Failed to update users");
  }
});

// Create the slices
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = "";
      state.error = null;
    },
    loadUserData: (state) => {
      state.userDetails = JSON.parse(localStorage.getItem("userDetails") ?? "{}")
    } 
  }, // Contain the functions which will modify the state
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user details";
      })
      .addCase(fetchReaders.fulfilled, (state, action) => {
        state.users = action.payload.content;
        state.itemsCount = action.payload.itemsCount;
        state.pageCount = action.payload.pageCount;
      })
      .addCase(fetchReaders.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user details";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const { userId, message } = action.payload;
        const user = state.users.find((u) => u.id === userId);
        if (user) {
          user.isDeleted = true;
        }
        state.successMessage = message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload || "Delete failed";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.successMessage = message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload || "Update failed";
      });
  },
});

export const { clearSuccessMessage, loadUserData } = userSlice.actions;

// Export the created slice
export default userSlice.reducer;
