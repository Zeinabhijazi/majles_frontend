import { Grid, Typography } from "@mui/material";
import React from "react";
import CustomizedAccordions from "./accordion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MainSection() {
  const t = useTranslations("banner");
  return (
    <Grid container height="450px">
      <Grid
        size={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
          my: 5,
        }}
      >
        <Typography variant="h6">{t("title")}</Typography>
        <Typography variant="body2">{t("body")}</Typography>
        <CustomizedAccordions />
      </Grid>
      <Grid size={6} sx={{ p: 4 }}>
        <Image
          src="/mainSection.jpg"
          width={500}
          height={700}
          alt="main"
          style={{ width: "700px", height: "410px", borderRadius: "12px" }}
          priority
        />
      </Grid>
    </Grid>
  );
}
