"use client";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { IconButton, InputAdornment } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslations } from "next-intl";
interface StyledDatePickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
}

export default function BasicDatePicker ({
  value,
  onChange,
}: StyledDatePickerProps) {
  const t = useTranslations("label");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            size: "small",
            placeholder: t("datePickerLabel"),
            sx: {
              width: 250, 
              color: "primary.main",
              "& .MuiInputBase-root": {
                height: 40, 
              },
            },
            InputProps: {
              endAdornment: value  && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onChange(null)}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
