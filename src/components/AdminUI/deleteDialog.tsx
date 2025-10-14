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
import { clearSuccessMessage, deleteUser } from "@/redux/slices/userSlice";

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
  const t1 = useTranslations("button");
  const t2 = useTranslations("heading");
  const [openDelete, setOpenDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const { successMessage, successType } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (successType === "delete" && successMessage) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage())
      }, 2500);
    }
  }, [successMessage, successType]);

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // Handle submit
  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  return (
    <React.Fragment>
      <Button
        variant="text"
        color="secondary"
        onClick={() => handleOpenDelete(userId)}
      >
        <DeleteIcon />
      </Button>
      <Dialog
        open={openDelete}
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
        <DialogContent>{t2("deleteDialogQuestion")}</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(userId)}
          >
            {t1("delete")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseDelete}
          >
            {t1("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
      {successType === "delete" && successMessage && (
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
