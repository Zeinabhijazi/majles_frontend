"use client";
import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import DeleteOrderDialog from "@/components/Dialog/deleteOrder";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateOrderModal from "@/components/Modals/updateOrderModal";
import EditIcon from "@mui/icons-material/Edit";
import OrderTable from "@/components/Tables/order/orderTable";

export default function ClientDataGrid({
  status,
  search,
}: {
  status: string;
  search: string;
}) {
  const t1 = useTranslations("select");
  const t2 = useTranslations("label");
  const locale = useLocale();
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const handleOpenDetails = (id: number) => {
    setOpenDetails(true);
    setSelectedOrder(id);
  };

  const handleOpenDelete = (id: number) => {
    setOpenDelete(true);
    setSelectedOrder(id);
  };

  const handleCloseDetails = () => setOpenDetails(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), width: 70 },
    {
      field: "Reader",
      headerName: t2("reader"),
      width: 120,
      valueGetter: (value, row) =>
        `${row.reader?.firstName ?? ""} ${row.reader?.lastName ?? ""}`,
    },
    {
      field: "Date",
      headerName: t2("date"),
      width: 200,
      valueGetter: (value, row) => {
        const date = new Date(row.orderDate);
        return `${t2("day")}: ${date.getDate()} - ${date.toLocaleString(locale, { month: "long" })} - ${date.getFullYear()}`;
      }
    },
    {
      field: "Time",
      headerName: t2("time"),
      width: 120,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "status",
      headerName: t1("status"),
      width: 150,
      renderCell: (params) => {
        const row = params.row;
        if (!row.isAccepted && !row.isDeleted && !row.isCompleted)
          return <Typography variant="body2">{t1("pending")}</Typography>;
        if (row.isCompleted)
          return <Typography variant="body2">{t1("completed")}</Typography>;
        if (row.isDeleted)
          return <Typography variant="body2">{t1("rejected")}</Typography>;
        if (row.isAccepted)
          return <Typography variant="body2">{t1("accepted")}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            color="secondary"
            onClick={() => handleOpenDetails(Number(params.row.id))}
          >
            <EditIcon />
          </IconButton>
          <Button
            variant="text"
            color="secondary"
            disabled={params.row.isDeleted || params.row.isAccepted}
            onClick={() => handleOpenDelete(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <OrderTable
        columns={columns}
        fetchFn={fetchOrdersForLoggedUser}
        filters={{ status, search }}
      />
      {openDetails && selectedOrder && (
        <UpdateOrderModal
          orderId={selectedOrder!!}
          onClose={handleCloseDetails}
          open={openDetails}
        />
      )}
      {openDelete && selectedOrder && (
        <DeleteOrderDialog
          open={openDelete}
          onClose={handleCloseDelete}
          orderId={selectedOrder}
        />
      )}
    </>
  );
}
