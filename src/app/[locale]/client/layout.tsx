"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import DashboardSidebar from "@/components/Dashboard/dashboardSidebar";
import Header from "@/components/Dashboard/Header";
import { useRouter } from "@/i18n/navigation";
import { CircularProgress } from "@mui/material";
interface ClientRootLayoutProps {
  children: React.ReactNode;
}

export default function ClientRootLayout({
  children,
}: Readonly<ClientRootLayoutProps>) {
  const [canAccess, setCanAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.userType === "client") {
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
  ) : (
    <CircularProgress color="secondary" />
  );
}
