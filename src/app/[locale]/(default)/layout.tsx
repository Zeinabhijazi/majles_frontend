import MenuAppBar from "@/components/includes/MenuAppBar";
import Footer from "@/components/includes/Footer";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MenuAppBar />
      <section style={{ minHeight: "calc(100vh - 70px)", marginTop: "70px" }}>
        {children}
      </section>
      <Footer />
    </>
  );
}
