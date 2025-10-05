import MenuAppBar from "@/components/MenuAppBar";
import Footer from "@/components/Footer";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MenuAppBar />
      <main style={{ minHeight: "calc(100vh - 70px)", marginTop: "70px" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
