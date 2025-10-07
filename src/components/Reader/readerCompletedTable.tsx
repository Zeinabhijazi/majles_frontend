import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useTranslations } from "next-intl";

interface Column {
  id: "ID" | "Date" | "Time" | "Country";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
}

const ReaderCompletedTable = () => {
  const t1 = useTranslations("label");
  const columns: readonly Column[] = [
    { id: "ID", label: t1("id"), minWidth: 50, align: "center" },
    { id: "Date", label: t1("date"), minWidth: 100, align: "center" },
    { id: "Time", label: t1("time"), minWidth: 100, align: "center" },
    { id: "Country", label: t1("country"), minWidth: 100, align: "center" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { orders, itemsCount } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({}));
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(
      fetchOrdersForLoggedUser({ page: newPage + 1, limit: rowsPerPage })
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = +event.target.value;
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchOrdersForLoggedUser({ page: 1, limit: newLimit }));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer className="table_scrollbar" sx={{ maxHeight: 450 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* Table Body */}
          {orders && orders.length > 0 && (
            <TableBody sx={{ bgcolor: "background.default" }}>
              {orders.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleTimeString()}
                  </TableCell>
                  <TableCell align="center">{row.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={itemsCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ bgcolor: "background.default" }}
      />
    </Paper>
  );
};

export default ReaderCompletedTable;
