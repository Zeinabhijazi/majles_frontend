import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UserDetailsModal from "./UserDetailsModal";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { User } from "@/types/user";
import DeleteDialog from "./deleteDialog";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";

interface Column {
  id: "id" | "Name" | "Email" | "Type" | "Actions";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
}

const UserTable = () => {
  const t1 = useTranslations("userTable");
  const t2 = useTranslations("Form");
  const columns: readonly Column[] = [
    { id: "id", label: t2("id"), minWidth: 50, align: "center" },
    { id: "Name", label: t1("name"), minWidth: 100, align: "center" },
    { id: "Email", label: t2("email"), minWidth: 100, align: "center" },
    { id: "Type", label: t1("type"), minWidth: 100, align: "center" },
    { id: "Actions", label: t2("actions"), minWidth: 100, align: "center" },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = useState(false);
  const { users, itemsCount } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers({}));
  }, [dispatch]);

  const handleOpen = (id: number) => {
    const specificUser = users.find((u) => u.id === id) || null;
    setSelectedUser(specificUser);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    dispatch(fetchUsers({ page: newPage + 1, limit: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = +event.target.value;
    setRowsPerPage(newLimit);
    setPage(0);
    dispatch(fetchUsers({ page: 1, limit: newLimit }));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer className="table_scrollbar" sx={{ maxHeight: 360 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow >
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
          {users && users.length > 0 && 
            <TableBody sx={{bgcolor: "background.default"}}>
              {users.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">
                      {row.firstName} {row.lastName}
                    </TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">
                      {row.userType === "reader"
                        ? t2("reader")
                        : row.userType === "admin"
                        ? t2("admin")
                        : row.userType === "client"
                        ? t2("client")
                        : "Unknown"}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="text"
                          onClick={() => handleOpen(row.id)}
                        >
                          <OpenInNew color="secondary" />
                        </Button>
                        <UserDetailsModal
                          open={open}
                          onClose={handleClose}
                          user={selectedUser}
                        />
                        {row.isDeleted === true ? (
                          <Button variant="text" color="secondary" disabled >
                            <DeleteIcon />
                          </Button>
                        ) : (
                          <DeleteDialog userId={row.id} />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          }
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
        sx={{bgcolor: "background.default"}}
      />
    </Paper>
  );
};

export default UserTable;
