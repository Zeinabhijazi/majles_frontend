"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import { useRouter } from "@/i18n/navigation";
import Header from "@/components/Dashboard/Header";
import DashboardSidebar from "@/components/Dashboard/dashboardSidebar";
interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({
  children,
}: Readonly<AdminRootLayoutProps>) {
  const [canAccess, setCanAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.userType === "admin") {
      setCanAccess(true);
    } else {
      router.replace("/");
    }
  }, []);

  // Loading screen while checking
  if (canAccess === null) {
    return <CircularProgress color="secondary" />;
  }

  return canAccess === true ? (
    <section className="h-screen w-full flex flex-row">
      <div className="w-1/5">
        <DashboardSidebar role={"admin"} />
      </div>
      <div className="w-4/5">
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
    </section>
  ) : (
    <CircularProgress color="secondary" />
  );
}
