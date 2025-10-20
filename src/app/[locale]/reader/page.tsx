"use client";
import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CardData from "@/components/Statistics/dataCard";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useLocale, useTranslations } from "next-intl";
import PendingOrdersDataGrid from "@/components/Tables/order/pendingOrders";
import ReaderDataGrid from "@/components/Tables/order/ReaderDataGrid";

export default function ReaderPage() {
  const t = useTranslations("readerDashboard");
  const { totalOrders, pendingItemsCount, completedItemsCount } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({}));
  }, [dispatch]);

  const locale = useLocale();
  const currentMonth = new Date().toLocaleString(locale, { month: "long" });

  return (
    <Box component="section">
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <CardData text={t("pendingOrder")} data={pendingItemsCount} />
        <CardData text={t("completedOrder")} data={completedItemsCount} />
        <CardData text={t("allOrders")} data={totalOrders} />
      </Box>
      <Grid
        container
        sx={{ height: 430, display: "flex", flexDirection: "row", gap: 2, mt: 2 }}
      >
        <Grid size={6}>
          <Typography variant="h5" color="primary">
            Pending Orders:
          </Typography>
          <PendingOrdersDataGrid />
        </Grid>
        <Grid size={5.8}>
          <Typography variant="h5" color="primary">
            Orders in this {currentMonth}:
          </Typography>
          <ReaderDataGrid />
        </Grid>
      </Grid>
    </Box>
  );
}
