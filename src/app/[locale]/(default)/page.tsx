"use client";
import { Box } from "@mui/material";
import AboutUs from "@/components/Home/AboutUs";
import ContactUs from "@/components/Home/ContactUs";
import Banner from "@/components/Home/Banner";
import ReaderSection from "@/components/Home/ReaderSection";
import CountSection from "@/components/Home/CountSection";

export default function Home() {
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
