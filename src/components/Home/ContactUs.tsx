import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import ContactForm from "../Forms/ContactForm";

export default function ContactUs() {
  const t = useTranslations("heading");
  return (
    <Box component="section" id="contact">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "700",
          textAlign: "center",
          mt: 7,
          mb: 5,
          pl: 2,
        }}
      >
        {t("contactSectionTitle")}
      </Typography>
      <ContactForm />
    </Box>
  );
}
