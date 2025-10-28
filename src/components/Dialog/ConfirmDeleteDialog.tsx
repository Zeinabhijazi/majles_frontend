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
import { clearSuccessMessage as clearUserMessage, deleteUser } from "@/redux/slices/userSlice";
import { clearSuccessMessage as clearOrderMessage, cancelOrder } from "@/redux/slices/orderSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  userId?: number;
  orderId?: number;
  type: "user" | "order"; 
}

export default function ConfirmDeleteDialog({
  open,
  onClose,
  userId,
  orderId,
  type,
}: Readonly<ConfirmDeleteDialogProps>) {
  const t1 = useTranslations("button");
  const t2 = useTranslations("heading");

  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { successMessage, successType } = useSelector((state: RootState) =>
    type === "user" ? state.user : state.order
  );

  const handleDelete = () => {
    if (type === "user" && userId) dispatch(deleteUser(userId));
    if (type === "order" && orderId) dispatch(cancelOrder(orderId));
  };

  useEffect(() => {
    if (
      (type === "user" && successType === "delete" && successMessage) ||
      (type === "order" && successType === "cancel" && successMessage)
    ) {
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
        if (type === "user") dispatch(clearUserMessage());
        if (type === "order") dispatch(clearOrderMessage());
        onClose();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, successType, type, dispatch, onClose]);

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
        <DialogTitle>{t2("deleteDialog")}</DialogTitle>
        <DialogContent>
          {type === "user"
            ? t2("deleteDialogQuestion")
            : t2("deleteOrderDialogQuestion")}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            {t1("delete")}
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            {t1("cancel")}
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
