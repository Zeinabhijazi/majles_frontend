import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button } from "@mui/material";
import OrderDetailsModal from "./OrderDetailsModal";
import { useTranslations } from "next-intl";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { Order } from "@/types/order";
import AssignReaderDialog from "./assignReaderDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchOrders } from "@/redux/slices/orderSlice";
interface Column {
  id: "id" | "Client" | "Reader" | "Date" | "Time" | "Actions";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
}

const OrderTable = () => {
  const t1 = useTranslations("label");
  const t2 = useTranslations("button");
  const { orders, itemsCount } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const columns: readonly Column[] = [
    { id: "id", label: t1("id"), minWidth: 50, align: "center" },
    { id: "Client", label: t1("client"), minWidth: 100, align: "center" },
    { id: "Reader", label: t1("reader"), minWidth: 100, align: "center" },
    { id: "Date", label: t1("date"), minWidth: 100, align: "center" },
    { id: "Time", label: t1("time"), minWidth: 100, align: "center" },
    { id: "Actions", label: t1("actions"), minWidth: 100, align: "center" },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    dispatch(fetchOrders({}));
  }, [dispatch]);

  const handleOpen = (id: number) => {
    const specificOrder = orders.find((o) => o.id === id) || null;
    setSelectedOrder(specificOrder);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(fetchOrders({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = +event.target.value;
    setRowsPerPage(+event.target.value);
    setPage(0);
    dispatch(fetchOrders({ page: 1, limit: newLimit }));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer className="table_scrollbar" sx={{ maxHeight: 350 }}>
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
              {orders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">
                    {row.client.firstName} {row.client.lastName}
                  </TableCell>
                  <TableCell align="center">
                    {row.reader?.firstName} {row.reader?.lastName}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleTimeString()}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Button
                        variant="text"
                        color="secondary"
                        onClick={() => handleOpen(row.id)}
                      >
                        <OpenInNew />
                      </Button>
                      <OrderDetailsModal
                        open={open}
                        onClose={handleClose}
                        order={selectedOrder}
                      />
                      {row.isAccepted === true ? (
                        <Button variant="contained" disabled>
                          {t2("assign")}
                        </Button>
                      ) : (
                        <AssignReaderDialog orderId={row.id} />
                      )}
                    </Box>
                  </TableCell>
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
export default OrderTable;
