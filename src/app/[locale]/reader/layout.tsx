"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import Header from "@/components/Dashboard/Header";
import DashboardSidebar from "@/components/Dashboard/dashboardSidebar";
interface ReaderRootLayoutProps {
  children: React.ReactNode;
}

export default function ReaderRootLayout({
  children,
}: Readonly<ReaderRootLayoutProps>) {
  return (
    <section className="h-screen w-full flex flex-row overflow-hidden">
      <div className="w-1/5 fixed top-0 left-0 h-screen">
        <DashboardSidebar role={"reader"} />
      </div>
      <div className="w-4/5 ml-[20%] flex flex-col h-screen">
        <div className="h-[55px] fixed top-0 right-0 w-[80%] z-10">
          <Header />
        </div>
        <div className="mt-[55px] flex-1 overflow-y-auto">
          <Paper
            variant="elevation"
            square
            sx={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              width: "100%",
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
