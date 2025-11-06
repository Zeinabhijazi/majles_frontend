"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CardData from "@/components/Statistics/dataCard";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useLocale, useTranslations } from "next-intl";
import PendingOrdersDataGrid from "@/components/Tables/order/pendingOrders";
import ReaderDataGrid from "@/components/Tables/order/ReaderDataGrid";
import BasicDatePicker from "@/components/Forms/datePicker";
import { Dayjs } from "dayjs";

export default function ReaderPage() {
  const t1 = useTranslations("readerDashboard");
  const t2 = useTranslations("dashboard");
  const { acceptedItemsCount, pendingItemsCount, completedItemsCount, rejectedItemsCount } = useSelector(
    (state: RootState) => state.order
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const locale = useLocale();
  const currentMonth = new Date().toLocaleString(locale, { month: "long" });
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!selectedDate) {
        dispatch(fetchOrdersForLoggedUser({}));
        return;
      }
      const start = selectedDate.startOf("day").valueOf();
      const end = selectedDate.endOf("day").valueOf();
      dispatch(fetchOrdersForLoggedUser({ start, end }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedDate, dispatch]);


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
        <CardData text={t1("pendingOrder")} data={pendingItemsCount} />
        <CardData text={t1("completedOrder")} data={completedItemsCount} />
        <CardData text={t1("acceptedOrder")} data={acceptedItemsCount} />
        <CardData text={t1("rejectedOrder")} data={rejectedItemsCount} />
      </Box>
      <Box
        component={"section"}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h5" color="primary">
              {currentMonth} {t2("orders")}:
            </Typography>
            <BasicDatePicker value={selectedDate} onChange={setSelectedDate} />
          </Box>
          <ReaderDataGrid />
        </Box>
        <Box>
          <Typography variant="h5" color="primary">
            {t1("pendingOrder")}:
          </Typography>
          <PendingOrdersDataGrid />
        </Box>
      </Box>
    </Box>
  );
}
