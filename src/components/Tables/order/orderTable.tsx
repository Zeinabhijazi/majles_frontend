"use client";
import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Order } from "@/types/order";

interface OrderTableProps {
  columns: GridColDef<Order>[];
  fetchFn: (params: { page: number; limit: number }) => any;
  filters?: Record<string, any>;
  dataType?: "general" | "monthly" | "pending";
}

const OrderTable: React.FC<OrderTableProps> = ({ columns, fetchFn, filters, dataType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, monthlyOrders, pendingOrders, itemsCount, itemsCountMonthly, itemsCountPending } =
  useSelector((state: RootState) => state.order);

  const rows =
    dataType === "monthly" ? monthlyOrders :
    dataType === "pending" ? pendingOrders :
    orders;

  const rowCount =
    dataType === "monthly" ? itemsCountMonthly :
    dataType === "pending" ? itemsCountPending :
    itemsCount;

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchFn({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...filters, 
      })
    );
  }, [dispatch, fetchFn, paginationModel, filters]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [filters]);
  
  return (
    <Paper sx={{ overflow: "hidden", width: "100%" }}>
      <DataGrid<Order>
        className="table_scrollbar"
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 100]}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        sx={{
          bgcolor: "primary.main",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "primary.main",
            color: "white",
          },
          maxHeight: 420,
        }}
      />
    </Paper>
  );
};

export default OrderTable;