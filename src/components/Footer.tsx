import React from "react";
import { Box, Typography } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <Box
      height={40}
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "row",
        justifyContent: "end",
        alignItems: "center",
        boxShadow: 24,
        pr: 2,
      }}
    >
      <CopyrightIcon sx={{ fontSize: "20px", pr: 0.5 }} />
      <Typography variant="body1" sx={{ mt: 0.1 }}>
        {t("text")}
      </Typography>
    </Box>
  );
}
