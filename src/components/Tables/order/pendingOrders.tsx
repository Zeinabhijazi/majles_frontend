"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import {
  fetchOrdersForLoggedUser,
  handleAccept,
} from "@/redux/slices/orderSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import OrderTable from "@/app/[locale]/components/Tables/order/orderTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ConfirmDeleteDialog from "@/app/[locale]/components/Dialog/ConfirmDeleteDialog";

export default function PendingOrdersDataGrid() {
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const locale = useLocale();
  const dispatch = useDispatch<AppDispatch>();
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
        return `${date.getDate()} - ${date.toLocaleString(locale, { month: "long" })} - ${date.getFullYear()}`;
      }
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
                  handleAccept({ orderId: params.row.id, readerId: readerId })
                )
              }
            >
              {t1("accept")}
            </Button>
            <Button
              variant="text"
              color="secondary"
              disabled={params.row.isDeleted || params.row.isAccepted}
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
        fetchFn={(params) => fetchOrdersForLoggedUser({ ...params, status: "pending", target: "pending" })}
      />
      {openDelete && selectedOrder && (
        <ConfirmDeleteDialog
          open={openDelete}
          onClose={handleCloseDelete}
          orderId={selectedOrder}
          type="order"
        />
      )}
    </>
  );
}
