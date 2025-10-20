"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import SearchInput from "@/components/Forms/SearchInput";
import AppSelect from "@/components/Forms/AppSelect";
import ClientDataGrid from "@/components/Tables/order/ClientDataGrid";

export default function ClientPage() {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("select");
  const t3 = useTranslations("searchInput");

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({ status: status }));
  }, [dispatch, status]);

  const handleUserSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <Box component={"section"}>
      <Typography
        variant="h2"
        sx={{
          fontSize: 23,
          fontWeight: 700,
          color: "primary.main",
        }}
      >
        {t1("clientPageTitle")}
      </Typography>
      <Grid
        spacing={10}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <AppSelect
          value={status}
          onChange={(e) => setStatus(e.target.value as string)}
          placeholder={t2("status")}
          options={[
            { value: "all", label: t2("all") },
            { value: "pending", label: t2("pending") },
            { value: "completed", label: t2("completed") },
            { value: "accepted", label: t2("accepted") },
            { value: "rejected", label: t2("rejected") },
          ]}
        />
        <SearchInput
          placeholder={t3("orderSearch")}
          onSearch={handleUserSearch}
        />
      </Grid>
      <ClientDataGrid status={status} search={search} />
    </Box>
  );
}
