import React, { useEffect } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import PeopleIcon from "@mui/icons-material/People";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserCounts } from "@/redux/slices/dashboardSlice";
import { useTranslations } from "next-intl";

export default function CountSection() {
  const t = useTranslations("countSection");
  const { userCounts } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserCounts());
  }, [dispatch]);

  return (
    <Box
      component="section"
      sx={{
        bgcolor: "secondary.main",
        my: 7,
        py: 2,
      }}
    >
      <Grid container>
        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton size="large">
            <LocalLibraryIcon color="primary" sx={{ fontSize: 55 }} />
          </IconButton>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2" color="primary" sx={{ fontSize: "35px" }}>
              {userCounts.readers}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontSize: "20px" }}>
              {t("readers")}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <IconButton size="large">
            <PeopleIcon color="primary" sx={{ fontSize: 55 }} />
          </IconButton>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h2" color="primary" sx={{ fontSize: "35px" }}>
              {userCounts.clients}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ fontSize: "20px" }}>
              {t("clients")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
