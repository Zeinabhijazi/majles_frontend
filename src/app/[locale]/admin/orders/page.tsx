"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import BasicDatePicker from "@/components/AdminUI/datePicker";
import { useTranslations } from "next-intl";
import OrderTable from "@/components/Tables/orderTable";
import AppSelect from "@/components/Forms/AppSelect";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

export default function OrdersAdminPage() {
  const t = useTranslations("heading");
  const t1 = useTranslations("select");
  const [status, setStatus] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrders({ status: status }));
  }, [dispatch, status]);

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
        {t("ordersPageTitle")}
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
        <AppSelect
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
          placeholder={t1("status")}
          options={[
            { value: "all", label: t1("all") },
            { value: "assigned", label: t1("assigned") },
            { value: "notAssigned", label: t1("notAssigned") },
          ]}
        />
      </Grid>
      <OrderTable />
    </Box>
  );
}
