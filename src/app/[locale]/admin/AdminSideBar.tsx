"use client";
import React, { useState } from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Link, useRouter }from "@/i18n/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AdminSideBar() {
  const t = useTranslations("AdminNavBar");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    if (index === 4) {
      localStorage.removeItem("token"); // Clear localStorage when auth is ready
      localStorage.removeItem("userDetails");
      router.push("/");
    }
  };
    
  return (
    <Paper
      variant="elevation"
      square
      sx= {{ 
        height: "100%",
      }}
    >
      <Box
        component="section"
        sx= {{
          display: "flex",
          flexDirection: 'column',
          gap: 2,
          alignItems: "center",
          justifyItems: "center",
          p: 3,
          mb: 3,
        }}
      > 
        <Image
          src="/admin.png"
          width={150}       
          height={150}      
          style={{ width: "150px", height: "auto" }} 
          alt="Admin"
          priority
        />
      </Box>

      <nav aria-label="main folders">
        <List>
          <Link href='/admin'>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
              >
                <ListItemIcon>
                  <DashboardIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={t("dashboard")} />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href="/admin/users">
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
              >
                <ListItemIcon>
                  <PeopleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={t("users")} />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href="/admin/orders">
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemIcon>
                  <ListAltIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={t("orders")} />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link href="/admin/profile">
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}
              >
                <ListItemIcon>
                  <SettingsIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={t("setting")} />
              </ListItemButton>
            </ListItem>
          </Link>

          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
            >
              <ListItemIcon>
                <LogoutIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={t("logout")} />
            </ListItemButton>
          </ListItem>

        </List>
      </nav>
    </Paper>
  );
}
