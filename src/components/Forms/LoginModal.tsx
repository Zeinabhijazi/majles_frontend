"use client";
import React, { useState } from "react";
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
  Alert,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import CheckIcon from "@mui/icons-material/Check";

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
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const t3 = useTranslations("loginModal");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const dispatch = useDispatch<AppDispatch>();

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
        const userData = await dispatch(login({ email, password })).unwrap(); // unwrap(): continue when the thunk return the respone
        if (userData.userType === "admin") { 
          // Clear the inputs
          setEmail("");
          setPassword("");
          onClose();
        }

        if (userData.userType !== "admin") {
          setAlertText("Login Successfully.");
          setSuccessAlert(true);
          // Clear the inputs
          setEmail("");
          setPassword("");
          // Hide alert after 3 seconds
          setTimeout(() => {
            setSuccessAlert(false);
            onClose();
            router.replace("/");
            window.location.reload();
          }, 2500);
        }
      }
    } catch (err: any) {
      if (err) {
        setAlertText(err);
        setWarningAlert(true);
        setTimeout(() => {
          setWarningAlert(false);
        }, 3000);
      } else {
        setAlertText("An unexpected error occurred. Please try again.");
      }
    }
  };

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
                {t3("hello")}
              </Typography>
              <Typography variant="h6">{t3("title")}</Typography>
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
              mt: 2,
            }}
          >
            <TextField
              required
              label={t1("email")}
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
              label={t1("password")}
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
                  {t2("login")}
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
                  {t3("forgetPassword")}
                </Link>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                mb: 2,
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
                {t3("question")}
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
                {t2("create")}
              </Button>
            </Box>
            <Stack>
              {successAlert && (
                <Alert
                  sx={{ margin: "10px" }}
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  {alertText}
                </Alert>
              )}
              {warningAlert && (
                <Alert sx={{ margin: "10px" }} severity="error">
                  {alertText}
                </Alert>
              )}
            </Stack>
          </FormControl>
        </Box>
      </Slide>
    </Modal>
  );
}
