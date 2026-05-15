"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, HeartPulse, Building2, Stethoscope, Store } from "lucide-react";

export default function UserProfile({ profileData, stats, role }) {
  if (!profileData) return null;

  const { name, email, role: rawRole, isVerified, profile } = profileData;
  const userRole = role.toLowerCase(); // patient, doctor, pharmacist, volunteer
  const isPatient = userRole === "patient";
  const isDoctor = userRole === "doctor";
  const isPharmacist = userRole === "pharmacist" || userRole === "pharmacy";
  const isVolunteer = userRole === "volunteer";

  // Formatted Role String
  const roleLabels = { patient: "مريض", doctor: "طبيب", pharmacist: "صيدلية", pharmacy: "صيدلية", volunteer: "متطوع" };
  const roleLabel = roleLabels[userRole] || rawRole;

  // Derive stats logic based on role
  let stat1 = { label: "مكتملة", value: 0 };
  let stat2 = { label: "إجمالي", value: 0 };

  if (stats) {
    if (isPatient) {
      stat1 = { label: "طلبات مقبولة", value: stats.acceptedRequests || 0 };
      stat2 = { label: "إجمالي الطلبات", value: stats.totalRequests || 0 };
    } else if (isDoctor) {
      stat1 = { label: "تم الكشف", value: stats.completedConsultations || 0 };
      stat2 = { label: "قيد الانتظار", value: stats.acceptedConsultations || 0 };
    } else if (isPharmacist) {
      stat1 = { label: "تم التوفير", value: stats.fulfilledRequests || 0 };
      stat2 = { label: "إجمالي", value: stats.totalRequests || 0 };
    } else if (isVolunteer) {
      stat1 = { label: "تم التوصيل", value: stats.completedTasks || 0 };
      stat2 = { label: "مهامك", value: stats.myTasks || 0 };
    }
  }

  // Profile icon based on role
  const profileTheme = {
    patient: { gradient: "from-sky-500 to-cyan-400", avatarBg: "bg-sky-50", ring: "ring-sky-200" },
    doctor: { gradient: "from-sky-500 to-cyan-400", avatarBg: "bg-sky-50", ring: "ring-sky-200" },
    pharmacist: { gradient: "from-sky-500 to-orange-400", avatarBg: "bg-sky-50", ring: "ring-sky-200" },
    volunteer: { gradient: "from-rose-500 to-pink-400", avatarBg: "bg-rose-50", ring: "ring-rose-200" },
  };
  const theme = profileTheme[isPharmacist ? "pharmacist" : userRole] || profileTheme.patient;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* ── Header: Avatar & Basic Info ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className={`relative mb-4 w-28 h-28 rounded-full ${theme.avatarBg} ring-4 ${theme.ring} flex items-center justify-center p-1 shadow-inner`}>
          <div className={`w-full h-full rounded-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white text-4xl shadow-md`}>
            {name?.charAt(0) || <User />}
          </div>
          {isVerified && (
            <div className="absolute bottom-0 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-black text-slate-800">{name}</h2>
        <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500`}>
          {roleLabel}
        </span>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 text-center shadow-md shadow-slate-200/40 border border-slate-100 flex flex-col justify-center items-center">
          <span className={`text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${theme.gradient}`}>{stat1.value}</span>
          <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">{stat1.label}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 text-center shadow-md shadow-slate-200/40 border border-slate-100 flex flex-col justify-center items-center">
          <span className={`text-4xl font-black text-slate-700`}>{stat2.value}</span>
          <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">{stat2.label}</span>
        </motion.div>
      </div>

      {/* ── Contact Information ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-7 shadow-md shadow-slate-200/40 border border-slate-100 relative">
        
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-extrabold text-slate-800">معلومات التواصل</h3>
          <button className={`flex items-center justify-center w-10 h-10 rounded-2xl ${theme.avatarBg} text-slate-600 hover:scale-105 transition-transform`}>
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
              <p className="text-sm font-semibold text-slate-700 dir-ltr text-right">{profile?.phone || "غير مضاف"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
              <p className="text-sm font-semibold text-slate-700 dir-ltr text-right">{email || "غير مضاف"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
              <p className="text-sm font-semibold text-slate-700">
                {profile?.address ? `${profile.address}، ` : ""}
                {profile?.city ? `${profile.city}، ` : ""}
                {profile?.governorate || "غير محدد"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Role Specific Information ── */}
      {isPatient && profile && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-7 shadow-md shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-extrabold text-slate-800">Medical Information</h3>
            <HeartPulse className="w-5 h-5 text-rose-400" />
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${profile.hasChronicDisease ? 'bg-rose-100 text-rose-500' : 'bg-sky-100 text-sky-500'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-slate-700 flex-1">
              {profile.hasChronicDisease ? "يوجد أمراض مزمنة" : "لا يوجد أمراض مزمنة"}
            </p>
          </div>
        </motion.div>
      )}

      {isDoctor && profile && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-7 shadow-md shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-extrabold text-slate-800">Professional Context</h3>
            <Stethoscope className="w-5 h-5 text-sky-500" />
          </div>
          <div className="space-y-3">
             <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Specialty</span>
              <span className="text-sm font-semibold text-slate-800">{profile.specialty || "عام"}</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Clinic Address</span>
              <span className="text-sm font-semibold text-slate-800">{profile.clinicAddress || "غير محدد"}</span>
            </div>
          </div>
        </motion.div>
      )}

      {isPharmacist && profile && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-7 shadow-md shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-extrabold text-slate-800">Pharmacy Details</h3>
            <Store className="w-5 h-5 text-sky-500" />
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Pharmacy Name</span>
            <span className="text-sm font-semibold text-slate-800">{profile.pharmacyName || "غير محدد"}</span>
          </div>
        </motion.div>
      )}

      {/* ── Account Status ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl p-7 shadow-md shadow-slate-200/40 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-extrabold text-slate-800">Account Status</h3>
          <ShieldCheck className={`w-5 h-5 ${isVerified ? "text-sky-500" : "text-slate-300"}`} />
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${isVerified ? "bg-sky-50 text-sky-600 border-sky-100" : "bg-sky-50 text-sky-600 border-sky-100"} flex items-center gap-1`}>
          {isVerified ? "Verified Account" : "Pending Verification"}
          {isVerified && <ShieldCheck className="w-3.5 h-3.5" />}
        </div>
      </motion.div>

    </div>
  );
}
