"use client";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import AdminHeader from "@/components/AdminUI/adminHeader";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "@/i18n/navigation";
import DashboardSideBar from "@/components/AdminUI/sideBar";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({
  children,
}: Readonly<AdminRootLayoutProps>) {
  const [canAccess, setCanAccess] = useState(false);
  const { userDetails } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  console.log(userDetails.userType);
  
  /*useEffect(()=> {
    // If userDetails is still loading or undefined, don't redirect yet
    if (userDetails.userType === undefined || userDetails === null)  return;
    
    if (userDetails.userType === "admin") {
      setCanAccess(true);
    }
    else {
      setCanAccess(false);
      router.replace("/"); // redirects to home [not admin]
    }
  }, [userDetails, router]);*/
  
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
  if( canAccess === null) {
    return <CircularProgress color="secondary" />
  }

  return (
    canAccess === true ? (
        <section className="h-screen w-full flex flex-row">
        <div className="w-1/5">
          <DashboardSideBar role={"admin"} />
        </div>
        <div className="w-4/5">
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
      </section>
      ) : 
            (
              <CircularProgress color="secondary" />
            )
  );
}
