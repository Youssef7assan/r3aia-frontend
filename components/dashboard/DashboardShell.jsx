"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, ChevronRight } from "lucide-react";
import { parseJwt } from "../../lib/jwt";
import ChatBot from "./ChatBot";

const roleConfig = {
  patient:    { label: "المريض",   gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)" },
  doctor:     { label: "الطبيب",   gradient: "linear-gradient(135deg, #10b981, #34d399)" },
  pharmacist: { label: "الصيدلية", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)" },
  volunteer:  { label: "المتطوع",  gradient: "linear-gradient(135deg, #f43f5e, #fb7185)" },
};

export default function DashboardShell({ role, navItems, activeTab, onTabChange, userName, children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const config = roleConfig[role] || roleConfig.patient;

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB]" dir="rtl">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.07]">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-white shadow-sm cursor-pointer"
            >
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
          </Link>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div key="logo-text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <Link href="/" className="group">
                  <p className="text-white font-extrabold text-base leading-none group-hover:text-sky-200 transition-colors">رعاية</p>
                  <p className="text-sky-100 text-[10px] font-medium mt-0.5">لوحة {config.label}</p>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-auto w-7 h-7 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors flex-shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Nav */}
        <nav className="px-2 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const isActive = activeTab === id;
            return (
              <motion.button
                key={id} onClick={() => onTabChange(id)} whileTap={{ scale: 0.97 }}
                className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.85)", background: isActive ? "rgba(255,255,255,0.2)" : "transparent" }}
              >
                {isActive && (
                  <motion.div layoutId={`nav-${role}`} className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.3), rgba(99,102,241,0.3))" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full cursor-pointer">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span key={`label-${id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-semibold">
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && badge > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="mr-auto text-[10px] font-black bg-gradient-to-r from-sky-500 to-orange-400 text-white px-2 py-0.5 rounded-full">
                      {badge}
                    </motion.span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.07]">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer" onClick={logout}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: config.gradient }}>
                {userName?.charAt(0) || "؟"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{userName}</p>
                <p className="text-sky-100 text-xs">{config.label}</p>
              </div>
              <motion.button whileHover={{ scale: 1.1, color: "#f87171" }} whileTap={{ scale: 0.9 }}
                className="text-white/80 transition-colors cursor-pointer">
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button whileHover={{ scale: 1.1 }} onClick={logout}
              className="w-full flex justify-center text-white/80 hover:text-rose-400 p-2 cursor-pointer">
              <LogOut className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center px-6 gap-4 flex-shrink-0"
          style={{ boxShadow: "0 1px 20px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {activeTab !== "overview" && (
                <motion.button 
                  initial={{ opacity: 0, width: 0, marginRight: -10 }} 
                  animate={{ opacity: 1, width: "auto", marginRight: 0 }} 
                  exit={{ opacity: 0, width: 0, marginRight: -10 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTabChange("overview")}
                  className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50 border border-slate-100 transition-colors"
                  title="الرجوع للرئيسية"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 leading-none">
                {navItems.find(n => n.id === activeTab)?.label || "لوحة التحكم"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">منصة رعاية — لوحة {config.label}</p>
            </div>
          </div>
          <div className="mr-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: config.gradient }}>
              {userName?.charAt(0) || "؟"}
            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* رعايا - Floating Assistant */}
      <ChatBot role={role.charAt(0).toUpperCase() + role.slice(1)} userName={userName} />
    </div>
  );
}

// ── Shared Components ──
export function StatCard({ icon: Icon, label, value, suffix = "", gradient, bg, iconColor, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${bg} ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && <span className="text-xs font-bold px-2 py-1 rounded-full bg-sky-50 text-sky-600">{trend}</span>}
      </div>
      <p className="text-2xl font-black text-slate-900">{value}{suffix}</p>
      <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, Math.max(10, (value / 50) * 100))}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`} />
      </div>
    </motion.div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
        <Icon className="w-14 h-14 text-sky-400 mx-auto mb-4" />
      </motion.div>
      <p className="text-slate-600 font-bold text-lg">{title}</p>
      <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
    </motion.div>
  );
}

export function useAuth(expectedRole) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const p = parseJwt(token);
      if (!p) throw new Error("Invalid token");
      const r = p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || p["role"] || "";
      const rs = (Array.isArray(r) ? r[0] : String(r)).toLowerCase();
      
      const accountStatus = p["AccountStatus"] || p["accountStatus"] || "";
      if (accountStatus === "Banned") { router.replace("/banned"); return; }
      if (accountStatus === "Pending") { router.replace("/pending-review"); return; }
      
      if (rs !== expectedRole.toLowerCase()) { router.push("/"); return; }
      setUserName(p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || p["name"] || p["unique_name"] || "");
      setIsReady(true);
    } catch { router.push("/login"); }
  }, []);

  return { userName, isReady };
}

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};
