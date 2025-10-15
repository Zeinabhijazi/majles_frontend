"use client";
import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CardData from "@/components/Statistics/dataCard";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useTranslations } from "next-intl";
import ReaderCompletedTable from "@/components/Reader/readerCompletedTable";
import ReaderPendingTable from "@/components/Reader/readerPendingTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { date } from "zod";

export default function ReaderPage() {
  const t = useTranslations("readerDashboard");
  const { totalOrders, pendingItemsCount, completedItemsCount } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({}));
  }, [dispatch]);

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
      <Grid container sx={{ border: "1px solid red", height: 420, display: "flex", flexDirection: "row" }}>
        <Grid size={12} sx={{ display: "flex", height: 210, flexDirection: "column" }}>
            <Typography variant="h6" color="primary">
                {" "}
                Pending Orders
            </Typography>
          <ReaderPendingTable />
        </Grid>
        <Grid size={12} sx={{ display: "flex", height: 210, flexDirection: "column" }}>
            <Typography variant="h6" color="primary">
              {" "}
              Completed Orders
            </Typography>
          <ReaderCompletedTable />
        </Grid>
      </Grid>
    </Box>
  );
}
