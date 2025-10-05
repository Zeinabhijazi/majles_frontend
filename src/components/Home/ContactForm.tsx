import React from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Form");
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      color: "#fff",
    },
    input: { height: "50px", padding: "0 12px" },
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "40%",
        height: "100%",
        m: "auto",
        p: 3,
        gap: 1.5,
        mb: 5,
      }}
    >
      <Grid container spacing={2} sx={{ display: "flex" }}>
        <Grid size={6}>
          <Typography
            variant="h6"
            color="grey"
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              pl: 0.5,
            }}
          >
            {t("firstName")}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            color="secondary"
            sx={textFieldSx}
          />
        </Grid>
        <Grid size={6}>
          <Typography
            variant="h6"
            color="grey"
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              pl: 0.5,
            }}
          >
            {t("lastName")}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            color="secondary"
            sx={textFieldSx}
          />
        </Grid>
      </Grid>
      <Grid>
        <Typography
          variant="h6"
          color="grey"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            pl: 0.5,
          }}
        >
          {t("email")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          color="secondary"
          sx={textFieldSx}
        />
      </Grid>
      <Grid>
        <Typography
          variant="h6"
          color="grey"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            pl: 0.5
          }}
        >
          {t("message")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          color="secondary"
          multiline
          rows={4}
          sx={{
            borderRadius: "12px",
          }}
        />
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        //type="submit"
        sx={{
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          textTransform: "capitalize",
        }}
        onClick={() => {}}
      >
        {t("send")}
      </Button>
    </Box>
  );
}
