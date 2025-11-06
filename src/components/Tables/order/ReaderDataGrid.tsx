"use client";
import React from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useLocale, useTranslations } from "next-intl";
import { Order } from "@/types/order";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import OrderTable from "@/components/Tables/order/orderTable";

export default function ReaderDataGrid() {
  const filters = React.useMemo(() => ({ thisMonth: true }), []);
  const fetchReaderOrders = React.useCallback(
    (params: Record<string, any>) => fetchOrdersForLoggedUser({ ...params, target: "monthly" }),
    []
  );
  const t2 = useTranslations("label");
  const locale = useLocale();

  const columns: GridColDef<Order>[] = [
    { field: "id", headerName: t2("id"), flex: 1, },
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
      field: "Address",
      headerName: t2("address"),
      flex: 4,
      valueGetter: (value, row) => `${row?.addressOne ?? ""}, ${row?.addressTwo ?? ""}, ${row?.postNumber ?? ""}, ${row?.city ?? ""} `,
    },
  ];
  

  return <OrderTable columns={columns} fetchFn={fetchReaderOrders} filters={filters} dataType="monthly" />;
}
