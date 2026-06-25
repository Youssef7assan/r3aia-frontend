"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import extractError from "../../../lib/extractError";
import DashboardShell, { StatCard, EmptyState, useAuth, pageVariants } from "../../../components/dashboard/DashboardShell";
import {
  LayoutDashboard, Stethoscope, Pill, Bell, FileText, Clock,
  CheckCircle2, XCircle, Calendar, Plus, Heart, HeartPulse, Image as ImageIcon,
  ChevronRight, MessageSquare, Upload, ArrowLeft,
  Sparkles, TrendingUp, X, User as UserIcon, Activity, Headset
} from "lucide-react";

import UserProfile from "../../../components/dashboard/UserProfile";
import Settings from "../../../components/dashboard/Settings";
import Tilt from "react-parallax-tilt";
import RoleInstructions from "../../../components/dashboard/RoleInstructions";
import ModernNotifications from "../../../components/dashboard/ModernNotifications";
import TicketSystem from "../../../components/dashboard/TicketSystem";

const navItems = [
  { id: "overview", label: "نظرة عامة",    icon: LayoutDashboard },
  { id: "consult",  label: "استشاراتي",    icon: Stethoscope },
  { id: "medicine", label: "طلبات الأدوية", icon: Pill },
  { id: "donations",label: "التبرعات",      icon: Heart },
  { id: "support",  label: "الدعم الفني",  icon: Headset },
  { id: "notif",    label: "الإشعارات",    icon: Bell },
  { id: "profile",  label: "ملفي الشخصي",  icon: UserIcon },
  { id: "settings", label: "الإعدادات",    icon: Sparkles },
];

const statusMap = {
  Pending:   { label: "قيد الانتظار", color: "bg-sky-50 text-sky-600 border-sky-200" },
  Accepted:  { label: "تم القبول",   color: "bg-sky-50 text-sky-600 border-sky-200" },
  Completed: { label: "مكتمل",      color: "bg-sky-50 text-sky-600 border-sky-200" },
  Cancelled: { label: "ملغي",       color: "bg-rose-50 text-rose-500 border-rose-200" },
  Fulfilled: { label: "تم التوفير",  color: "bg-sky-50 text-sky-600 border-sky-200" },
};

export default function PatientDashboard() {
  const { userName, isReady } = useAuth("Patient");
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [medRequests, setMedRequests] = useState([]);
  const [medReqs, setMedReqs] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [specialties, setSpecialties] = useState([]);

  // ── New Request Modals ──
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [donateForm, setDonateForm] = useState({ amount: "", paymentMethod: "VodafoneCash", receiptImage: null });
  
  const [consultForm, setConsultForm] = useState({ specialtyId: "", description: "", medicalImages: [] });
  const [medicineForm, setMedicineForm] = useState({ prescriptionImage: null, needDelivery: false });
  const [submitting, setSubmitting] = useState(false);
  const [targetTicketId, setTargetTicketId] = useState(null);
  const fileInputRef = useRef(null);
  const medImgRef = useRef(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (!isReady) return;
    Promise.all([
      api.get("/Stats/patient").then(r => setStats(r.data)).catch(() => {}),
      api.get("/MedicalRequests/my-requests").then(r => setMedRequests(r.data)).catch(() => {}),
      api.get("/MedicineRequests/my-requests").then(r => setMedReqs(r.data)).catch(() => {}),
      api.get("/Donations/cases").then(r => setDonations(r.data)).catch(() => {}),
      api.get("/Support/notifs").then(r => setNotifs(r.data)).catch(() => {}),
      api.get("/Profiles/me").then(r => setProfile(r.data)).catch(() => {}),
      api.get("/Specialties").then(r => setSpecialties(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isReady]);

  // ── Create Consultation ──
  const handleCreateConsult = async (e) => {
    e.preventDefault();
    if (!consultForm.specialtyId) { toast.error("اختر التخصص"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("SpecialtyId", consultForm.specialtyId);
      fd.append("Description", consultForm.description);
      if (consultForm.medicalImages.length > 0) {
        consultForm.medicalImages.forEach(f => fd.append("MedicalImages", f));
      }
      await api.post("/MedicalRequests/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ تم إرسال طلب الاستشارة بنجاح");
      setShowConsultModal(false);
      setConsultForm({ specialtyId: "", description: "", medicalImages: [] });
      // Refresh
      api.get("/MedicalRequests/my-requests").then(r => setMedRequests(r.data)).catch(() => {});
      api.get("/Stats/patient").then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      toast.error(extractError(err, "فشل إرسال طلب الاستشارة"));
    } finally { setSubmitting(false); }
  };

  // ── Create Medicine Request ──
  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    if (!medicineForm.prescriptionImage) { toast.error("ارفع صورة الروشتة"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("PrescriptionImage", medicineForm.prescriptionImage);
      fd.append("NeedDelivery", medicineForm.needDelivery);
      await api.post("/MedicineRequests", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ تم إرسال طلب الدواء بنجاح");
      setShowMedicineModal(false);
      setMedicineForm({ prescriptionImage: null, needDelivery: false });
      api.get("/MedicineRequests/my-requests").then(r => setMedReqs(r.data)).catch(() => {});
      api.get("/Stats/patient").then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      toast.error(extractError(err, "فشل إرسال طلب الدواء"));
    } finally { setSubmitting(false); }
  };

  // ── Make Donation ──
  const handleDonate = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    if (!donateForm.amount || donateForm.amount <= 0) { toast.error("أدخل مبلغ التبرع"); return; }
    
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("CaseId", selectedCase.id);
      fd.append("Amount", donateForm.amount);
      fd.append("PaymentMethod", donateForm.paymentMethod);
      if (donateForm.receiptImage) {
        fd.append("ReceiptImage", donateForm.receiptImage);
      }
      
      await api.post("/Donations/pay", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ جزاك الله خيراً! تم تسجيل تبرعك وسيتم مراجعته.");
      setShowDonateModal(false);
      setSelectedCase(null);
      setDonateForm({ amount: "", paymentMethod: "VodafoneCash", receiptImage: null });
      api.get("/Donations/cases").then(r => setDonations(r.data)).catch(() => {});
    } catch (err) {
      toast.error(extractError(err, "فشل تسجيل التبرع"));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel Request ──
  const handleCancel = async (requestId) => {
    try {
      await api.post(`/MedicalRequests/cancel/${requestId}`, { cancellationReason: "إلغاء بواسطة المريض" });
      toast.success("تم إلغاء الطلب");
      setMedRequests(r => r.map(x => x.id === requestId ? { ...x, requestStatus: "Cancelled" } : x));
    } catch (err) { toast.error(extractError(err, "فشل إلغاء الطلب")); }
  };

  // ── Complete Request ──
  const handleComplete = async (requestId) => {
    try {
      await api.post(`/MedicalRequests/complete/${requestId}`);
      toast.success("تم تأكيد إتمام الكشف بنجاح! شكراً لك.");
      setMedRequests(r => r.map(x => x.id === requestId ? { ...x, requestStatus: "Completed" } : x));
    } catch (err) { toast.error(extractError(err, "فشل تأكيد الكشف")); }
  };

  const markRead = async (id) => {
    await api.patch(`/Support/mark-read/${id}`).catch(() => {});
    setNotifs(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  if (!isReady) return <div className="min-h-screen flex items-center justify-center bg-[#F4F6FB]"><div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" /></div>;

  const unread = notifs.filter(n => !n.isRead).length;
  const navWithBadge = navItems.map(n => n.id === "notif" ? { ...n, badge: unread } : n);

  // ── Quick Action Cards Data ──
  const quickActions = [
    {
      id: "new-consult",
      title: "طلب استشارة طبية",
      subtitle: "احجز موعد مع طبيب متخصص مجاناً",
      icon: Stethoscope,
      gradient: "from-sky-500 via-cyan-500 to-blue-600",
      shadowColor: "shadow-sky-200",
      stat: stats?.pendingRequests || 0,
      statLabel: "قيد الانتظار",
      onClick: () => setShowConsultModal(true),
    },
    {
      id: "new-medicine",
      title: "طلب أدوية",
      subtitle: "ارفع صورة الروشتة واحصل على دوائك",
      icon: Pill,
      gradient: "from-sky-500 via-cyan-500 to-green-600",
      shadowColor: "shadow-sky-200",
      stat: medReqs.filter(r => r.requestStatus === "Pending").length,
      statLabel: "طلب نشط",
      onClick: () => setShowMedicineModal(true),
    },
    {
      id: "my-consults",
      title: "استشاراتي",
      subtitle: "تابع حالة طلباتك والمواعيد",
      icon: FileText,
      gradient: "from-sky-500 via-purple-500 to-indigo-600",
      shadowColor: "shadow-sky-200",
      stat: medRequests.length,
      statLabel: "استشارة",
      onClick: () => setTab("consult"),
    },
    {
      id: "notifications",
      title: "الإشعارات",
      subtitle: "تحديثات من المنصة والأطباء",
      icon: Bell,
      gradient: "from-sky-500 via-orange-500 to-yellow-600",
      shadowColor: "shadow-sky-200",
      stat: unread,
      statLabel: "غير مقروء",
      onClick: () => setTab("notif"),
    },
  ];

  return (
    <DashboardShell role="patient" navItems={navWithBadge} activeTab={tab} onTabChange={setTab} userName={userName}>
      <ToastContainer position="top-center" rtl theme="colored" autoClose={3000} />

      {/* ══════ CONSULTATION MODAL ══════ */}
      <AnimatePresence>
        {showConsultModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowConsultModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" dir="rtl">
              <div className="p-1" style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
                <div className="bg-white rounded-t-[20px] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white flex items-center justify-center">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">طلب استشارة جديدة</h3>
                        <p className="text-xs text-slate-400">اختر التخصص واوصف حالتك</p>
                      </div>
                    </div>
                    <button onClick={() => setShowConsultModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateConsult} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">التخصص المطلوب *</label>
                      <select value={consultForm.specialtyId} onChange={e => setConsultForm(p => ({ ...p, specialtyId: e.target.value }))} required
                        className="w-full bg-slate-50 border-2 border-slate-200 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all">
                        <option value="">اختر التخصص</option>
                        {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">وصف الحالة *</label>
                      <textarea value={consultForm.description} onChange={e => setConsultForm(p => ({ ...p, description: e.target.value }))} required rows={3}
                        placeholder="اوصف أعراضك بالتفصيل..."
                        className="w-full bg-slate-50 border-2 border-slate-200 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-sky-400 focus:bg-white transition-all resize-none" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">صور طبية (اختياري)</label>
                      <div onClick={() => medImgRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all">
                        <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-400">{consultForm.medicalImages.length > 0 ? `${consultForm.medicalImages.length} صورة مختارة` : "اضغط لرفع صور"}</p>
                      </div>
                      <input ref={medImgRef} type="file" accept="image/*" multiple hidden
                        onChange={e => setConsultForm(p => ({ ...p, medicalImages: [...e.target.files] }))} />
                    </div>
                    <motion.button type="submit" disabled={submitting} whileHover={!submitting ? { scale: 1.02 } : {}} whileTap={!submitting ? { scale: 0.97 } : {}}
                      className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 disabled:opacity-70"
                      style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", boxShadow: "0 4px 20px rgba(14,165,233,0.35)" }}>
                      {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> إرسال الطلب</>}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ MEDICINE MODAL ══════ */}
      <AnimatePresence>
        {showMedicineModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowMedicineModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" dir="rtl">
              <div className="p-1" style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>
                <div className="bg-white rounded-t-[20px] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">طلب أدوية جديد</h3>
                        <p className="text-xs text-slate-400">ارفع صورة الروشتة</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMedicineModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateMedicine} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">صورة الروشتة *</label>
                      <div onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all">
                        {medicineForm.prescriptionImage ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-sky-500" />
                            <p className="text-sm text-sky-700 font-semibold">{medicineForm.prescriptionImage.name}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-400 font-medium">اضغط لرفع صورة الروشتة</p>
                            <p className="text-[10px] text-slate-300 mt-1">PNG, JPG حتى 10MB</p>
                          </>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" hidden
                        onChange={e => setMedicineForm(p => ({ ...p, prescriptionImage: e.target.files[0] }))} />
                    </div>
                    <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" checked={medicineForm.needDelivery}
                        onChange={e => setMedicineForm(p => ({ ...p, needDelivery: e.target.checked }))}
                        className="w-4 h-4 rounded accent-sky-500" />
                      <div>
                        <span className="text-sm font-bold text-slate-700">أحتاج توصيل للمنزل</span>
                        <p className="text-[10px] text-slate-400">سيتم تكليف متطوع لتوصيل الدواء مجاناً</p>
                      </div>
                    </label>
                    <motion.button type="submit" disabled={submitting} whileHover={!submitting ? { scale: 1.02 } : {}} whileTap={!submitting ? { scale: 0.97 } : {}}
                      className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 disabled:opacity-70"
                      style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)", boxShadow: "0 4px 20px rgba(16,185,129,0.35)" }}>
                      {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> إرسال الطلب</>}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ DONATE MODAL ══════ */}
      <AnimatePresence>
        {showDonateModal && selectedCase && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setShowDonateModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" dir="rtl">
              <div className="p-1" style={{ background: "linear-gradient(135deg, #f43f5e, #fbbf24)" }}>
                <div className="bg-white rounded-t-[20px] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-sky-500 text-white flex items-center justify-center">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg">تبرع للحالة</h3>
                        <p className="text-xs text-slate-400">{selectedCase.title}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowDonateModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">المبلغ (ج.م) *</label>
                      <input type="number" min="10" required value={donateForm.amount} onChange={e => setDonateForm({ ...donateForm, amount: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-200 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-rose-400 focus:bg-white transition-all font-bold"
                        placeholder="أدخل المبلغ..." />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">طريقة الدفع *</label>
                      <select value={donateForm.paymentMethod} onChange={e => setDonateForm({ ...donateForm, paymentMethod: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-200 text-sm rounded-2xl p-3.5 focus:ring-0 focus:border-rose-400 focus:bg-white transition-all font-bold">
                        <option value="VodafoneCash">فودافون كاش (01012345678)</option>
                        <option value="InstaPay">إنستاباي (r3aia@instapay)</option>
                        <option value="BankTransfer">تحويل بنكي</option>
                      </select>
                      <p className="text-xs text-rose-500 mt-2 bg-rose-50 p-2 rounded-lg font-semibold">
                        يرجى تحويل المبلغ أولاً ثم إرفاق صورة الإيصال.
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">إيصال الدفع (اختياري)</label>
                      <div onClick={() => receiptRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition-all">
                        {donateForm.receiptImage ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-rose-500" />
                            <p className="text-xs text-rose-700 font-bold">{donateForm.receiptImage.name}</p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                            <p className="text-xs text-slate-400 font-semibold">اضغط لرفع صورة إيصال التحويل</p>
                          </>
                        )}
                      </div>
                      <input ref={receiptRef} type="file" accept="image/*" hidden onChange={e => setDonateForm({ ...donateForm, receiptImage: e.target.files[0] })} />
                    </div>
                    <motion.button type="submit" disabled={submitting} whileHover={!submitting ? { scale: 1.02 } : {}} whileTap={!submitting ? { scale: 0.97 } : {}}
                      className="w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 disabled:opacity-70 mt-2"
                      style={{ background: "linear-gradient(135deg, #f43f5e, #fbbf24)", boxShadow: "0 4px 20px rgba(244,63,94,0.35)" }}>
                      {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Heart className="w-5 h-5" /> تسجيل التبرع</>}
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════ OVERVIEW ══════════════════ */}
      {tab === "overview" && (
        <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {/* Welcome Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden mb-6 p-7 relative"
            style={{ background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0c4a6e 100%)" }}>
            <div className="absolute top-0 right-0 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute right-10 top-10 opacity-30">
              <Heart className="w-12 h-12 text-rose-300" />
            </motion.div>
            <motion.div animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute left-20 top-5 opacity-30">
              <Activity className="w-16 h-16 text-sky-300" />
            </motion.div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300 text-sm font-semibold">مرحباً بعودتك</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-1">{userName} 👋</h2>
                <p className="text-white/50 text-sm">{new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              {profile && (
                <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><UserIcon className="w-4 h-4 text-white" /></div>
                  <div>
                    <p className="text-white text-xs font-bold">{profile.profile?.governorate || "—"}</p>
                    <p className="text-white/40 text-[10px]">{profile.isVerified ? "✅ حساب موثّق" : "⏳ بانتظار التوثيق"}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />)}</div>
          ) : stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon={FileText} label="إجمالي الطلبات" value={stats.totalRequests} gradient="from-sky-500 to-indigo-500" bg="bg-sky-50" iconColor="text-sky-600" />
              <StatCard icon={Clock} label="قيد الانتظار" value={stats.pendingRequests} gradient="from-sky-500 to-orange-500" bg="bg-sky-50" iconColor="text-sky-600" />
              <StatCard icon={CheckCircle2} label="تم القبول" value={stats.acceptedRequests} gradient="from-sky-500 to-cyan-500" bg="bg-sky-50" iconColor="text-sky-600" />
              <StatCard icon={Pill} label="طلبات أدوية" value={stats.medicineRequests} gradient="from-sky-500 to-cyan-500" bg="bg-sky-50" iconColor="text-sky-600" />
            </div>
          )}

          {/* ══════ QUICK ACTION CARDS ══════ */}
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" /> إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Tilt key={action.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.03} transitionSpeed={2500} className="h-full">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      whileHover={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={action.onClick}
                      className={`relative group bg-white rounded-2xl p-5 text-right shadow-sm ${action.shadowColor} border border-slate-100/80 overflow-hidden transition-all w-full h-full`}
                    >
                      {/* Gradient accent top */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient}`} />

                      {/* Glow on hover */}
                      <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Title & subtitle */}
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1">{action.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{action.subtitle}</p>

                        {/* Bottom: stat + arrow */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-lg font-black text-slate-900">{action.stat}</span>
                            <span className="text-[10px] text-slate-400 mr-1">{action.statLabel}</span>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-gradient-to-br group-hover:from-slate-100 group-hover:to-slate-50 flex items-center justify-center text-slate-300 group-hover:text-slate-600 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </Tilt>
                );
              })}
            </div>
          </div>
          
          <RoleInstructions role="Patient" />
          {/* Recent Consults */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Stethoscope className="w-4 h-4" /></div>
                <h3 className="font-bold text-slate-800 text-sm">آخر الاستشارات</h3>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setTab("consult")}
                className="text-xs text-sky-600 font-bold bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                عرض الكل <ChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
            {medRequests.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">لا توجد استشارات بعد — اطلب واحدة الآن!</p>
            ) : (
              <div>
                {medRequests.slice(0, 5).map((r, i) => {
                  const s = statusMap[r.requestStatus] || statusMap.Pending;
                  return (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{r.specialtyName || "استشارة طبية"}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{new Date(r.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ════════════ CONSULTATIONS ════════════ */}
      {tab === "consult" && (
        <motion.div key="consult" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">استشاراتي الطبية</h2>
              <p className="text-slate-400 text-sm mt-0.5">{medRequests.length} استشارة</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowConsultModal(true)}
              className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
              <Plus className="w-4 h-4" /> طلب جديد
            </motion.button>
          </div>
          {medRequests.length === 0 ? (
            <EmptyState icon={Stethoscope} title="لا توجد استشارات بعد" subtitle="اطلب استشارة طبية مجانية الآن" />
          ) : (
            <div className="space-y-3">
              {medRequests.map((r, i) => {
                const s = statusMap[r.requestStatus] || statusMap.Pending;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900">{r.specialtyName || "استشارة طبية"}</h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
                        </div>
                        {r.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.description}</p>}
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                          {r.doctorName && <span className="flex items-center gap-1 text-sky-600 font-semibold"><Stethoscope className="w-3 h-3" />د. {r.doctorName}</span>}
                          {r.appointmentDate && <span className="flex items-center gap-1 text-sky-600 font-semibold"><Clock className="w-3 h-3" />الموعد: {new Date(r.appointmentDate).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                        </div>
                        {r.clinicAddress && (
                          <div className="mt-2 text-xs font-semibold text-slate-600">
                            العنوان: {r.clinicAddress}
                          </div>
                        )}
                        {r.doctorNotes && (
                          <div className="mt-3 bg-sky-50 border border-sky-100 rounded-xl p-3">
                            <p className="text-xs text-sky-700 flex items-start gap-1"><MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />{r.doctorNotes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {r.requestStatus === "Pending" && (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => handleCancel(r.id)}
                              className="text-xs text-rose-500 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> إلغاء الطلب
                            </motion.button>
                          )}
                          {r.requestStatus === "Accepted" && (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              onClick={() => handleComplete(r.id)}
                              className="text-xs text-emerald-600 font-bold bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" /> تأكيد إتمام الكشف
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ════════════ MEDICINE ════════════ */}
      {tab === "medicine" && (
        <motion.div key="medicine" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">طلبات الأدوية</h2>
              <p className="text-slate-400 text-sm mt-0.5">{medReqs.length} طلب</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowMedicineModal(true)}
              className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl"
              style={{ background: "linear-gradient(135deg, #10b981, #14b8a6)" }}>
              <Plus className="w-4 h-4" /> طلب جديد
            </motion.button>
          </div>
          {medReqs.length === 0 ? (
            <EmptyState icon={Pill} title="لا توجد طلبات أدوية" subtitle="ارفع صورة الروشتة واحصل على دوائك مجاناً" />
          ) : (
            <div className="space-y-4">
              {medReqs.map((r, i) => {
                const s = statusMap[r.requestStatus || r.status] || statusMap.Pending;
                const imgUrl = r.prescriptionImageUrl ? (r.prescriptionImageUrl.startsWith('http') ? r.prescriptionImageUrl : `http://localhost:5129/${r.prescriptionImageUrl.replace(/\\/g, '/')}`) : null;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900">طلب دواء #{r.id}</h3>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${s.color}`}>{s.label}</span>
                          {r.needDelivery && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">🚚 توصيل</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                        
                        {/* صورة الروشتة */}
                        {imgUrl && (
                          <a href={imgUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors">
                            <ImageIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-xs text-slate-600 font-bold">عرض الروشتة</span>
                            <img src={imgUrl} alt="روشتة" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                          </a>
                        )}

                        {/* معلومات الصيدلية */}
                        {r.pharmacyName && (
                          <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                            <p className="text-[10px] text-emerald-500 font-bold mb-1">✅ الصيدلية التي وفّرت الدواء</p>
                            <p className="text-sm font-bold text-slate-800">{r.pharmacyName}</p>
                            {r.pharmacyAddress && <p className="text-xs text-slate-500 mt-0.5">📍 {r.pharmacyAddress}</p>}
                            {r.pharmacyPhone && <p className="text-xs text-sky-600 font-semibold mt-0.5">📱 {r.pharmacyPhone}</p>}
                            {r.pharmacyNotes && <p className="text-xs text-slate-600 mt-1 bg-white rounded-lg p-2 border border-emerald-100">💬 {r.pharmacyNotes}</p>}
                          </div>
                        )}

                        {/* معلومات المتطوع */}
                        {r.volunteerName && (
                          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                            <p className="text-[10px] text-amber-500 font-bold mb-1">🚚 متطوع التوصيل</p>
                            <p className="text-sm font-bold text-slate-800">{r.volunteerName}</p>
                            {r.volunteerPhone && <p className="text-xs text-sky-600 font-semibold mt-0.5">📱 {r.volunteerPhone}</p>}
                            {r.deliveryStatus && (
                              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                r.deliveryStatus === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                r.deliveryStatus === "OutForDelivery" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-sky-50 text-sky-600 border-sky-200"
                              }`}>{r.deliveryStatus === "Delivered" ? "تم التوصيل ✅" : r.deliveryStatus === "OutForDelivery" ? "في الطريق 🚚" : "المتطوع قبل المهمة"}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ════════════ DONATIONS ════════════ */}
      {tab === "donations" && (
        <motion.div key="donations" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">حالات التبرع الحرجة</h2>
              <p className="text-slate-400 text-sm mt-0.5">ساهم لتوفير احتياجات المرضى</p>
            </div>
          </div>
          {donations.length === 0 ? (
            <EmptyState icon={Heart} title="لا توجد حالات حالياً" subtitle="شكراً لاهتمامك، سيتم عرض الحالات فور توافرها." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donations.map((d, i) => {
                const isPaidOut = d.status === "Fulfilled";
                const progress = Math.min((d.collectedAmount / d.targetAmount) * 100, 100);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100/80 p-5 relative overflow-hidden flex flex-col">
                    {progress >= 100 && (
                      <div className="absolute top-4 left-4 bg-sky-100 text-sky-600 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 border border-sky-200 shadow-sm z-10">
                        <CheckCircle2 className="w-3 h-3" /> تم الاكتمال
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 leading-tight pr-12">{d.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{new Date(d.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                    </div>
                    {d.description && <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1 px-1">{d.description}</p>}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs font-bold mb-1 px-1">
                        <span className="text-rose-500">تم جمع: {d.collectedAmount} ج.م</span>
                        <span className="text-slate-500">الهدف: {d.targetAmount} ج.م</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${progress >= 100 ? "bg-sky-500" : "bg-gradient-to-r from-rose-500 to-sky-400"}`} />
                      </div>
                      <motion.button whileHover={progress < 100 ? { scale: 1.02 } : {}} whileTap={progress < 100 ? { scale: 0.97 } : {}}
                        disabled={progress >= 100}
                        onClick={() => { setSelectedCase(d); setShowDonateModal(true); }}
                        className="w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{ background: progress >= 100 ? "#94a3b8" : "linear-gradient(135deg, #f43f5e, #fbbf24)", boxShadow: progress >= 100 ? "none" : "0 4px 15px rgba(244,63,94,0.25)" }}>
                        <Heart className="w-4 h-4" /> {progress >= 100 ? "الحالة مكتملة" : "تبرع الآن"}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ════════════ NOTIFICATIONS ════════════ */}
      {tab === "notif" && (
        <motion.div key="notif" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">الإشعارات</h2>
          <ModernNotifications
            notifs={notifs}
            markRead={markRead}
            accent="sky"
            onNotificationClick={(n) => {
              if (!n.actionUrl) return;
              if (n.actionUrl.startsWith("consult")) {
                setTab("consult");
              } else if (n.actionUrl.startsWith("medicine")) {
                setTab("medicine");
              } else if (n.actionUrl.startsWith("ticket")) {
                const urlParams = new URLSearchParams(n.actionUrl.split("?")[1]);
                const tId = urlParams.get("id");
                if (tId) setTargetTicketId(Number(tId));
                setTab("support");
              }
            }}
          />
        </motion.div>
      )}

      {/* ════════════ SUPPORT TICKETS ════════════ */}
      {tab === "support" && (
        <motion.div key="support" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <TicketSystem isAdmin={false} targetTicketId={targetTicketId} />
        </motion.div>
      )}

      {/* ════════════ PROFILE ════════════ */}
      {tab === "profile" && (
        <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
          <UserProfile profileData={profile} stats={stats} role="Patient" />
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
