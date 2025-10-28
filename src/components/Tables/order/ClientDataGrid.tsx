"use client";
import React, { useState } from "react";
import { Box, Button, Chip, IconButton, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateOrderModal from "@/components/Modals/updateOrderModal";
import EditIcon from "@mui/icons-material/Edit";
import OrderTable from "@/components/Tables/order/orderTable";
import ConfirmDeleteDialog from "@/components/Dialog/ConfirmDeleteDialog";

export default function ClientDataGrid({
  status,
  search,
}: Readonly<{
  status: string;
  search: string;
}>) {
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
    { field: "id", headerName: t2("id"), flex: 1 },
    {
      field: "Reader",
      headerName: t2("reader"),
      flex: 1,
      valueGetter: (value, row) =>
        `${row.reader?.firstName ?? ""} ${row.reader?.lastName ?? ""}`,
    },
    {
      field: "Date",
      headerName: t2("date"),
      flex: 1,
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
      flex: 1,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "status",
      headerName: t1("status"),
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        if (!row.isAccepted && !row.isDeleted && !row.isCompleted){
          return (
            <Stack spacing={1} sx={{ width: "65%", mt: 1.5 }}>
              <Chip label={t1("pending")} color="warning" size="small" />
            </Stack>
          );
        }

        if (row.isCompleted)
          return (
            <Stack spacing={1} sx={{ width: "65%", mt: 1.5 }}>
              <Chip label={t1("completed")} color="success" size="small" />
            </Stack>
          );
        if (row.isDeleted)
          return (
            <Stack spacing={1} sx={{ width: "65%", mt: 1.5 }}>
              <Chip label={t1("rejected")} color="error" size="small" />
            </Stack>
          );
        if (row.isAccepted)
          return (
            <Stack spacing={1} sx={{ width: "65%", mt: 1.5 }}>
              <Chip label={t1("accepted")} color="secondary" size="small" />
            </Stack>
          );
      },
    },
    {
      field: "actions",
      headerName: t2("actions"),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
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
        fetchFn={(params) => fetchOrdersForLoggedUser({ ...params, target: "general" })}
        filters={{ status, search }}
      />
      {openDetails && selectedOrder && (
        <UpdateOrderModal
          orderId={selectedOrder}
          onClose={handleCloseDetails}
          open={openDetails}
        />
      )}
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
