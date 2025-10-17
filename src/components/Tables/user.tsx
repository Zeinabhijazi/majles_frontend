import  React, { useEffect, useState} from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";
import { User } from "@/types/user";
import OpenInNew from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslations } from "next-intl";
import UserDetailsModal from "../Modals/UserDetailsModal";
import DeleteDialog from "../Dialog/deleteDialog";

export default function UserDataGrid() {
  const t1 = useTranslations("radioButton");
  const t2 = useTranslations("label");
  const dispatch = useDispatch<AppDispatch>();
  const { users, itemsCount } = useSelector(
    (state: RootState) => state.user
  );
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleOpen = (id: number) => {
    const specificUser = users.find((u) => u.id === id) || null;
    setSelectedUser(specificUser);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  // fetch data whenever pagination changes
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  const columns: GridColDef<User>[] = [
    { field: "id", headerName: t2("id"), width: 90 },
    {
      field: "name",
      headerName: t2("name"),
      width: 200,
      // valueGetter() => string: Render a combination of different fields
      valueGetter: (value, row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`,
    },
    { field: "email", headerName: t2("email"), width: 174 },
    { 
      field: "userType", 
      headerName: t2("type"), 
      width: 200,
      valueGetter: (value, row) => 
        {
          return row.userType === "reader"
            ? t1("reader")
            : row.userType === "admin"
              ? t1("admin")
              : row.userType === "client"
                ? t1("client")
                : "Unknown";
        }
    },
    {
      field: "actions",
      headerName: t2("actions"),
      width: 380,
      sortable: false,
      // renderCell() => ReactElement
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button  variant="text" onClick={() => handleOpen(params.row.id)}>
            <OpenInNew color="secondary" />
          </Button>
          <UserDetailsModal
            open={open}
            onClose={handleClose}
            user={selectedUser}
          />
          {params.row.isDeleted ? (
            <Button variant="text" disabled>
              <DeleteIcon />
            </Button>
          ) : (
            <DeleteDialog userId={params.row.id} />
          )}
        </Box>
      ),
    },
  ];

  return (
    <Paper sx={{ overflow: "hidden", width: "100%" }} >
      <DataGrid<User>
        className="table_scrollbar"
        rows={users}
        columns={columns}
        paginationMode="server"
        rowCount={itemsCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 100]} 
        //checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu={true}
        sx={{
          bgcolor: "primary.main",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "primary.main",
            color: "white",
          },
          maxHeight: 420
        }}
        
      />
    </Paper>
  );
}
