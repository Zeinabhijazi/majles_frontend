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
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { UpdateUser } from "@/types/updateUser";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  clearSuccessMessage,
  fetchUserDetails,
  updateUser,
} from "@/redux/slices/userSlice";
import z from "zod";

export default function UpdateUserForm() {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("radioButton");
  
  const { userDetails, successType, successMessage } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isEditting, setIsEditting] = useState(false);
  
  const [formData, setFormData] = useState<UpdateUser | null>(null);
  const [tempData, setTempData] = useState<UpdateUser | null>(null);

  const [inputErrors, setInputErrors] = useState<
    Partial<Record<keyof UpdateUser, string>>
  >({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  // Sync formData with user when it’s fetched
  useEffect(() => {
    if (userDetails) {
      setFormData(userDetails);
      setTempData(userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Handle edit button
  const handleEditClick = () => {
    if (formData) {
      setTempData(formData);
      setIsEditting(true);
    }
  };

  const handleEditingClose = () => {
    if (tempData) {
      setFormData(tempData);
    }
    setIsEditting(false);
  };

  // Field change during editing
  const handleChange = (field: keyof UpdateUser, value: string | number) => {
    setTempData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
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

  // Validation
  const validateInputs = (): boolean => {
    const result = userSchema.safeParse(tempData);
    if (result.success) {
      setInputErrors({});
      return true;
    }

    const fieldErrors: Partial<Record<keyof UpdateUser, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof UpdateUser;
      fieldErrors[field] = issue.message;
    }
    setInputErrors(fieldErrors);
    return false;
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
    if (!validateInputs()) return;
    if (!formData || !tempData) return null;
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
  
  if (!formData || !tempData) return null;
  return (
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
          sx={{ marginInlineStart: "auto" }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleEditingClose}
          color="secondary"
          size="small"
          sx={{ marginInlineStart: "auto" }}
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
                  marginTop: "4px",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  color: "#f44336",
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
            <strong>{t3("gender")}:</strong>
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
                label={t3("male")}
              />
              <FormControlLabel
                value="female"
                control={<Radio color="secondary" size="small" />}
                label={t3("female")}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {inputErrors.gender ? "Please select a gender" : ""}
              </FormHelperText>
            </RadioGroup>
          ) : (
            <span>
              {formData.gender === "male" ? t3("male") : t3("female")}
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
                  onChange={(e) => handleChange("addressOne", e.target.value)}
                  size="small"
                  fullWidth
                  error={!!inputErrors.addressOne}
                  helperText={inputErrors.addressOne}
                />
                <TextField
                  value={tempData.addressTwo}
                  onChange={(e) => handleChange("addressTwo", e.target.value)}
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
                  onChange={(e) => handleChange("postNumber", e.target.value)}
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

      {isEditting && (
        <Grid>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{ float: "inline-end", width: "18%", mt: 1.2 }}
          >
            {t2("save")}
          </Button>
        </Grid>
      )}

      {/* Alerts */}
      <Snackbar
        open={successAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{alertText}</Alert>
      </Snackbar>
    </Box>
  )
}
