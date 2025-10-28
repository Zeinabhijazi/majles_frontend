import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper and modules styles
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchReaders } from "@/redux/slices/userSlice";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useTranslations } from "next-intl";

export default function Carousel() {
  const t = useTranslations("label");
  const dispatch = useDispatch<AppDispatch>();
  const { users, itemsCount } = useSelector((state: RootState) => state.user);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const pageCount = Math.ceil(itemsCount / rowsPerPage);
  const [isRtl, setIsRtl] = useState(false);

  useEffect(() => {
    setIsRtl(document.dir === "rtl");
  }, []);

  useEffect(() => {
    dispatch(fetchReaders({ page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pageCount) setPage(page + 1);
  };

  return (
    <Box>
      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="h-[165px]"
      >
        {users &&
          users.length > 0 &&
          users.map((user) => (
            <SwiperSlide
              key={user.id}
              style={{
                alignItems: "center",
                justifyContent: "start",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Avatar
                alt="Remy Sharp"
                sx={{
                  width: 80,
                  height: 80,
                  mb: 1,
                  bgcolor: "secondary.main",
                  textTransform: "uppercase",
                }}
              >
                {user.firstName.charAt(0)} {user.lastName.charAt(0)}
              </Avatar>
              <Typography variant="caption" sx={{ pl: 1.2 }}>
                {user.firstName} {user.lastName}{" "}
              </Typography>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* Pagination Buttons */}
      <Box display="flex" justifyContent="center" mt={2} gap={2}>
        <IconButton color="secondary" disabled={page <= 1} onClick={handlePrev}>
          {isRtl ? <ChevronRightIcon /> : <KeyboardArrowLeftIcon />}
        </IconButton>
        <Typography variant="body2" align="center" sx={{ mt: 1.2 }}>
          {t("page")} {page} / {pageCount}
        </Typography>
        <IconButton
          color="secondary"
          disabled={page >= pageCount}
          onClick={handleNext}
        >
          {isRtl ? <KeyboardArrowLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
