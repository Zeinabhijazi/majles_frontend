"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import OrderTable from "@/components/AdminUI/orderTable";
import OrderSelect from "@/components/AdminUI/orderSelect";
import BasicDatePicker from "@/components/AdminUI/datePicker";
import { useTranslations } from "next-intl";

export default function OrdersAdminPage() {
  const t = useTranslations("order");
  return (
    <Box component="section">
      <Typography
        variant="h2"
        sx={{
          fontSize: 23,
          fontWeight: 700,
          color: "primary.main",
          mb: 2,
        }}
      >
        {t("title")}
      </Typography>
      <Grid
        container
        sx={{
          mt: 1,
          mb: 1.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          
        }}
      >
        <Grid size={7}>
          <BasicDatePicker />
        </Grid>
        <OrderSelect />
      </Grid>
      <OrderTable />
    </Box>
  );
}
