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
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearSuccessMessage} from "@/redux/slices/userSlice";
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
  orderId: number;
}

export default function DeleteOrderDialog({
  orderId,
}: Readonly<DeleteDialogProps>) {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("button");
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const { successMessage, successType } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (successType === "cancel" && successMessage) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
  }, [successMessage, successType]);

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = (orderId: number) => {
    dispatch(cancelOrder(orderId));
  };

  return (
    <React.Fragment>
      <Button
        variant="text"
        color="secondary"
        onClick={() => handleOpenDelete(orderId)}
      >
        <DeleteIcon />
      </Button>
      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
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
            onClick={() => handleDelete(orderId)}
          >
            {t2("delete")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDelete}
          >
            {t2("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
      {successType === "cancel" && successMessage && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
    </React.Fragment>
  );
}
