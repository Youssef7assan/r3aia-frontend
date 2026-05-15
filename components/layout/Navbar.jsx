"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  Home,
  Info,
  Stethoscope,
  HandHeart,
  Phone,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/about", label: "من نحن", icon: Info },
  { href: "/services", label: "خدماتنا", icon: Stethoscope },
  { href: "/doctors", label: "دليل الأطباء", icon: Heart },
  { href: "/volunteer", label: "تطوع معنا", icon: HandHeart },
  { href: "/contact", label: "تواصل معنا", icon: Phone },
];

const hiddenPrefixes = [
  "/admin", "/patient/dashboard", "/doctor/dashboard", 
  "/pharmacist/dashboard", "/volunteer/dashboard",
  "/login", "/register", "/forgot-password", 
  "/complete-profile", "/banned", "/pending-review"
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState("/login");
  const pathname = usePathname();

  // لا تعرض الـ Navbar في صفحات الداشبورد
  const shouldHide = hiddenPrefixes.some(p => pathname.startsWith(p));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Check login state
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const p = JSON.parse(decodedJson);
        const r = p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || p["role"] || "";
        const role = Array.isArray(r) ? r[0].toLowerCase() : String(r).toLowerCase();
        
        if (role === "admin") setDashboardUrl("/admin/dashboard");
        else if (role === "doctor") setDashboardUrl("/doctor/dashboard");
        else if (role === "patient") setDashboardUrl("/patient/dashboard");
        else if (role === "pharmacist") setDashboardUrl("/pharmacist/dashboard");
        else if (role === "volunteer") setDashboardUrl("/volunteer/dashboard");
      } catch {}
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // لا تعرض الـ Navbar في صفحات الداشبورد
  if (shouldHide) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] py-2.5"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-50">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden"
            >
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
            </motion.div>
            <span
              className={`text-2xl font-extrabold transition-colors duration-300 ${
                scrolled ? "text-sky-700" : "text-white"
              }`}
            >
              رعاية
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[0.95rem] font-semibold py-2 transition-colors duration-200 group ${
                  pathname === link.href
                    ? scrolled
                      ? "text-sky-600"
                      : "text-white"
                    : scrolled
                    ? "text-slate-500 hover:text-sky-600"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 right-0 h-[3px] rounded-full bg-gradient-to-l from-sky-500 to-cyan-400 transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href={dashboardUrl}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-white text-sky-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                    scrolled
                      ? "border-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400"
                      : "border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-white text-sky-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden z-50 w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              scrolled ? "text-slate-700" : "text-white"
            }`}
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white z-40 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col pt-24 px-6 pb-8 h-full">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                            pathname === link.href
                              ? "bg-sky-50 text-sky-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto flex flex-col gap-3"
                >
                  {isLoggedIn ? (
                    <Link
                      href={dashboardUrl}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 gradient-sky text-white rounded-2xl font-bold text-base shadow-lg"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      لوحة التحكم
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-sky-200 text-sky-600 rounded-2xl font-bold text-base hover:bg-sky-50 transition-colors"
                      >
                        <LogIn className="w-5 h-5" />
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 gradient-sky text-white rounded-2xl font-bold text-base shadow-lg"
                      >
                        <UserPlus className="w-5 h-5" />
                        إنشاء حساب مجاني
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
