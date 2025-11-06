"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import {
  clearSuccessMessage,
  fetchOrdersForLoggedUser,
  handleAcceptOrder,
} from "@/redux/slices/orderSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderTable from "@/components/Tables/order/orderTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ConfirmDeleteDialog from "@/components/Dialog/ConfirmDeleteDialog";

export default function PendingOrdersDataGrid() {
  const filters = useMemo(() => ({ status: "pending" }), []);
  const fetchPendingOrders = useCallback(
    (params: Record<string, any>) =>
      fetchOrdersForLoggedUser({ ...params, target: "pending" }),
    []
  );
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { successMessage, successType } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (successType === "accept" && successMessage) {
      dispatch(fetchPendingOrders({status: "pending"}));
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
        dispatch(clearSuccessMessage());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, successType, dispatch]);

  const { userDetails } = useSelector((state: RootState) => state.user);
  if (!userDetails?.id) return;
  const readerId = userDetails.id;

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
    setSelectedOrder(id);
  };
  const handleCloseDelete = () => setOpenDelete(false);
  

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), flex: 1 },
    {
      field: "Date",
      headerName: t2("date"),
      flex: 2,
      valueGetter: (value, row) => {
        const date = new Date(row.orderDate);
        return `${date.getDate()} - ${date.toLocaleString(locale, {
          month: "long",
        })} - ${date.getFullYear()}`;
      },
    },
    {
      field: "Time",
      headerName: t2("time"),
      flex: 2,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "actions",
      headerName: t2("actions"),
      flex: 4,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                dispatch(
                  handleAcceptOrder({
                    orderId: params.row.id,
                    formData: { readerId },
                  })
                )
              }
            >
              {t1("accept")}
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => handleOpenDelete(params.row.id)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <OrderTable
        columns={columns}
        fetchFn={fetchPendingOrders}
        filters={filters}
        dataType="pending"
      />
      {openDelete && selectedOrder && (
        <ConfirmDeleteDialog
          open={openDelete}
          onClose={handleCloseDelete}
          orderId={selectedOrder}
          type="order"
        />
      )}
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={() => setSnackbarOpen(false)}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity="success"
        sx={{ width: "100%" }}
      >
        {successMessage}
      </Alert>
    </Snackbar>
    </>
  );
}
