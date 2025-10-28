"use client";
import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import ChangePassword from "../Forms/ChangePassword";
import UpdateUserForm from "../Forms/UpdateUser";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ height: "464px" }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 1.5,
            width: "100%",
            height: "99%",
            boxSizing: "border-box",
            backgroundColor: "background.default",
            borderRadius: 4,
            mt: 1,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

export default function UserInformation() {
  const t = useTranslations("tab");
  const [value, setValue] = useState(0);

  // For Tab
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box component="section">
      <Tabs
        value={value}
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChangeTab}
        variant="scrollable"
        aria-label="scrollable prevent tabs example"
        sx={{
          width: "100%",
        }}
      >
        <Tab label={t("personalDetails")} sx={{ flex: 1 }} />
        <Tab label={t("accountDetails")} sx={{ flex: 1 }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <UpdateUserForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ChangePassword />
      </TabPanel>
    </Box>
  );
}
