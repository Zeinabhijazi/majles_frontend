"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import AdminHeader from "@/components/AdminUI/adminHeader";
import DashboardSideBar from "@/components/AdminUI/sideBar";
interface ReaderRootLayoutProps {
  children: React.ReactNode;
}

export default function ReaderRootLayout({
  children,
}: Readonly<ReaderRootLayoutProps>) {
  return (
    <section className="h-screen w-full flex flex-row">
      <div className="w-1/5">
        <DashboardSideBar role={"reader"} />
      </div>
      <div className="w-4/5">
        <div>
          <AdminHeader />
          <Paper
            variant="elevation"
            square
            sx={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              width: "100%",
              height: "calc(100vh - 55px)",
              p: 2,
            }}
          >
            {children}
          </Paper>
        </div>
      </div>
    </section>
  );
}
