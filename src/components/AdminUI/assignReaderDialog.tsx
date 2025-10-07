import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import CloseIcon from "@mui/icons-material/Close";
import {
  clearSuccessMessage,
  handleAssignReader,
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
  const { users } = useSelector((state: RootState) => state.user);
  const [allReaders, setAllReaders] = useState("");
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [readerId, setReaderId] = useState<number>(0);
  const { successMessage, error } = useSelector(
    (state: RootState) => state.order
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchReaders({}));
    if (successMessage) {
      setMessage(successMessage);
      setOpenSnackbar(true);
    }
    if (error) {
      setMessage(error);
      setOpenSnackbar(true);
    }
  }, [dispatch, successMessage, error]);

  const handleChange = (event: SelectChangeEvent) => {
    setAllReaders(event.target.value);
    setReaderId(Number(event.target.value));
  };

  const handleOpenAssign = () => setOpenAssignModal(true);

  const handleCloseAssign = () => {
    setAllReaders("");
    setOpenAssignModal(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      onClick={() => {
        setOpenSnackbar(false);
        handleCloseAssign();
        dispatch(clearSuccessMessage()); // ✅ clears Redux
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        message={message}
        action={action}
      />
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
        PaperProps={{
          sx: {
            width: 400,
            height: 250,
            bgcolor: "background.default",
            border: "1px solid #000",
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
              labelId="reader-select-label"
              id="reader-select"
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
    </React.Fragment>
  );
}
