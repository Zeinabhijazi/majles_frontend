"use client";
import { use, useEffect } from "react";
import { Box } from "@mui/material";
import AboutUs from "@/components/Home/AboutUs";
import ContactUs from "@/components/Home/ContactUs";
import Banner from "@/components/Home/Banner";
import ReaderSection from "@/components/Home/ReaderSection";
import CountSection from "@/components/Home/CountSection";

export default function Home({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params); // destructuring the locale from param

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <Box component={"section"}>
      <Banner />
      <AboutUs />
      <CountSection />
      <ReaderSection />
      <ContactUs />
    </Box>
  );
}
