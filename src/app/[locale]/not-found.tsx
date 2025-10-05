"use client";
import React from "react";
import { 
  Box, 
  Link, 
  Typography 
} from "@mui/material";
//import Image from "next/image";
//import "../../../middleware";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation(); 
  return (
    <Box>
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {/* <Image src="/notFound.png" alt="Not Found Logo" width={200} height={200} /> */}
        <Typography variant="h2" sx={{ my: 2, fontSize: 20, fontWeight: 700 }}>
          {t('notFound.title')}
        </Typography>
        <Typography variant="h5" sx={{ my: 2, fontSize: 20, fontWeight: 500 }}>
          {t('notFound.subTitle')}
        </Typography>
        <Link
          sx={{
            fontSize: 15,
            textDecoration: "underline",
            color: "blue",
          }}
          href="/"
        >
          {t('notFound.link')}
        </Link>
      </Box>
    </Box>
  );
}
