"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchReaders } from "@/redux/slices/userSlice";
import SearchInput from "@/components/Forms/SearchInput";
import ReaderDetailsModal from "@/components/Modals/ReaderDetailsModal";
import { useTranslations } from "next-intl";

interface ReaderListSectionProps {
  title?: string | null;
  showImage?: boolean;
  buttonLabel: string;
  onButtonClick: (userId: number) => void;
  headerExtra?: React.ReactNode;
  searchField?: string;
  variant?: "readers" | "admin";
  className?: string;
}

const ReaderListSection: React.FC<ReaderListSectionProps> = ({
  title,
  showImage = false,
  buttonLabel,
  onButtonClick,
  headerExtra,
  searchField = "name",
  variant = "readers",
  className,
}) => {
  const t1 = useTranslations("searchInput");
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

  const handleReaderSearch = (value: string) => { dispatch(fetchReaders({
    search: value,
    page: 1,
    limit: 10
  })); };

  useEffect(() => {
    dispatch(fetchReaders({
      page: 1,
      limit: 10
    }));
  }, [dispatch]);

  const containerSx =
    variant === "readers"
      ? {
          p: 2,
        }
      : {
          p: 0,
        };

  const gridItemSx =
    variant === "admin"
      ? {
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: "primary.main",
        }
      : {
          boxShadow: 20,
          borderRadius: 2,
        };

  return (
    <Box component="section" sx={containerSx} className={className}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title && <Typography variant="h4">{title}</Typography>}
        {headerExtra}
        <SearchInput
          placeholder={t1("countrySearch")}
          onSearch={handleReaderSearch}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {users?.map((user) => (
          <Grid
            key={user.id}
            size={variant === "admin" ? 4 : 3}
            sx={gridItemSx}
          >
            <CardActionArea onClick={() => handleOpenDetails(user.id)}>
              {showImage && (
                <CardMedia
                  component="img"
                  image="/mainSection.jpg"
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{
                    height: 150,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" gutterBottom color="grey">
                  <strong>Gender:</strong> {user.gender}
                </Typography>
                <Typography variant="body2" gutterBottom color="grey">
                  <strong>Country:</strong> {user.country}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="grey"
                  sx={{ height: "25px" }}
                >
                  <strong>Address:</strong> {user.addressOne}, {user.addressTwo}
                  , {user.postNumber}, {user.city}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions
              sx={{
                bgcolor: "primary.main",
                borderTop: "1px solid rgba(255,255,255,0.2)",
                pl: 2,
                borderEndStartRadius: 12,
                borderEndEndRadius: 12,
              }}
            >
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => onButtonClick(user.id)}
              >
                {buttonLabel}
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
};

export default ReaderListSection;
