import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    // Slices
    dashboard: dashboardReducer,
    user: userReducer,
    order: orderReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
