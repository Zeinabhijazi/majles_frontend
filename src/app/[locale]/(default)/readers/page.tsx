"use client";
import React, { useEffect } from "react";
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
} from "@mui/material";
import { useTranslations } from "next-intl";
import CreateOrderModal from "@/components/Reader/CreateOrderModal";
export default function Readers() {
  const t = useTranslations("readers");
  const t1 = useTranslations("Form");
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    dispatch(fetchReaders({}));
  }, [dispatch]);

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        bgcolor: "Background.default"
      }}
    >
      <Typography variant="h4"> {t("title")} </Typography>
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
                  bgcolor: "Background.default"
                }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" gutterBottom color="grey">
                  <strong>{t1("country")}: </strong>
                  {user.country}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="grey"
                  sx={{ height: " 45px" }}
                >
                  <strong>{t1("address")}: </strong>
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
              <CreateOrderModal readerId={user.id}/>
            </CardActions>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
