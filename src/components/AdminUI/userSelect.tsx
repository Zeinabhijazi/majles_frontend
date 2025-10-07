import React, { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/slices/userSlice";
import { Grid } from "@mui/material";
import { useTranslations } from "next-intl";

const UserSelect = () => {
  const t = useTranslations("select");
  const [userType, setUserType] = useState("");
  const [isDeleted, setIsDeleted] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsers({ userType: userType, isDeleted: isDeleted }));
  }, [dispatch, userType, isDeleted]);

  return (
    <Grid size={5} sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
      <FormControl size="small">
        <InputLabel>{t("userType")}</InputLabel>
        <Select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          sx={{
            height: 40,
            width: 200,
          }}
        >
          <MenuItem value="all">{t("all")}</MenuItem>
          <MenuItem value="admin">{t("admin")}</MenuItem>
          <MenuItem value="client">{t("client")}</MenuItem>
          <MenuItem value="reader">{t("reader")}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>{t("status")}</InputLabel>
        <Select
          value={isDeleted}
          onChange={(e) => setIsDeleted(e.target.value)}
          sx={{
            height: 40,
            width: 200,
          }}
        >
          <MenuItem value="all">{t("all")}</MenuItem>
          <MenuItem value="false">{t("active")}</MenuItem>
          <MenuItem value="true">{t("isDeleted")}</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
};

export default UserSelect;
