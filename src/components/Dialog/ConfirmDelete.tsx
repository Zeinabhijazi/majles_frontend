import React from "react";
import { 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Snackbar, 
    Alert 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";




export default function ConfirmDelete () {
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