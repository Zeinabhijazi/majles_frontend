"use client";
import { fetchUserDetails } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  Paper,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "@/types/updateUser";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

interface Passwords {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type UserDetails = {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
  addressOne: string;
  addressTwo?: string;
  country: string;
  city: string;
  postNumber: number;
  email?: string;
};

export default function MyAccounts() {
  const t = useTranslations("Form");
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<UserDetails>({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    gender: userDetails.gender,
    phoneNumber: userDetails.phoneNumber,
    latitude: userDetails.latitude,
    longitude: userDetails.longitude,
    addressOne: userDetails.addressOne,
    addressTwo: userDetails.addressTwo,
    country: userDetails.country,
    city: userDetails.city,
    postNumber: userDetails.postNumber,
    email: userDetails.email,
  });
  
  const [passwords, setPasswords] = useState<Passwords>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);
  useEffect(() => {
  if (userDetails) {
    setFormData({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      gender: userDetails.gender,
      phoneNumber: userDetails.phoneNumber,
      latitude: userDetails.latitude,
      longitude: userDetails.longitude,
      addressOne: userDetails.addressOne,
      addressTwo: userDetails.addressTwo,
      country: userDetails.country,
      city: userDetails.city,
      postNumber: userDetails.postNumber,
      email: userDetails.email,
    });
  }
}, [userDetails]);

  // To get the currect location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleChange("latitude", latitude);
        handleChange("longitude", longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("Could not get your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Field change during editing
  const handleChange = (field: keyof UpdateUser, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle visibility for a password field
  const handleToggleShow = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hanldeChangePasswordFields = (
    key: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      component="section"
      sx={{
        height: "100vh",
        p: 2,
      }}
    >
      <Typography variant="h4">Account Settings</Typography>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "row",
          gap: 5,
          alignItems: "stretch",
        }}
      >
        <Paper
          elevation={3}
          variant="outlined"
          square={false}
          sx={{
            width: "70%",
            boxShadow: 8,
            px: 2,
          }}
        >
          <Typography variant="h6" sx={{ my: 1 }}> Personal Info </Typography>

          <Grid container>
            <Grid size={6}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                }}
              >
                <strong>{t("firstName")}:</strong>
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                }}
              >
                <strong>{t("lastName")}:</strong>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                value={formData.lastName}
                 onChange={(e) => handleChange("lastName", e.target.value)}
                size="small"
                required
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid size={6}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                }}
              >
                <strong>{t("phoneNumber")}:</strong>
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                }}
              >
                <strong>{t("gender")}:</strong>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                size="small"
                required
              />
            </Grid>
            <Grid size={6}>
              <RadioGroup
                row
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label={t("male")}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label={t("female")}
                />
              </RadioGroup>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid size={12}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "15px",
                }}
              >
                <strong>{t("coordinates")}:</strong>
              </Typography>
            </Grid>
            <Grid size={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    value={formData.latitude}
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    fullWidth
                    value={formData.longitude}
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                  <IconButton onClick={handleGetLocation}>
                    <EditLocationAltIcon color="secondary" />
                  </IconButton>
                </Box>
            </Grid>
          </Grid>

          {/* Address */}
          <Grid container>
            <Grid size={12}>
              <Typography>
                <strong>{t("address")}:</strong>
              </Typography>
            </Grid>
            <Grid size={12}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      value={formData.addressOne}
                      onChange={(e) =>
                        handleChange("addressOne", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                    <TextField
                      value={formData.addressTwo}
                      onChange={(e) =>
                        handleChange("addressTwo", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                    <TextField
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    size="small"
                    fullWidth
                  />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      value={formData.postNumber}
                      onChange={(e) =>
                        handleChange("postNumber", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                  </Box>
                </Box>
            </Grid>
          </Grid>

          <Grid>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ float: "right", width: "18%", mt: 1.2 }}
            >
              {t("save")}
            </Button>
          </Grid>
        </Paper>

        <Box
          sx={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Paper
            elevation={3}
            square={false}
            sx={{
              height: "110px",
              boxShadow: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Avatar
              alt="user"
              sx={{
                width: 45,
                height: 45,
                my: 0.5,
                textTransform: "uppercase",
              }}
            >
              {userDetails.firstName.charAt(0)} {userDetails.lastName.charAt(0)}
            </Avatar>
            <Typography variant="body1">
              Welcome: {userDetails.email}
            </Typography>
          </Paper>
          <Paper
            elevation={3}
            square={false}
            sx={{
              height: "390px",
              boxShadow: 8,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ my: 1.5 }}>
              Change Password
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyItems: "center",
                alignItems: "center",
              }}
            >
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
                  {t("currentPassword")} *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  type={showPassword.oldPassword ? "text" : "password"}
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    hanldeChangePasswordFields("oldPassword", e.target.value)
                  }
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
                  {t("newPassword")} *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword.newPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    hanldeChangePasswordFields("newPassword", e.target.value)
                  }
                  size="small"
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
                  {t("confirmPassword")} *
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    hanldeChangePasswordFields(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  size="small"
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
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                sx={{
                  mt: 2,
                }}
                onClick={() => {}}
              >
                {t("changePassword")}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
