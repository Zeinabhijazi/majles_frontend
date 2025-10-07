"use client";
import React, { useState, MouseEvent, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserDetails } from "@/redux/slices/userSlice";

export default function Header() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Handle language
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const changeLanguage = (lng: string) => {
    if (lng !== locale) {
      router.replace(pathname, { locale: lng });
      router.refresh();
    }
    handleClose();
  };

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
        {t("welcome")} {userDetails.firstName} {userDetails.lastName}
      </Typography>
      <Box>
        <IconButton aria-controls="notification-menu" aria-haspopup="true">
          <NotificationsIcon color="secondary" />
        </IconButton>
        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <LanguageIcon color="secondary" />
        </IconButton>

        {/* Language Menu */}
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
          <MenuItem onClick={() => changeLanguage("ar")}>Arabic</MenuItem>
          <MenuItem onClick={() => changeLanguage("fr")}>French</MenuItem>
          <MenuItem onClick={() => changeLanguage("de")}>Deutsch</MenuItem>
        </Menu>

      </Box>
    </Paper>
  );
}
