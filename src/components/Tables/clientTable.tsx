import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchOrdersForLoggedUser } from "@/redux/slices/orderSlice";
import { useTranslations } from "next-intl";
import UpdateOrderModal from "../Forms/updateOrderModal";
import { OrderForEdit } from "@/types/orderForEdits";
import DeleteOrderDialog from "../Dialog/deleteOrder";

interface Column {
  id: "ID" | "Reader" | "Date" | "Time" | "Status" | "Actions";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
}

const ClientTable = () => {
  const t1 = useTranslations("label");
  const t2 = useTranslations("select");
  const columns: readonly Column[] = [
    { id: "ID", label: t1("id"), minWidth: 50, align: "center" },
    { id: "Reader", label: t1("reader"), minWidth: 100, align: "center" },
    { id: "Date", label: t1("date"), minWidth: 100, align: "center" },
    { id: "Time", label: t1("time"), minWidth: 100, align: "center" },
    { id: "Status", label: t2("status"), minWidth: 100, align: "center" },
    { id: "Actions", label: t1("actions"), minWidth: 100, align: "center" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { orders, itemsCount } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch<AppDispatch>();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderForEdit| null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrdersForLoggedUser({}));
  }, [dispatch]);

  // Handle details modal
  const handleOpenDetails = (id: number) => {
    const specificOrder = orders.find((o) => o.id === id) || null;
    if (specificOrder) {
      setSelectedOrder({
        readerId: Number(specificOrder.readerId),
        orderDate: specificOrder.orderDate,
        longitude: Number(specificOrder.longitude),
        latitude: Number(specificOrder.latitude),
        addressOne: specificOrder.addressOne,
        addressTwo: specificOrder.addressTwo,
        country: specificOrder.country,
        city: specificOrder.city,
        postNumber: specificOrder.postNumber
      });
    }
    setSelectedOrderId(id);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setSelectedOrderId(null);
    setOpenDetails(false);
  };

  // Handle table
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
      <TableContainer className="table_scrollbar" sx={{ maxHeight: 360 }}>
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
                    {row.reader?.firstName} {row.reader?.lastName}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.orderDate).toLocaleTimeString()}
                  </TableCell>
                  <TableCell align="center">
                    {row.isAccepted === true && row.isDeleted === false ? (
                      <Typography variant="body2">{t2("completed")}</Typography>
                    ) : row.isAccepted === false && row.isDeleted === false ? (
                      <Typography variant="body2">{t2("pending")}</Typography>
                    ) : row.isDeleted === true ? (
                      <Typography variant="body2">{t2("rejected")}</Typography>
                    ) : (
                      "unknown"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <IconButton>
                        <OpenInNew
                          color="secondary"
                          onClick={() => handleOpenDetails(row.id)}
                        />
                      </IconButton>
                      {row.isAccepted === true || row.isDeleted === true ? (
                        <Button variant="text" disabled>
                          <DeleteIcon />
                        </Button>
                      ) : (
                        <DeleteOrderDialog orderId={row.id} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {selectedOrder && selectedOrderId !== null && (
        <UpdateOrderModal
          orderId={selectedOrderId}
          open={openDetails}
          onClose={handleCloseDetails}
          order={selectedOrder}
        />
      )}
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

export default ClientTable;
