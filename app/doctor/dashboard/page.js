"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardShell, { StatCard, EmptyState, useAuth, pageVariants } from "../../../components/dashboard/DashboardShell";
import {
  LayoutDashboard, Stethoscope, ClipboardList, Bell, Clock,
  CheckCircle2, Calendar, User, ChevronRight, Send,
  ArrowLeft, Sparkles, TrendingUp, X, UserCheck, FileText, Headset, Heart
} from "lucide-react";

import UserProfile from "../../../components/dashboard/UserProfile";
import Settings from "../../../components/dashboard/Settings";
import UrgentCaseModal from "../../../components/dashboard/UrgentCaseModal";
import Tilt from "react-parallax-tilt";
import RoleInstructions from "../../../components/dashboard/RoleInstructions";
import ModernNotifications from "../../../components/dashboard/ModernNotifications";
import TicketSystem from "../../../components/dashboard/TicketSystem";

const navItems = [
  { id: "overview",  label: "نظرة عامة",   icon: LayoutDashboard },
  { id: "urgent",    label: "نداءات الطوارئ", icon: Bell },
  { id: "available", label: "طلبات متاحة",  icon: ClipboardList },
  { id: "appointments", label: "حجوزات العيادة", icon: Calendar },
  { id: "support",   label: "الدعم الفني",  icon: Headset },
  { id: "notif",     label: "الإشعارات",   icon: Bell },
  { id: "profile",   label: "ملفي الشخصي",  icon: User },
  { id: "settings",  label: "الإعدادات",   icon: Sparkles },
];

export default function DoctorDashboard() {
  const { userName, isReady } = useAuth("Doctor");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [available, setAvailable] = useState([]);
  const [urgentCases, setUrgentCases] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [respondForm, setRespondForm] = useState({ appointmentDate: "", doctorNotes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [targetTicketId, setTargetTicketId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [urgentDetail, setUrgentDetail] = useState(null);
  const [clinicAppointments, setClinicAppointments] = useState([]);

  useEffect(() => {
    if (!isReady) return;
    Promise.all([
      api.get("/Stats/doctor").then(r => setStats(r.data)).catch(() => {}),
      api.get("/MedicalRequests/for-doctor").then(r => setAvailable(r.data)).catch(() => {}),
      api.get("/Stats/urgent-cases/doctor").then(r => setUrgentCases(r.data)).catch(() => {}),
      api.get("/Support/notifs").then(r => setNotifs(r.data)).catch(() => {}),
      api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {}),
      api.get("/ClinicAppointments/my-appointments").then(r => setClinicAppointments(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isReady]);

  const handleRespond = async (reqId) => {
    if (!respondForm.appointmentDate) { toast.error("حدد موعد الكشف"); return; }
    setSubmitting(true);
    try {
      await api.post(`/MedicalRequests/respond/${reqId}`, {
        appointmentDate: new Date(respondForm.appointmentDate).toISOString(),
        doctorNotes: respondForm.doctorNotes
      });
      toast.success("✅ تم قبول الطلب وتحديد الموعد");
      setAvailable(a => a.filter(r => r.id !== reqId));
      setRespondingTo(null);
      setRespondForm({ appointmentDate: "", doctorNotes: "" });
      setStats(s => s ? { ...s, acceptedConsultations: s.acceptedConsultations + 1, availableConsultations: Math.max(0, s.availableConsultations - 1) } : s);
    } catch (err) { toast.error(err.response?.data?.message || err.response?.data || "حدث خطأ"); }
    finally { setSubmitting(false); }
  };

  const viewDetail = async (reqId) => {
    try {
      const r = await api.get(`/MedicalRequests/detail/${reqId}`);
      setSelectedDetail(r.data);
    } catch { toast.error("لا يمكن عرض التفاصيل"); }
  };

  const markRead = async (id) => {
    await api.patch(`/Support/mark-read/${id}`).catch(() => {});
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  if (!isReady) return <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]"><div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /></div>;

  const unread = notifs.filter(n => !n.isRead).length;
  const pendingAppts = clinicAppointments.filter(a => a.status === "Pending").length;
  const navWithBadge = navItems.map(n => n.id === "notif" ? { ...n, badge: unread } : n.id === "available" ? { ...n, badge: available.length } : n.id === "urgent" ? { ...n, badge: urgentCases.length } : n.id === "appointments" ? { ...n, badge: pendingAppts } : n);

  const quickActions = [
    {
      id: "urgent", title: "حالات الطوارئ", subtitle: "حالات متأخرة تنتظر تدخلاً سريعاً",
      icon: Bell, gradient: "from-rose-500 via-orange-500 to-red-600", shadowColor: "shadow-rose-300",
      stat: urgentCases.length || 0, statLabel: "حالة طارئة", onClick: () => setTab("urgent"),
    },
    {
      id: "avail", title: "الطلبات المتاحة", subtitle: "طلبات استشارة في تخصصك ومحافظتك",
      icon: ClipboardList, gradient: "from-sky-500 via-orange-500 to-yellow-500", shadowColor: "shadow-sky-200",
      stat: stats?.availableConsultations || 0, statLabel: "طلب متاح", onClick: () => setTab("available"),
    },
    {
      id: "accepted", title: "الاستشارات المقبولة", subtitle: "استشارات قبلتها وتنتظر الموعد",
      icon: UserCheck, gradient: "from-sky-500 via-cyan-500 to-green-600", shadowColor: "shadow-sky-200",
      stat: stats?.acceptedConsultations || 0, statLabel: "مقبولة", onClick: () => setTab("available"),
    },
    {
      id: "notifs", title: "الإشعارات", subtitle: "تحديثات من المنصة والمرضى",
      icon: Bell, gradient: "from-sky-500 via-purple-500 to-indigo-600", shadowColor: "shadow-sky-200",
      stat: unread, statLabel: "غير مقروء", onClick: () => setTab("notif"),
    },
  ];

  return (
    <DashboardShell role="doctor" navItems={navWithBadge} activeTab={tab} onTabChange={setTab} userName={userName}>
      <ToastContainer position="top-center" rtl theme="colored" autoClose={3000} />

      {/* ══ Mdoals ══ */}
      {urgentDetail && (
        <UrgentCaseModal 
          urgentId={urgentDetail.id} 
          urgentType={urgentDetail.type} 
          role="Doctor" 
          onClose={() => setUrgentDetail(null)} 
          onClaimed={(id) => {
             setUrgentCases(prev => prev.filter(c => c.id != id));
             api.get("/Stats/doctor").then(r => setStats(r.data)).catch(() => {});
          }}
        />
      )}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedDetail(null)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6" dir="rtl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-900 text-lg">الملف الطبي</h3>
                <button onClick={() => setSelectedDetail(null)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {[["المريض", selectedDetail.patientName], ["التخصص", selectedDetail.specialtyName], ["الوصف", selectedDetail.description],
                  ["أمراض مزمنة", selectedDetail.hasChronicDisease ? "نعم" : "لا"], ["المحافظة", selectedDetail.governorate]
                ].filter(([,v]) => v).map(([l,v]) => (
                  <div key={l} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 font-medium">{l}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{v}</p>
                  </div>
                ))}
                {selectedDetail.medicalImagesUrls && selectedDetail.medicalImagesUrls.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 font-bold mb-2">صور طبية:</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedDetail.medicalImagesUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ OVERVIEW ══════════ */}
      <AnimatePresence mode="wait">
      {tab === "overview" && (
        <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-6 p-7 relative"
            style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0284c7 100%)" }}>
            <div className="absolute top-0 right-0 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute right-10 top-10 opacity-30">
              <Stethoscope className="w-12 h-12 text-sky-300" />
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute left-20 top-5 opacity-30">
              <Heart className="w-16 h-16 text-cyan-300" />
            </motion.div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                {profile?.profile?.profileImage ? (
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0 relative overflow-hidden">
                    <img src={profile.profile.profileImage.startsWith('http') ? profile.profile.profileImage : `http://localhost:5129/${profile.profile.profileImage.replace(/\\/g, '/')}`} alt={userName} className="w-full h-full object-cover rounded-xl" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg flex items-center justify-center flex-shrink-0 border border-white/30 text-white text-3xl font-black">
                    {userName?.charAt(0) || "د"}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-sky-300" /><span className="text-sky-300 text-sm font-semibold">مرحباً يا دكتور</span></div>
                  <h2 className="text-2xl font-black text-white mb-1">د. {userName} 👨‍⚕️</h2>
                  <p className="text-white/50 text-sm">{new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
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
          
          <RoleInstructions role="Doctor" />

          {/* Recent available */}
          {available.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><ClipboardList className="w-4 h-4" /></div>
                  <h3 className="font-bold text-slate-800 text-sm">أحدث الطلبات المتاحة</h3>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setTab("available")}
                  className="text-xs text-sky-600 font-bold bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                  عرض الكل <ChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
              {available.slice(0, 4).map((r, i) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-orange-400 text-white flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.patientName || "مريض"}</p>
                    <p className="text-[10px] text-slate-400">{r.specialtyName} — {new Date(r.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 border border-sky-200">قيد الانتظار</span>
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
          <p className="text-slate-400 text-sm mb-6">حالات متعثرة وخطيرة تحتاج لتدخل سريع</p>
          
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

      {/* ══════════ AVAILABLE ══════════ */}
      {tab === "available" && (
        <motion.div key="available" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">الطلبات المتاحة</h2>
          <p className="text-slate-400 text-sm mb-6">{available.length} طلب في تخصصك ومحافظتك</p>
          {available.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="لا توجد طلبات حالياً" subtitle="سيتم إشعارك عند وصول طلبات جديدة" />
          ) : (
            <div className="space-y-3">
              {available.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2 }} className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-orange-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg"><User className="w-5 h-5" /></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{r.patientName || "مريض"}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description || "لا يوجد وصف"}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                          {r.specialtyName && <span className="font-semibold text-sky-600">{r.specialtyName}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {respondingTo === r.id ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">تاريخ ووقت الموعد *</label>
                        <input type="datetime-local" required value={respondForm.appointmentDate}
                          onChange={e => setRespondForm(p => ({ ...p, appointmentDate: e.target.value }))}
                          className="w-full bg-white border-2 border-slate-200 text-sm rounded-xl p-2.5 focus:ring-0 focus:border-sky-400" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">ملاحظات للمريض (اختياري)</label>
                        <textarea value={respondForm.doctorNotes} onChange={e => setRespondForm(p => ({ ...p, doctorNotes: e.target.value }))}
                          rows={2} placeholder="مثل: يرجى إحضار التحاليل السابقة..."
                          className="w-full bg-white border-2 border-slate-200 text-sm rounded-xl p-2.5 focus:ring-0 focus:border-sky-400 resize-none" />
                      </div>
                      <div className="flex gap-2">
                        <motion.button disabled={submitting} whileTap={{ scale: 0.97 }} onClick={() => handleRespond(r.id)}
                          className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #10b981, #34d399)" }}>
                          {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-3.5 h-3.5" /> تأكيد القبول</>}
                        </motion.button>
                        <button onClick={() => setRespondingTo(null)} className="px-4 py-2.5 rounded-xl text-slate-500 font-bold text-sm bg-slate-200 hover:bg-slate-300 transition-colors">إلغاء</button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex border-t border-slate-100">
                      <motion.button whileHover={{ backgroundColor: "#f0fdf4" }} whileTap={{ scale: 0.98 }} onClick={() => viewDetail(r.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-sky-600 transition-colors border-l border-slate-100">
                        <FileText className="w-4 h-4" /> الملف الطبي
                      </motion.button>
                      <motion.button whileHover={{ backgroundColor: "#f0fdf4" }} whileTap={{ scale: 0.98 }} onClick={() => setRespondingTo(r.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-sky-600 transition-colors">
                        <CheckCircle2 className="w-4 h-4" /> قبول وتحديد موعد
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
            accent="emerald"
            onNotificationClick={(n) => {
              if (n.actionUrl && n.actionUrl.includes("urgent-case")) {
                const params = new URLSearchParams(n.actionUrl.split("?")[1]);
                const type = params.get('type') || 'Unknown';
                setSelectedUrgentNotif({ id: n.id, type });
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
          <UserProfile profileData={profile} stats={stats} role="Doctor" />
        </motion.div>
      )}

      {/* ════════════ SUPPORT TICKETS ════════════ */}
      {tab === "support" && (
        <motion.div key="support" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <TicketSystem isAdmin={false} targetTicketId={targetTicketId} />
        </motion.div>
      )}

      {/* ════════════ CLINIC APPOINTMENTS ════════════ */}
      {tab === "appointments" && (
        <motion.div key="appointments" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-800">حجوزات العيادة</h2>
              <span className="text-sm text-slate-400">{clinicAppointments.length} حجز</span>
            </div>

            {clinicAppointments.length === 0 ? (
              <EmptyState icon={Calendar} title="لا توجد حجوزات" subtitle="الحجوزات الواردة ستظهر هنا" />
            ) : (
              <div className="grid gap-4">
                {clinicAppointments.map((appt) => {
                  const statusMap = {
                    Pending: { label: "في الانتظار", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
                    Confirmed: { label: "مؤكد", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
                    Cancelled: { label: "ملغى", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
                  };
                  const st = statusMap[appt.status] || statusMap.Pending;

                  return (
                    <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">
                            {appt.patientName?.charAt(0) || "م"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{appt.patientName}</p>
                            <p className="text-sm text-slate-400" dir="ltr">{appt.patientPhone}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                          {st.label}
                        </span>
                      </div>

                      {appt.notes && (
                        <p className="text-sm text-slate-500 mt-3 bg-slate-50 p-3 rounded-xl">{appt.notes}</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 inline ml-1" />
                          {new Date(appt.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>

                        {appt.status === "Pending" && (
                          <div className="flex gap-2">
                            <motion.button whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                try {
                                  await api.put(`/ClinicAppointments/${appt.id}/status`, { status: "Confirmed" });
                                  setClinicAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: "Confirmed" } : a));
                                  toast.success("تم تأكيد الحجز");
                                } catch { toast.error("حدث خطأ"); }
                              }}
                              className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors">
                              <CheckCircle2 className="w-3.5 h-3.5" /> تأكيد
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                try {
                                  await api.put(`/ClinicAppointments/${appt.id}/status`, { status: "Cancelled" });
                                  setClinicAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: "Cancelled" } : a));
                                  toast.info("تم إلغاء الحجز");
                                } catch { toast.error("حدث خطأ"); }
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-500 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors border border-rose-200">
                              <X className="w-3.5 h-3.5" /> رفض
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ════════════ SETTINGS ════════════ */}
      {tab === "settings" && (
        <motion.div key="settings" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <Settings profileData={profile} refetchProfile={() => api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {})} />
        </motion.div>
      )}
      </AnimatePresence>
    </DashboardShell>
  );
}
