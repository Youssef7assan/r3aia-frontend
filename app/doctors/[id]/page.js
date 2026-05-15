"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, MapPin, Phone, Clock, Stethoscope, Star, BadgePercent,
  Heart, Calendar, CheckCircle2, ChevronLeft, User, Building2,
  FileText, Sparkles, X, Send
} from "lucide-react";
import api from "../../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fixImg = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:5129/${path.replace(/\\/g, "/")}`;
};

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/DiscountedDoctors/${id}`)
      .then(r => setDoctor(r.data))
      .catch(() => toast.error("لم يتم العثور على الطبيب"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      toast.error("من فضلك أدخل الاسم ورقم الهاتف");
      return;
    }
    setBookingLoading(true);
    try {
      await api.post("/ClinicAppointments", {
        doctorId: doctor.id,
        patientName: bookingName,
        patientPhone: bookingPhone,
        notes: bookingNotes || null,
      });
      toast.success("تم الحجز بنجاح! 🎉 الدفع سيكون في العيادة.");
      setShowBooking(false);
      setBookingName(""); setBookingPhone(""); setBookingNotes("");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحجز");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center animate-pulse">
          <Stethoscope className="w-8 h-8 text-sky-500" />
        </div>
        <p className="text-sky-600 font-bold">جاري تحميل بيانات الطبيب...</p>
      </div>
    </div>
  );

  if (!doctor) return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-sky-100 mx-auto flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-sky-400" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">الطبيب غير موجود</h2>
        <Link href="/doctors" className="text-sky-500 font-bold hover:underline">العودة لدليل الأطباء</Link>
      </div>
    </div>
  );

  const imgUrl = fixImg(doctor.profileImage);
  const isDiscounted = doctor.consultationType === "Discounted";
  const isFree = doctor.consultationType === "Free";

  return (
    <div className="min-h-screen pt-[80px] bg-gradient-to-br from-sky-50 via-white to-cyan-50/30" dir="rtl">
      <ToastContainer position="top-center" rtl />

      {/* ── Header ── */}
      <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-xl border-b border-sky-100/80 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 flex items-center justify-center transition-colors flex-shrink-0">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sky-500 font-semibold">دليل الأطباء</p>
            <h1 className="text-sm font-black text-slate-800 truncate">د. {doctor.fullName}</h1>
          </div>
          <Link href="/doctors"
            className="text-xs text-sky-600 font-bold bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            كل الأطباء <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Hero Card ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-sky-100/50 border border-sky-100">

          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-sky-400 via-cyan-400 to-cyan-400" />

          {/* Badges */}
          <div className="absolute top-6 left-5 flex flex-col gap-2 z-10">
            {isDiscounted && doctor.discountPercentage && (
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <BadgePercent className="w-3.5 h-3.5" /> خصم {doctor.discountPercentage}%
              </div>
            )}
            {isFree && (
              <div className="bg-gradient-to-r from-sky-500 to-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> كشف مجاني
              </div>
            )}
          </div>

          <div className="p-7">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              {imgUrl ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl shadow-sky-200/50 flex-shrink-0 border-4 border-white ring-2 ring-sky-200">
                  <img src={imgUrl} alt={doctor.fullName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-black text-4xl flex-shrink-0 shadow-xl shadow-sky-200/50 border-4 border-white">
                  {doctor.fullName?.charAt(0) || "د"}
                </div>
              )}

              {/* Name + Specialty */}
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-black text-slate-800 mb-1">د. {doctor.fullName}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 bg-sky-50 text-sky-600 font-bold text-sm px-3 py-1 rounded-full border border-sky-200">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {doctor.specialty}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>{doctor.governorate}{doctor.city ? ` — ${doctor.city}` : ""}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Details Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Contact & Location */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base border-b border-sky-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              بيانات التواصل والعنوان
            </h3>

            <div className="space-y-3">
              {doctor.clinicAddress && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">عنوان العيادة</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{doctor.clinicAddress}</p>
                  </div>
                </div>
              )}

              {doctor.governorate && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">المحافظة / المنطقة</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">
                      {doctor.governorate}{doctor.city ? ` — ${doctor.city}` : ""}
                    </p>
                  </div>
                </div>
              )}

              {doctor.clinicPhone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">هاتف العيادة</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5 dir-ltr" dir="ltr">{doctor.clinicPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Working Hours & Price */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 space-y-4">
            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base border-b border-sky-50 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              المواعيد والأسعار
            </h3>

            <div className="space-y-3">
              {doctor.workingHours && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">ساعات العمل</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{doctor.workingHours}</p>
                  </div>
                </div>
              )}

              {isDiscounted && (
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100">
                  <p className="text-xs text-slate-400 font-semibold mb-2">سعر الكشف</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-rose-600">{doctor.discountedPrice} ج.م</span>
                    {doctor.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-semibold">{doctor.originalPrice} ج.م</span>
                    )}
                    {doctor.discountPercentage && (
                      <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                        وفر {doctor.discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isFree && (
                <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-4 border border-sky-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-sky-500" />
                    <span className="font-black text-sky-700 text-lg">كشف مجاني بالكامل</span>
                  </div>
                  <p className="text-xs text-sky-600 mt-1">خدمة تطوعية من الطبيب لدعم المجتمع</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Description ── */}
        {doctor.description && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100">
            <h3 className="font-black text-slate-800 flex items-center gap-2 text-base border-b border-sky-50 pb-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              نبذة عن الطبيب
            </h3>
            <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100">
              <p className="text-slate-700 font-medium leading-relaxed text-base">{doctor.description}</p>
            </div>
          </motion.div>
        )}

        {/* ── Book Now ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <button
            onClick={() => setShowBooking(true)}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-sky-300/40 transition-all hover:shadow-sky-400/50 hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Calendar className="w-5 h-5" />
            احجز موعدك الآن
          </button>
          <p className="text-center text-xs text-slate-400 font-semibold mt-2">الدفع سيكون في العيادة</p>
        </motion.div>
      </div>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {showBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowBooking(false)}>
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-black text-lg">حجز موعد</h3>
                  <p className="text-sky-100 text-sm">د. {doctor.fullName}</p>
                </div>
                <button onClick={() => setShowBooking(false)}
                  className="w-9 h-9 rounded-xl bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBook} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">الاسم الكامل *</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} required
                      placeholder="أدخل اسمك الكامل"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm font-medium focus:border-sky-400 focus:bg-white outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">رقم الهاتف *</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} required
                      placeholder="01xxxxxxxxx" dir="ltr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm font-medium focus:border-sky-400 focus:bg-white outline-none transition-all text-right" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">ملاحظات (اختياري)</label>
                  <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)}
                    placeholder="أي تفاصيل أو ملاحظات تود إضافتها..." rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-sky-400 focus:bg-white outline-none transition-all resize-none" />
                </div>

                <button type="submit" disabled={bookingLoading}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-black py-3.5 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg shadow-sky-200">
                  {bookingLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> جاري الإرسال...</>
                  ) : (
                    <><Send className="w-4 h-4" /> تأكيد الحجز</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
