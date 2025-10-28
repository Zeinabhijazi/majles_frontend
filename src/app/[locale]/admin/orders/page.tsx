"use client"; 
import React, { useEffect, useState } from "react"; 
import { Box, Grid, Typography } from "@mui/material"; 
import BasicDatePicker from "@/components/Forms/datePicker"; 
import { useTranslations } from "next-intl"; 
import AppSelect from "@/components/Forms/AppSelect"; 
import { fetchOrders } from "@/redux/slices/orderSlice"; 
import { useDispatch } from "react-redux"; 
import { AppDispatch } from "@/redux/store";  
import OrderDataGrid from "@/components/Tables/order/OrderDataGrid";
import { Dayjs } from "dayjs";

export default function OrdersAdminPage() { 
  const t1 = useTranslations("heading"); 
  const t2 = useTranslations("select"); 
  const [status, setStatus] = useState(""); 
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!selectedDate) {
        dispatch(fetchOrders({ status }));
        return;
      }
      const start = selectedDate.startOf("day").valueOf();
      const end = selectedDate.endOf("day").valueOf();
      dispatch(fetchOrders({ start, end, status }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [selectedDate, dispatch, status]);

  useEffect(() => {
    if (!selectedDate) {
      dispatch(fetchOrders({ status }));
    }
  }, [status, dispatch]);
  
  return ( 
    <Box component="section"> 
      <Typography 
        variant="h2" 
        sx={{ fontSize: 23, fontWeight: 700, color: "primary.main", mb: 2, }} 
      >
         {t1("ordersPageTitle")} 
      </Typography> 
      <Grid 
        container 
        sx={{ 
          mt: 1, 
          mb: 1.5, 
          display: "flex", 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center"
        }} 
      > 
        <Grid size={7}> 
          <BasicDatePicker 
            value={selectedDate}
            onChange={setSelectedDate}
          /> 
        </Grid> 
        <AppSelect 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          placeholder={t2("status")} 
          options={[ 
            { value: "all", label: t2("all") },
            { value: "assigned", label: t2("assigned") },
            { value: "notAssigned", label: t2("notAssigned") },
          ]} 
        /> 
      </Grid> 
      <OrderDataGrid 
        status={status}
        selectedDate={selectedDate}
      />
    </Box> 
  ); 
}
