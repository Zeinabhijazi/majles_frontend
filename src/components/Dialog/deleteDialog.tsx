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
  open: boolean;
  onClose: () => void;
  userId: number;
}

export default function DeleteDialog(props: DeleteDialogProps) {
  const t1 = useTranslations("button");
  const t2 = useTranslations("heading");
  const { successMessage, successType } = useSelector(
    (state: RootState) => state.user
  );
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Handle submit
  const handleDelete = (userId: number) => {
    dispatch(deleteUser(userId));
  };

  useEffect(() => {
    if (successType === "delete" && successMessage) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
  }, [successMessage, successType]);
  
  {successType === "delete" && successMessage && (
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
        <DialogTitle>{t2("deleteDialog")}</DialogTitle>
        <DialogContent>{t2("deleteDialogQuestion")}</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(props.userId)}
          >
            {t1("delete")}
          </Button>
          <Button variant="contained" color="secondary" onClick={props.onClose}>
            {t1("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
