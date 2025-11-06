import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";
import CheckIcon from "@mui/icons-material/Check";
import z from "zod";

export default function ContactForm() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

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

  // schema
  const formSchema = z.object({
    firstname: z.string("Should be a Character"),
    lastname: z.string("Should be a Character"),
    email: z.string().email("Invalid email"),
    subject: z
      .string()
      .min(5, "Subject is required."),
    message: z
      .string()
      .min(5, "Message should be clear and at least 5 characters"),
  });

  const validate = (): boolean => {
    const result = formSchema.safeParse(formData);

    if (result.success) {
      setError({}); // clear previous errors
      return true;
    }

    // Build the fieldErrors object from Zod errors
    const fieldErrors: { [key: string]: string } = {};
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0] as string;
      fieldErrors[fieldName] = issue.message;
    }

    setError(fieldErrors);
    return false;
  };

  // Function to send email
  const sendEmail = async () => {
    try {
      const response = await api.post("mail/send", formData);
      if (response.data.success) {
        setAlertText("Email sent");
        setSuccessAlert(true);
        // Clear the inputs
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phoneNumber: "",
          subject: "",
          message: "",
        });
        // Hide alert after 3 seconds
        setTimeout(() => {
          setSuccessAlert(false);
        }, 2500);
      } else {
        setAlertText("Failed to send email");
        setWarningAlert(true);
        setTimeout(() => {
          setWarningAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("An error occurred while sending the email", error);
    }
  };

  // Action on submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      sendEmail();
    }
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
            error={!!error.firstname}
            helperText={error.firstname}
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
            error={!!error.lastname}
            helperText={error.lastname}
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
          error={!!error.email}
          helperText={error.email}
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
          {t1("phoneNumber")}
        </Typography>
        <TextField
          fullWidth
          name="phoneNumber"
          variant="outlined"
          color="secondary"
          sx={textFieldSx}
          value={formData.phoneNumber}
          onChange={handleChange}
          error={!!error.phoneNumber}
          helperText={error.phoneNumber}
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
          {t1("subject")}
        </Typography>
        <TextField
          fullWidth
          name="subject"
          variant="outlined"
          color="secondary"
          sx={textFieldSx}
          value={formData.subject}
          onChange={handleChange}
          error={!!error.subject}
          helperText={error.subject}
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
          error={!!error.message}
          helperText={error.message}
          onChange={handleChange}
          multiline
          rows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
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
      <Stack>
        {successAlert && (
          <Alert
            sx={{ margin: "10px" }}
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
          >
            {alertText}
          </Alert>
        )}
        {warningAlert && (
          <Alert sx={{ margin: "10px" }} severity="error">
            {alertText}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
