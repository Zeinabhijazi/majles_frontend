"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  FormLabel,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormHelperText,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";
import Snackbar from "@mui/material/Snackbar";
import { z } from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute",
  width: 480,
  height: 580,
  bgcolor: "background.default",
  border: "1px solid #e9e9e9",
  borderRadius: 2,
  boxShadow: 24,
  px: 2,
  py: 3,
  overflowY: "auto",
};

type FormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  postNumber: number;
  country: string;
  city: string;
  addressOne: string;
  addressTwo: string;
  longitude: number;
  latitude: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  userType: string;
};

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  gender: "",
  userType: "",
  addressOne: "",
  addressTwo: "",
  city: "",
  postNumber: "",
  country: "",
  latitude: "",
  longitude: "",
};

export default function RegisterModal({
  open,
  onClose,
}: Readonly<RegisterModalProps>) {
  const t1 = useTranslations("registerModal");
  const t2 = useTranslations("label");
  const t3 = useTranslations("radioButton");
  const t4 = useTranslations("button");
  const steps = [t1("personalInfo"), t1("address")];
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState({
      password: false,
      confirmPassword: false,
    });

  // Toggle visibility for a password field
  const handleToggleShow = (key: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // To get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      // navigator.geolocation is a built-in browser api
      alert("Geolocation is not supported by your browser.");
      return;
    }

    // Asking for User Location
    navigator.geolocation.getCurrentPosition(
      // getCurrentPosition: Asks the browser for the current GPS coordinates
      (pos) => {
        // (pos): success callback
        const { latitude, longitude } = pos.coords; // Extract long and lat from pos.coords and update them
        // Save as numbers into formData
        handleChange("latitude", latitude);
        handleChange("longitude", longitude);
      },
      (err) => {
        // (err): error callback - Runs if user denies permission or location fails.
        console.error("Error getting location:", err);
        alert("Could not get your location.");
      },
      {
        // Optional
        enableHighAccuracy: true, // Use GPS if available (more precise)
        timeout: 5000, // Wait max 5 seocnds
        maximumAge: 0, // Don't use cashed location, always got fresh one.
      }
    );
  };

  // For inputs
  const handleChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // schema
  const registerSchema = z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().nonempty("Phone Number is required"),
    gender: z.enum(["male", "female"], "Please select a gender"),
    userType: z.enum(["reader", "admin", "client"], "Please select a type"),
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

  const validate = (): boolean => {
    const result = registerSchema.safeParse(formData);

    if (result.success) {
      setError({});
      return true;
    }

    const fieldErrors: { [key: string]: string } = {};
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] as string;
      fieldErrors[fieldName] = issue.message;
    });

    setError(fieldErrors);
    return false;
  };

  // Handle form
  const handleSubmit = async () => {
    try {
      if (validate()) {
        const response = await api.post(`auth/signup`, formData);
        if (response.data.success) {
          setAlertText("Added successfully");
          setSuccessAlert(true);
          setFormData(initialFormData);
          setTimeout(() => setSuccessAlert(false), 2500);
        }
      }
    } catch (error: any) {
      // Check if the error has a response from server
      if (error.response && error.response.data) {
        setAlertText(error.response.data.message || "Server error");
        setWarningAlert(true);
        setTimeout(() => setWarningAlert(false), 3000);
      } else {
        console.error("Unexpected error:", error);
        setAlertText("An unexpected error occurred");
        setWarningAlert(true);
        setTimeout(() => setWarningAlert(false), 3000);
      }
    }
  };

  // For Stepper
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === steps.length - 1) {
      //last step -> submit form
      await handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Step 1: Personal info form
  const FormStep = (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{
        mt: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Grid size={6}>
          <TextField //First Name
            variant="outlined"
            placeholder={t2("firstName")}
            value={formData.firstName}
            color="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("firstName", e.target.value)
            }
            error={!!error.firstName}
            helperText={error.firstName}
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField //Last Name
            variant="outlined"
            placeholder={t2("lastName")}
            color="secondary"
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("lastName", e.target.value)
            }
            error={!!error.lastName}
            helperText={error.lastName}
            required
          />
        </Grid>
      </Grid>
      <TextField // Email
        variant="outlined"
        placeholder={t2("email")}
        color="secondary"
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("email", e.target.value)
        }
        error={!!error.email}
        helperText={error.email}
        required
      />
      <TextField // Password
        variant="outlined"
        color="secondary"
        placeholder={t2("password")}
        type={showPassword.password ? "text" : "password"}
        autoComplete="current-password"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("password", e.target.value)
        }
        error={!!error.password}
        helperText={error.password}
        required
        InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  onClick={() => handleToggleShow("password")}
                  edge="end"
                >
                  {showPassword.password ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
      />
      <TextField // Confirm Password
        variant="outlined"
        color="secondary"
        placeholder={t2("confirmPassword")}
        type={showPassword.confirmPassword ? "text" : "password"}
        autoComplete="current-password"
        value={formData.confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("confirmPassword", e.target.value)
        }
        error={!!error.password}
        helperText={error.password}
        required
        InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="secondary"
                  onClick={() => handleToggleShow("confirmPassword")}
                  edge="end"
                >
                  {showPassword.password ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
      />
      <TextField // Phone Number
        variant="outlined"
        color="secondary"
        placeholder={t2("phoneNumber")}
        value={formData.phoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("phoneNumber", e.target.value)
        }
        error={!!error.phoneNumber}
        helperText={error.phoneNumber}
        required
      />
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
          mb: 1,
        }}
      >
        <Grid size={6}>
          <FormControl>
            <FormLabel
              color="secondary"
              required
              id="demo-controlled-radio-buttons-group"
              sx={{ fontSize: "13px" }}
            >
              {t3("gender")}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              sx={{ fontSize: "13px" }}
            >
              <FormControlLabel
                value="female"
                control={<Radio color="secondary" size="small" />}
                label={t3("female")}
              />
              <FormControlLabel
                value="male"
                control={<Radio color="secondary" size="small" />}
                label={t3("male")}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {!!error.gender ? "Please select a gender" : ""}
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid size={6}>
          <FormControl>
            <FormLabel
              color="secondary"
              required
              id="demo-controlled-radio-buttons-group"
              sx={{ fontSize: "13px" }}
            >
              {t3("userType")}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="userType"
              value={formData.userType}
              onChange={(e) => handleChange("userType", e.target.value)}
            >
              <FormControlLabel
                value="client"
                control={<Radio color="secondary" size="small" />}
                label={t3("client")}
              />
              <FormControlLabel
                value="reader"
                control={<Radio color="secondary" size="small" />}
                label={t3("reader")}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {!!error.userType ? "Please select a type" : ""}
              </FormHelperText>
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  // Step 2: Address info form
  const addressStep = (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      autoComplete="off"
      sx={{
        my: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField // Address One
        variant="outlined"
        color="secondary"
        placeholder={t2("addressOne")}
        value={formData.addressOne}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("addressOne", e.target.value)
        }
        error={!!error.addressOne}
        helperText={error.addressOne}
        required
      />

      <TextField // Address Two
        variant="outlined"
        color="secondary"
        placeholder={t2("addressTwo")}
        value={formData.addressTwo}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("addressTwo", e.target.value)
        }
        error={!!error.addressTwo}
        helperText={error.addressTwo}
      />

      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Grid size={6}>
          <TextField // City
            variant="outlined"
            color="secondary"
            placeholder={t2("city")}
            value={formData.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("city", e.target.value)
            }
            error={!!error.city}
            helperText={error.city}
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField // Post Code
            variant="outlined"
            color="secondary"
            placeholder={t2("postCode")}
            value={formData.postNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("postNumber", e.target.value)
            }
            error={!!error.postNumber}
            helperText={error.postNumber}
            required
          />
        </Grid>
      </Grid>
      <TextField // Country
        variant="outlined"
        color="secondary"
        placeholder={t2("country")}
        value={formData.country}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("country", e.target.value)
        }
        error={!!error.country}
        helperText={error.country}
        required
      />
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Grid size={6}>
          <TextField // Latitude
            variant="outlined"
            color="secondary"
            placeholder={t2("latitude")}
            value={formData.latitude}
            InputProps={{ readOnly: true }}
            required
            error={!!error.latitude}
            helperText={error.latitude}
          />
        </Grid>
        <Grid size={6}>
          <TextField // Longitude
            variant="outlined"
            color="secondary"
            placeholder={t2("longitude")}
            value={formData.longitude}
            InputProps={{ readOnly: true }}
            required
            error={!!error.longitude}
            helperText={error.longitude}
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="secondary" onClick={handleGetLocation}>
        {t4("pickLocation")}
      </Button>
    </Box>
  );

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={style} className="register_scrollbar">
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", float: "right" }}
        />
        {/* Stepper header */}
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.MuiStepIcon-root.Mui-completed": {
                      color: "secondary.main",
                    },
                    "&.MuiStepIcon-root.Mui-active": {
                      color: "secondary.main",
                    },
                    "& .MuiStepIcon-text": {
                      fill: "#fff",
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        {activeStep === steps.length ? (
          <>
            {/*<Typography sx={{ mt: 2, mb: 1 }}>All steps completed 🎉</Typography>*/}
          </>
        ) : (
          <>
            {activeStep === 0 && FormStep}
            {activeStep === 1 && addressStep}

            {/* Step navigation */}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                variant="text"
                color="secondary"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                {t4("back")}
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button variant="text" color="secondary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? t4("signUp") : t4("next")}
              </Button>
              {successAlert && (
                <Snackbar
                  open={successAlert}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert severity="success">{alertText}</Alert>
                </Snackbar>
              )}
              {warningAlert && (
                <Snackbar
                  open={warningAlert}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert severity="error">{alertText}</Alert>
                </Snackbar>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
