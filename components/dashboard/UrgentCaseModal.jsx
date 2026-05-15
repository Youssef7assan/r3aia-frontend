import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { AlertTriangle, Stethoscope, Pill, MapPin, CheckCircle2, Activity, BellRing, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UrgentCaseModal({ urgentId, urgentType, role, onClose, onClaimed }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!urgentId || !urgentType) return;
    setLoading(true);
    api.get(`/Stats/urgent-detail?type=${urgentType}&id=${urgentId}`)
      .then(r => setDetail(r.data))
      .catch(() => toast.error("تعذر جلب بيانات الحالة المتعثرة، ربما تم حجزها مسبقاً"))
      .finally(() => setLoading(false));
  }, [urgentId, urgentType]);

  const handleClaim = async () => {
    setSubmitting(true);
    try {
      if (role === "Doctor") {
        const appointmentDate = new Date();
        appointmentDate.setHours(appointmentDate.getHours() + 2); 
        await api.post(`/MedicalRequests/respond/${urgentId}`, {
          appointmentDate: appointmentDate.toISOString(),
          doctorNotes: notes || "تم التدخل السريع للحالة الطارئة"
        });
      } else if (role === "Pharmacy") {
        try { await api.post(`/MedicineRequests/confirm-pharmacy/${urgentId}`); } catch(e) {}
      } else if (role === "Volunteer") {
        // Volunteer logic
      }
      setSuccess(true);
      toast.success("✅ تم التكفل بالحالة بنجاح!");
      setTimeout(() => {
        if (onClaimed) onClaimed(urgentId);
        onClose();
      }, 2500);
    } catch (err) {
      toast.error("فشل تسجيل التكفل بالحالة.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-2xl bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-y-auto max-h-[95vh] relative">
          
          <button onClick={onClose} className="absolute top-4 left-4 z-20 w-10 h-10 bg-slate-700/50 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-rose-600" />
          
          <div className="p-6 md:p-8 space-y-6 relative z-10 pt-10">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
                 <p className="text-rose-500 font-bold animate-pulse">جاري جلب تفاصيل الحالة...</p>
               </div>
            ) : !success ? (
              detail ? (
                <>
                  <div className="text-center mb-6">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                      <AlertTriangle className="w-8 h-8 text-rose-500" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-white mb-1">بيانات الحالة <span className="text-rose-500">SOS</span></h2>
                  </div>

                  <div className="flex items-center gap-4 border-b border-slate-700/50 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-inner">
                      {detail.type === "Medical" ? <Stethoscope className="w-7 h-7 text-sky-400" /> : <Pill className="w-7 h-7 text-sky-400" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {detail.patientName}
                      </h2>
                      <p className="text-slate-400 flex items-center gap-1.5 mt-1 text-sm"><MapPin className="w-4 h-4" /> {detail.patientGovernorate} - {detail.patientCity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-500 font-semibold mb-1">نوع الطلب المفقود</p>
                      <p className="text-lg font-bold text-slate-200">{detail.type === "Medical" ? "استشارة طبية" : "تبرع دوائي"}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                      <p className="text-xs text-slate-500 font-semibold mb-1">وقت التعثر</p>
                      <p className="text-lg font-bold text-slate-200 text-rose-400">{Math.floor(detail.ageMinutes)} دقيقة مرت</p>
                    </div>
                  </div>

                  {detail.type === "Medical" && (
                    <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/80">
                      <p className="text-xs text-sky-400 font-bold mb-2 uppercase tracking-wide">بيانات الاستشارة المطلوبة</p>
                      <p className="text-xl font-black text-white mb-3">{detail.specialtyName}</p>
                      <p className="text-slate-300 text-sm leading-relaxed bg-slate-800 p-3 rounded-xl border border-slate-700/50">{detail.description || "لا يوجد وصف محدد"}</p>
                    </div>
                  )}

                  {detail.type === "Medicine" && (
                     <div className="bg-slate-700/30 rounded-2xl p-5 border border-slate-700/80">
                        <p className="text-xs text-sky-400 font-bold mb-2 uppercase tracking-wide">الروشتة الدوائية المطلوبة</p>
                        {detail.prescriptionImageUrl ? (
                        <img src={`http://localhost:5247${detail.prescriptionImageUrl}`} alt="روشتة" className="w-full h-auto max-h-64 object-contain rounded-xl shadow-lg border border-slate-600 bg-slate-800 p-2" />
                        ) : (
                        <p className="text-slate-400 text-sm text-center py-4 bg-slate-800 rounded-xl">لا توجد تفاصيل، الرجاء الاتصال بالمريض.</p>
                        )}
                     </div>
                  )}

                  <div className="pt-2">
                    <div className="mb-4">
                       <label className="text-sm font-bold text-slate-400 mb-2 block">ملاحظة للطاقم أو للمريض (اختياري)</label>
                       <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أنا جاهز للمساعدة الآن..." className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-rose-500 transition-all font-medium" />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={submitting} onClick={handleClaim} className="w-full bg-gradient-to-r from-rose-600 to-red-500 text-white font-black text-lg py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(225,29,72,0.3)] disabled:opacity-80">
                      {submitting ? <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><BellRing className="w-6 h-6" /> التقاط الحالة فوراً</>}
                    </motion.button>
                  </div>
                </>
              ) : (
                 <div className="py-10 text-center">
                   <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-300">لم يتم العثور على الحالة</h3>
                   <p className="text-slate-500 mt-2">قد يكون أحدهم قد تكفل بها بالفعل أو تم حذفها!</p>
                 </div>
              )
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                 <div className="w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                   <CheckCircle2 className="w-14 h-14 text-white" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-2">عظيم جداً!</h2>
                 <p className="text-sky-400 text-lg font-medium">تم تسجيل التدخل بنجاح.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
