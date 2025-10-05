import React from "react";
import { Box, Typography } from "@mui/material";
import BasicTimeline from "./TimeLine";
import { useTranslations } from "next-intl";

export default function AboutUs() {
  const t = useTranslations("homePage");
  return (
    <Box component="section" id="about">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "700",
          textAlign: "left",
          mt: 7,
          mb: 5,
          pl: 2,
        }}
      >
        {t("aboutTitle")}
      </Typography>
      <BasicTimeline />
    </Box>
  );
}
