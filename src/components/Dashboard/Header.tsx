"use client";
import React, { useEffect } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserDetails } from "@/redux/slices/userSlice";
import HomeIcon from "@mui/icons-material/Home";
import Language from "../includes/Language";

export default function Header() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  return (
    <Paper
      variant="elevation"
      square
      sx={{
        height: "55px",
        width: "100%",
        p: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "primary.main",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mt: 1,
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        {t("welcome")} {userDetails?.firstName} {userDetails?.lastName}
      </Typography>
      <Box className="flex flex-row">
        <IconButton
          aria-controls="home-menu"
          aria-haspopup="true"
          onClick={() => router.replace("/")}
        >
          <HomeIcon color="secondary" />
        </IconButton>
        <Language />
      </Box>
    </Paper>
  );
}
