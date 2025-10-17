"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Order } from "@/types/order";
import { fetchOrders } from "@/redux/slices/orderSlice";
import OpenInNew from "@mui/icons-material/OpenInNew";
import OrderDetailsModal from "@/components/Modals/OrderDetailsModal";
import AssignReaderDialog from "@/components/Dialog/assignReaderDialog";
import OrderTable from "@/components/Tables/order/orderTable";

export default function OrderDataGrid() {
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");

  const { orders } = useSelector(
    (state: RootState) => state.order
  );
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOpen = (id: number) => {
    const specificOrder = orders.find((o) => o.id === id) || null;
    setSelectedOrder(specificOrder);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), width: 70 },
    {
      field: "Client",
      headerName: t2("client"),
      width: 120,
      valueGetter: (value, row) =>
        `${row.client.firstName ?? ""} ${row.client.lastName ?? ""}`,
    },
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
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleDateString(),
    },
    {
      field: "Time",
      headerName: t2("time"),
      width: 120,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 380,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            variant="text"
            color="secondary"
            onClick={() => handleOpen(params.row.id)} 
          >
            <OpenInNew color="secondary" />
          </Button>
          <OrderDetailsModal
            open={open}
            onClose={handleClose}
            order={selectedOrder}
          />
          {params.row.isAccepted ? (
            <Button variant="contained" disabled>
              {t1("assign")}
            </Button>
          ) : (
            <AssignReaderDialog orderId={params.row.id} />
          )}
        </Box>
      ),
    },
  ];

  return <OrderTable columns={columns} fetchFn={fetchOrders} />;
}
