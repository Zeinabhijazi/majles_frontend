"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/lib/axios";
import { UpdateUser } from "@/types/updateUser";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUserDetails, updateUser } from "@/redux/slices/userSlice";
import z from "zod";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ height: "480px" }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 1.5,
            width: "100%",
            height: "99%",
            boxSizing: "border-box",
            backgroundColor: "background.default",
            borderRadius: 4,
            mt: 1,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}
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

export default function UserInformation() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("tab");
  const t4 = useTranslations("radioButton");
  const [value, setValue] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [isEditting, setIsEditting] = useState(false);
  const [formData, setFormData] = useState<UserDetails>(userDetails);
  const [tempData, setTempData] = useState<UpdateUser>({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    gender: userDetails.gender,
    phoneNumber: userDetails.phoneNumber,
    longitude: userDetails.longitude,
    latitude: userDetails.latitude,
    addressOne: userDetails.addressOne,
    addressTwo: userDetails.addressTwo,
    postNumber: userDetails.postNumber,
    country: userDetails.country,
    city: userDetails.city,
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
  const [error, setError] = useState<Partial<Passwords>>({});
  const [alertText, setAlertText] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Open edit
  const handleEditClick = () => {
    setTempData(formData);
    setIsEditting(true);
  };

  // Close edit
  const handleEditingClose = () => {
    setFormData(tempData);
    setIsEditting(false);
  };

  // Field change during editing
  const handleChange = (field: keyof UpdateUser, value: string | number) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sync formData with user when it’s fetched
  useEffect(() => {
    if (userDetails) {
      setFormData(userDetails);
    }
  }, [userDetails]);

  // For Tab
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Toggle visibility for a password field
  const handleToggleShow = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  //
  const hanldeChangePasswordFields = (
    key: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [key]: value }));
  };

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

  // schema
  const passwordSchema = z.object({
    oldPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  });

  // To change password
  const hanldeChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate fields
    const validation = passwordSchema.safeParse(passwords);

    if (!validation.success) {
      const fieldErrors: Partial<Passwords> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Passwords;
        fieldErrors[field] = issue.message;
      });
      setError(fieldErrors);
      return;
    }
    setError({});

    // Check newPassword === confirmPassword
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlertText("New password and confirm password do not match.");
      setWarningAlert(true);
      return;
    }
    try {
      // Call backend to change password
      const response = await api.put("/api/user/changePassword", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        setAlertText("Password changed successfully.");
        setSuccessAlert(true);
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setAlertText(response.data?.message || "Failed to change password.");
        setWarningAlert(true);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setAlertText(msg);
      setWarningAlert(true);
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

  // To update data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      longitude,
      latitude,
      addressOne,
      addressTwo,
      postNumber,
      country,
      city,
    } = tempData;
    dispatch(
      updateUser({
        firstName,
        lastName,
        gender,
        phoneNumber,
        longitude,
        latitude,
        addressOne,
        addressTwo,
        postNumber,
        country,
        city,
      })
    );
    setFormData((prev) => ({ ...prev, ...tempData }));
    setIsEditting(false);
  };

  return (
    <Box component="section">
      <Tabs
        value={value}
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChangeTab}
        variant="scrollable"
        aria-label="scrollable prevent tabs example"
        sx={{
          width: "100%",
        }}
      >
        <Tab label={t3("personalDetails")} sx={{ flex: 1 }} />
        <Tab label={t3("accountDetails")} sx={{ flex: 1 }} />
      </Tabs>
      {/* Personal */}
      <TabPanel value={value} index={0}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSave}
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            margin: "auto",
            gap: 2,
            height: "100%",
          }}
        >
          {!isEditting ? (
            <IconButton
              onClick={handleEditClick}
              color="secondary"
              size="small"
              sx={{ marginLeft: "auto" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleEditingClose}
              color="secondary"
              size="small"
              sx={{ marginLeft: "auto" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}

          <Grid container sx={{ height: 30 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t1("firstName")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <TextField
                  value={tempData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  size="small"
                  sx={{ width: "50%" }}
                  required
                />
              ) : (
                <span>{formData.firstName}</span>
              )}
            </Grid>
          </Grid>

          <Grid container sx={{ height: 30 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t1("lastName")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <TextField
                  value={tempData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  size="small"
                  sx={{ width: "50%" }}
                  required
                />
              ) : (
                <span>{formData.lastName}</span>
              )}
            </Grid>
          </Grid>

          <Grid container sx={{ height: 30 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t1("phoneNumber")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <TextField
                  value={tempData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  size="small"
                  sx={{ width: "50%" }}
                  required
                />
              ) : (
                <span>{formData.phoneNumber}</span>
              )}
            </Grid>
          </Grid>

          <Grid container sx={{ height: 30 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t4("gender")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <RadioGroup
                  row
                  value={tempData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="secondary" size="small" />}
                    label={t4("male")}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="secondary" size="small" />}
                    label={t4("female")}
                  />
                </RadioGroup>
              ) : (
                <span>
                  {formData.gender === "male" ? t4("male") : t4("female")}
                </span>
              )}
            </Grid>
          </Grid>

          <Grid container sx={{ height: 30 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t1("coordinates")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    value={tempData.latitude}
                    size="small"
                    sx={{ width: "50%" }}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    value={tempData.longitude}
                    size="small"
                    sx={{ width: "50%" }}
                    InputProps={{ readOnly: true }}
                  />
                  <IconButton onClick={handleGetLocation}>
                    <EditLocationAltIcon color="secondary" />
                  </IconButton>
                </Box>
              ) : (
                <span>
                  {formData.latitude}, {formData.longitude}
                </span>
              )}
            </Grid>
          </Grid>

          <Grid container sx={{ height: 115 }}>
            <Grid size={4}>
              <Typography>
                <strong>{t1("address")}:</strong>
              </Typography>
            </Grid>
            <Grid size={8}>
              {isEditting ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      value={tempData.addressOne}
                      onChange={(e) =>
                        handleChange("addressOne", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                    <TextField
                      value={tempData.addressTwo}
                      onChange={(e) =>
                        handleChange("addressTwo", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      value={tempData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <TextField
                      value={tempData.postNumber}
                      onChange={(e) =>
                        handleChange("postNumber", e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <TextField
                    value={tempData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Box>
              ) : (
                <span>
                  {formData.addressOne}, {formData.addressTwo},{" "}
                  {formData.postNumber}, {formData.country}, {formData.city}
                </span>
              )}
            </Grid>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ float: "right", width: "18%", mt: 1.2 }}
            >
              {t2("save")}
            </Button>
          </Grid>
        </Box>
      </TabPanel>
      {/* Account */}
      <TabPanel value={value} index={1}>
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
              value={userDetails.email}
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
              error={!!error.oldPassword}
              helperText={error.oldPassword}
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
              error={!!error.newPassword}
              helperText={error.newPassword}
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
              error={!!error.confirmPassword}
              helperText={error.confirmPassword}
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
                mt: 2,
                float: "right",
              }}
              onClick={() => {}}
            >
              {t2("changePassword")}
            </Button>
          </Grid>

          {/* Alerts */}
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={successAlert}
            autoHideDuration={3000}
            onClose={() => setSuccessAlert(false)}
          >
            <Alert severity="success">{alertText}</Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={warningAlert}
            autoHideDuration={3000}
            onClose={() => setWarningAlert(false)}
          >
            <Alert severity="warning">{alertText}</Alert>
          </Snackbar>
        </Box>
      </TabPanel>
    </Box>
  );
}
