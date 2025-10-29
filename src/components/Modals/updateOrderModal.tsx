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
import { Order } from "@/types/order";

const style = {
  position: "absolute" as const,
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
}

export default function UpdateOrderModal({
  orderId,
  open,
  onClose
}: Readonly<OrderDetailsModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("heading");
  const { orders, successType, successMessage } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Order | null>(null);
  const [tempData, setTempData] = useState<OrderForEdit | null>(null);
  const [isEditting, setIsEditting] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertText, setAlertText] = useState<string | null>("");

  // When modal opens, pick the order
  useEffect(() => {
    if (!open) return;
    const selectedOrder = orders.find((o) => o.id === orderId) || null;
    setFormData(selectedOrder);
    if (selectedOrder) {
      setTempData({
        orderDate: selectedOrder.orderDate,
        longitude: Number(selectedOrder.longitude) || 0,
        latitude: Number(selectedOrder.latitude) || 0,
        addressOne: selectedOrder.addressOne || "",
        addressTwo: selectedOrder.addressTwo || "",
        city: selectedOrder.city || "",
        country: selectedOrder.country || "",
        postNumber: selectedOrder.postNumber || 0,
        readerId: selectedOrder.readerId || undefined,
      });
      setIsEditting(false); 
    }
  }, [open, orderId, orders]);

  // Handle input change
  const handleChange = (
    field: keyof OrderForEdit,
    value: string | number | Date 
  ) => {
    setTempData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  // Edit / cancel
  const handleEditClick = () => {
    if (formData) {
      setTempData({
        orderDate: formData.orderDate,
        longitude: formData.longitude ?? 0,
        latitude: formData.latitude ?? 0,
        addressOne: formData.addressOne ?? "",
        addressTwo: formData.addressTwo ?? "",
        city: formData.city,
        country: formData.country ?? "",
        postNumber: formData.postNumber ?? 0,
        readerId: formData.readerId ?? undefined,
      });
      setIsEditting(true);
    }
  }

  const handleEditingClose = () => {
    if (tempData) {
      setFormData((prev) => prev ? { ...prev, ...tempData } : prev);
    }
    setIsEditting(false);
  };

  // Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleChange("latitude", pos.coords.latitude);
        handleChange("longitude", pos.coords.longitude);
      },
      () => alert("Could not get location")
    );
  };

  // Show success message
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempData || !formData) return;
    dispatch(updateOrder({ formData: tempData, orderId: formData.id }));
    setIsEditting(false);
  };

  // Disable editing
  const isDisabled = formData?.status !== 'pending';

  return (
    <Box component="section">
      <Modal
        open={open}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t3("orderDetailsModel")}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSave}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Grid container>
              <Grid size={3}>
                <Typography><strong>{t1("coordinates")}:</strong></Typography>
              </Grid>
              <Grid size={9}>
                {isEditting ? (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      value={tempData?.latitude}
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ width: "50%" }}
                    />
                    <TextField
                      value={tempData?.longitude}
                      size="small"
                      InputProps={{ readOnly: true }}
                      sx={{ width: "50%" }}
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
              <Grid size={3}>
                <Typography><strong>{t1("address")}:</strong></Typography>
              </Grid>
              <Grid size={9}>
                {isEditting ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        value={tempData?.addressOne}
                        onChange={(e) => handleChange("addressOne", e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        value={tempData?.addressTwo}
                        onChange={(e) => handleChange("addressTwo", e.target.value)}
                        size="small"
                        fullWidth
                      />
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        value={tempData?.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        size="small"
                        fullWidth
                      />
                      <TextField
                        value={tempData?.postNumber}
                        onChange={(e) => handleChange("postNumber", Number(e.target.value))}
                        size="small"
                        fullWidth
                      />
                    </Box>
                    <TextField
                      value={tempData?.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </Box>
                ) : (
                  <span>
                    {formData?.addressOne}, {formData?.addressTwo}, {formData?.postNumber}, {formData?.country}, {formData?.city}
                  </span>
                )}
              </Grid>
            </Grid>

            {!isDisabled && (
              <Box sx={{ display: "flex", gap: 2, marginLeft: "auto" }}>
                {!isEditting ? (
                  <Button variant="contained" color="secondary" onClick={handleEditClick}>
                    {t2("edit")}
                  </Button>
                ) : (
                  <Button variant="contained" color="secondary" onClick={handleEditingClose}>
                    {t2("cancel")}
                  </Button>
                )}
                {isEditting && (
                  <Button variant="contained" color="secondary" type="submit">
                    {t2("save")}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

      <Snackbar open={successAlert} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="success">{alertText}</Alert>
      </Snackbar>
    </Box>
  );
}
