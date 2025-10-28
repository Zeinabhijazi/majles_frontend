"use client";
import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 220,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  p: 3,
};

interface ReaderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function ReaderDetailsModal({
  open,
  onClose,
  userId,
}: Readonly<ReaderDetailsModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("heading");
  const { users } = useSelector((state: RootState) => state.user);

  if (!userId) return null;

  const user = users.find((u) => u.id === userId) || null;

  return (
    <Box component="section">
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
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
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 0.5 }}>
              {t2("readerDetailsModel")}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ alignItems: "flex-end" }} />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "90%",
              marginTop: 5,
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
                {t1("email")} :
              </Typography>
              <Typography
                variant="h6"
                component="a"
                href={`mailto:${user?.email}`}
                sx={{
                  fontSize: "17px",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "none", opacity: 0.8 },
                }}
              >
                {user?.email}
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
                {t1("phoneNumber")} :
              </Typography>
              <Typography
                variant="h6"
                component="a"
                href={`tel:${user?.phoneNumber}`}
                sx={{
                  fontSize: "17px",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "none", opacity: 0.8 },
                }}
              >
                {user?.phoneNumber}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
