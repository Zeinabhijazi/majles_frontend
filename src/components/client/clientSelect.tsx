import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Grid } from "@mui/material";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useTranslations } from "next-intl";

const ClientSelect = () => {
  const t = useTranslations("select");
  const [status, setStatus] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({ status: status }));
  }, [dispatch, status]);

  return (
    <Grid size={5} sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
      <FormControl size="small">
        <InputLabel>{t("status")}</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{
            height: 40,
            width: 200,
          }}
        >
          <MenuItem value="all">{t("all")}</MenuItem>
          <MenuItem value="pending">{t("pending")}</MenuItem>
          <MenuItem value="completed">{t("completed")}</MenuItem>
          <MenuItem value="rejected">{t("rejected")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default ClientSelect;
