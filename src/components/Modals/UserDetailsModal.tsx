"use client";
import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

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
  p: 3,
};

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function UserDetailsModal({
  open,
  onClose,
  userId,
}: Readonly<UserDetailsModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("radioButton");
  const t3 = useTranslations("heading");
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
              backgroundColor: "rgba(0, 0, 0, 0.3)",
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
              {t3("userDetailsModel")}
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
                {t1("phoneNumber")}:
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "17px" }}>
                {user?.phoneNumber}
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
                {user?.addressOne}, {user?.addressTwo}, {user?.postNumber},{" "}
                {user?.country}, {user?.city}
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
                {user?.latitude}, {user?.longitude}
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
                {t2("gender")}:
              </Typography>
              <Typography variant="h6" sx={{ fontSize: "17px" }}>
                {user?.gender === "female" ? t2("female") : t2("male")}
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
                {t1("deleted")}:
              </Typography>
              <FormGroup>
                {user?.isDeleted === true ? (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox size="small" color="secondary" checked />
                      }
                      label={t1("yes")}
                    />
                    <FormControlLabel
                      disabled
                      control={<Checkbox size="small" />}
                      label={t1("no")}
                    />
                  </>
                ) : (
                  <>
                    <FormControlLabel
                      disabled
                      control={<Checkbox size="small" />}
                      label={t1("yes")}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox size="small" color="secondary" checked />
                      }
                      label={t1("no")}
                    />
                  </>
                )}
              </FormGroup>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
