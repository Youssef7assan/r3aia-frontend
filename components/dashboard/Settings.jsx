"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Save, Camera, Mail, Phone, MapPin, Building2, Store, HeartPulse, Stethoscope, ChevronRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import extractError from "../../lib/extractError";

export default function Settings({ profileData, refetchProfile }) {
  if (!profileData) return null;

  const { name, email, role: rawRole, profile } = profileData;
  const role = rawRole.toLowerCase();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: "", phoneNumber: "", governorateId: "", cityId: "", address: "", specialtyId: "", pharmacyName: "", hasChronicDisease: false, description: ""
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Lists for dropdowns
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    // Fetch Governorates
    api.get("/Governorates").then(res => setGovernorates(res.data)).catch(() => {});
    
    // Initialize profile form
    setProfileForm({
      fullName: name || "",
      phoneNumber: profile?.phone || "",
      governorateId: profile?.governorateId || "",
      cityId: profile?.cityId || "",
      address: profile?.clinicAddress || profile?.address || "",
      specialtyId: profile?.specialtyId || "",
      pharmacyName: profile?.pharmacyName || "",
      hasChronicDisease: profile?.hasChronicDisease || false,
      description: profile?.description || "",
    });

    if (role === 'doctor' && profile?.workingHours) {
      const existingHours = profile.workingHours;
      if (existingHours.includes(" من ")) {
        const [daysPart, timePart] = existingHours.split(" من ");
        if (daysPart) setSelectedDays(daysPart.split(" و "));
        if (timePart && timePart.includes(" إلى ")) {
          setStartTime(timePart.split(" إلى ")[0]);
          setEndTime(timePart.split(" إلى ")[1]);
        }
      } 
    }
  }, [name, profile, role]);

  useEffect(() => {
    if (profileForm.governorateId) {
      api.get(`/Cities/by-governorate/${profileForm.governorateId}`).then(res => setCities(res.data)).catch(() => {});
    } else {
      setCities([]);
    }
  }, [profileForm.governorateId]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let endpoint = "";
    let method = "post";
    
    // Adapt payload
    let payload = {
      phoneNumber: profileForm.phoneNumber,
      governorateId: profileForm.governorateId,
      cityId: profileForm.cityId,
    };

    if (role === "patient") {
      endpoint = "/Profiles/patient";
      method = "put";
      payload = { ...payload, fullName: profileForm.fullName, address: profileForm.address, hasChronicDisease: profileForm.hasChronicDisease };
    } else if (role === "doctor") {
      let finalWorkingHours = "";
      if (selectedDays.length > 0 && startTime && endTime) {
        finalWorkingHours = `${selectedDays.join(" و ")} من ${startTime} إلى ${endTime}`;
      }
      endpoint = "/Profiles/doctor";
      
      const fd = new FormData();
      fd.append("PhoneNumber", profileForm.phoneNumber || "");
      fd.append("GovernorateId", profileForm.governorateId);
      fd.append("CityId", profileForm.cityId);
      fd.append("FullName", profileForm.fullName || "");
      fd.append("ClinicAddress", profileForm.address || "");
      fd.append("SpecialtyId", profileForm.specialtyId);
      
      if (finalWorkingHours) fd.append("WorkingHours", finalWorkingHours);
      if (profileForm.description) fd.append("Description", profileForm.description);

      // Preserve existing prices and consultation details
      if (profile?.consultationType) {
        fd.append("ConsultationType", profile.consultationType);
        if (profile.originalPrice) fd.append("OriginalPrice", profile.originalPrice);
        if (profile.discountedPrice) fd.append("DiscountedPrice", profile.discountedPrice);
      }
      if (profile?.clinicPhone) {
        fd.append("ClinicPhone", profile.clinicPhone);
      }

      payload = fd;
    } else if (role === "pharmacy") {
      endpoint = "/Profiles/pharmacy";
      payload = { ...payload, pharmacyName: profileForm.fullName, address: profileForm.address };
    } else if (role === "volunteer") {
      endpoint = "/Profiles/volunteer";
      payload = { ...payload, fullName: profileForm.fullName, nationalID: profile?.nationalID || "12345678912345" }; // Mocked NID since it shouldn't change
    }

    try {
      const isFormData = payload instanceof FormData;
      await api[method](endpoint, payload, isFormData ? { headers: { 'Content-Type': undefined } } : {});
      toast.success("✅ تم تحديث بيانات الملف الشخصي بنجاح", { className: "font-bold font-cairo" });
      if (refetchProfile) refetchProfile();
    } catch (err) {
      toast.error(extractError(err, "حدث خطأ أثناء تحديث البيانات"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة ❌");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/Auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("✅ تم تغيير كلمة المرور بنجاح");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(extractError(err, "كلمة المرور الحالية غير صحيحة"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "profile", label: "المعلومات الشخصية", icon: User },
    { id: "security", label: "كلمة المرور والأمان", icon: Lock },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12" dir="rtl">
      
      {/* ── Banner ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden relative shadow-lg"
        style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-cyan-500/20 opacity-50 mixing-blend-overlay" />
        <div className="relative p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-800 ring-4 ring-slate-700/50 flex items-center justify-center text-4xl text-sky-400 font-extrabold shadow-2xl overflow-hidden">
              {name?.charAt(0) || <User />}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-slate-900 group-hover:bg-sky-400">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-right flex-1">
            <h1 className="text-2xl font-black text-white mb-1">{name}</h1>
            <p className="text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4" /> {email}
            </p>
          </div>
        </div>
        
        {/* Tabs inside Banner */}
        <div className="flex px-4 pt-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-md overflow-x-auto custom-scrollbar">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`relative flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors whitespace-nowrap
                  ${isActive ? "text-sky-400" : "text-slate-400 hover:text-slate-200"}`}>
                <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                {t.label}
                {isActive && (
                  <motion.div layoutId="settingTabAccent" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        
        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <motion.form key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
            onSubmit={submitProfile} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 xl:col-span-2">
            
            <div className="mb-8">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-2">
                <User className="text-sky-500 w-6 h-6" /> بيانات الحساب
              </h2>
              <p className="text-sm text-slate-500">قم بتحديث معلوماتك الشخصية لضمان تواصل فعال على المنصة.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-2">الاسم الكامل / اسم الجهة</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input type="text" name="fullName" value={profileForm.fullName} onChange={handleProfileChange} required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-medium transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input type="tel" name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} required dir="ltr"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-medium transition-all text-right" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-2">المحافظة</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <select name="governorateId" value={profileForm.governorateId} onChange={handleProfileChange} required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-bold transition-all appearance-none">
                    <option value="" disabled>اختر المحافظة...</option>
                    {governorates.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>

              {role !== "volunteer" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-2">المنطقة / المدينة</label>
                  <select name="cityId" value={profileForm.cityId} onChange={handleProfileChange} required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-bold transition-all appearance-none">
                    <option value="" disabled>اختر المدينة...</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {role !== "volunteer" && (
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 ml-2">العنوان التفصيلي</label>
                  <div className="relative">
                    <Building2 className="absolute right-4 top-4 text-slate-400 w-5 h-5 pointer-events-none" />
                    <textarea name="address" value={profileForm.address} onChange={handleProfileChange} required rows="3"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-medium transition-all" />
                  </div>
                </div>
              )}

              {/* Working Hours Input for Doctor */}
              {role === "doctor" && (
                <div className="md:col-span-2 bg-sky-50/30 border border-sky-100 rounded-2xl p-5 mb-2">
                  <h3 className="font-bold text-sky-800 mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5" /> مواعيد عمل العيادة
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">أيام العمل المتاحة</label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map(day => {
                          const isSelected = selectedDays.includes(day);
                          return (
                            <button key={day} type="button"
                              onClick={() => {
                                if (isSelected) setSelectedDays(prev => prev.filter(d => d !== day));
                                else setSelectedDays(prev => [...prev, day]);
                              }}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isSelected ? "bg-sky-500 text-white shadow-md shadow-sky-500/20" : "bg-white text-slate-500 border border-slate-200 hover:border-sky-300"}`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-bold text-slate-600 mb-2">من الساعة</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                           className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:border-sky-400 outline-none transition-all font-bold font-sans dir-ltr" />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm font-bold text-slate-600 mb-2">إلى الساعة</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                           className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:border-sky-400 outline-none transition-all font-bold font-sans dir-ltr" />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-sky-200/50">
                      <label className="block text-sm font-bold text-slate-600 mb-2">نبذة عن الطبيب (الوصف الاختياري)</label>
                      <textarea
                        name="description"
                        value={profileForm.description || ""}
                        onChange={handleProfileChange}
                        placeholder="نبذة مختصرة عن الطبيب والشهادات والخبرات..."
                        rows="3"
                        className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 outline-none transition-all font-medium custom-scrollbar resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === "patient" && (
                <div className="md:col-span-2 flex items-center bg-sky-50/50 border border-sky-100 rounded-xl p-4 gap-4 transition-colors hover:bg-sky-50">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${profileForm.hasChronicDisease ? 'bg-sky-500 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-200'}`}>
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => setProfileForm(p => ({...p, hasChronicDisease: !p.hasChronicDisease}))}>
                    <h4 className="font-bold text-slate-800">الأمراض المزمنة</h4>
                    <p className="text-xs text-slate-500 mt-0.5">هل تعاني من أي أمراض مزمنة تتطلب رعاية مستمرة؟</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="hasChronicDisease" checked={profileForm.hasChronicDisease} onChange={handleProfileChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:-translate-x-full peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-sky-500/30 flex items-center gap-2 transition-all disabled:opacity-70 disabled:pointer-events-none">
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                حفظ التعديلات
              </motion.button>
            </div>
          </motion.form>
        )}

        {/* ── SECURITY TAB ── */}
        {activeTab === "security" && (
          <motion.div key="security" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <form onSubmit={submitPassword} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-2">
                  <Lock className="text-sky-500 w-6 h-6" /> تغيير كلمة المرور
                </h2>
                <p className="text-sm text-slate-500">تأكد من استخدام كلمة مرور قوية تحتوي على أحرف وأرقام لحماية حسابك.</p>
              </div>

              <div className="max-w-md space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-2">كلمة المرور الحالية</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-4 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-bold transition-all dir-ltr text-right" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-2">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input type={showPassword ? "text" : "password"} name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength={6}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-12 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-bold transition-all dir-ltr text-right" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-2">تأكيد كلمة المرور الجديدة</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required minLength={6}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pr-12 pl-12 py-3.5 focus:bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 font-bold transition-all dir-ltr text-right" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit"
                  className="bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-all disabled:opacity-70 disabled:pointer-events-none">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                  حفظ كلمة المرور
                </motion.button>
              </div>
            </form>
            
            {/* Added Security Advice Block */}
            <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sky-800 mb-1">نصائح أمنية</h4>
                <ul className="text-sky-700/80 text-sm font-medium space-y-1 list-disc list-inside">
                  <li>استخدم 8 أحرف على الأقل.</li>
                  <li>تجنب استخدام بيانات شخصية ككلمة مرور (مثل رقم الهاتف).</li>
                  <li>لا تشارك كلمة مرورك مع أي شخص.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
