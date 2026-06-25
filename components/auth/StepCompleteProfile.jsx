import { useState, useRef, useEffect } from 'react';
import { CloudUpload, FileText, CheckCircle2, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import extractError from '../../lib/extractError';

export default function StepCompleteProfile({ role }) {
  const router = useRouter();

  // ── البيانات المشتركة ──
  const [governorateId, setGovernorateId] = useState('');
  const [cityId, setCityId] = useState('');

  // ── بيانات خاصة بكل دور ──
  // Patient
  const [address, setAddress] = useState('');
  const [hasChronicDisease, setHasChronicDisease] = useState(false);

  // Doctor
  const [specialtyId, setSpecialtyId] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const profileImageRef = useRef(null);
  const [licenseImage, setLicenseImage] = useState(null);
  const licenseImageRef = useRef(null);

  // Pharmacist
  const [pharmacyName, setPharmacyName] = useState('');
  const [pharmacyAddress, setPharmacyAddress] = useState('');

  // Files (Patient only: NIDImage + SocialProofImage)
  const [nidImage, setNidImage] = useState(null);
  const [socialProofImage, setSocialProofImage] = useState(null);
  const nidRef = useRef(null);
  const socialRef = useRef(null);

  // ── قوائم البيانات ──
  const [loading, setLoading] = useState(false);
  const [governorates, setGovernorates] = useState([]);
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // ── تحميل البيانات عند بدء الصفحة ──
  useEffect(() => {
    // 1) Fetch governorates
    api.get('/Governorates')
      .then(r => setGovernorates(r.data))
      .catch(e => console.error("Governorates loading hit an error", e));

    if (role === 'Doctor') {
      api.get('/Specialties')
        .then(res => setSpecialties(res.data))
        .catch(() => setSpecialties([
          { id: 1, name: 'باطنة' }, { id: 2, name: 'أطفال' },
          { id: 3, name: 'جراحة' }, { id: 4, name: 'نساء وتوليد' },
          { id: 5, name: 'عظام' }, { id: 6, name: 'عيون' },
        ]));
    }
  }, [role]);

  // ── تحميل المدن عند اختيار المحافظة ──
  useEffect(() => {
    if (governorateId) {
      api.get(`/Cities/by-governorate/${governorateId}`)
        .then(res => setCities(res.data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
    setCityId('');
  }, [governorateId]);

  // ── جلب بيانات المستخدم من localStorage (تم حفظها في StepBasicInfo) ──
  const getUserDataFromStorage = () => {
    try {
      const saved = localStorage.getItem('r3aia_reg');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return { fullName: '', nationalID: '', phoneNumber: '' };
  };

  // ══════════════════════════════════════════════════
  //  الإرسال حسب الدور
  // ══════════════════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = getUserDataFromStorage();

    try {
      if (role === 'Patient') {
        // ⚡ Patient: multipart/form-data (مع صور)
        const formData = new FormData();
        formData.append('FullName', userData.fullName);
        formData.append('PhoneNumber', userData.phoneNumber);
        formData.append('GovernorateId', governorateId);
        formData.append('CityId', cityId);
        formData.append('Address', address);
        formData.append('HasChronicDisease', hasChronicDisease);
        if (nidImage) formData.append('NIDImage', nidImage);
        if (socialProofImage) formData.append('SocialProofImage', socialProofImage);

        await api.post('/Profiles/patient', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      } else if (role === 'Doctor') {
        const formData = new FormData();
        formData.append("FullName", userData.fullName);
        formData.append("PhoneNumber", userData.phoneNumber || "");
        formData.append("SpecialtyId", specialtyId);
        formData.append("GovernorateId", governorateId);
        formData.append("CityId", cityId);
        formData.append("ClinicAddress", clinicAddress);
        if (clinicPhone) formData.append("ClinicPhone", clinicPhone);
        
        if (consultationType) {
          formData.append("ConsultationType", consultationType);
          if (consultationType === 'Discounted') {
            if (originalPrice) formData.append("OriginalPrice", originalPrice);
            if (discountedPrice) formData.append("DiscountedPrice", discountedPrice);
          }
        }
        
        if (profileImage) {
          formData.append("ProfileImage", profileImage);
        }
        if (licenseImage) {
          formData.append("LicenseImage", licenseImage);
        }

        await api.post('/Profiles/doctor', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

      } else if (role === 'Pharmacist') {
        // ⚡ Pharmacist: JSON
        await api.post('/Profiles/pharmacy', {
          pharmacyName: pharmacyName,
          phoneNumber: userData.phoneNumber,
          governorateId: parseInt(governorateId),
          cityId: parseInt(cityId),
          address: pharmacyAddress,
        });

      } else if (role === 'Volunteer') {
        // ⚡ Volunteer: JSON
        await api.post('/Profiles/volunteer', {
          fullName: userData.fullName,
          nationalID: userData.nationalID,
          phoneNumber: userData.phoneNumber,
          governorateId: parseInt(governorateId),
        });
      }

      toast.success('تم استكمال الملف الشخصي بنجاح! 🎉');
      localStorage.removeItem('r3aia_reg'); // تنظيف البيانات المؤقتة
      setTimeout(() => router.push('/pending-review'), 800);
    } catch (error) {
      toast.error(extractError(error, 'حدث خطأ أثناء إكمال الملف الشخصي.'));
      console.error('Profile error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════════════
  //  مكونات مساعدة
  // ══════════════════════════════════════════════════
  const selectClass = "w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white p-3.5 transition-all hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const inputClass = "w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white p-3.5 transition-all hover:border-slate-300";

  const FileUploadBox = ({ title, desc, file, setFile, fileRef, icon: Icon }) => (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-2">{title}</p>
      <div
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all
          ${file ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/50'}`}
      >
        <input type="file" className="hidden" ref={fileRef} onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} accept="image/*" />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${file ? 'bg-green-100 text-green-600' : 'bg-white text-sky-500 shadow-sm'}`}>
          {file ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          {file ? (
            <>
              <p className="text-sm font-bold text-green-700">تم إرفاق الملف ✓</p>
              <p className="text-xs text-green-600 truncate">{file.name}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-600">{desc}</p>
              <p className="text-xs text-sky-500 font-semibold mt-1">اضغط لاختيار صورة</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════
  //  حقول الموقع المشتركة
  // ══════════════════════════════════════════════════
  const LocationFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="inline w-3.5 h-3.5 ml-1" />
          المحافظة <span className="text-rose-500">*</span>
        </label>
        <select value={governorateId} onChange={(e) => setGovernorateId(e.target.value)} required className={selectClass}>
          <option value="">اختر المحافظة</option>
          {governorates.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      {role !== 'Volunteer' && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            المدينة <span className="text-rose-500">*</span>
          </label>
          <select value={cityId} onChange={(e) => setCityId(e.target.value)} required disabled={!governorateId} className={selectClass}>
            <option value="">اختر المدينة</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════
  //  الحقول الخاصة بكل دور
  // ══════════════════════════════════════════════════

  // ── مريض ──
  const PatientFields = () => (
    <>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">العنوان التفصيلي</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="الشارع - الحي - رقم المبنى" className={inputClass} />
      </div>

      <label className="flex items-center justify-between bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-sky-300 transition-colors">
        <span className="text-sm font-semibold text-slate-700">هل تعاني من أمراض مزمنة؟</span>
        <div className="relative">
          <input type="checkbox" checked={hasChronicDisease} onChange={(e) => setHasChronicDisease(e.target.checked)} className="sr-only" />
          <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${hasChronicDisease ? 'bg-sky-500' : 'bg-slate-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${hasChronicDisease ? '-translate-x-6 mr-1' : 'translate-x-0.5'}`} />
          </div>
        </div>
      </label>

      <div className="space-y-3">
        <FileUploadBox title="صورة بطاقة الرقم القومي *" desc="صورة واضحة للوجهين (أقل من 5MB)" file={nidImage} setFile={setNidImage} fileRef={nidRef} icon={CloudUpload} />
        <FileUploadBox title="صورة البحث الاجتماعي *" desc="نسخة حديثة من البحث الاجتماعي" file={socialProofImage} setFile={setSocialProofImage} fileRef={socialRef} icon={FileText} />
      </div>
    </>
  );

  // ── طبيب ──
  const DoctorFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            التخصص الطبي <span className="text-rose-500">*</span>
          </label>
          <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)} required className={selectClass}>
            <option value="">اختر التخصص</option>
            {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">عنوان العيادة</label>
          <input type="text" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} placeholder="عنوان العيادة التفصيلي" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">رقم العيادة</label>
          <input type="tel" value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} placeholder="01xxxxxxxxx" className={inputClass} />
        </div>
      </div>

      {/* ── نوع الكشف ── */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">نوع الكشف (اختياري)</label>
        <div className="grid grid-cols-2 gap-3">
          {[{ value: 'Free', label: '🆓 كشف مجاني', desc: 'بدون أي رسوم' }, { value: 'Discounted', label: '💰 كشف مخفض', desc: 'بسعر مخفض' }].map(opt => (
            <label key={opt.value}
              className={`relative flex flex-col items-center p-4 rounded-2xl border-2 cursor-pointer transition-all text-center
                ${consultationType === opt.value
                  ? 'border-sky-400 bg-sky-50 shadow-md shadow-sky-100'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
            >
              <input type="radio" name="consultationType" value={opt.value}
                checked={consultationType === opt.value}
                onChange={(e) => setConsultationType(e.target.value)}
                className="sr-only" />
              <span className="text-lg mb-1">{opt.label}</span>
              <span className="text-xs text-slate-400">{opt.desc}</span>
              {consultationType === opt.value && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* ── حقول السعر (تظهر فقط لو مخفض) ── */}
      {consultationType === 'Discounted' && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              السعر قبل الخفض (ج.م) <span className="text-rose-500">*</span>
            </label>
            <input type="number" min="1" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="مثال: 300" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              السعر بعد الخفض (ج.م) <span className="text-rose-500">*</span>
            </label>
            <input type="number" min="0" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} placeholder="مثال: 100" required className={inputClass} />
          </div>
          {originalPrice && discountedPrice && parseFloat(originalPrice) > 0 && (
            <div className="col-span-2 text-center">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-sm">
                🎉 نسبة الخصم: {Math.round((1 - parseFloat(discountedPrice) / parseFloat(originalPrice)) * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* صورة الطبيب الاختيارية وكارنيه المزاولة */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700 mb-1">المستندات والصور</label>
        <FileUploadBox title="كارنيه مزاولة المهنة *" desc="صورة واضحة لكارنيه مزاولة المهنة الصادر من النقابة" file={licenseImage} setFile={setLicenseImage} fileRef={licenseImageRef} icon={FileText} />
        <FileUploadBox title="الصورة الشخصية (اختياري)" desc="تساعد المرضى في التعرف عليك" file={profileImage} setFile={setProfileImage} fileRef={profileImageRef} icon={CloudUpload} />
      </div>

    </div>
  );

  // ── صيدلانى ──
  const PharmacistFields = () => (
    <>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          <Building2 className="inline w-3.5 h-3.5 ml-1" />
          اسم الصيدلية <span className="text-rose-500">*</span>
        </label>
        <input type="text" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="اسم الصيدلية" required className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">عنوان الصيدلية</label>
        <input type="text" value={pharmacyAddress} onChange={(e) => setPharmacyAddress(e.target.value)} placeholder="الشارع - الحي" className={inputClass} />
      </div>
    </>
  );

  // ── متطوع ──
  // المتطوع يحتاج فقط المحافظة (بدون مدينة)
  const VolunteerFields = () => null;

  // ══════════════════════════════════════════════════
  //  الواجهة
  // ══════════════════════════════════════════════════
  const roleConfig = {
    Patient: { label: 'مريض', color: 'bg-sky-50 text-sky-600' },
    Doctor: { label: 'طبيب', color: 'bg-sky-50 text-sky-600' },
    Pharmacist: { label: 'صيدلانى', color: 'bg-sky-50 text-sky-600' },
    Volunteer: { label: 'متطوع', color: 'bg-rose-50 text-rose-600' },
  };

  const rc = roleConfig[role] || roleConfig.Patient;

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 ${rc.color} rounded-full px-3 py-1.5 text-xs font-bold`}>
            {rc.label}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1.5">إتمام الملف الشخصي</h2>
        <p className="text-slate-500 text-sm">أكمل البيانات المطلوبة لتفعيل حسابك</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* الموقع - مشترك */}
        {LocationFields()}

        {/* الحقول الخاصة بكل دور */}
        {role === 'Patient' && PatientFields()}
        {role === 'Doctor' && DoctorFields()}
        {role === 'Pharmacist' && PharmacistFields()}
        {role === 'Volunteer' && VolunteerFields()}

        {/* زر الإرسال */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full gradient-sky text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-sky-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait mt-2 text-base"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>إتمام التسجيل وإرسال للمراجعة</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
