"use client";
import React, { use, useEffect, useState } from "react";
import { fetchReaders } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/Forms/SearchInput";
import { handleAssignReader } from "@/redux/slices/orderSlice";
import ReaderDetailsModal from "@/components/Modals/ReaderDetailsModal";
import IconBreadcrumbs from "@/components/includes/BreadCrumb";

export default function AssignReader({
  params,
}: Readonly<{ params: Promise<{ id: number }> }>) {
  const t2 = useTranslations("label");
  const t3 = useTranslations("button");
  const t4 = useTranslations("searchInput");
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleOpenDetails = (id: number) => {
    setSelectedUser(id);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setOpenDetails(false);
  };

  const handleReaderSearch = (value: string) => {
    dispatch(fetchReaders({ name: value }));
  };

  useEffect(() => {
    dispatch(fetchReaders({}));
  }, [dispatch]);

  return (
    <Box component="section">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <IconBreadcrumbs />
        <SearchInput
          placeholder={t4("nameSearch")}
          onSearch={handleReaderSearch}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {users?.map((user) => (
          <Grid size={4} key={user.id}>
            <CardActionArea onClick={() => handleOpenDetails(user.id)}>
              <CardContent
                sx={{
                  bgcolor: "primary.main",
                  borderStartStartRadius: 12,
                  borderStartEndRadius: 12,
                }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" gutterBottom color="grey">
                  <strong>{t2("country")}: </strong>
                  {user.country}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="grey"
                  sx={{ height: " 25px" }}
                >
                  <strong>{t2("address")}: </strong>
                  {user.addressOne}, {user.addressTwo}, {user.postNumber},{" "}
                  {user.city}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ bgcolor: "primary.main", pl: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() =>
                  dispatch(
                    handleAssignReader({
                      readerId: user.id,
                      orderId: id,
                    })
                  )
                }
              >
                {t3("assign")}
              </Button>
            </CardActions>
          </Grid>
        ))}
      </Grid>
      {openDetails && selectedUser && (
        <ReaderDetailsModal
          open={openDetails}
          onClose={handleCloseDetails}
          userId={selectedUser}
        />
      )}
    </Box>
  );
}
