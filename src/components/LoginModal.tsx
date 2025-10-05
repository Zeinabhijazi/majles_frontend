"use client";
import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  FormControl,
  Grid,
  Modal,
  Slide,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { loadUserData } from "@/redux/slices/userSlice";

const style = {
  position: "absolute",
  width: 410,
  height: 450,
  bgcolor: "background.default",
  border: "1px solid #eee",
  borderRadius: 5,
  boxShadow: 24,
  p: 3,
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSecond: () => void;
}

export default function LoginModal({
  open,
  onClose,
  onOpenSecond,
}: Readonly<ModalProps>) {
  const t = useTranslations("Form");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { userDetails } = useSelector((state: RootState) => state.user);

  

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // schema
  const loginSchema = z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const validate = (): boolean => {
    const result = loginSchema.safeParse({ email, password });

    if (result.success) {
      setError({});
      return true;
    }

    const fieldErrors: { email?: string; password?: string } = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as "email" | "password";
      if (field) {
        fieldErrors[field] = issue.message;
      }
    });

    setError(fieldErrors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (validate()) {
        const userData = await dispatch(login({ email, password })).unwrap();// unwrap(): continue when the thunk return the respone
        
        console.log(userData.userType); 

        if (userData.userType !== "admin") {
          setEmail("");
          setPassword("");
          onClose();
          router.replace("/");      
          window.location.reload(); 
        } 
      }
    } catch (err: any) {
      if (err) {
        setAlertText("An unexpected error occurred. Please try again.");
      }
      setWarningAlert(true);
    }
  }

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => {
        setSuccessAlert(false);
        setWarningAlert(false);
        setEmail("");
        setPassword("");
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <Modal
      open={open}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Slide direction="down" in={open} mountOnEnter unmountOnExit>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={style}
        >
          <Grid container>
            <Grid
              sx={{
                flex: "0 0 95%",
                p: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: 38,
                  fontWeight: 500,
                }}
              >
                {t("hello")}
              </Typography>
              <Typography variant="h6">{t("title")}</Typography>
            </Grid>
            <Grid
              sx={{
                flex: "0 0 5%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                mt: 1,
              }}
            >
              <CloseIcon onClick={onClose} sx={{ cursor: "pointer" }} />
            </Grid>
          </Grid>
          <FormControl
            variant="outlined"
            sx={{
              width: "100%",
              height: "70%",
              my: 2,
            }}
          >
            <TextField
              required
              label={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="secondary"
              error={!!error.email}
              helperText={error.email}
              sx={{
                mb: 1,
              }}
            />
            <TextField
              label={t("password")}
              type={showPassword ? "text" : "password"}
              value={password}
              color="secondary"
              onChange={(e) => setPassword(e.target.value)}
              error={!!error.password}
              helperText={error.password}
              sx={{
                mb: 1,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="secondary"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />
            <Grid container>
              <Grid
                sx={{
                  flex: "0 0 50%",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  sx={{
                    my: 1,
                    width: 100,
                    height: 40,
                    p: 1,
                  }}
                >
                  {t("login")}
                </Button>
              </Grid>
              <Grid
                sx={{
                  flex: "0 0 50%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  mt: 2,
                }}
              >
                <Link className="text-xs" href="/not-found">
                  {t("forgetPassword")}
                </Link>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  fontSize: 13,
                  mt: 1,
                }}
              >
                {t("question")}
              </Typography>
              <Button
                variant="text"
                color="secondary"
                sx={{
                  fontSize: 14,
                  textAlign: "center",
                  fontStyle: "normal",
                  fontWeight: "medium",
                  textTransform: "capitalize",
                  backgroundColor: "transparent",
                }}
                onClick={onOpenSecond}
              >
                {t("create")}
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
          </FormControl>
        </Box>
      </Slide>
    </Modal>
  );
}
