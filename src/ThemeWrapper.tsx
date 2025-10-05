"use client";

import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "@/theme";

export default function ThemeWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Apply theme globally */}
      {children}
    </ThemeProvider>
  );
}
