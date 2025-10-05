"use client";
import React from "react";
import { Box } from "@mui/material";
import UserInformation from "@/components/UserInformation";

export default function ProfileReaderPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <UserInformation />
    </Box>
  );
}
