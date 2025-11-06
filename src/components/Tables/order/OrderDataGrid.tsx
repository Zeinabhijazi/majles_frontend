"use client";
import React, { useState } from "react";
import { Box, Button, Chip, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import { fetchOrders } from "@/redux/slices/orderSlice";
import OpenInNew from "@mui/icons-material/OpenInNew";
import OrderDetailsModal from "@/components/Modals/OrderDetailsModal";
import OrderTable from "@/components/Tables/order/orderTable";
import { Dayjs } from "dayjs";
import { Link } from "@/i18n/navigation";

export default function OrderDataGrid({
  status,
  selectedDate,
}: Readonly<{
  status: string;
  selectedDate: Dayjs | null;
}>) {
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");
  const t3 = useTranslations("select");

  const locale = useLocale();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // compute start/end once
  const start = selectedDate
    ? selectedDate.startOf("day").valueOf()
    : undefined;
  const end = selectedDate ? selectedDate.endOf("day").valueOf() : undefined;

  const handleOpenDetails = (id: number) => {
    setSelectedOrder(id);
    setOpenDetails(true);
  };
  const handleCloseDetails = () => setOpenDetails(false);

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), flex: 0.5 },
    {
      field: "Client",
      headerName: t2("client"),
      flex: 1,
      valueGetter: (value, row) =>
        `${row.client.firstName ?? ""} ${row.client.lastName ?? ""}`,
    },
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
      headerName: t3("status"),
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        const deleted = status === "deleted";
        const completed = status === "completed";
        const accepted = status === "accepted";
        const rejected = status === "rejected";

        let statusKey:
          | "pending"
          | "deleted"
          | "completed"
          | "accepted"
          | "rejected"
          | "assigned";

        if (deleted) statusKey = "deleted";
        else if (completed) statusKey = "completed";
        else if (accepted) statusKey = "accepted";
        else if (rejected) statusKey = "rejected";
        else if(params.row.readerId !== null && status === "pending") statusKey = "assigned";
        else statusKey = "pending";

        const statusMap: Record<
          typeof statusKey,
          {
            label: string;
            color: "error" | "info" | "secondary" | "success" | "warning" | "default";
          }
        > = {
          pending: { label: t3("pending"), color: "warning" },
          deleted: { label: t2("deleted"), color: "secondary" },
          completed: { label: t3("completed"), color: "success" },
          accepted: { label: t3("accepted"), color: "info" },
          rejected: { label: t3("rejected"), color: "error" },
          assigned: { label: t3("assigned"), color: "default" },
        };

        const { label, color } = statusMap[statusKey];

        return (
          <Stack spacing={1} sx={{ width: "65%", mt: 1.5 }}>
            <Chip label={label} color={color} size="small" />
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: t2("actions"),
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="text"
            onClick={() => handleOpenDetails(params.row.id)}
          >
            <OpenInNew color="secondary" />
          </Button>
          <Link href={`/admin/orders/${params.row.id}/assign`}>
            <Button
              variant="contained"
              color="secondary"
              disabled={params.row.status !== "pending" || params.row.readerId !== null }
            >
              {t1("assign")}
            </Button>
          </Link>
        </Box>
      ),
    },
  ];

  return (
    <>
      <OrderTable
        columns={columns}
        fetchFn={fetchOrders}
        filters={{ status, start, end }}
      />
      {openDetails && selectedOrder && (
        <OrderDetailsModal
          open={openDetails}
          onClose={handleCloseDetails}
          orderId={selectedOrder}
        />
      )}
    </>
  );
}
