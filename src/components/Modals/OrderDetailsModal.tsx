"use client";
import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { Order } from "@/types/order";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 470,
  height: 380,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  boxShadow: 8,
  p: 3,
};

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  open,
  onClose,
  order,
}: Readonly<OrderDetailsModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("heading");

  if (!order) return null;

  return (
    <Box component="section">
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
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t2("orderDetailsModel")}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ alignItems: "flex-end" }} />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "90%",
              mt: 10,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: "18px", fontWeight: 700 }}
              >
                {t1("phoneNumber")}:
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "17px" }}>
                {order.client.phoneNumber}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: "18px", fontWeight: 700 }}
              >
                {t1("address")}:
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "17px" }}>
                {order.addressOne}, {order.addressTwo}, {order.postNumber},{" "}
                {order.country}, {order.city}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: "18px", fontWeight: 700 }}
              >
                {t1("coordinates")}:
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "17px" }}>
                {order.latitude}, {order.longitude}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
