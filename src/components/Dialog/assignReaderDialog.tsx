import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slide,
  Snackbar,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchReaders } from "@/redux/slices/userSlice";
import {
  handleAssignReader,
  clearSuccessMessage,
  fetchOrders,
} from "@/redux/slices/orderSlice";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface AssignDialogProps {
  orderId: number;
}

export default function AssignReaderDialog({
  orderId,
}: Readonly<AssignDialogProps>) {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("button");
  const t3 = useTranslations("select");
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const { users } = useSelector((state: RootState) => state.user);
  const { successMessage, successType, error } = useSelector(
    (state: RootState) => state.order
  );
  const [allReaders, setAllReaders] = useState("");
  const [readerId, setReaderId] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReaders({}));
  }, [dispatch]);

  useEffect(() => {
    if (successType === "assign" && successMessage) {
      dispatch(fetchOrders({}));
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
    if (error) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(clearSuccessMessage());
      }, 2500);
    }
  }, [successMessage, successType, error]);

  const handleChange = (event: SelectChangeEvent) => {
    setAllReaders(event.target.value);
    setReaderId(Number(event.target.value));
  };

  const handleOpenAssign = () => setOpenAssignModal(true);

  const handleCloseAssign = () => {
    setAllReaders("");
    setOpenAssignModal(false);
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenAssign()}
      >
        {t2("assign")}
      </Button>
      <Dialog
        open={openAssignModal}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            width: 400,
            height: 250,
            bgcolor: "background.default",
            border: "1px solid #eee",
            borderRadius: 5,
            boxShadow: 8,
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "secondary.main",
            fontWeight: 700,
            fontSize: "25px",
            mb: 1,
          }}
        >
          {t1("assignDialog")}
        </DialogTitle>
        <DialogContent
          sx={{
            overflow: "visible",
          }}
        >
          <FormControl fullWidth>
            <InputLabel>{t3("selectReader")}</InputLabel>
            <Select
              value={allReaders}
              onChange={handleChange}
              label={t3("selectReader")}
            >
              {users &&
                users.length > 0 &&
                users.map((row) => (
                  <MenuItem value={row.id} key={row.id}>
                    {row.firstName} {row.lastName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => dispatch(handleAssignReader({ orderId, readerId }))}
          >
            {t2("assign")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseAssign}
          >
            {t2("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
      {successType === "assign" && successMessage && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </React.Fragment>
  );
}
