"use client";
import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import UserTable from "@/components/AdminUI/userTable";
import RegisterModal from "@/components/RegisterModal";
import UserSelect from "@/components/AdminUI/userSelect";
import Search from "@/components/AdminUI/search";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { User } from "@/types/user";

export default function UsersAdminPage() {
  const t1 = useTranslations("user");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
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
          {t1("title")}
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
          {t1("add")}
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
        <UserSelect />
      </Grid>      
      <UserTable />
    </Box>
  );
}
