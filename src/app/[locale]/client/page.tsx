"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ClientSelect from "@/components/client/clientSelect";
import ClientTable from "@/components/client/clientTable";
import SearchClient from "@/components/client/searchClient";
import { useTranslations } from "next-intl";

export default function ClientPage() {
  const t = useTranslations("heading")
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
        {t("clientPageTitle")}
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
        <SearchClient />
        <ClientSelect />
      </Grid>
      <ClientTable />
    </Box>
  );
}
