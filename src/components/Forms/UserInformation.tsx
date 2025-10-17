"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormHelperText,
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
import {
  clearSuccessMessage,
  fetchUserDetails,
  updateUser,
} from "@/redux/slices/userSlice";
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
  const { userDetails, successType, successMessage } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
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
  const [inputErrors, setInputErrors] = useState<
    Partial<Record<keyof UpdateUser, string>>
  >({});
  const [errors, setErrors] = useState<Partial<Passwords>>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  // For Tab
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Handle edit button
  const handleEditClick = () => {
    setTempData(formData);
    setIsEditting(true);
  };

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
  const userSchema = z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    phoneNumber: z.string().nonempty("Phone Number is required"),
    gender: z.enum(["male", "female"], "Please select a gender"),
    addressOne: z.string().nonempty("Address One is required"),
    addressTwo: z.string().optional(),
    city: z.string().nonempty("City is required"),
    postNumber: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Post Code must be a number")
    ),
    country: z.string().nonempty("Country is required"),
    longitude: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Longitude must be a number")
    ),
    latitude: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Latitude must be a number")
    ),
  });

  const passwordSchema = z.object({
    oldPassword: z.string().nonempty("Current password is required"),
    newPassword: z.string().nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  });

  // Validation
  const validateInputs = (): boolean => {
    const result = userSchema.safeParse(tempData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Record<keyof UpdateUser, string>> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof UpdateUser;
      fieldErrors[field] = issue.message;
    });
    setInputErrors(fieldErrors);
    return false;
  };

  const validatePassword = (): boolean => {
    // Validate fields
    const result = passwordSchema.safeParse(passwords);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Passwords> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof Passwords;
      fieldErrors[field] = issue.message;
    });

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
      const response = await api.put("/api/user/changePassword", {
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

  useEffect(() => {
    if (successType === "update" && successMessage) {
      setAlertText(successMessage);
      setSuccessAlert(true);
      setTimeout(() => {
        setSuccessAlert(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
  }, [successMessage, successType]);

  // To update data
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!validateInputs()) return;
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
          className="table_scrollbar"
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
            overflowY: "auto",
            pr: 2,
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

          <Grid container>
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
                  sx={{
                    width: "50%",
                    "& .MuiFormHelperText-root": {
                      marginTop: "4px", // space between input and helper text
                      fontSize: "0.75rem",
                      lineHeight: 1.2,
                      color: "#f44336", // red for visibility in dark mode
                    },
                  }}
                  required
                  error={!!inputErrors.firstName}
                  helperText={inputErrors.firstName}
                />
              ) : (
                <span>{formData.firstName}</span>
              )}
            </Grid>
          </Grid>

          <Grid container>
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
                  error={!!inputErrors.lastName}
                  helperText={inputErrors.lastName}
                />
              ) : (
                <span>{formData.lastName}</span>
              )}
            </Grid>
          </Grid>

          <Grid container>
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
                  error={!!inputErrors.phoneNumber}
                  helperText={inputErrors.phoneNumber}
                />
              ) : (
                <span>{formData.phoneNumber}</span>
              )}
            </Grid>
          </Grid>

          <Grid container>
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
                  <FormHelperText sx={{ color: "#d32f2f" }}>
                    {!!inputErrors.gender ? "Please select a gender" : ""}
                  </FormHelperText>
                </RadioGroup>
              ) : (
                <span>
                  {formData.gender === "male" ? t4("male") : t4("female")}
                </span>
              )}
            </Grid>
          </Grid>

          <Grid container>
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
                    error={!!inputErrors.latitude}
                    helperText={inputErrors.latitude}
                  />
                  <TextField
                    value={tempData.longitude}
                    size="small"
                    sx={{ width: "50%" }}
                    InputProps={{ readOnly: true }}
                    error={!!inputErrors.longitude}
                    helperText={inputErrors.longitude}
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

          <Grid container>
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
                      error={!!inputErrors.addressOne}
                      helperText={inputErrors.addressOne}
                    />
                    <TextField
                      value={tempData.addressTwo}
                      onChange={(e) =>
                        handleChange("addressTwo", e.target.value)
                      }
                      size="small"
                      fullWidth
                      error={!!inputErrors.addressTwo}
                      helperText={inputErrors.addressTwo}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      value={tempData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      size="small"
                      fullWidth
                      error={!!inputErrors.city}
                      helperText={inputErrors.city}
                    />
                    <TextField
                      value={tempData.postNumber}
                      onChange={(e) =>
                        handleChange("postNumber", e.target.value)
                      }
                      size="small"
                      fullWidth
                      error={!!inputErrors.postNumber}
                      helperText={inputErrors.postNumber}
                    />
                  </Box>
                  <TextField
                    value={tempData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    size="small"
                    fullWidth
                    error={!!inputErrors.country}
                    helperText={inputErrors.country}
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
                mt: 2,
                float: "right",
              }}
              onClick={() => {}}
            >
              {t2("changePassword")}
            </Button>
          </Grid>
        </Box>
      </TabPanel>
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
