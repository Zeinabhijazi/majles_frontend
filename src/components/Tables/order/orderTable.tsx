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
  filters?: {
    status?: string;
    search?: string;
    start?: number;
    end?: number;
  };
}

const OrderTable: React.FC<OrderTableProps> = ({ columns, fetchFn, filters }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, itemsCount } = useSelector((state: RootState) => state.order);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch(
      fetchFn({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...filters, // keep filters when paginating
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
        rows={orders}
        columns={columns}
        paginationMode="server"
        rowCount={itemsCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 100]}
        disableRowSelectionOnClick
        disableColumnMenu
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