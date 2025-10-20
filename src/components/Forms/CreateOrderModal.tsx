"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import api from "@/lib/axios";

type FormData = {
  orderDate: Date;
  postNumber: number;
  country: string;
  city: string;
  addressOne: string;
  addressTwo: string;
  longitude: number;
  latitude: number;
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({
  open,
  onClose,
}: Readonly<ModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("heading");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState({
    addressOne: "",
    addressTwo: "",
    city: "",
    postNumber: "",
    country: "",
    longitude: "",
    latitude: "",
  });
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const { userDetails } = useSelector((state: RootState) => state.user);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
    height: 500,
    bgcolor: "background.default",
    border: "1px solid #eee",
    borderRadius: 5,
    p: 4,
  };

  const handleChange = (name: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setAlertText("Please select a valid date");
      setWarningAlert(true);
      setTimeout(() => setWarningAlert(false), 3000);
      return;
    }
    const payload: FormData = {
      orderDate: date!.toDate(), // Convert Dayjs to ISO string
      addressOne: formData.addressOne || userDetails.addressOne || "",
      addressTwo: formData.addressTwo || userDetails.addressTwo || "",
      city: formData.city || userDetails.city || "",
      postNumber: Number(formData.postNumber) || userDetails.postNumber || 0,
      country: formData.country || userDetails.country || "",
      latitude: Number(formData.latitude) || userDetails.latitude || 0,
      longitude: Number(formData.longitude) || userDetails.longitude || 0,
    };

    try {
      const response = await api.post("api/order", payload);
      if (response.data.success) {
        setAlertText("Order added successfully!");
        setSuccessAlert(true);
        setDate(null);
        setFormData({
          addressOne: "",
          addressTwo: "",
          city: "",
          postNumber: "",
          country: "",
          longitude: "",
          latitude: "",
        });

        setTimeout(() => setSuccessAlert(false), 2500);
      }
    } catch (error: any) {
      setAlertText(
        error.response?.data?.message || "An unexpected error occurred"
      );
      setWarningAlert(true);
      setTimeout(() => setWarningAlert(false), 3000);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // less black, more transparent
            },
          },
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5">
              <AssignmentAddIcon
                color="secondary"
                sx={{ fontSize: "35px", mr: 2 }}
              />
              <strong>{t3("addOrderModal")}</strong>
            </Typography>
            <CloseOutlinedIcon onClick={onClose} sx={{ mt: 1 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              my: 1.5,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label={t1("datePickerLabel")}
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Grid size={6}>
                <TextField // Address One
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("addressOne")}
                  value={formData.addressOne}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("addressOne", e.target.value)
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextField // Address Two
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("addressTwo")}
                  value={formData.addressTwo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("addressTwo", e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Grid size={6}>
                <TextField // City
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("city")}
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("city", e.target.value)
                  }
                />
              </Grid>
              <Grid size={6}>
                <TextField // Post Code
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("postCode")}
                  value={formData.postNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("postNumber", e.target.value)
                  }
                />
              </Grid>
            </Grid>
            <TextField // Country
              fullWidth
              variant="outlined"
              color="secondary"
              placeholder={t1("country")}
              value={formData.country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("country", e.target.value)
              }
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
              <Grid size={5}>
                <TextField // Latitude
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("latitude")}
                  value={formData.latitude}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={5}>
                <TextField // Longitude
                  variant="outlined"
                  color="secondary"
                  placeholder={t1("longitude")}
                  value={formData.longitude}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid size={2}>
                <IconButton onClick={handleGetLocation}>
                  <AddLocationAltOutlinedIcon color="secondary" />
                </IconButton>
              </Grid>
            </Grid>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ ml: "auto" }}
            >
              {t2("save")}
            </Button>
          </Box>
        </Box>
      </Modal>
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
        <Alert severity="error">{alertText}</Alert>
      </Snackbar>
    </div>
  );
}
