import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";

export default function ContactForm() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  // Handle change on input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      color: "#fff",
    },
    input: { height: "50px", padding: "0 12px" },
  };

  // Function to send email
  const sendEmail = async () => {
    try {
      const response = await api.post("/api/mail/send", formData);
    } catch (error) {
      console.error("An error occurred while sending the email", error);
    }
  };

  // Action on submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    sendEmail();
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
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
            {t1("firstName")}
          </Typography>
          <TextField
            fullWidth
            name="firstname"
            variant="outlined"
            color="secondary"
            sx={textFieldSx}
            value={formData.firstname}
            onChange={handleChange}
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
            {t1("lastName")}
          </Typography>
          <TextField
            fullWidth
            name="lastname"
            variant="outlined"
            color="secondary"
            sx={textFieldSx}
            value={formData.lastname}
            onChange={handleChange}
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
          {t1("email")}
        </Typography>
        <TextField
          fullWidth
          name="email"
          variant="outlined"
          color="secondary"
          sx={textFieldSx}
          value={formData.email}
          onChange={handleChange}
        />
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
          {t1("message")}
        </Typography>
        <TextField
          fullWidth
          name="message"
          variant="outlined"
          color="secondary"
          value={formData.message}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            }
          }}
        />
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        sx={{
          fontSize: 14,
          textAlign: "center",
          fontStyle: "normal",
          fontWeight: "medium",
          textTransform: "capitalize",
        }}
      >
        {t2("send")}
      </Button>
    </Box>
  );
}
