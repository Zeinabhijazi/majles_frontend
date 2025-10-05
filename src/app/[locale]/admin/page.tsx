"use client";
import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CardData from "@/components/AdminUI/dataCard";
import { useTranslations } from "next-intl";
import OrdersPieChart from "@/components/AdminUI/OrdersPieChart";
import UsersLineChart from "@/components/AdminUI/UsersLineChart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserCounts } from "@/redux/slices/dashboardSlice";
import { fetchOrders } from "@/redux/slices/orderSlice";

export default function AdminPage() {
  const t = useTranslations("dashboard");
  const { userCounts } = useSelector((state: RootState) => state.dashboard);
  const { orders } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();  
  useEffect(()=> {
    dispatch(fetchUserCounts());
    dispatch(fetchOrders({}));
  },[dispatch]);

  return (
    <Box>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          mb: 5,
        }}
      >
        <CardData text={t("clientNumber")} data={userCounts.clients} />
        <CardData text={t("readerNumber")} data={userCounts.readers} />
        <CardData text={t("orderNumber")}  data={orders.length} />
      </Box>
      <Grid 
        sx={{
          display: "flex",
          flexDirection: "row",
          width: '100%',
        }}
      >
        <Grid 
          sx={{
            width: '50%',
          }}
        >
          <OrdersPieChart />
        </Grid>
        <Grid 
          sx={{
            width: '50%',
          }}
        >
          <UsersLineChart />
        </Grid>
      </Grid>
    </Box>
  );
}
