"use client";
import React, { useEffect } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// { loadUserData } from "@/redux/slices/userSlice";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

const cache = createCache({ key: "css", prepend: true });

export default function ThemeRegistry({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch<AppDispatch>();

  /*useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);*/

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
