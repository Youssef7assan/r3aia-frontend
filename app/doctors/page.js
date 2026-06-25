"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Stethoscope, MapPin, Phone, Clock, Tag, Search, Filter, X as XIcon,
  ChevronDown, Calendar, Star, Heart, ArrowLeft, BadgePercent, CheckCircle2, Building2, FileText
} from "lucide-react";
import api from "../../lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import extractError from "../../lib/extractError";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [governorates, setGovernorates] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filterGov, setFilterGov] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Booking modal
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/Governorates").then(r => setGovernorates(r.data)).catch(() => {}),
      api.get("/Specialties").then(r => setSpecialties(r.data)).catch(() => {}),
    ]);
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [filterGov, filterSpec]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGov) params.append("governorateId", filterGov);
      if (filterSpec) params.append("specialtyId", filterSpec);
      const res = await api.get(`/DiscountedDoctors?${params.toString()}`);
      setDoctors(res.data);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = doctors.filter(d =>
    !searchTerm || d.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = async (e) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      toast.error("من فضلك أدخل الاسم ورقم الهاتف");
      return;
    }
    setBookingLoading(true);
    try {
      await api.post("/ClinicAppointments", {
        doctorId: bookingDoctor.id,
        patientName: bookingName,
        patientPhone: bookingPhone,
        notes: bookingNotes || null,
      });
      toast.success("تم الحجز بنجاح! 🎉 الدفع سيكون في العيادة.");
      setBookingDoctor(null);
      setBookingName("");
      setBookingPhone("");
      setBookingNotes("");
    } catch (err) {
      toast.error(extractError(err, "حدث خطأ أثناء الحجز."));
    } finally {
      setBookingLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterGov("");
    setFilterSpec("");
    setSearchTerm("");
  };

  const hasFilters = filterGov || filterSpec || searchTerm;

  return (
    <div className="min-h-screen bg-[#F4F6FB]" dir="rtl">
      <ToastContainer position="top-center" rtl theme="colored" />

      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1729] via-[#1a2744] to-[#0c2340]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-sky-300 px-5 py-2 rounded-full text-sm font-bold mb-6 border border-white/10">
              <Heart className="w-4 h-4" />
              مبادرة رعاية الطبية
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              أطباء بأسعار <span className="bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">مخفضة</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
              نخبة من الأطباء المتطوعين يقدمون كشوفات طبية مجانية ومخفضة لخدمة المجتمع. 
              احجز موعدك الآن واستفد من الخدمة.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex justify-center gap-8 mt-10 flex-wrap">
            {[
              { icon: Stethoscope, label: "طبيب متطوع", value: doctors.length || "—" },
              { icon: BadgePercent, label: "خصم يصل إلى", value: "70%" },
              { icon: CheckCircle2, label: "الدفع في العيادة", value: "✓" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3">
                <s.icon className="w-5 h-5 text-sky-400" />
                <div>
                  <p className="text-white font-black text-lg leading-none">{s.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F6FB] to-transparent" />
      </section>

      {/* ═══ Filters ═══ */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-5">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث باسم الطبيب..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm focus:border-sky-400 focus:bg-white transition-all outline-none" />
            </div>

            {/* Specialty Filter */}
            <div className="relative min-w-[180px]">
              <Stethoscope className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm appearance-none focus:border-sky-400 focus:bg-white transition-all outline-none cursor-pointer">
                <option value="">كل التخصصات</option>
                {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Governorate Filter */}
            <div className="relative min-w-[180px]">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select value={filterGov} onChange={(e) => setFilterGov(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm appearance-none focus:border-sky-400 focus:bg-white transition-all outline-none cursor-pointer">
                <option value="">كل المحافظات</option>
                {governorates.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {hasFilters && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.9 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                <XIcon className="w-4 h-4" /> مسح الفلاتر
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

      {/* ═══ Doctors Grid ═══ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-bold text-lg">لا يوجد أطباء حالياً</p>
            <p className="text-slate-400 text-sm mt-1">جرب تعديل الفلاتر أو العودة لاحقاً</p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm font-semibold">
                عرض <span className="text-sky-600 font-black">{filtered.length}</span> طبيب
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc, i) => (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
                  className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm group"
                >
                  {/* Top Banner */}
                  <div className="h-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-500" />

                  {/* Discount Badge */}
                  {doc.consultationType === "Discounted" && doc.discountPercentage && (
                    <div className="absolute top-5 left-4 z-10">
                      <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-rose-200 flex items-center gap-1">
                        <BadgePercent className="w-3.5 h-3.5" />
                        خصم {doc.discountPercentage}%
                      </div>
                    </div>
                  )}
                  {doc.consultationType === "Free" && (
                    <div className="absolute top-5 left-4 z-10">
                      <div className="bg-gradient-to-r from-sky-500 to-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-sky-200 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        مجاني
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Doctor Info */}
                    <div className="flex items-start gap-4 mb-5">
                      {doc.profileImage ? (
                        <div className="w-14 h-14 rounded-2xl flex-shrink-0 shadow-lg shadow-sky-200 overflow-hidden relative">
                           <img src={doc.profileImage.startsWith('http') ? doc.profileImage : `http://localhost:5129/${doc.profileImage.replace(/\\/g, '/')}`} alt={doc.fullName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg shadow-sky-200">
                          {doc.fullName?.charAt(0) || "د"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-center h-14">
                        <h3 className="text-base font-extrabold text-slate-800 truncate">د. {doc.fullName}</h3>
                        <p className="text-sky-600 text-sm font-bold mt-0.5">{doc.specialty}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 text-sm text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{doc.governorate} — {doc.clinicAddress || "غير محدد"}</span>
                      </div>
                      {doc.clinicPhone && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-500">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span dir="ltr">{doc.clinicPhone}</span>
                        </div>
                      )}
                      {doc.workingHours && (
                        <div className="flex items-center gap-2.5 text-sm text-slate-500">
                          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{doc.workingHours}</span>
                        </div>
                      )}
                      {doc.description && (
                        <div className="flex items-start gap-2.5 text-sm text-slate-500 bg-slate-50 p-3 rounded-xl mt-2">
                          <p className="flex-1 line-clamp-2 leading-relaxed">{doc.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    {doc.consultationType === "Discounted" && (
                      <div className="bg-gradient-to-r from-sky-50 to-sky-50 rounded-xl p-3 mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-sky-500" />
                          <span className="text-sm font-bold text-slate-600">سعر الكشف:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400 line-through">{doc.originalPrice} ج.م</span>
                          <span className="text-lg font-black text-sky-600">{doc.discountedPrice} ج.م</span>
                        </div>
                      </div>
                    )}
                    {doc.consultationType === "Free" && (
                      <div className="bg-sky-50 rounded-xl p-3 mb-5 text-center">
                        <span className="text-sky-600 font-black text-sm">✨ الكشف مجاني بالكامل</span>
                      </div>
                    )}

                    {/* Buttons Row */}
                    <div className="flex gap-2">
                      <Link href={`/doctors/${doc.id}`}
                        className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-sky-200 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        تفاصيل
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setBookingDoctor(doc)}
                        className="flex-[2] bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-200/50 cursor-pointer text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        احجز موعدك الآن
                      </motion.button>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-2.5 font-medium">💳 الدفع في العيادة</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ═══ Booking Modal ═══ */}
      <AnimatePresence>
        {bookingDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setBookingDoctor(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-6 text-white relative">
                <button onClick={() => setBookingDoctor(null)}
                  className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <XIcon className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4">
                  {bookingDoctor.profileImage ? (
                    <div className="w-14 h-14 rounded-2xl flex-shrink-0 shadow-lg shadow-white/10 overflow-hidden relative border-2 border-white/30">
                       <img src={`http://localhost:5242/${bookingDoctor.profileImage}`} alt={bookingDoctor.fullName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-black">
                      {bookingDoctor.fullName?.charAt(0) || "د"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-extrabold">حجز موعد مع</h3>
                    <p className="text-white/80 font-semibold">د. {bookingDoctor.fullName}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="px-6 pt-5 pb-2 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Stethoscope className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold">{bookingDoctor.specialty}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span>{bookingDoctor.governorate} — {bookingDoctor.clinicAddress}</span>
                </div>
                {bookingDoctor.consultationType === "Discounted" && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Tag className="w-4 h-4 text-sky-500" />
                    <span>السعر: <span className="line-through text-slate-400">{bookingDoctor.originalPrice} ج.م</span>
                      <span className="text-sky-600 font-black mr-2">{bookingDoctor.discountedPrice} ج.م</span></span>
                  </div>
                )}
                {bookingDoctor.consultationType === "Free" && (
                  <div className="flex items-center gap-2 text-sky-600 font-bold">
                    <Heart className="w-4 h-4" />
                    <span>الكشف مجاني بالكامل</span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    الاسم بالكامل <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" value={bookingName} onChange={(e) => setBookingName(e.target.value)}
                    placeholder="أدخل اسمك الكامل" required
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-sky-400 focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    رقم الهاتف <span className="text-rose-500">*</span>
                  </label>
                  <input type="tel" value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)}
                    placeholder="01xxxxxxxxx" required dir="ltr"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-sky-400 focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ملاحظات (اختياري)</label>
                  <textarea value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="أضف أي ملاحظات للطبيب..." rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-sky-400 focus:bg-white outline-none transition-all resize-none" />
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-center">
                  <p className="text-sky-700 text-sm font-bold">💳 الدفع سيكون في العيادة</p>
                </div>

                <motion.button type="submit" disabled={bookingLoading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-200 disabled:opacity-60 cursor-pointer">
                  {bookingLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      تأكيد الحجز
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
