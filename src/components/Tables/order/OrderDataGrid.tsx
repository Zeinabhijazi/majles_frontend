"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
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
}: {
  status: string;
  selectedDate: Dayjs | null;
}) {
  const t1 = useTranslations("button");
  const t2 = useTranslations("label");
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
    { field: "id", headerName: t2("id"), flex: 1 },
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
      flex: 1,
      valueGetter: (value, row) => new Date(row.orderDate).toLocaleTimeString(),
    },
    {
      field: "actions",
      headerName: t2("actions"),
      flex: 2,
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
              disabled={params.row.isAccepted}
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
