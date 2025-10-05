import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearSuccessMessage, deleteUser } from "@/redux/slices/userSlice";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface DeleteDialogProps {
  userId: number;
}

export default function DeleteDialog({ userId }: Readonly<DeleteDialogProps>) {
  const t = useTranslations("deletedDialog");
  const t1 = useTranslations("userTable");
  const [openDelete, setOpenDelete] = useState(false);
  const { successMessage, error } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      onClick={() => {
        setOpen(false);
        dispatch(clearSuccessMessage()); // ✅ clears Redux
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  useEffect(() => {
    if (successMessage) {
      setMessage(successMessage);
      setOpen(true);
    }
    if (error) {
      setMessage(error);
      setOpen(true);
    }
  }, [successMessage, error]);

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
    handleCloseDelete();
  };
  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        message={message}
        action={action}
      />
      <Button variant="text" color="secondary" onClick={() => handleOpenDelete(userId)}>
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
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogContent>{t1("questionUser")}</DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(userId)}>{t("deleteBtn")}</Button>
          <Button variant="contained" color="secondary" onClick={handleCloseDelete}>{t("cancelBtn")}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
