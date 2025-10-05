"use client";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";

function Search() {
  const t = useTranslations("Form")
  const t1 = useTranslations("user");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>()

  const handleSearch = () => {
    dispatch(fetchUsers({search}));
  };
  const handleResetFilters = () => {
    setSearch("");
    dispatch(fetchUsers({}));
  };
  return (
    <div className="relative flex">
      <input
        className="peer block w-[240px] border-1 border-gray-400 rounded-md outline-0 py-[9px] pl-10 text-sm placeholder:text-gray-700 text-zinc-950"
        placeholder={t1("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-600 peer-focus:text-dark-900" />
      <Button 
        variant="contained"
        color="secondary"
        onClick={handleSearch}
        sx={{
          mx: 0.5,
        }}
      > 
        {t("searchbtn")}
      </Button>
      <Button 
        color="secondary"
        variant="contained"
        onClick={handleResetFilters}
      >
        {t("resetbtn")}
      </Button>
    </div>
  );
};

export default Search;
