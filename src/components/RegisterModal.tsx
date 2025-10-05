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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";
import Snackbar from "@mui/material/Snackbar";
import { z } from "zod";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute",
  width: 480,
  height: 580,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  boxShadow: 24,
  px: 2,
  py: 3,
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

export default function RegisterModal({
  open,
  onClose,
}: Readonly<RegisterModalProps>) {
  const t = useTranslations("Form");
  const steps = [t("personalInfo"), t("address")];
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [error, setError] = useState<{
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    confPassword?: string;
    gender?: string;
    type?: string;
    phone?: string;
    addressOne?: string;
    addressTwo?: string;
    country?: string;
    city?: string;
    postcode?: number;
    lat?: number;
    long?: number;
  }>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "female",
    userType: "client",
    addressOne: "",
    addressTwo: "",
    city: "",
    postNumber: "",
    country: "",
    longitude: 0,
    latitude: 0,
  });

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
  const loginSchema = z.object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email address"),
    phoneNumber: z.string().nonempty("Phone Number is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
    postNumber: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Post Number must be a number")
    ),
    longitude: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Longitude must be a number")
    ),
    latitude: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number("Latitude must be a number")
    ),
    gender: z.enum(["male", "female"]),
    userType: z.enum(["reader", "admin", "client"]),
    addressOne: z.string().nonempty("Address One is required"),
    addressTwo: z.string().optional(),
    city: z.string().nonempty("City is required"),
    country: z.string().nonempty("Country is required"),
  });


  const validate = (): boolean => {
    const result = loginSchema.safeParse({
      formData,
    });

    if (result.success) {
      setError({});
      return true;
    }

    const fieldErrors: {
      fname?: string;
      lname?: string;
      phone?: string;
      email?: string;
      password?: string;
      confpassword?: string;
      gender?: string;
      type?: string;
      addressOne?: string;
      addressTwo?: string;
      city?: string;
      country?: string;
      postNumber?: string;
      latitude?: string;
      longitude?: string;
    } = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as
        | "fname"
        | "lname"
        | "phone"
        | "email"
        | "password"
        | "confpassword"
        | "gender"
        | "type"
        | "addressOne"
        | "addressTwo"
        | "city"
        | "country"
        | "postNumber"
        | "latitude"
        | "longitude";
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });

    setError(fieldErrors);
    return false;
  };

  // Handle form
  const handleSubmit = async () => {
    try {
      if (validate()) {
        const response = await api.post(`api/auth/signup`, formData);
        if (response.status === 200) {
          setAlertText("Added successfully");
          setSuccessAlert(true);
          // Clear the inputs and close the modal
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            gender: "female",
            userType: "client",
            addressOne: "",
            addressTwo: "",
            city: "",
            postNumber: "",
            country: "",
            longitude: 0,
            latitude: 0,
          });
        }
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const msg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(", ")
          : err.response.data.message;
        setAlertText(msg);
      } else {
        setAlertText("An unexpected error occurred. Please try again.");
      }
      setWarningAlert(true);
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
            label={t("firstName")}
            value={formData.firstName}
            color="secondary"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("firstName", e.target.value)
            }
            error={!!error.fname}
            helperText={error.fname}
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField //Last Name
            variant="outlined"
            label={t("lastName")}
            color="secondary"
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("lastName", e.target.value)
            }
            error={!!error.lname}
            helperText={error.lname}
            required
          />
        </Grid>
      </Grid>
      <TextField // Email
        variant="outlined"
        label={t("email")}
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
        label={t("password")}
        type="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("password", e.target.value)
        }
        error={!!error.password}
        helperText={error.password}
        required
      />
      <TextField // Confirm Password
        variant="outlined"
        color="secondary"
        label={t("confirmPassword")}
        type="password"
        autoComplete="current-password"
        value={formData.confirmPassword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("confirmPassword", e.target.value)
        }
        error={!!error.confPassword}
        helperText={error.confPassword}
        required
      />
      <TextField // Phone Number
        variant="outlined"
        color="secondary"
        label={t("phoneNumber")}
        value={formData.phoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange("phoneNumber", e.target.value)
        }
        error={!!error.phone}
        helperText={error.phone}
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
              {t("gender")}
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
                label={t("female")}
              />
              <FormControlLabel
                value="male"
                control={<Radio color="secondary" size="small" />}
                label={t("male")}
              />
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
              {t("userType")}
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
                label={t("client")}
              />
              <FormControlLabel
                value="reader"
                control={<Radio color="secondary" size="small" />}
                label={t("reader")}
              />
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
        label={t("addressOne")}
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
        label={t("addressTwo")}
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
            label={t("city")}
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
            label={t("postCode")}
            value={formData.postNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("postNumber", e.target.value)
            }
            error={!!error.postcode}
            helperText={error.postcode}
            required
          />
        </Grid>
      </Grid>
      <TextField // Country
        variant="outlined"
        color="secondary"
        label={t("country")}
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
            label={t("latitude")}
            value={formData.latitude}
            InputProps={{ readOnly: true }}
            required
            error={!!error.lat}
            helperText={error.lat}
          />
        </Grid>
        <Grid size={6}>
          <TextField // Longitude
            variant="outlined"
            color="secondary"
            label={t("longitude")}
            value={formData.longitude}
            InputProps={{ readOnly: true }}
            required
            error={!!error.long}
            helperText={error.long}
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="secondary" onClick={handleGetLocation}>
        {t("pickLocation")}
      </Button>
    </Box>
  );

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => {
        setSuccessAlert(false);
        setWarningAlert(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          gender: "female",
          userType: "client",
          addressOne: "",
          addressTwo: "",
          city: "",
          postNumber: "",
          country: "",
          longitude: 0,
          latitude: 0,
        });
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
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
      <Box sx={style}>
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
                {t("back")}
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button variant="text" color="secondary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? t("signUp") : t("next")}
              </Button>
              {successAlert && (
                <Snackbar
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  open={successAlert}
                  message={alertText}
                  action={action}
                />
              )}
              {warningAlert && (
                <Snackbar
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  open={warningAlert}
                  message={alertText}
                  action={action}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
