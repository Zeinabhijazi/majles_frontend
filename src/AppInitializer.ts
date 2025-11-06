 "use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserData } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import { loadAuthData } from "./redux/slices/authSlice";

export default function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserData());
    dispatch(loadAuthData());
  }, [dispatch]);

  return null; 
}
