"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "@/theme";

export default function ThemeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent mismatched render between server and client
    return null;
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Apply theme globally */}
      {children}
    </ThemeProvider>
  );
}
