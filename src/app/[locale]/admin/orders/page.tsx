"use client"; 
import React, { useEffect, useState } from "react"; 
import { Box, Grid, Typography } from "@mui/material"; 
import BasicDatePicker from "@/components/Forms/datePicker"; 
import { useTranslations } from "next-intl"; 
import AppSelect from "@/components/Forms/AppSelect"; 
import { fetchOrders } from "@/redux/slices/orderSlice"; 
import { useDispatch } from "react-redux"; 
import { AppDispatch } from "@/redux/store";  
import OrderDataGrid from "@/components/Tables/order/order";

export default function OrdersAdminPage() { 
  const t1 = useTranslations("heading"); 
  const t2 = useTranslations("select"); 
  const [status, setStatus] = useState(""); 
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => { 
    dispatch(fetchOrders({ status: status })); 
  }, [dispatch, status]); 
  
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
          <BasicDatePicker /> 
        </Grid> 
        <AppSelect 
          value={status} 
          onChange={(e) => setStatus(e.target.value as string)} 
          placeholder={t2("status")} 
          options={[ 
            { value: "all", label: t2("all") },
            { value: "assigned", label: t2("assigned") },
            { value: "notAssigned", label: t2("notAssigned") },
          ]} 
        /> 
      </Grid> 
      <OrderDataGrid />
    </Box> 
  ); 
}

