"use client";
import React, { useState, MouseEvent, useEffect } from "react";
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
import LanguageIcon from "@mui/icons-material/Language";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useLocale, useTranslations } from "next-intl";
import {  Link, usePathname, useRouter } from "@/i18n/navigation";
import AccountCircle from '@mui/icons-material/AccountCircle';


export default function MenuAppBar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [ isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
  
  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    window.location.reload(); // refresh
  }  

  // Change Language
  const changeLanguage = (lng: string) => {
    if (lng !== locale) {
      router.replace(pathname, { locale: lng });
      router.refresh();
    }
    handleClose();
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
                flexGrow: 1
              }}
            >
              <Link 
                href='/#' 
              >
                {t("home")}
              </Link>
              <Link href="/#about">
                {t("about")}
              </Link>
              <Link href="/#contact">
               {t("contact")}
              </Link>
              <Link href="/readers">
                {t("readers")}
              </Link>
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

            <IconButton
              aria-controls="language-menu"
              aria-haspopup="true"
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
            >
              <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
              <MenuItem onClick={() => changeLanguage("ar")}>Arabic</MenuItem>
              <MenuItem onClick={() => changeLanguage("fr")}>French</MenuItem>
              <MenuItem onClick={() => changeLanguage("de")}>Deutsch</MenuItem>
            </Menu>


            {!isLogin 
              ?
              (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpenLogin}
                >
                  {t("login")}
                </Button>
              )
              : 
              (
                <Box sx={{ flexGrow: 0 }}>
                  <IconButton onClick={handleOpenUserMenu} >
                      <AccountCircle color="secondary" />
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem><Link href="/account">{t("myAccount")}</Link></MenuItem>
                    <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
                  </Menu>
                </Box>
              )
            }
            

          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
