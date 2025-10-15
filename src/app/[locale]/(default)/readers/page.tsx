"use client";
import React, { useEffect, useState } from "react";
import { fetchReaders } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import CreateOrderModal from "@/components/Forms/CreateOrderModal";
import LoginModal from "@/components/Forms/LoginModal";
import RegisterModal from "@/components/Forms/RegisterModal";
import ReaderSearch from "@/components/Reader/readerSearch";
export default function Readers() {
  const t1 = useTranslations("heading");
  const t2 = useTranslations("label");
  const t3 = useTranslations("button");
  const dispatch = useDispatch<AppDispatch>();
  const { users, userDetails } = useSelector((state: RootState) => state.user);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Actions for login modal
  const handleCloseLogin = () => setLoginOpen(false);

  // Actions for register modal
  const handleOpenRegister = () => setRegisterOpen(true);
  const handleCloseRegister = () => setRegisterOpen(false);

  // Actions for create order modal
  const handleCloseCreate = () => setCreateOrderOpen(false);

  useEffect(() => {
    dispatch(fetchReaders({}));
  }, [dispatch]);

  const handleAddOrder = () => {
    if (!userDetails?.userType) {
      setLoginOpen(true);
    } else {
      setCreateOrderOpen(true);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        bgcolor: "Background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4"> {t1("readersPage")} </Typography>
        <ReaderSearch />
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          mt: 2,
        }}
      >
        {users?.map((user) => (
          <Grid
            size={3}
            key={user.id}
            height="345px"
            sx={{
              boxShadow: 20,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
            }}
          >
            <CardActionArea>
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
              <CardContent
                sx={{
                  bgcolor: "Background.default",
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
                  sx={{ height: " 45px" }}
                >
                  <strong>{t2("address")}: </strong>
                  {user.addressOne}, {user.addressTwo}, {user.postNumber},{" "}
                  {user.country}, {user.city}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions
              sx={{
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleAddOrder}
              >
                {t3("addOrder")}
              </Button>

              {/* Login Modal */}
              <LoginModal
                open={loginOpen}
                onClose={handleCloseLogin}
                onOpenSecond={() => {
                  handleCloseLogin();
                  handleOpenRegister();
                }}
              />

              {/* Register Modal */}
              <RegisterModal
                open={registerOpen}
                onClose={handleCloseRegister}
              />

              {/* Create Order Modal */}
              <CreateOrderModal
                open={createOrderOpen}
                onClose={handleCloseCreate}
              />
            </CardActions>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
