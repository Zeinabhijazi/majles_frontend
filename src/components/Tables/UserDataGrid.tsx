import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User } from "@/types/user";
import OpenInNew from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import UserDetailsModal from "../Modals/UserDetailsModal";
import DeleteDialog from "../Dialog/deleteDialog";

interface UserDataGridProps {
  paginationModel: {
    page: number;
    pageSize: number;
  };
  setPaginationModel: React.Dispatch<
    React.SetStateAction<{
      page: number;
      pageSize: number;
    }>
  >;
}

export default function UserDataGrid(props: UserDataGridProps) {
  const t1 = useTranslations("radioButton");
  const t2 = useTranslations("label");
  const { users, itemsCount } = useSelector((state: RootState) => state.user);

  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleOpenDetails = (id: number) => {
    setSelectedUser(id);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setOpenDetails(false);
  };

  const handleOpenDelete = (id: number) => {
    setSelectedUser(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setSelectedUser(null);
    setOpenDelete(false);
  };

  const columns: GridColDef<User>[] = [
    { field: "id", headerName: t2("id"), width: 90 },
    {
      field: "name",
      headerName: t2("name"),
      width: 150,
      // valueGetter() => string: Render a combination of different fields
      valueGetter: (value, row) =>
        `${row.firstName ?? ""} ${row.lastName ?? ""}`,
    },
    { field: "email", headerName: t2("email"), width: 174 },
    {
      field: "userType",
      headerName: t2("type"),
      width: 120,
      valueGetter: (value, row) => {
        return row.userType === "reader"
          ? t1("reader")
          : row.userType === "admin"
          ? t1("admin")
          : row.userType === "client"
          ? t1("client")
          : "Unknown";
      },
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 350,
      sortable: false,
      // renderCell() => ReactElement
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="text"
            onClick={() => handleOpenDetails(params.row.id)}
          >
            <OpenInNew color="secondary" />
          </Button>
          <Button
            variant="text"
            color="secondary"
            disabled={params.row.isDeleted}
            onClick={() => handleOpenDelete(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ overflow: "hidden", width: "100%" }}>
        <DataGrid<User>
          className="table_scrollbar"
          rows={users}
          columns={columns}
          paginationMode="server"
          rowCount={itemsCount}
          paginationModel={props.paginationModel}
          onPaginationModelChange={props.setPaginationModel}
          pageSizeOptions={[10, 25, 100]}
          checkboxSelection
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
      {openDetails && selectedUser && (
        <UserDetailsModal
          open={openDetails}
          onClose={handleCloseDetails}
          userId={selectedUser!!}
        />
      )}
      {openDelete && selectedUser && (
        <DeleteDialog
          open={openDelete}
          onClose={handleCloseDelete}
          userId={selectedUser!!}
        />
      )}
    </>
  );
}
