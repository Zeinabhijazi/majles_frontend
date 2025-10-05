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

export default function ReaderRootLayout({
  children,
}: Readonly<AdminRootLayoutProps>) {
  const router = useRouter();
  const { userDetails } = useSelector((state: RootState) => state.user);
  const [canAccess, setCanAccess] = useState(true);
  console.log(userDetails.userType);
  
  useEffect(()=> {
    /*if (userDetails) {
      console.log(userDetails.userType);
      if(userDetails.userType === "admin") {
        setCanAccess(true)
      }
      else {
        router.replace("/");
      }
    } */
  }, [])


  return (
      <section className="h-screen w-full flex flex-row">
        <div className="w-1/5">
          <DashboardSideBar role={"reader"} />
        </div>
        <div className="w-4/5">
          <div>
            <AdminHeader />
            {canAccess === true ? (
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
            ) : 
            (
              <CircularProgress color="secondary" />
            )
            }
          </div>
        </div>
      </section>
  );
}
