import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

export default function BasicDatePicker() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSearchByDate = () => {
    if (!selectedDate) {
      dispatch(fetchOrders({ status }));
      return;
    }
    const startMs = selectedDate.startOf("day").valueOf(); // e.g. 2025-09-09T00:00:00+03 => epoch ms
    const endMs = selectedDate.endOf("day").valueOf(); // local 23:59:59.999 epoch ms
    dispatch(fetchOrders({ status, start: startMs, end: endMs }));
  };

  const handleResetFilters = () => {
    setSelectedDate(null);
    dispatch(fetchOrders({}));
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={t1("datePickerLabel")}
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          sx={{
            width: 250,
          }}
        />
      </LocalizationProvider>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSearchByDate}
        sx={{ mx: 0.5 }}
      >
        {t2("search")}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleResetFilters}
      >
        {t2("reset")}
      </Button>
    </>
  );
}
