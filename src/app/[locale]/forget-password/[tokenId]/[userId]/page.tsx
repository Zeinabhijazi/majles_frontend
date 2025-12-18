"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslations } from "next-intl";
import z from "zod";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

interface Passwords {
  newPassword?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("heading");
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  
  const [passwords, setPasswords] = useState<Passwords>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Passwords>>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const params = useParams();
  
  // Toggle visibility for a password field
  const handleToggleShow = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle passwords
  const hanldeChangePasswordFields = (
    key: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [key]: value }));
  };

  // Schema
  const passwordSchema = z.object({
    newPassword: z.string().nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  });

  // Validation
  const validatePassword = (): boolean => {
    // Validate fields
    const result = passwordSchema.safeParse(passwords);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Passwords> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof Passwords;
      fieldErrors[field] = issue.message;
    }

    setErrors(fieldErrors);
    return false;
  };

  // To change password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validation
      if (!validatePassword()) return;

      // Check if new and confirm password match
      if (passwords.newPassword !== passwords.confirmPassword) {
        setAlertText("New password and confirm password do not match.");
        setWarningAlert(true);
        setTimeout(() => setWarningAlert(false), 3000);
        return;
      }

      // Call backend to change password
      const response = await api.put("reset-password/resetPassword", {
        token: params.tokenId, userId: params.userId, newPassword: passwords.newPassword,
      });

      // Handle backend response
      if (response.data.success) {
        setAlertText("Reset password successfully.");
        setSuccessAlert(true);
        setPasswords({
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => setSuccessAlert(false), 3000);
      } else {
        setAlertText(response.data.message || "Failed to reset password.");
        setWarningAlert(true);
        setTimeout(() => setWarningAlert(false), 3000);
      }
    } catch (err: any) {
      // Handle errors (like wrong old password)
      const message =
        err.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setAlertText(message);
      setWarningAlert(true);
      setTimeout(() => setWarningAlert(false), 3000);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      width: "100%",
      height: "50px",
      color: "#fff",
    },
    input: { height: "50px", padding: "0 12px" },
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleResetPassword}
      autoComplete="off"
      sx={{
        border: "1px solid grey",
        borderRadius: 5,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 450,
        height: 400,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 2,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: "30px",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        {t3("resetPassword")}
      </Typography>
      <Grid>
        <Typography
          variant="h6"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            color: "grey",
            pl: 0.5,
          }}
        >
          {t1("newPassword")} *
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type={showPassword.newPassword ? "text" : "password"}
          value={passwords.newPassword}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          onChange={(e) =>
            hanldeChangePasswordFields("newPassword", e.target.value)
          }
          sx={textFieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  onClick={() => handleToggleShow("newPassword")}
                  edge="end"
                >
                  {showPassword.newPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
      </Grid>
      <Grid>
        <Typography
          variant="h6"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            color: "grey",
            pl: 0.5,
          }}
        >
          {t1("confirmPassword")} *
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type={showPassword.confirmPassword ? "text" : "password"}
          value={passwords.confirmPassword}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          onChange={(e) =>
            hanldeChangePasswordFields("confirmPassword", e.target.value)
          }
          sx={textFieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  onClick={() => handleToggleShow("confirmPassword")}
                  edge="end"
                >
                  {showPassword.confirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
      </Grid>
      <Grid>
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
            float: "inline-end",
          }}
          onClick={() => {}}
        >
          {t2("changePassword")}
        </Button>
      </Grid>
      {/* Alerts */}
      <Snackbar
        open={successAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{alertText}</Alert>
      </Snackbar>
      <Snackbar
        open={warningAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="warning">{alertText}</Alert>
      </Snackbar>
    </Box>
  );
}
