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
import { clearSuccessMessage } from "@/redux/slices/userSlice";
import { cancelOrder } from "@/redux/slices/orderSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
}

export default function DeleteOrderDialog(props: DeleteDialogProps) {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("button");
  const { successMessage, successType } = useSelector(
    (state: RootState) => state.order
  );
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Handle submit
  const handleDelete = (orderId: number) => {
    dispatch(cancelOrder(orderId));
  };

  useEffect(() => {
    if (successType === "cancel" && successMessage) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
  }, [successMessage, successType]);
  {
    successType === "cancel" && successMessage && (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    );
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
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
        <DialogTitle>{t1("deleteDialog")}</DialogTitle>
        <DialogContent>{t1("deleteOrderDialogQuestion")}</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(props.orderId)}
          >
            {t2("delete")}
          </Button>
          <Button variant="contained" color="secondary" onClick={props.onClose}>
            {t2("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
