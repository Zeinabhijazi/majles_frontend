"use client";
import React, { useEffect, useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onSearch
}) => {
  const [value, setValue] = useState("");

  // Debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (onSearch) onSearch(value);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  // Clear input handler
  const handleClear = () => {
    setValue("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="flex items-center space-x-2">
      <TextField
        variant="outlined"
        size="small"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        sx={{ 
          width: 260, 
          "& .MuiOutlinedInput-input": {
            color: "primary.main", 
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: "gray",
            opacity: 1,
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

export default SearchInput;
