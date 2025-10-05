import React, { useState, useEffect } from "react";
import {
  InputLabel,
  FormControl,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { useTranslations } from "next-intl";

const OrderSelect = () => {
  const t = useTranslations("order");
  const t1 = useTranslations("Form");
  const [status, setStatus] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrders({ status: status }));
  }, [dispatch, status]);

  return (
    <Grid size={5} sx={{display: "flex", justifyContent: "end", gap: 2}}>

      <FormControl size="small">
        <InputLabel>
          {t("status")}
        </InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            height: 40,
            width: 200,
          }}
        >
          <MenuItem value="all">{t1("all")}</MenuItem>
          <MenuItem value="assigned">{t("assigned")}</MenuItem>
          <MenuItem value="notAssigned">{t("notAssigned")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default OrderSelect;
