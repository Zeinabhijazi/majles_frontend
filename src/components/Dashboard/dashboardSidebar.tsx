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
} from "@mui/material";
import { Link, useRouter } from "@/i18n/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface SidebarProps {
  role: "client" | "admin" | "reader";
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuConfig: Record<
    SidebarProps["role"],
    { label: string; path?: string; icon: React.ReactNode }[]
  > = {
    admin: [
      {
        label: t("dashboard"),
        path: "/admin",
        icon: <DashboardIcon color="secondary" />,
      },
      {
        label: t("users"),
        path: "/admin/users",
        icon: <PeopleIcon color="secondary" />,
      },
      {
        label: t("orders"),
        path: "/admin/orders",
        icon: <ListAltIcon color="secondary" />,
      },
      {
        label: t("setting"),
        path: "/admin/profile",
        icon: <SettingsIcon color="secondary" />,
      },
      { label: t("logout"), icon: <LogoutIcon color="secondary" /> },
    ],
    client: [
      {
        label: t("orders"),
        path: "/client",
        icon: <ListAltIcon color="secondary" />,
      },
      {
        label: t("setting"),
        path: "/client/profile",
        icon: <SettingsIcon color="secondary" />,
      },
      { label: t("logout"), icon: <LogoutIcon color="secondary" /> },
    ],
    reader: [
      {
        label: t("orders"),
        path: "/reader",
        icon: <ListAltIcon color="secondary" />,
      },
      {
        label: t("setting"),
        path: "/reader/profile",
        icon: <SettingsIcon color="secondary" />,
      },
      { label: t("logout"), icon: <LogoutIcon color="secondary" /> },
    ],
  };

  const menuItems = menuConfig[role];

  // Handle logout
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    const item = menuItems[index];

    if (item.label === "Logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("userDetails");
      router.push("/");
    }
  };

  return (
    <Paper
      variant="elevation"
      square
      sx={{
        height: "100%",
        bgcolor: "primary.main",
      }}
    >
      <Box
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
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
          {menuItems.map((item, index) => (
            <ListItem key={item.label} disablePadding>
              {item.path ? (
                <Link href={item.path} className="w-full">
                  <ListItemButton
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
              ) : (
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </nav>
    </Paper>
  );
}
