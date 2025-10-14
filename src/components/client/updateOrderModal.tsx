"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearSuccessMessage, updateOrder } from "@/redux/slices/orderSlice";
import { OrderForEdit } from "@/types/orderForEdits";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 390,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  boxShadow: 8,
  p: 3,
};

interface OrderDetailsModalProps {
  orderId: number;
  open: boolean;
  onClose: () => void;
  order: OrderForEdit;
}

export default function UpdateOrderModal({
  orderId,
  open,
  onClose,
  order,
}: Readonly<OrderDetailsModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("heading");
  const [isEditting, setIsEditting] = useState(false);
  const [formData, setFormData] = useState<OrderForEdit>(order);
  const [tempData, setTempData] = useState<OrderForEdit>({
    readerId: order.readerId,
    orderDate: order.orderDate,
    longitude: order.longitude,
    latitude: order.latitude,
    addressOne: order.addressOne,
    addressTwo: order.addressTwo,
    country: order.country,
    city: order.city,
    postNumber: order.postNumber,
  });
  const { successType, successMessage, error } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch<AppDispatch>();
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState<string | null>("");

  // When order changes (selected from table)
  useEffect(() => {
    if (order) {
      setFormData(order);
      setTempData(order);
    }
  }, [order]);

  // Handle change
  const handleChange = (
    field: keyof OrderForEdit,
    value: string | number | Date
  ) => {
    setTempData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle edit button
  const handleEditClick = () => {
    setTempData(formData);
    setIsEditting(true);
  };

  const handleEditingClose = () => {
    setFormData(tempData);
    setIsEditting(false);
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
    const {
      orderDate,
      longitude,
      latitude,
      addressOne,
      addressTwo,
      city,
      country,
      postNumber,
    } = tempData;

    // Build the payload
    const formData: OrderForEdit = {
      orderDate,
      longitude,
      latitude,
      addressOne,
      addressTwo,
      city,
      country,
      postNumber
    };
    dispatch(updateOrder({ formData, orderId }));
    setFormData((prev: any) => ({ ...prev, ...tempData }));
    setIsEditting(false);
  };

  if (!order) return null;
  return (
    <Box component="section">
      <Modal
        open={open}
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
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t3("orderDetailsModel")}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ alignItems: "flex-end" }} />
          </Box>
          <Box
            component="form"
            onSubmit={handleSave}
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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
                    {formData?.latitude}, {formData?.longitude}
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
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
                    {formData?.addressOne}, {formData?.addressTwo},{" "}
                    {formData?.postNumber}, {formData?.country},{" "}
                    {formData?.city}
                  </span>
                )}
              </Grid>
            </Grid>

            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 3,
                marginLeft: "auto",
              }}
            >
                {!isEditting ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEditingClose}
                  >
                    Cancel
                  </Button>
                )}
              <Button variant="contained" color="secondary" type="submit">
                {t2("save")}
              </Button>
            </Grid>
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
        <Alert severity="warning">{alertText}</Alert>
      </Snackbar>
    </Box>
  );
}
