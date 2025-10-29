"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@/i18n/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useTranslations } from "next-intl";
import Language from "./Language";
import LoginModal from "../Forms/LoginModal";
import RegisterModal from "../Forms/RegisterModal";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { logout } from "@/redux/slices/authSlice";
import { clearUserData } from "@/redux/slices/userSlice";

export default function MenuAppBar() {
  const t1 = useTranslations("navbar");
  const t2 = useTranslations("button");

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const { isLogin } = useSelector((state: RootState) => state.auth);
  const { userDetails } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserData());
  };

  // Actions for login modal
  const handleOpenLogin = () => setLoginOpen(true);
  const handleCloseLogin = () => setLoginOpen(false);

  // Actions for register modal
  const handleOpenRegister = () => setRegisterOpen(true);
  const handleCloseRegister = () => setRegisterOpen(false);

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          height: "70px",
          boxShadow: "rgba(0, 0, 0, 0.24) 40px 40px 80px -8px",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              color="secondary"
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexGrow: 1,
              }}
            >
              <Link href="/">{t1("home")}</Link>
              <Link href="/#about">{t1("about")}</Link>
              <Link href="/#contact">{t1("contact")}</Link>
              <Link href="/readers">{t1("readers")}</Link>
            </Box>

            <LoginModal
              open={loginOpen}
              onClose={handleCloseLogin}
              onOpenSecond={() => {
                handleCloseLogin(); // Close the first modal
                handleOpenRegister(); // Open the second modal
              }}
            />
            <RegisterModal open={registerOpen} onClose={handleCloseRegister} />
            <Language />

            {!isLogin
              ? userDetails?.userType !== "admin" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenLogin}
                  >
                    {t2("login")}
                  </Button>
                )
              : userDetails?.userType !== "admin" && (
                  <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu}>
                      <AccountCircle color="secondary" />
                    </IconButton>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {userDetails?.userType === "reader" ? (
                        <MenuItem>
                          <Link href="/reader">{t1("myAccount")}</Link>
                        </MenuItem>
                      ) : (
                        <MenuItem>
                          <Link href="/client">{t1("myAccount")}</Link>
                        </MenuItem>
                      )}

                      <MenuItem onClick={handleLogout}>{t1("logout")}</MenuItem>
                    </Menu>
                  </Box>
                )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
