"use client";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { Order } from "@/types/order";
import {
  clearSuccessMessage,
  fetchOrdersForLoggedUser,
  handleAccept,
} from "@/redux/slices/orderSlice";
import DeleteOrderDialog from "@/components/Dialog/deleteOrder";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderTable from "@/components/Tables/order/orderTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

export default function PendingOrdersDataGrid() {
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const { userDetails } = useSelector((state: RootState) => state.user);
  const { successType, successMessage, error } = useSelector(
    (state: RootState) => state.order
  );
  if (!userDetails?.id) return;
  const readerId = userDetails.id;
  useEffect(() => {
    if (successType === "accept" && successMessage) {
      dispatch(fetchOrdersForLoggedUser({}));
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

  {
    successType === "assign" && successMessage && (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
    );
  }
  {
    error && (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    );
  }

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), width: 70 },
    {
      field: "Date",
      headerName: t2("date"),
      width: 100,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleDateString(),
    },
    {
      field: "Time",
      headerName: t2("time"),
      width: 100,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                dispatch(
                  handleAccept({ orderId: params.row.id, readerId: readerId })
                )
              }
            >
              {t1("accept")}
            </Button>
            {params.row.isAccepted || params.row.isDeleted ? (
              <Button variant="text" disabled>
                <DeleteIcon />
              </Button>
            ) : (
              <DeleteOrderDialog orderId={params.row.id} />
            )}
          </Box>
        );
      },
    },
  ];

  return <OrderTable columns={columns} fetchFn={fetchOrdersForLoggedUser} />;
}
