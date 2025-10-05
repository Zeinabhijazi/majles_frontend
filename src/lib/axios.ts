import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // Nest API base URL
  timeout: 10000, // optional: 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request interceptor (e.g., auth token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or cookies/session
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized → maybe token expired
      console.warn("Unauthorized! Redirecting to login...");
      // redirect or refresh token
    } else if (error.response?.status === 500) {
      console.error("Server error, try again later");
    }
    //return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const authorization = response.headers["authorization"];

    if (authorization) {
      // Extras.saveToken ( authorization );
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Optional: clear token and redirect
      
    }
    //return Promise.reject(error);
    console.log(error);
  }
);

export default api;
