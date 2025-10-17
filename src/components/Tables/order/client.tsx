"use client";
import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { Order } from "@/types/order";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import DeleteOrderDialog from "@/components/Dialog/deleteOrder";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateOrderModal from "@/components/Modals/updateOrderModal";
import OpenInNew from "@mui/icons-material/OpenInNew";
import OrderTable from "@/components/Tables/order/orderTable";

export default function ClientDataGrid() {
  const t1 = useTranslations("select");
  const t2 = useTranslations("label");

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const handleOpenDetails = (id: number) => {
    setSelectedOrderId(null);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedOrderId(null);
    setOpenDetails(false);
  };

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
      width: 120,
      valueGetter: (value, row) =>
        new Date(row.orderDate).toLocaleDateString(),
    },
    {
      field: "Time",
      headerName: t2("time"),
      width: 120,
      valueGetter: (value, row) =>
        new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "status",
      headerName: t1("status"),
      width: 150,
      renderCell: (params) => {
        const row = params.row;
        if (row.isAccepted && !row.isDeleted)
          return <Typography variant="body2">{t1("completed")}</Typography>;
        if (!row.isAccepted && !row.isDeleted)
          return <Typography variant="body2">{t1("pending")}</Typography>;
        if (row.isDeleted)
          return <Typography variant="body2">{t1("rejected")}</Typography>;
        return "unknown";
      },
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 380,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <IconButton
            color="secondary"
            onClick={() => handleOpenDetails(Number(params.row))}
          >
            <OpenInNew />
          </IconButton>

          {/*<UpdateOrderModal
            orderId={selectedOrderId}
            open={openDetails}
            onClose={handleCloseDetails}
          />*/}

          {params.row.isAccepted || params.row.isDeleted ? (
            <Button variant="text" disabled>
              <DeleteIcon />
            </Button>
          ) : (
            <DeleteOrderDialog orderId={params.row.id} />
          )}
        </Box>
      ),
    },
  ];

  return <OrderTable columns={columns} fetchFn={fetchOrdersForLoggedUser} />;
}
