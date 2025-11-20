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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Passwords {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePassword() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const { userDetails } = useSelector((state: RootState) => state.user);
  if(!userDetails) return;
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwords, setPasswords] = useState<Passwords>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Passwords>>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

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
    oldPassword: z.string().nonempty("Current password is required"),
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
  const hanldeChangePassword = async (e: React.FormEvent) => {
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
      const response = await api.put("user/changePassword", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      // Handle backend response
      if (response.data.success) {
        setAlertText("Password changed successfully.");
        setSuccessAlert(true);
        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => setSuccessAlert(false), 3000);
      } else {
        setAlertText(response.data.message || "Failed to change password.");
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
      onSubmit={hanldeChangePassword}
      autoComplete="off"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        height: "100%",
        margin: "auto",
        gap: 1.5,
        mt: 1,
      }}
    >
      <Grid sx={{ width: "70%", margin: "auto" }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            color: "grey",
            pl: 0.5,
          }}
        >
          {t1("email")}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={userDetails?.email}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={textFieldSx}
        />
      </Grid>
      <Grid sx={{ width: "70%", margin: "auto" }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "13px",
            fontWeight: 400,
            color: "grey",
            pl: 0.5,
          }}
        >
          {t1("currentPassword")} *
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          type={showPassword.oldPassword ? "text" : "password"}
          value={passwords.oldPassword}
          onChange={(e) =>
            hanldeChangePasswordFields("oldPassword", e.target.value)
          }
          sx={textFieldSx}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  onClick={() => handleToggleShow("oldPassword")}
                  edge="end"
                >
                  {showPassword.oldPassword ? (
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
      <Grid sx={{ width: "70%", margin: "auto" }}>
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
      <Grid sx={{ width: "70%", margin: "auto" }}>
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
      <Grid sx={{ width: "70%", margin: "auto" }}>
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
