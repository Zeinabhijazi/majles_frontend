"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import DashboardSidebar from "@/components/Dashboard/dashboardSidebar";
import Header from "@/components/Dashboard/Header";
interface ClientRootLayoutProps {
  children: React.ReactNode;
}

export default function ClientRootLayout({
  children,
}: Readonly<ClientRootLayoutProps>) {
  return (
    <section className="h-screen w-full flex flex-row">
      <div className="w-1/5">
        <DashboardSidebar role={"client"} />
      </div>
      <div className="w-4/5">
        <div>
          <Header />
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
