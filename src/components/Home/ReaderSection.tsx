import { Box, Typography } from "@mui/material";
import React from "react";
import Carousel from "./Carousel";
import { useTranslations } from "next-intl";

export default function ReaderSection() {
  const t = useTranslations("heading");
  return (
    <Box component="section" id="readers">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "700",
          textAlign: "start",
          paddingInlineStart: 2,
          mt: 7,
          mb: 5,
          pl: 2,
        }}
      >
        {t("readerSectionTitle")}
      </Typography>
      <Carousel />
    </Box>
  );
}
