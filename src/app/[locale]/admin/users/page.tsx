"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import RegisterModal from "@/components/Forms/RegisterModal";
import Search from "@/components/AdminUI/search";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import AppSelect from "@/components/Forms/AppSelect";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";
import UserTable from "@/components/Tables/user";

export default function UsersAdminPage() {
  const t = useTranslations("select");
  const t1 = useTranslations("heading");
  const t2 = useTranslations("button");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [userType, setUserType] = useState("");
  const [isDeleted, setIsDeleted] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsers({ userType: userType, isDeleted: isDeleted }));
  }, [dispatch, userType, isDeleted]);

  return (
    <Box component="section">
      <Grid
        spacing={10}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: 23,
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {t1("usersPageTitle")}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            height: "38px",
            ml: "auto",
          }}
          onClick={handleOpen}
        >
          <AddIcon sx={{ mr: 0.5 }} />
          {t2("addUser")}
        </Button>
        <RegisterModal open={open} onClose={handleClose} />
      </Grid>
      <Grid
        container
        sx={{
          mt: 2,
          mb: 1.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid size={7}>
          <Search />
        </Grid>
        <Grid size={5} sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
          <AppSelect
            value={userType}
            onChange={(e) => setUserType(e.target.value as string)}
            placeholder={t("userType")}
            options={[
              { value: "all", label: t("all") },
              { value: "admin", label: t("admin") },
              { value: "client", label: t("client") },
              { value: "reader", label: t("reader") },
            ]}
          />

          <AppSelect
            value={isDeleted}
            onChange={(e) => setIsDeleted(e.target.value as string)}
            placeholder={t("status")}
            options={[
              { value: "all", label: t("all") },
              { value: "false", label: t("active") },
              { value: "true", label: t("isDeleted") },
            ]}
          />
        </Grid>
      </Grid>
      <UserTable />
    </Box>
  );
}
