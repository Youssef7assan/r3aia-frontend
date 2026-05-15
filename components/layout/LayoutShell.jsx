"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Preloader from "@/components/layout/Preloader";
import LenisProvider from "@/components/providers/LenisProvider";

const dashboardPrefixes = ["/admin", "/patient/dashboard", "/doctor/dashboard", "/pharmacist/dashboard", "/volunteer/dashboard"];

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isDashboard = dashboardPrefixes.some(p => pathname.startsWith(p));

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <LenisProvider>
      <Preloader />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </LenisProvider>
  );
}
