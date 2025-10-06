"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import { Dayjs } from "dayjs";

type FormData = {
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

export default function CreateOrderModal(
  {open, onClose} : Readonly<ModalProps>
  ) {
  const t = useTranslations("Form");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState({
      addressOne: "",
      addressTwo: "",
      city: "",
      postNumber: "",
      country: "",
      longitude: 0,
      latitude: 0,
    });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 520,
    height: 500,
    bgcolor: "background.default",
    border: "1px solid #eee",
    borderRadius: 5,
    boxShadow: 8,
    p: 4,
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

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  }

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            timeout: 500,
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
              <AssignmentAddIcon color="secondary" sx={{fontSize: "35px", mr: 2}}/><strong>Add Order</strong>
            </Typography>
            <CloseOutlinedIcon onClick={onClose} sx={{ mt:1}}/>
          </Box>
          
          
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            autoComplete="off"
            sx={{
              my: 1.5,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          > 
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker 
                  label="Date"
                  value={date}
                  onChange = {(newValue) => setDate(newValue)}
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
                  label={t("addressOne")}
                  value={formData.addressOne}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("addressOne", e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField // Address Two
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  label={t("addressTwo")}
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
                  label={t("city")}
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("city", e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid size={6}>
                <TextField // Post Code
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  label={t("postCode")}
                  value={formData.postNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("postNumber", e.target.value)
                  }
                  required
                />
              </Grid>
            </Grid>
            <TextField // Country
              fullWidth
              variant="outlined"
              color="secondary"
              label={t("country")}
              value={formData.country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("country", e.target.value)
              }
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
              <Grid size={5}>
                <TextField // Latitude
                  variant="outlined"
                  color="secondary"
                  label={t("latitude")}
                  value={formData.latitude}
                  InputProps={{ readOnly: true }}
                  required
                />
              </Grid>
              <Grid size={5}>
                <TextField // Longitude
                  variant="outlined"
                  color="secondary"
                  label={t("longitude")}
                  value={formData.longitude}
                  InputProps={{ readOnly: true }}
                  required
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
              {t("save")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
