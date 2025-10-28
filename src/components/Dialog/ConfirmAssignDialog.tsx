"use client";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Snackbar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearSuccessMessage,
  handleAssignReader,
} from "@/redux/slices/orderSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  orderId: number;
}

export default function ConfirmAssignDialog({
  open,
  onClose,
  userId,
  orderId,
}: Readonly<ConfirmDeleteDialogProps>) {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("label");
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { successMessage, successType } = useSelector(
    (state: RootState) => state.order
  );

  const handleAssign = () => {
    dispatch(
      handleAssignReader({
        readerId: userId,
        orderId: orderId,
      })
    );
  };

  useEffect(() => {
    if (successType === "assign" && successMessage) {
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
        dispatch(clearSuccessMessage());
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, successType, dispatch, onClose]);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            border: "1px solid #fff",
            boxShadow: 3,
            bgcolor: "background.default",
          },
        }}
      >
        <DialogTitle>{t1("confirmDialog")}</DialogTitle>
        <DialogContent>
          {t1("assignDialogQuestion")}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleAssign}>
            {t2("yes")}
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            {t2("no")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    </>
  );
}
