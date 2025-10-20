"use client";
import React from "react";
import { Box } from "@mui/material";
import UserInformation from "@/components/Dashboard/UserInformation";

export default function ProfileAdminPage() {
  return (
    <Box sx={{ width: "100%" }}>
      <UserInformation />
    </Box>
  );
}
