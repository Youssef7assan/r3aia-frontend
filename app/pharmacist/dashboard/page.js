"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import extractError from "../../../lib/extractError";
import DashboardShell, { StatCard, EmptyState, useAuth, pageVariants } from "../../../components/dashboard/DashboardShell";
import {
  LayoutDashboard, Pill, ClipboardList, Bell, Clock,
  CheckCircle2, Calendar, ChevronRight, Image,
  Package, ShoppingBag, ArrowLeft, Sparkles, TrendingUp, User, Headset
} from "lucide-react";

import UserProfile from "../../../components/dashboard/UserProfile";
import UrgentCaseModal from "../../../components/dashboard/UrgentCaseModal";
import Tilt from "react-parallax-tilt";
import RoleInstructions from "../../../components/dashboard/RoleInstructions";
import ModernNotifications from "../../../components/dashboard/ModernNotifications";
import TicketSystem from "../../../components/dashboard/TicketSystem";

const navItems = [
  { id: "overview", label: "نظرة عامة",   icon: LayoutDashboard },
  { id: "urgent",    label: "نداءات الطوارئ", icon: Bell },
  { id: "open",     label: "طلبات متاحة", icon: ClipboardList },
  { id: "support",  label: "الدعم الفني",  icon: Headset },
  { id: "notif",    label: "الإشعارات",   icon: Bell },
  { id: "profile",  label: "ملفي الشخصي",  icon: User },
  { id: "settings", label: "الإعدادات",   icon: Sparkles },
];

export default function PharmacistDashboard() {
  const { userName, isReady } = useAuth("Pharmacist");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [openReqs, setOpenReqs] = useState([]);
  const [urgentCases, setUrgentCases] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [targetTicketId, setTargetTicketId] = useState(null);
  const [urgentDetail, setUrgentDetail] = useState(null);

  useEffect(() => {
    if (!isReady) return;
    Promise.all([
      api.get("/Stats/pharmacy").then(r => setStats(r.data)).catch(() => {}),
      api.get("/MedicineRequests/open").then(r => setOpenReqs(r.data)).catch(() => {}),
      api.get("/Stats/urgent-cases/pharmacist").then(r => setUrgentCases(r.data)).catch(() => {}),
      api.get("/Support/notifs").then(r => setNotifs(r.data)).catch(() => {}),
      api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isReady]);

  const handleAccept = async (id) => {
    setSubmitting(true);
    try {
      await api.post(`/MedicineRequests/accept/${id}`, { pharmacyNotes: notes || null });
      toast.success("✅ تم قبول الطلب — الدواء جاهز");
      setOpenReqs(r => r.filter(x => x.id !== id));
      setAcceptingId(null); setNotes("");
      setStats(s => s ? { ...s, fulfilledRequests: s.fulfilledRequests + 1, availableRequests: Math.max(0, s.availableRequests - 1) } : s);
    } catch (err) { toast.error(extractError(err, "فشل قبول طلب الدواء")); }
    finally { setSubmitting(false); }
  };

  const markRead = async (id) => {
    await api.patch(`/Support/mark-read/${id}`).catch(() => {});
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  if (!isReady) return <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]"><div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /></div>;

  const unread = notifs.filter(n => !n.isRead).length;
  const navWithBadge = navItems.map(n => n.id === "notif" ? { ...n, badge: unread } : n.id === "open" ? { ...n, badge: openReqs.length } : n.id === "urgent" ? { ...n, badge: urgentCases.length } : n);

  const quickActions = [
    {
      id: "urgent", title: "حالات الطوارئ", subtitle: "حالات متأخرة تنتظر تدخلاً سريعاً",
      icon: Bell, gradient: "from-rose-500 via-orange-500 to-red-600", shadowColor: "shadow-rose-300",
      stat: urgentCases.length || 0, statLabel: "حالة طارئة", onClick: () => setTab("urgent"),
    },
    {
      id: "open", title: "طلبات متاحة", subtitle: "طلبات دواء في محافظتك تنتظر التوفير",
      icon: ClipboardList, gradient: "from-sky-500 via-orange-500 to-yellow-500", shadowColor: "shadow-sky-200",
      stat: stats?.availableRequests || 0, statLabel: "طلب متاح", onClick: () => setTab("open"),
    },
    {
      id: "done", title: "تم التوفير", subtitle: "طلبات وفّرت لها الدواء بنجاح",
      icon: CheckCircle2, gradient: "from-sky-500 via-cyan-500 to-green-600", shadowColor: "shadow-sky-200",
      stat: stats?.fulfilledRequests || 0, statLabel: "طلب مكتمل", onClick: () => {},
    },
    {
      id: "notifs", title: "الإشعارات", subtitle: "تحديثات من المنصة",
      icon: Bell, gradient: "from-sky-500 via-purple-500 to-indigo-600", shadowColor: "shadow-sky-200",
      stat: unread, statLabel: "غير مقروء", onClick: () => setTab("notif"),
    },
  ];

  return (
    <DashboardShell role="pharmacist" navItems={navWithBadge} activeTab={tab} onTabChange={setTab} userName={userName}>
      <ToastContainer position="top-center" rtl theme="colored" autoClose={3000} />

      {urgentDetail && (
        <UrgentCaseModal 
          urgentId={urgentDetail.id} 
          urgentType={urgentDetail.type} 
          role="Pharmacy" 
          onClose={() => setUrgentDetail(null)} 
          onClaimed={(id) => {
             setUrgentCases(prev => prev.filter(c => c.id != id));
             api.get("/Stats/pharmacy").then(r => setStats(r.data)).catch(() => {});
          }}
        />
      )}

      {/* ══════════ OVERVIEW ══════════ */}
      {tab === "overview" && (
        <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-6 p-7 relative"
            style={{ background: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #78350f 100%)" }}>
            <div className="absolute top-0 right-0 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute right-10 top-10 opacity-30">
              <Pill className="w-12 h-12 text-sky-300" />
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute left-20 top-5 opacity-30">
              <Package className="w-16 h-16 text-yellow-300" />
            </motion.div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-sky-300" /><span className="text-sky-300 text-sm font-semibold">مرحباً بك</span></div>
              <h2 className="text-2xl font-black text-white mb-1">{userName} 💊</h2>
              <p className="text-white/50 text-sm">{new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-sky-500" /> إجراءات سريعة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Tilt key={action.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.03} transitionSpeed={2500} className="h-full">
                    <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                      whileHover={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }} whileTap={{ scale: 0.97 }}
                      onClick={action.onClick}
                      className={`relative group bg-white rounded-2xl p-5 text-right shadow-sm ${action.shadowColor} border border-slate-100/80 overflow-hidden transition-all w-full h-full`}>
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient}`} />
                      <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1">{action.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{action.subtitle}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div><span className="text-lg font-black text-slate-900">{action.stat}</span><span className="text-[10px] text-slate-400 mr-1">{action.statLabel}</span></div>
                          <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-600 transition-all"><ArrowLeft className="w-4 h-4" /></div>
                        </div>
                      </div>
                    </motion.button>
                  </Tilt>
                );
              })}
            </div>
          </div>
          
          <RoleInstructions role="Pharmacist" />
        </motion.div>
      )}

      {/* ══════════ URGENT CASES ══════════ */}
      {tab === "urgent" && (
        <motion.div key="urgent" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
            نداءات الطوارئ <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>
          </h2>
          <p className="text-slate-400 text-sm mb-6">أدوية مطلوبة لحالات خطيرة أو متعثرة وتنتظر التوفير</p>
          
          {urgentCases.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="لا توجد نداءات حالياً" subtitle="الوضع مستقر بفضل جهودكم" />
          ) : (
            <div className="space-y-3">
              {urgentCases.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow border border-rose-100 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 bottom-0 w-1 bg-rose-500"></div>
                  <div className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 animate-pulse"><Bell className="w-6 h-6" /></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                          {r.patientName || "مريض"}
                          <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">SOS</span>
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{r.patientGovernorate} - {r.patientCity}</p>
                      </div>
                      <button onClick={() => setUrgentDetail({ type: r.type, id: r.id })} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 transition-all flex items-center gap-2 whitespace-nowrap">
                        معاينة التفاصيل <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════ OPEN REQUESTS ══════════ */}
      {tab === "open" && (
        <motion.div key="open" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">طلبات الأدوية المتاحة</h2>
          <p className="text-slate-400 text-sm mb-6">{openReqs.length} طلب في محافظتك</p>
          {openReqs.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="لا توجد طلبات حالياً" subtitle="ستصلك إشعارات عند وصول طلبات جديدة" />
          ) : (
            <div className="space-y-3">
              {openReqs.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }} className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-yellow-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><Pill className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900">{r.patientName || "مريض"}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">طلب #{r.id}</span>
                          {r.needDelivery && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">🚚 يحتاج توصيل</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                          {r.patientPhone && <span className="flex items-center gap-1 text-sky-600 font-semibold">📱 {r.patientPhone}</span>}
                        </div>
                        {(r.patientGovernorate || r.patientCity || r.patientAddress) && (
                          <div className="mt-2 text-xs font-semibold text-slate-600 flex items-center gap-1">
                            📍 {[r.patientGovernorate, r.patientCity, r.patientAddress].filter(Boolean).join(" - ")}
                          </div>
                        )}
                        {r.prescriptionImageUrl && (
                          <a href={r.prescriptionImageUrl.startsWith('http') ? r.prescriptionImageUrl : `http://localhost:5129/${r.prescriptionImageUrl.replace(/\\/g, '/')}`} 
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-3 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2 hover:bg-sky-100 transition-colors group">
                            <Image className="w-4 h-4 text-sky-500" />
                            <span className="text-xs text-sky-700 font-bold">عرض صورة الروشتة</span>
                            <img src={r.prescriptionImageUrl.startsWith('http') ? r.prescriptionImageUrl : `http://localhost:5129/${r.prescriptionImageUrl.replace(/\\/g, '/')}`} 
                              alt="روشتة" className="w-12 h-12 rounded-lg object-cover border border-sky-200" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {acceptingId === r.id ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">ملاحظات (اختياري)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="مثل: الدواء متوفر، يمكن الاستلام..."
                          className="w-full bg-white border-2 border-slate-200 text-sm rounded-xl p-2.5 focus:ring-0 focus:border-sky-400 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <motion.button disabled={submitting} whileTap={{ scale: 0.97 }} onClick={() => handleAccept(r.id)}
                          className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
                          {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5" /> تأكيد التوفير</>}
                        </motion.button>
                        <button onClick={() => { setAcceptingId(null); setNotes(""); }} className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-sm bg-slate-200 hover:bg-slate-300 transition-colors">إلغاء</button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex border-t border-slate-100">
                      <motion.button whileHover={{ backgroundColor: "#fffbeb" }} whileTap={{ scale: 0.98 }} onClick={() => setAcceptingId(r.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-sky-600 transition-colors"><ShoppingBag className="w-4 h-4" /> توفير الدواء</motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════ NOTIFICATIONS ══════════ */}
      {tab === "notif" && (
        <motion.div key="notif" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">الإشعارات</h2>
          <ModernNotifications
            notifs={notifs}
            markRead={markRead}
            accent="amber"
            onNotificationClick={(n) => {
              if (n.actionUrl && n.actionUrl.includes("urgent-case")) {
                const params = new URLSearchParams(n.actionUrl.split("?")[1]);
                setUrgentDetail({ type: params.get("type") || "Medicine", id: params.get("id") });
                setTab("urgent");
              } else if (n.actionUrl && n.actionUrl.startsWith("ticket")) {
                const urlParams = new URLSearchParams(n.actionUrl.split("?")[1]);
                const tId = urlParams.get("id");
                if (tId) setTargetTicketId(Number(tId));
                setTab("support");
              }
            }}
          />
        </motion.div>
      )}

      {/* ════════════ PROFILE ════════════ */}
      {tab === "profile" && (
        <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <UserProfile profileData={profile} stats={stats} role="Pharmacist" />
        </motion.div>
      )}

      {/* ════════════ SUPPORT TICKETS ════════════ */}
      {tab === "support" && (
        <motion.div key="support" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <TicketSystem isAdmin={false} targetTicketId={targetTicketId} />
        </motion.div>
      )}

      {/* ════════════ SETTINGS ════════════ */}
      {tab === "settings" && (
        <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Settings profileData={profile} refetchProfile={() => api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {})} />
        </motion.div>
      )}
    </DashboardShell>
  );
}
