"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseJwt } from "../../../lib/jwt";
import {
  LayoutDashboard, Users, ClipboardList, Heart, LogOut,
  CheckCircle2, XCircle, ShieldAlert, Megaphone,
  Stethoscope, Pill, HandHeart, User, AlertTriangle,
  RefreshCw, TrendingUp, Activity, Menu, X,
  Bell, Search, ChevronRight, Sparkles, Shield,
  BarChart3, UserCheck, Clock, Send, Eye, Headset
} from "lucide-react";

import TicketSystem from "../../../components/dashboard/TicketSystem";

// ── helpers ─────────────────────────────────────────────────────────────
const navItems = [
  { id: "overview",  label: "نظرة عامة",     icon: LayoutDashboard },
  { id: "pending",   label: "طلبات الانضمام", icon: Users },
  { id: "members",   label: "إدارة الأعضاء",  icon: UserCheck },
  { id: "requests",  label: "مراقبة الطلبات", icon: ClipboardList },
  { id: "donate-cases", label: "حالات التبرع", icon: Heart },
  { id: "support",   label: "الدعم الفني", icon: Headset },
  { id: "notify",    label: "إرسال إشعارات",  icon: Megaphone },
];
const roleIcon   = { patient: User, doctor: Stethoscope, pharmacy: Pill, volunteer: HandHeart };
const roleName   = { patient: "مريض", doctor: "طبيب", pharmacy: "صيدلانى", volunteer: "متطوع" };
const roleGrad   = {
  patient:  "from-sky-500 to-cyan-400",
  doctor:   "from-sky-500 to-cyan-400",
  pharmacy: "from-sky-500 to-yellow-400",
  volunteer:"from-rose-500 to-pink-400",
};

// ── Animated Counter ─────────────────────────────────────────────────────
function Counter({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = parseFloat(value) || 0;
    if (end === 0) return;
    const dur = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(end * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

// ── Main Component ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive]   = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [adminName, setAdminName] = useState("المدير");
  const [stats, setStats]         = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingSort, setPendingSort]   = useState("oldest");
  const [allUsers, setAllUsers] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);  const [stalledReqs, setStalledReqs]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [isAuthed, setIsAuthed]   = useState(false);
  const [notifyData, setNotifyData] = useState({ title: "", message: "", targetRole: "All" });
  const [donateForm, setDonateForm] = useState({ title: "", description: "", goalAmount: "", patientName: "", caseImage: null });
  const [sending, setSending]     = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const [stalledFilter, setStalledFilter] = useState("all");
  const [stalledSearch, setStalledSearch] = useState("");

  const [selectedReq, setSelectedReq] = useState(null);
  const [reqDetail, setReqDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Auth ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const p = parseJwt(token);
      if (!p) throw new Error("Invalid token");
      const r = p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || p["role"] || "";
      const rs = Array.isArray(r) ? r.join(",") : String(r);
      const accountStatus = p["AccountStatus"] || p["accountStatus"] || "";
      if (accountStatus === "Banned") { router.replace("/banned"); return; }
      if (!rs.toLowerCase().includes("admin")) { router.push("/"); return; }
      
      setAdminName(
        p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        || p["name"] || p["unique_name"] || "المدير"
      );
      setIsAuthed(true);
    } catch { router.push("/login"); }
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    Promise.all([
      api.get("/Stats/admin").then(r => setStats(r.data)).catch(() => {}),
      api.get("/Admin/pending-users-details").then(r => setPendingUsers(r.data)).catch(() => {}),
      api.get("/Admin/stalled-requests?minutes=0").then(r => setStalledReqs(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isAuthed]);

  const refreshPending = () => {
    api.get("/Admin/pending-users-details").then(r => setPendingUsers(r.data)).catch(() => {});
  };

  const handleVerify = async (userId, action) => {
    try {
      if (action === "approve") {
        await api.post("/Admin/verify-user", { userId, isApproved: true });
        toast.success("✅ تم قبول المستخدم بنجاح");
      } else {
        await api.post(`/Admin/ban-user/${userId}`);
        toast.success("🚫 تم رفض وحظر المستخدم");
      }
      setPendingUsers(p => p.filter(u => u.id !== userId));
      setStats(s => s ? { ...s, pendingVerifications: Math.max(0, s.pendingVerifications - 1) } : s);
    } catch { toast.error("حدث خطأ، حاول مرة أخرى"); }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!donateForm.caseImage) {
      toast.error("يرجى إرفاق صورة الحالة");
      return;
    }
    setSending(true);
    const fd = new FormData();
    fd.append("Title", donateForm.title);
    fd.append("Description", donateForm.description);
    fd.append("GoalAmount", donateForm.goalAmount);
    fd.append("PatientName", donateForm.patientName);
    fd.append("CaseImage", donateForm.caseImage);

    try {
      if (editingCase) {
        // Edit existing case
        await api.put(`/Admin/donation-cases/${editingCase.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("🎉 تم تعـديل حالة التبرع بنجاح!");
        setEditingCase(null);
      } else {
        // Create new case
        await api.post("/Admin/create-case", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("🎉 تم إضافة حالة التبرع بنجاح وإرسال الإشعارات!");
      }
      setDonateForm({ title: "", description: "", goalAmount: "", patientName: "", caseImage: null });
      fetchDonationCases();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل العملية");
    } finally {
      setSending(false);
    }
  };

  const fetchUsers = () => {
    api.get("/Admin/all-users").then(r => setAllUsers(r.data)).catch(() => {});
  };

  const fetchDonationCases = () => {
    api.get("/Admin/all-donation-cases").then(r => setAllCases(r.data)).catch(() => {});
  };

  useEffect(() => {
    if (active === "members") fetchUsers();
    if (active === "donate-cases") fetchDonationCases();
  }, [active]);

  const handleBanUnban = async (u) => {
    try {
      if (u.accountStatus === 3) { // 3 = Banned
        await api.post(`/Admin/unban-user/${u.id}`);
        toast.success("تم فك الحظر عن المستخدم بنجاح");
      } else {
        await api.post(`/Admin/ban-user/${u.id}`);
        toast.success("تم حظر المستخدم بنجاح");
      }
      fetchUsers();
    } catch {
      toast.error("فشل في تغيير حالة المستخدم");
    }
  };

  const handleDeleteCase = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحالة نهائياً؟")) return;
    try {
      await api.delete(`/Admin/donation-cases/${id}`);
      toast.success("تم حذف الحالة بنجاح");
      fetchDonationCases();
    } catch {
      toast.error("فشل حذف الحالة");
    }
  };

  const startEditCase = (c) => {
    setEditingCase(c);
    setDonateForm({
      title: c.title,
      description: c.description,
      goalAmount: c.goalAmount,
      patientName: c.patientName,
      caseImage: null // will just keep old if null
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleNotify = async (e) => {
    e.preventDefault(); setSending(true);
    try {
      await api.post("/Admin/broadcast-notification", notifyData);
      toast.success("🎉 تم إرسال الإشعار بنجاح");
      setNotifyData({ title: "", message: "", targetRole: "All" });
    } catch { toast.error("فشل الإرسال"); }
    finally { setSending(false); }
  };

  const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

  const handleReviewRequest = async (id, type) => {
    setSelectedReq({ id, type });
    setReqDetail(null);
    setDetailLoading(true);
    try {
      const res = await api.get(`/Admin/request-detail?type=${type}&id=${id}`);
      setReqDetail(res.data);
    } catch {
      toast.error("فشل تحميل تفاصيل الطلب");
      setSelectedReq(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleBroadcastUrgent = async () => {
    if (!selectedReq) return;
    try {
      toast.info("جاري إرسال نداء الطوارئ...");
      await api.post("/Admin/broadcast-urgent", { type: selectedReq.type, requestId: selectedReq.id });
      toast.success("🚨 تم إرسال نداء طوارئ لكافة المختصين بنجاح!");
      setSelectedReq(null);
    } catch (err) {
      toast.error(err.response?.data || "فشل إرسال النداء");
    }
  };

  // ── Stat Cards Config ────────────────────────────────────────────────
  const statCards = stats ? [
    {
      label: "إجمالي المستخدمين", value: stats.totalUsers,
      icon: Users, grad: "from-sky-600 to-indigo-600",
      bg: "bg-sky-50", iconColor: "text-sky-600",
      trend: "+12%", up: true,
    },
    {
      label: "قيد المراجعة", value: stats.pendingVerifications,
      icon: ShieldAlert, grad: "from-sky-500 to-orange-500",
      bg: "bg-sky-50", iconColor: "text-sky-600",
      trend: `${stats.pendingVerifications} طلب`, up: null,
    },
    {
      label: "حالات التبرع النشطة", value: stats.activeCases,
      icon: Heart, grad: "from-rose-500 to-pink-500",
      bg: "bg-rose-50", iconColor: "text-rose-600",
      trend: "نشط", up: true,
    },
    {
      label: "إجمالي التبرعات", value: stats.totalDonations,
      suffix: " ج", icon: TrendingUp, grad: "from-sky-500 to-cyan-500",
      bg: "bg-sky-50", iconColor: "text-sky-600",
      trend: "+8%", up: true,
    },
  ] : [];

  // ── Page Variants ────────────────────────────────────────────────────
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
    exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB]" dir="rtl">
      <ToastContainer position="top-center" rtl theme="colored" autoClose={3000} />

      {/* ══════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════ */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex-shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Glow blob */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.07]">
          <motion.div
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
          >
            <Heart className="w-4 h-4 text-white" fill="white" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
              >
                <p className="text-white font-extrabold text-base leading-none">رعاية</p>
                <p className="text-sky-100 text-[10px] font-medium mt-0.5">لوحة الإدارة</p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="mr-auto w-7 h-7 flex items-center justify-center rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Nav Items */}
        <nav className="px-2 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <motion.button
                key={id}
                onClick={() => setActive(id)}
                onHoverStart={() => setHoveredNav(id)}
                onHoverEnd={() => setHoveredNav(null)}
                whileTap={{ scale: 0.97 }}
                className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
                  background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.3), rgba(99,102,241,0.3))" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full cursor-pointer">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-sm font-semibold"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && id === "pending" && pendingUsers.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="mr-auto text-[10px] font-black bg-gradient-to-r from-sky-500 to-orange-400 text-white px-2 py-0.5 rounded-full"
                    >
                      {pendingUsers.length}
                    </motion.span>
                  )}
                </div>
                {collapsed && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-400 rounded-l-full" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Admin Card */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.07]">
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-default"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
              >
                {adminName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{adminName}</p>
                <p className="text-sky-100 text-xs">مدير النظام</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, color: "#f87171" }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="text-sky-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={logout}
              className="w-full flex justify-center text-sky-100 hover:text-rose-400 p-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.aside>

      {/* ══════════════════════════════════════════════════════════════
          MAIN
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center px-6 gap-4 flex-shrink-0"
          style={{ boxShadow: "0 1px 20px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {active !== "overview" && (
                <motion.button 
                  initial={{ opacity: 0, width: 0, marginRight: -10 }} 
                  animate={{ opacity: 1, width: "auto", marginRight: 0 }} 
                  exit={{ opacity: 0, width: 0, marginRight: -10 }}
                  whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActive("overview")}
                  className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-slate-500 bg-slate-50 border border-slate-100 transition-colors"
                  title="الرجوع للرئيسية"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 leading-none">
                {navItems.find(n => n.id === active)?.label}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">منصة رعاية — لوحة الإدارة</p>
            </div>
          </div>

          <div className="mr-auto flex items-center gap-3">
            {/* Pending badge */}
            {pendingUsers.length > 0 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full"
              >
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                {pendingUsers.length} طلب انضمام معلق
              </motion.div>
            )}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
            >
              {adminName.charAt(0)}
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">

            {/* ─────────────────────────────────────────────────────────
                OVERVIEW
            ───────────────────────────────────────────────────────── */}
            {active === "overview" && (
              <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                {/* Welcome Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative rounded-3xl overflow-hidden mb-6 p-7"
                  style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)" }}
                >
                  <div className="absolute top-0 right-0 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span className="text-sky-400 text-sm font-semibold">لوحة التحكم الرئيسية</span>
                      </div>
                      <h2 className="text-2xl font-black text-white mb-1">
                        مرحباً، {adminName} 👋
                      </h2>
                      <p className="text-white/50 text-sm">
                        {new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setActive("pending")}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        طلبات الانضمام
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setActive("notify")}
                        className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                        style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
                      >
                        <Send className="w-4 h-4" />
                        إرسال إشعار
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Stat Cards */}
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={stagger} initial="initial" animate="animate"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                  >
                    {statCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <motion.div
                          key={card.label} variants={item}
                          whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.iconColor} flex items-center justify-center`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            {card.trend && (
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                card.up === true ? "bg-sky-50 text-sky-600" :
                                card.up === false ? "bg-rose-50 text-rose-600" :
                                "bg-sky-50 text-sky-600"
                              }`}>
                                {card.trend}
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-black text-slate-900">
                            <Counter value={card.value} suffix={card.suffix} />
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">{card.label}</p>
                          {/* Progress bar accent */}
                          <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (card.value / 100) * 100)}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className={`h-full rounded-full bg-gradient-to-r ${card.grad}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Recent Pending */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">أحدث طلبات الانضمام</h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setActive("pending")}
                        className="text-xs text-sky-600 font-bold bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        عرض الكل <ChevronRight className="w-3 h-3" />
                      </motion.button>
                    </div>
                    <div>
                      {loading ? (
                        <div className="p-4 space-y-3">
                          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
                        </div>
                      ) : pendingUsers.length === 0 ? (
                        <div className="py-12 text-center">
                          <CheckCircle2 className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                          <p className="text-slate-400 text-sm font-medium">لا توجد طلبات معلقة</p>
                        </div>
                      ) : (
                        <motion.div variants={stagger} initial="initial" animate="animate">
                          {pendingUsers.slice(0, 5).map(u => {
                            const Icon = roleIcon[u.role] || User;
                            const grad = roleGrad[u.role] || "from-slate-400 to-slate-500";
                            return (
                              <motion.div
                                key={u.id} variants={item}
                                whileHover={{ backgroundColor: "#f8fafc" }}
                                className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 transition-colors cursor-default"
                              >
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${grad} text-white`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">{u.fullName}</p>
                                  <p className="text-xs text-slate-400">{roleName[u.role] || u.role} — {u.email}</p>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  onClick={() => { setActive("pending"); }}
                                  className="text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" /> مراجعة
                                </motion.button>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Quick Stats + Stalled */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Alert */}
                    {stats?.pendingVerifications > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-sky-50 border border-sky-200 rounded-2xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-sky-800">
                              {stats.pendingVerifications} طلب بانتظار مراجعتك
                            </p>
                            <motion.button
                              whileHover={{ x: -4 }}
                              onClick={() => setActive("pending")}
                              className="text-xs text-sky-600 font-semibold mt-1 hover:underline"
                            >
                              مراجعة الآن ←
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stalled */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                          <Activity className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">طلبات متعثرة</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-black text-slate-800">
                            {stalledReqs?.stalledMedical?.length ?? 0}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                            <Stethoscope className="w-3 h-3" /> طبية
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-black text-slate-800">
                            {stalledReqs?.stalledMedicine?.length ?? 0}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                            <Pill className="w-3 h-3" /> أدوية
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                      <h3 className="font-bold text-slate-800 text-sm mb-3">إجراءات سريعة</h3>
                      <div className="space-y-2">
                        {[
                          { label: "مراجعة الطلبات", icon: UserCheck, nav: "pending", color: "text-sky-600 bg-sky-50" },
                          { label: "إرسال إشعار", icon: Megaphone, nav: "notify", color: "text-sky-600 bg-sky-50" },
                          { label: "مراقبة الطلبات", icon: BarChart3, nav: "requests", color: "text-sky-600 bg-sky-50" },
                        ].map(({ label, icon: Icon, nav, color }) => (
                          <motion.button
                            key={nav} whileHover={{ x: -4 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setActive(nav)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{label}</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 mr-auto" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────
                PENDING USERS
            ───────────────────────────────────────────────────────── */}
            {active === "pending" && (
              <motion.div key="pending" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">طلبات الانضمام</h2>
                    <p className="text-slate-400 text-sm mt-0.5">{pendingUsers.length} طلب بانتظار المراجعة</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={pendingSort}
                      onChange={(e) => setPendingSort(e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-0 focus:border-sky-400 cursor-pointer shadow-sm"
                    >
                      <option value="oldest">الأقدم أولاً</option>
                      <option value="newest">الأحدث أولاً</option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={refreshPending}
                      className="flex items-center gap-2 text-sm font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" /> تحديث
                    </motion.button>
                  </div>
                </div>

                {pendingUsers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    >
                      <CheckCircle2 className="w-14 h-14 text-sky-400 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-slate-600 font-bold text-lg">لا توجد طلبات معلقة 🎉</p>
                    <p className="text-slate-400 text-sm mt-1">كل الطلبات تمت مراجعتها</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={stagger} initial="initial" animate="animate"
                    className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                  >
                    {[...pendingUsers].sort((a, b) => {
                      const dateA = new Date(a.createdAt).getTime();
                      const dateB = new Date(b.createdAt).getTime();
                      return pendingSort === "newest" ? dateB - dateA : dateA - dateB;
                    }).map(u => {
                      const Icon = roleIcon[u.role] || User;
                      const grad = roleGrad[u.role] || "from-slate-400 to-slate-500";
                      return (
                        <motion.div
                          key={u.id} variants={item} layout
                          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                          className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden transition-all"
                        >
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <motion.div
                                whileHover={{ rotate: -5, scale: 1.1 }}
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}
                              >
                                <Icon className="w-6 h-6" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold text-slate-900">{u.fullName}</p>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${grad}`}>
                                    {roleName[u.role] || u.role}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400 mt-0.5">{u.email}</p>
                                <p className="text-xs text-slate-300 mt-0.5 font-mono" dir="ltr">{u.nationalID}</p>
                              </div>
                            </div>

                            {u.profile && (
                              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                                {[
                                  ["المحافظة", u.profile.governorate],
                                  ["المدينة", u.profile.city],
                                  ["التخصص", u.profile.specialty],
                                  ["العيادة", u.profile.clinicAddress],
                                  ["الصيدلية", u.profile.pharmacyName],
                                  ["العنوان", u.profile.address],
                                  ["الهاتف", u.profile.phoneNumber],
                                ].filter(([, v]) => v).map(([label, value]) => (
                                  <div key={label} className="bg-slate-50 rounded-xl px-3 py-2">
                                    <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{value}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {!u.hasCompletedProfile && (
                              <div className="mt-3 flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2 text-xs text-sky-700 font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                لم يكمل الملف الشخصي بعد
                              </div>
                            )}
                          </div>

                          <div className="flex border-t border-slate-100 flex-wrap">
                            <motion.button
                              whileHover={{ backgroundColor: "#f0fdf4" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleVerify(u.id, "approve")}
                              className="flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-sky-600 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> قبول
                            </motion.button>
                            <div className="w-px bg-slate-100" />
                            <motion.button
                              whileHover={{ backgroundColor: "#fff1f2" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleVerify(u.id, "ban")}
                              className="flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-rose-500 transition-colors"
                            >
                              <XCircle className="w-4 h-4" /> رفض
                            </motion.button>
                            <div className="w-px bg-slate-100" />
                            <motion.button
                              whileHover={{ backgroundColor: "#f8fafc" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedUserForDetails(u)}
                              className="flex-1 min-w-[30%] flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-sky-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" /> تفاصيل المرفقات
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────
                REQUESTS
            ───────────────────────────────────────────────────────── */}
            {active === "requests" && (() => {
              const allStalled = (Array.isArray(stalledReqs) ? stalledReqs : []).map(x => ({
                ...x,
                _type: x.type?.toLowerCase() === "medical" ? "medical" : "medicine"
              })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

              const filteredReqs = allStalled.filter(r => {
                if (stalledFilter !== "all" && r._type !== stalledFilter) return false;
                if (stalledSearch) {
                  const term = stalledSearch.toLowerCase();
                  if (!r.patientName?.toLowerCase().includes(term) && !String(r.id).includes(term)) return false;
                }
                return true;
              });

              return (
                <motion.div key="requests" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">مراقبة الطلبات</h2>
                      <p className="text-slate-400 text-sm mt-0.5">المراقبة الحية لجميع الطلبات القائمة التي لم يتم الرد عليها</p>
                    </div>
                    {/* Filters Row */}
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                      {[
                        { id: "all", label: "الكل" },
                        { id: "medical", label: "استشارات طبية" },
                        { id: "medicine", label: "طلبات أدوية" }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setStalledFilter(f.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            stalledFilter === f.id
                              ? "bg-slate-800 text-white shadow-md"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="ابحث باسم المريض أو رقم الطلب..."
                      value={stalledSearch}
                      onChange={e => setStalledSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200/80 text-slate-800 rounded-2xl py-3.5 pr-12 pl-4 focus:outline-none focus:ring-0 focus:border-sky-400 shadow-sm transition-all"
                    />
                  </div>

                  {/* Results List */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-sky-500" />
                        سجل الطلبات المتعثرة
                      </h3>
                      <span className="bg-sky-100 text-sky-700 text-xs font-black px-3 py-1 rounded-full">
                        {filteredReqs.length} طلب
                      </span>
                    </div>

                    <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
                      {filteredReqs.length > 0 ? (
                        <motion.div variants={stagger} initial="initial" animate="animate">
                          {filteredReqs.map((r, i) => {
                            const isMedical = r._type === "medical";
                            const Icon = isMedical ? Stethoscope : Pill;
                            const grad = isMedical ? "from-sky-500 to-cyan-500" : "from-sky-500 to-yellow-500";
                            const bg = isMedical ? "bg-sky-50" : "bg-sky-50";
                            const color = isMedical ? "text-sky-600" : "text-sky-600";
                            const badge = isMedical ? "استشارة طبية" : "طلب دواء";

                            return (
                              <motion.div key={`${r._type}-${r.id}`} variants={item} className="p-5 flex items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center flex-shrink-0 border border-white/50 shadow-sm`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-bold text-slate-800 truncate">{r.patientName || "مريض مجهول"}</p>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${grad}`}>
                                      #{r.id} {badge}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {new Date(r.createdAt).toLocaleString("ar-EG")}
                                    </p>
                                    {r.specialtyName && (
                                      <p className="text-xs text-slate-500 border-r border-slate-200 pr-3 mr-3 truncate flex-shrink">
                                        تخصص: {r.specialtyName}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <motion.button 
                                  onClick={() => handleReviewRequest(r.id, r._type)}
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                  className="mt-2 sm:mt-0 flex-shrink-0 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 px-4 py-2 rounded-xl transition-all shadow-sm">
                                  مراجعة الطلب
                                </motion.button>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      ) : (
                        <div className="py-16 text-center">
                          <CheckCircle2 className="w-12 h-12 text-sky-400 mx-auto mb-3 opacity-50" />
                          <p className="text-slate-500 font-bold">لا يوجد طلبات مطابقة للبحث</p>
                          <p className="text-slate-400 text-sm mt-1">كل الأمور مستقرة في الوقت الحالي</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* ─────────────────────────────────────────────────────────
                MEMBERS MANAGEMENT
            ───────────────────────────────────────────────────────── */}
            {active === "members" && (
              <motion.div key="members" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">إدارة الأعضاء</h2>
                    <p className="text-slate-400 text-sm mt-1">التحكم في جميع مستخدمي المنصة (حظر، فك حظر، استعراض بيانات)</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <tr>
                          <th className="p-4">المستخدم</th>
                          <th className="p-4">الدور</th>
                          <th className="p-4">تاريخ التسجيل</th>
                          <th className="p-4">الحالة</th>
                          <th className="p-4 flex justify-end">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allUsers.length === 0 ? (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-400">جاري التحميل... أو لا يوجد مستخدمين.</td></tr>
                        ) : (
                          allUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4">
                                <p className="font-bold text-slate-800">{u.fullName}</p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                  u.userType === 4 ? "bg-sky-100 text-sky-700" :
                                  u.userType === 2 ? "bg-sky-100 text-sky-700" :
                                  u.userType === 3 ? "bg-sky-100 text-sky-700" :
                                  u.userType === 5 ? "bg-rose-100 text-rose-700" :
                                  u.userType === 1 ? "bg-indigo-100 text-indigo-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  {u.userType === 4 ? "مريض" : u.userType === 2 ? "طبيب" : u.userType === 3 ? "صيدلانى" : u.userType === 5 ? "متطوع" : u.userType === 1 ? "أدمن" : "غير معروف"}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500" dir="ltr">{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="p-4">
                                {u.accountStatus === 3 ? (
                                  <span className="text-rose-500 font-bold text-xs bg-rose-50 px-2.5 py-1 rounded-md">محظور</span>
                                ) : !u.isVerified ? (
                                  <span className="text-sky-500 font-bold text-xs bg-sky-50 px-2.5 py-1 rounded-md">قيد الانتظار</span>
                                ) : !u.isActive ? (
                                  <span className="text-slate-500 font-bold text-xs bg-slate-50 px-2.5 py-1 rounded-md">غير مفعل</span>
                                ) : (
                                  <span className="text-sky-500 font-bold text-xs bg-sky-50 px-2.5 py-1 rounded-md">نشط</span>
                                )}
                              </td>
                              <td className="p-4 flex justify-end gap-2">
                                <button
                                  onClick={() => handleBanUnban(u)}
                                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                                    u.accountStatus === 3 
                                      ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                                      : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  }`}
                                >
                                  {u.accountStatus === 3 ? "فك الحظر" : "حظر"}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────
                DONATE CASES
            ───────────────────────────────────────────────────────── */}
            {active === "donate-cases" && (
              <motion.div key="donate-cases" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">حالات التبرع</h2>
                    <p className="text-slate-400 text-sm mt-1">إضافة حالات جديدة ومتابعة الحالات الحالية</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden mb-10">
                  <div className="bg-gradient-to-r from-sky-50 to-cyan-50 p-6 border-b border-sky-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{editingCase ? "تعديل حالة التبرع" : "إضافة حالة جديدة"}</h3>
                          <p className="text-xs text-sky-600/80 font-medium mt-0.5">{editingCase ? "جاري تعديل بيانات الحالة" : "سيتم إرسال إشعار للمستخدمين عند الإضافة"}</p>
                        </div>
                      </div>
                      {editingCase && (
                        <button onClick={() => { setEditingCase(null); setDonateForm({title: "", description: "", goalAmount: "", patientName: "", caseImage: null}) }} className="text-sm font-bold text-sky-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-100 hover:bg-sky-50">إلغاء التعديل</button>
                      )}
                    </div>
                  </div>
                  <form onSubmit={handleCreateCase} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-right">عنوان الحالة</label>
                        <input type="text" dir="rtl" value={donateForm.title} onChange={e => setDonateForm({ ...donateForm, title: e.target.value })} required placeholder="مثال: عملية قلب مفتوح عاجلة" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 text-right focus:ring-0 focus:border-sky-400 focus:bg-white transition-all" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-right">المبلغ المطلوب (ج.م)</label>
                        <input type="number" dir="rtl" min="1" step="0.01" value={donateForm.goalAmount} onChange={e => setDonateForm({ ...donateForm, goalAmount: e.target.value })} required placeholder="مثال: 50000" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 text-right focus:ring-0 focus:border-sky-400 focus:bg-white transition-all" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-right">اسم المريض</label>
                        <input type="text" dir="rtl" value={donateForm.patientName} onChange={e => setDonateForm({ ...donateForm, patientName: e.target.value })} required placeholder="اسم المريض أو مجهول" className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 text-right focus:ring-0 focus:border-sky-400 focus:bg-white transition-all" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-right">وصف الحالة</label>
                        <textarea dir="rtl" value={donateForm.description} onChange={e => setDonateForm({ ...donateForm, description: e.target.value })} required placeholder="اشرح تفاصيل الحالة وسبب الاحتياج للمساعدة..." rows={3} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-3 text-right focus:ring-0 focus:border-sky-400 focus:bg-white transition-all resize-none" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-right">صورة الحالة {editingCase && <span className="text-xs text-sky-500 font-normal">(أرفق صورة جديدة فقط إذا أردت استبدالها)</span>}</label>
                        <input type="file" dir="rtl" accept="image/*" onChange={e => setDonateForm({ ...donateForm, caseImage: e.target.files[0] })} required={!editingCase} className="w-full text-sm text-slate-500 text-right file:mr-0 file:ml-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-600 hover:file:bg-sky-100 transition-colors cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1.5" />
                      </div>
                    </div>
                    <motion.button type="submit" disabled={sending} whileHover={!sending ? { scale: 1.02 } : {}} whileTap={!sending ? { scale: 0.98 } : {}} className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-70 transition-all shadow-lg shadow-sky-500/25" style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)" }}>
                      {sending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Heart className="w-4 h-4 fill-white" /> {editingCase ? "حفظ التعديلات" : "إضافة الحالة ونشرها"}</>}
                    </motion.button>
                  </form>
                </div>

                {/* List Section */}
                <h3 className="text-xl font-bold text-slate-800 mb-4">الحالات الحالية</h3>
                {allCases.length === 0 ? (
                   <p className="text-slate-500 p-8 text-center bg-white rounded-3xl border border-slate-100">لا يوجد حالات تبرع مسجلة حالياً.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCases.map(c => (
                      <div key={c.id} className="bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden flex flex-col group">
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                          {c.caseImage && (
                            <img src={`http://localhost:5129${c.caseImage}`} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {c.isCompleted ? (
                              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-md bg-opacity-90">مكتملة</span>
                            ) : (
                              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md backdrop-blur-md bg-opacity-90">جارية</span>
                            )}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h4 className="font-bold text-slate-800 text-lg mb-1">{c.title}</h4>
                          <p className="text-xs text-slate-400 mb-4">المريض: {c.patientName}</p>
                          
                          <div className="mt-auto">
                            <div className="flex justify-between items-end mb-2">
                              <div>
                                <p className="text-xs text-slate-400 font-medium">المبلغ المجموع</p>
                                <p className="font-bold text-sky-600 font-mono text-sm">{c.collectedAmount} <span className="text-[10px] text-slate-400 font-sans">ج.م</span></p>
                              </div>
                              <div className="text-left">
                                <p className="text-xs text-slate-400 font-medium">الهدف</p>
                                <p className="font-bold text-slate-800 font-mono text-sm">{c.goalAmount} <span className="text-[10px] text-slate-400 font-sans">ج.م</span></p>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                              <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${Math.min((c.collectedAmount / c.goalAmount) * 100, 100)}%` }} />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startEditCase(c)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-xl text-sm transition-colors border border-slate-200">
                                تعديل
                              </button>
                              <button onClick={() => handleDeleteCase(c.id)} className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold py-2 rounded-xl text-sm transition-colors border border-sky-100">
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────
                NOTIFY
            ───────────────────────────────────────────────────────── */}
            {active === "notify" && (
              <motion.div key="notify" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-extrabold text-slate-900">إرسال إشعارات</h2>
                  <p className="text-slate-400 text-sm mt-1">إرسال إشعارات جماعية لمستخدمي المنصة</p>
                </div>
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-6"
                  >
                    <form onSubmit={handleNotify} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">الفئة المستهدفة</label>
                        <select
                          value={notifyData.targetRole}
                          onChange={e => setNotifyData(p => ({ ...p, targetRole: e.target.value }))}
                          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all"
                        >
                          {[["All","الجميع"],["Patient","المرضى"],["Doctor","الأطباء"],["Pharmacist","الصيدليات"],["Volunteer","المتطوعون"]].map(([val, lbl]) => (
                            <option key={val} value={val}>{lbl}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الإشعار</label>
                        <input type="text" value={notifyData.title}
                          onChange={e => setNotifyData(p => ({ ...p, title: e.target.value }))}
                          placeholder="مثال: تحديث هام للمنصة" required
                          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">نص الإشعار</label>
                        <textarea value={notifyData.message}
                          onChange={e => setNotifyData(p => ({ ...p, message: e.target.value }))}
                          placeholder="اكتب نص الإشعار هنا..." required rows={5}
                          className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all resize-none"
                        />
                      </div>
                      <motion.button
                        type="submit" disabled={sending}
                        whileHover={!sending ? { scale: 1.02 } : {}}
                        whileTap={!sending ? { scale: 0.97 } : {}}
                        className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 disabled:opacity-70 transition-all"
                        style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 4px 20px rgba(14,165,233,0.35)" }}
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <><Send className="w-5 h-5" /> إرسال الإشعار لـ {notifyData.targetRole === "All" ? "الجميع" : notifyData.targetRole}</>
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* --- 5. Support Tickets --- */}
          <AnimatePresence>
            {active === "support" && (
              <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <TicketSystem isAdmin={true} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* REQUEST DETAIL MODAL */}
          <AnimatePresence>
            {selectedReq && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-full">
                  <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        {selectedReq.type === "medical" ? <Stethoscope className="text-sky-500 w-6 h-6"/> : <Pill className="text-sky-500 w-6 h-6"/>}
                        تفاصيل الطلب المتعثر #{selectedReq.id}
                      </h3>
                      {reqDetail && <p className="text-sm text-slate-400 mt-1">{new Date(reqDetail.createdAt).toLocaleString("ar-EG")} • متوقف منذ {Math.floor(reqDetail.ageMinutes)} دقيقة</p>}
                    </div>
                    <button onClick={() => setSelectedReq(null)} className="p-2 bg-slate-200/50 hover:bg-slate-200 text-slate-500 rounded-xl">
                      <X className="w-5 h-5"/>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    {detailLoading ? (
                      <div className="flex justify-center p-10"><RefreshCw className="w-8 h-8 animate-spin text-sky-500" /></div>
                    ) : reqDetail ? (
                      <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-2xl grid grid-cols-2 gap-4 border border-slate-100">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">اسم المريض</p>
                            <p className="font-bold text-slate-800">{reqDetail.patientName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                            <p className="font-bold text-slate-800">{reqDetail.patientPhone || "غير متوفر"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-slate-400 mb-1">الموقع الجغرافي</p>
                            <p className="font-bold text-slate-800">{reqDetail.patientGovernorate} - {reqDetail.patientCity}</p>
                          </div>
                        </div>

                        {selectedReq.type === "medical" ? (
                          <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl">
                            <p className="text-xs text-sky-600 mb-1">التخصص المطلوب</p>
                            <p className="font-bold text-slate-800 text-lg mb-3">{reqDetail.specialtyName}</p>
                            <p className="text-xs text-sky-600 mb-1">وصف الحالة</p>
                            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-sky-50">{reqDetail.description || "لا يوجد التخصص المطلوب في النظام أو لم يقم المريض بوصف حالته"}</p>
                          </div>
                        ) : (
                          <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-xl">
                            <p className="text-xs text-sky-600 mb-2 font-bold">الروشتة المرفقة</p>
                            {reqDetail.prescriptionImageUrl ? (
                              <img src={`http://localhost:5247${reqDetail.prescriptionImageUrl}`} alt="روشتة" className="w-full h-auto max-h-64 object-contain rounded-xl shadow-sm border border-sky-200 bg-white" />
                            ) : (
                              <p className="text-sm text-sky-700 font-bold p-4 bg-sky-100 rounded-lg text-center">لا توجد صورة للروشتة</p>
                            )}
                          </div>
                        )}

                        {reqDetail.suggestedContacts && reqDetail.suggestedContacts.length > 0 && (
                          <div>
                            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <Bell className="w-4 h-4 text-sky-500" />
                              أطراف مقترحة يمكن لإدارة النظام التواصل معهم لحل الأزمة
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {reqDetail.suggestedContacts.map((c, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between items-center shadow-sm">
                                  <div>
                                    <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                                    <p className="text-xs text-slate-400">{c.role === "Doctor" ? "طبيب متاح" : "صيدلية متاحة"}</p>
                                  </div>
                                  <a href={`tel:${c.phoneNumber}`} className="flex items-center gap-1 text-sky-600 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                    اتصال
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {reqDetail.suggestedContacts && reqDetail.suggestedContacts.length === 0 && (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                            <p className="text-sm font-bold text-rose-700">لا يوجد متطوعين/أطباء/صيدليات متاحين في هذه المحافظة!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-10">تعذر تحميل بيانات الطلب من السيرفر</p>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-end gap-3 mt-auto">
                    <button onClick={() => setSelectedReq(null)} className="px-6 py-2.5 rounded-xl font-bold bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors">
                      إغلاق
                    </button>
                    {!detailLoading && reqDetail && (
                      <button onClick={handleBroadcastUrgent} className="px-6 py-2.5 rounded-xl font-bold bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20">
                        إرسال نداء لكل المتخصصين يدوياً
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Details Modal */}
          <AnimatePresence>
            {selectedUserForDetails && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
                >
                  {(() => {
                    const fixImg = (path) => {
                      if (!path) return '';
                      if (path.startsWith('http://') || path.startsWith('https://')) return path;
                      return `http://localhost:5129${path.startsWith('/') ? '' : '/'}${path.replace(/\\/g, '/')}`;
                    };
                    return (
                      <>
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">تفاصيل انضمام: {selectedUserForDetails.fullName}</h3>
                        <p className="text-sm font-medium text-slate-500">{roleName[selectedUserForDetails.role] || selectedUserForDetails.role}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedUserForDetails(null)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">المعلومات الأساسية</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-500">البريد الإلكتروني</p>
                          <p className="text-sm font-bold text-slate-800 mt-1">{selectedUserForDetails.email}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-500">رقم الهاتف</p>
                          <p className="text-sm font-bold text-slate-800 mt-1" dir="ltr">{selectedUserForDetails.phoneNumber || selectedUserForDetails.profile?.phoneNumber || "غير متوفر"}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs text-slate-500">الرقم القومي</p>
                          <p className="text-sm font-bold text-slate-800 mt-1" dir="ltr">{selectedUserForDetails.nationalID}</p>
                        </div>
                      </div>
                    </div>

                    {/* Profile Details */}
                    {selectedUserForDetails.profile && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">بيانات إضافية</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            ["المحافظة", selectedUserForDetails.profile.governorate],
                            ["المدينة", selectedUserForDetails.profile.city],
                            ["التخصص", selectedUserForDetails.profile.specialty],
                            ["نوع الكشف", selectedUserForDetails.profile.consultationType === "Discounted" ? "مخفض" : selectedUserForDetails.profile.consultationType === "Free" ? "مجاني" : undefined],
                            ["السعر الأساسي", selectedUserForDetails.profile.originalPrice ? `${selectedUserForDetails.profile.originalPrice} ج.م` : undefined],
                            ["السعر بعد التخفيض", selectedUserForDetails.profile.discountedPrice ? `${selectedUserForDetails.profile.discountedPrice} ج.م` : undefined],
                            ["العيادة", selectedUserForDetails.profile.clinicAddress],
                            ["مواعيد العمل", selectedUserForDetails.profile.workingHours],
                            ["الصيدلية", selectedUserForDetails.profile.pharmacyName],
                            ["العنوان", selectedUserForDetails.profile.address],
                            selectedUserForDetails.role === "patient" ? ["أمراض مزمنة", selectedUserForDetails.profile.hasChronicDisease ? 'نعم' : 'لا'] : ["", null],
                          ].filter(([, v]) => v !== undefined && v !== null && v !== "").map(([label, value]) => (
                            <div key={label} className="bg-sky-50/50 rounded-xl p-3">
                              <p className="text-xs text-slate-500">{label}</p>
                              <p className="text-sm font-bold text-slate-800 mt-1">{value}</p>
                            </div>
                          ))}
                        </div>
                        {selectedUserForDetails.profile.description && (
                          <div className="bg-sky-50/50 rounded-xl p-4 mt-4">
                            <p className="text-xs text-slate-500 mb-2">نبذة عن الطبيب</p>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">{selectedUserForDetails.profile.description}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attachments / Images */}
                    {selectedUserForDetails.profile && (selectedUserForDetails.profile.nidImage || selectedUserForDetails.profile.socialProofImage || selectedUserForDetails.profile.profileImage || selectedUserForDetails.profile.licenseImage) && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">المرفقات والصور</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedUserForDetails.profile.profileImage && (
                            <div className="border border-slate-200 rounded-xl p-3">
                              <p className="text-xs font-semibold text-slate-600 mb-2">صورة الطبيب الشخصية</p>
                              <a href={fixImg(selectedUserForDetails.profile.profileImage)} target="_blank" rel="noopener noreferrer">
                                <img src={fixImg(selectedUserForDetails.profile.profileImage)} alt="Profile" className="w-full h-40 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                              </a>
                            </div>
                          )}
                          {selectedUserForDetails.profile.licenseImage && (
                            <div className="border-2 border-sky-300 bg-sky-50/40 rounded-xl p-3">
                              <p className="text-xs font-semibold text-sky-700 mb-2 flex items-center gap-1">
                                🏷️ كارنيه مزاولة المهنة
                              </p>
                              <a href={fixImg(selectedUserForDetails.profile.licenseImage)} target="_blank" rel="noopener noreferrer">
                                <img src={fixImg(selectedUserForDetails.profile.licenseImage)} alt="License" className="w-full h-40 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity cursor-zoom-in" />
                              </a>
                              <p className="text-[10px] text-sky-500 mt-1 text-center">اضغط للتكبير</p>
                            </div>
                          )}
                          {selectedUserForDetails.profile.nidImage && (
                            <div className="border border-slate-200 rounded-xl p-3">
                              <p className="text-xs font-semibold text-slate-600 mb-2">صورة البطاقة</p>
                              <a href={fixImg(selectedUserForDetails.profile.nidImage)} target="_blank" rel="noopener noreferrer">
                                <img src={fixImg(selectedUserForDetails.profile.nidImage)} alt="NID" className="w-full h-40 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                              </a>
                            </div>
                          )}
                          {selectedUserForDetails.profile.socialProofImage && (
                            <div className="border border-slate-200 rounded-xl p-3">
                              <p className="text-xs font-semibold text-slate-600 mb-2">البحث الاجتماعي</p>
                              <a href={fixImg(selectedUserForDetails.profile.socialProofImage)} target="_blank" rel="noopener noreferrer">
                                <img src={fixImg(selectedUserForDetails.profile.socialProofImage)} alt="Social Proof" className="w-full h-40 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                    <button 
                      onClick={() => {
                        handleVerify(selectedUserForDetails.id, "approve");
                        setSelectedUserForDetails(null);
                      }} 
                      className="px-6 py-2 rounded-xl font-bold bg-sky-500 text-white hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> قبول وتفعيل
                    </button>
                    <button 
                      onClick={() => {
                        handleVerify(selectedUserForDetails.id, "ban");
                        setSelectedUserForDetails(null);
                      }} 
                      className="px-6 py-2 rounded-xl font-bold border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> رفض وحظر
                    </button>
                  </div>
                      </>
                    );
                  })()}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}
