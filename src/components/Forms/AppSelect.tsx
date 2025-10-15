"use client";

import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";

interface Option {
  value: string | number | boolean;
  label: string;
}

interface AppSelectProps {
  value: string | number | boolean;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Option[];
  placeholder?: string;
  width?: number | string;
  height?: number;
}

const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  width = 200,
  height = 40,
}) => {
  return (
    <FormControl size="small" sx={{ width }}>
      <Select
        value={String(value)}
        onChange={onChange}
        displayEmpty
        input={<OutlinedInput />}
        sx={{
          height,
          color: "primary.main",
          "& .MuiSelect-select:has(option[value=''])": {
            color: "#aaa",
          },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AppSelect;
