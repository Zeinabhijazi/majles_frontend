"use client";
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import api from "@/lib/axios";
import z from "zod";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  height: 240,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  p: 3,
};

interface ForgetPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ForgetPasswordModal({
  open,
  onClose,
}: Readonly<ForgetPasswordModalProps>) {
  const t1 = useTranslations("label");
  const t2 = useTranslations("heading");
  const t3 = useTranslations("button");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const forgetPasswordSchema = z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
  });

  const validate = (): boolean => {
    const result = forgetPasswordSchema.safeParse({ email });

    if (result.success) {
      setEmailError("");
      return true;
    }

    const issue = result.error.issues.find((i) => i.path[0] === "email");
    setEmailError(issue?.message ?? "Invalid email");
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await api.post("auth/forget-password", { email });

      setSnackbarMessage(res.data.message || "Reset link sent");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";

      if (message.toLowerCase().includes("user")) {
        setEmailError(message);
        return;
      }

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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
              {t2("forgetPasswordTitle")}
            </Typography>
            <CloseIcon onClick={onClose} sx={{ alignItems: "flex-end" }} />
          </Box>

          <Box
            component={"form"}
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              placeholder={t1("forgetPasswordlabel")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="secondary"
              error={!!emailError}
              helperText={emailError}
              sx={{
                mb: 2,
              }}
            />
            <Button variant="contained" color="secondary" type="submit">
              {t3("submit")}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
