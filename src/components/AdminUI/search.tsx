"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslations } from "next-intl";

function Search() {
  const t1 = useTranslations("button");
  const t2 = useTranslations("searchInput");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // Debounce effect (auto-search after 500ms of no typing)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchUsers({ search }));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  // Clear input handler
  const handleClear = () => {
    setSearch("");
    dispatch(fetchUsers({}));
  };

  return (
    <div className="flex items-center space-x-2">
      <TextField
        variant="outlined"
        size="small"
        placeholder={t2("userSearch")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
            endAdornment: search && (
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

export default Search;
