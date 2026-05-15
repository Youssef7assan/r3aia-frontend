"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardShell, { StatCard, EmptyState, useAuth, pageVariants } from "../../../components/dashboard/DashboardShell";
import {
  LayoutDashboard, Truck, ClipboardList, Bell, Clock,
  CheckCircle2, Calendar, MapPin, ChevronRight,
  Package, HandHeart, User, ArrowLeft, Sparkles, TrendingUp, Headset
} from "lucide-react";

import UserProfile from "../../../components/dashboard/UserProfile";
import UrgentCaseModal from "../../../components/dashboard/UrgentCaseModal";
import Tilt from "react-parallax-tilt";
import RoleInstructions from "../../../components/dashboard/RoleInstructions";
import ModernNotifications from "../../../components/dashboard/ModernNotifications";
import TicketSystem from "../../../components/dashboard/TicketSystem";

const navItems = [
  { id: "overview",  label: "نظرة عامة",   icon: LayoutDashboard },
  { id: "urgent",    label: "نداءات الطوارئ", icon: Bell },
  { id: "available", label: "مهام متاحة",   icon: ClipboardList },
  { id: "my-tasks",  label: "مهامي",      icon: Truck },
  { id: "support",   label: "الدعم الفني", icon: Headset },
  { id: "notif",     label: "الإشعارات",   icon: Bell },
  { id: "profile",   label: "ملفي الشخصي",  icon: User },
  { id: "settings",  label: "الإعدادات",   icon: Sparkles },
];

export default function VolunteerDashboard() {
  const { userName, isReady } = useAuth("Volunteer");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [availTasks, setAvailTasks] = useState([]);
  const [urgentCases, setUrgentCases] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetTicketId, setTargetTicketId] = useState(null);
  const [urgentDetail, setUrgentDetail] = useState(null);

  useEffect(() => {
    if (!isReady) return;
    Promise.all([
      api.get("/Stats/volunteer").then(r => setStats(r.data)).catch(() => {}),
      api.get("/Delivery/available").then(r => setAvailTasks(r.data)).catch(() => {}),
      api.get("/Stats/urgent-cases/volunteer").then(r => setUrgentCases(r.data)).catch(() => {}),
      api.get("/Delivery/my-tasks").then(r => setMyTasks(r.data)).catch(() => {}),
      api.get("/Support/notifs").then(r => setNotifs(r.data)).catch(() => {}),
      api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isReady]);

  const handleAccept = async (taskId) => {
    try {
      await api.post("/Delivery/accept", { taskId });
      toast.success("✅ تم قبول مهمة التوصيل بنجاح");
      setAvailTasks(t => t.filter(x => x.id !== taskId));
      api.get("/Delivery/my-tasks").then(r => setMyTasks(r.data)).catch(() => {});
      setStats(s => s ? { ...s, myTasks: s.myTasks + 1, availableTasks: Math.max(0, s.availableTasks - 1) } : s);
    } catch (err) { toast.error(err.response?.data?.message || err.response?.data || "حدث خطأ"); }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.put("/Delivery/status", { taskId, status: newStatus });
      toast.success("✅ تم تحديث حالة المهمة");
      api.get("/Delivery/my-tasks").then(r => setMyTasks(r.data)).catch(() => {});
      api.get("/Stats/volunteer").then(r => setStats(r.data)).catch(() => {});
    } catch (err) { toast.error(err.response?.data?.message || err.response?.data || "حدث خطأ"); }
  };

  const markRead = async (id) => {
    await api.patch(`/Support/mark-read/${id}`).catch(() => {});
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  if (!isReady) return <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]"><div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" /></div>;

  const unread = notifs.filter(n => !n.isRead).length;
  const navWithBadge = navItems.map(n => n.id === "notif" ? { ...n, badge: unread } : n.id === "available" ? { ...n, badge: availTasks.length } : n.id === "urgent" ? { ...n, badge: urgentCases.length } : n);

  const quickActions = [
    {
      id: "urgent", title: "حالات الطوارئ", subtitle: "حالات متأخرة تنتظر تدخلاً سريعاً",
      icon: Bell, gradient: "from-rose-500 via-orange-500 to-red-600", shadowColor: "shadow-rose-300",
      stat: urgentCases.length || 0, statLabel: "حالة طارئة", onClick: () => setTab("urgent"),
    },
    {
      id: "avail", title: "مهام التوصيل المتاحة", subtitle: "أدوية جاهزة تنتظر التوصيل للمرضى",
      icon: ClipboardList, gradient: "from-sky-500 via-orange-500 to-yellow-500", shadowColor: "shadow-sky-200",
      stat: stats?.availableTasks || 0, statLabel: "مهمة متاحة", onClick: () => setTab("available"),
    },
    {
      id: "my", title: "مهامي الحالية", subtitle: "مهام قبلتها وتعمل على توصيلها",
      icon: Truck, gradient: "from-rose-500 via-pink-500 to-red-600", shadowColor: "shadow-rose-200",
      stat: stats?.myTasks || 0, statLabel: "مهمة نشطة", onClick: () => setTab("my-tasks"),
    },
    {
      id: "notifs", title: "الإشعارات", subtitle: "تحديثات من المنصة والمرضى",
      icon: Bell, gradient: "from-sky-500 via-purple-500 to-indigo-600", shadowColor: "shadow-sky-200",
      stat: unread, statLabel: "غير مقروء", onClick: () => setTab("notif"),
    },
  ];

  return (
    <DashboardShell role="volunteer" navItems={navWithBadge} activeTab={tab} onTabChange={setTab} userName={userName}>
      <ToastContainer position="top-center" rtl theme="colored" autoClose={3000} />

      {urgentDetail && (
        <UrgentCaseModal 
          urgentId={urgentDetail.id} 
          urgentType={urgentDetail.type} 
          role="Volunteer" 
          onClose={() => setUrgentDetail(null)} 
          onClaimed={(id) => {
             setUrgentCases(prev => prev.filter(c => c.id != id));
             api.get("/Stats/volunteer").then(r => setStats(r.data)).catch(() => {});
          }}
        />
      )}

      {/* ══════════ OVERVIEW ══════════ */}
      {tab === "overview" && (
        <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-6 p-7 relative"
            style={{ background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #881337 100%)" }}>
            <div className="absolute top-0 right-0 w-60 h-60 bg-rose-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-400/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute right-10 top-10 opacity-30">
              <Truck className="w-12 h-12 text-rose-300" />
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute left-20 top-5 opacity-30">
              <HandHeart className="w-16 h-16 text-pink-300" />
            </motion.div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-rose-300" /><span className="text-rose-300 text-sm font-semibold">أهلاً بالمتطوع</span></div>
              <h2 className="text-2xl font-black text-white mb-1">{userName} 🤝</h2>
              <p className="text-white/50 text-sm">{new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-rose-500" /> إجراءات سريعة</h3>
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
          
          <RoleInstructions role="Volunteer" />

          {/* Recent available tasks */}
          {availTasks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center"><Truck className="w-4 h-4" /></div>
                  <h3 className="font-bold text-slate-800 text-sm">أحدث مهام التوصيل</h3>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setTab("available")}
                  className="text-xs text-rose-600 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  عرض الكل <ChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
              {availTasks.slice(0, 4).map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white flex items-center justify-center flex-shrink-0"><Package className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{t.patientName || `مهمة #${t.id}`}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">{t.pharmacyName && <><MapPin className="w-2.5 h-2.5" />{t.pharmacyName}</>}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-200">متاح</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ══════════ URGENT CASES ══════════ */}
      {tab === "urgent" && (
        <motion.div key="urgent" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
            نداءات الطوارئ <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span></span>
          </h2>
          <p className="text-slate-400 text-sm mb-6">أدوية جاهزة للحالات المتعثرة تحتاج توصيل طارئ</p>
          
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

      {/* ══════════ AVAILABLE TASKS ══════════ */}
      {tab === "available" && (
        <motion.div key="available" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">مهام التوصيل المتاحة</h2>
          <p className="text-slate-400 text-sm mb-6">{availTasks.length} مهمة</p>
          {availTasks.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="لا توجد مهام حالياً" subtitle="عمل رائع! كل المهام تم التعامل معها 🎉" />
          ) : (
            <div className="space-y-3">
              {availTasks.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><Package className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">مهمة توصيل #{t.id}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">متاح</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                          {t.patientName && <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.patientName}</span>}
                          {t.pharmacyName && <span className="flex items-center gap-1 text-sky-600 font-semibold">📍 {t.pharmacyName}</span>}
                          {t.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{t.address}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(t.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══════════ MY TASKS ══════════ */}
      {tab === "my-tasks" && (
        <motion.div key="my-tasks" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">مهامي الحالية</h2>
          <p className="text-slate-400 text-sm mb-6">{myTasks.length} مهمة</p>
          {myTasks.length === 0 ? (
            <EmptyState icon={Truck} title="ليس لديك مهام نشطة حالياً" subtitle="اذهب لعلامة التبويب 'مهام متاحة' لقبول طلبات جديدة! 🚚" />
          ) : (
            <div className="space-y-3">
              {myTasks.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${t.taskStatus === "Delivered" ? "border-sky-200" : "border-slate-100/80"}`}>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg text-white ${t.taskStatus === "Delivered" ? "bg-gradient-to-br from-sky-500 to-cyan-400" : "bg-gradient-to-br from-rose-500 to-pink-400"}`}>
                        {t.taskStatus === "Delivered" ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">مهمة توصيل #{t.id}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            t.taskStatus === "Delivered" ? "bg-sky-50 text-sky-600 border-sky-200" :
                            "bg-sky-50 text-sky-600 border-sky-200"
                          }`}>{t.taskStatus === "Delivered" ? "تم التوصيل" : t.taskStatus === "Taken" ? "في الانتظار" : "جاري التوصيل"}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                          {t.patientName && <span className="flex items-center gap-1"><User className="w-3 h-3" />{t.patientName}</span>}
                          {t.pharmacyName && <span className="flex items-center gap-1 text-sky-600 font-semibold">📍 استلام من: {t.pharmacyName}</span>}
                          {t.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />توصيل إلى: {t.address}</span>}
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(t.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {t.taskStatus !== "Delivered" && (
                    <div className="flex border-t border-slate-100 bg-slate-50/50 p-3 gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleUpdateStatus(t.id, "OutForDelivery")}
                        disabled={t.taskStatus === "OutForDelivery"}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-sky-600 bg-sky-50 disabled:opacity-50 transition-colors border border-sky-100 disabled:bg-transparent">
                        <Truck className="w-4 h-4" /> جاري التوصيل (في الطريق)
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                         onClick={() => handleUpdateStatus(t.id, "Delivered")}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-sky-500 shadow-md shadow-sky-500/20 transition-all">
                        <CheckCircle2 className="w-4 h-4" /> تم التسليم بنجاح
                      </motion.button>
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
            accent="rose"
            onNotificationClick={(n) => {
              if (n.actionUrl && n.actionUrl.includes("urgent-case")) {
                const params = new URLSearchParams(n.actionUrl.split("?")[1]);
                setUrgentDetail({ type: params.get("type") || "Delivery", id: params.get("id") });
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
          <UserProfile profileData={profile} stats={stats} role="Volunteer" />
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
