import { useState } from 'react';
import { User, Mail, Phone, Lock, Hash, AtSign, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import extractError from '../../lib/extractError';
import { toast } from 'react-toastify';

export default function StepBasicInfo({ role, onNext, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    nationalID: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roleLabels = {
    Patient: 'مريض',
    Doctor: 'طبيب',
    Volunteer: 'متطوع',
    Pharmacist: 'صيدلانى',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate national ID
    if (!/^\d{14}$/.test(formData.nationalID)) {
      toast.error('الرقم القومي يجب أن يكون 14 رقمًا بالضبط');
      return;
    }

    // Validate password strength
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!pwdRegex.test(formData.password)) {
      toast.error('كلمة المرور ضعيفة — يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتان');
      return;
    }
    setLoading(true);

    const payload = {
      email: formData.email,
      userName: formData.userName,
      fullName: formData.fullName,
      nationalID: formData.nationalID,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      role: role,
    };

    try {
      const response = await api.post('/Auth/register', payload);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      // حفظ البيانات المطلوبة في الخطوة التالية
      localStorage.setItem('r3aia_reg', JSON.stringify({
        fullName: formData.fullName,
        nationalID: formData.nationalID,
        phoneNumber: formData.phoneNumber,
      }));
      toast.success('تم إنشاء الحساب بنجاح! أكمل بياناتك الآن.');
      onNext();
    } catch (error) {
      toast.error(extractError(error, 'حدث خطأ أثناء التسجيل. يرجى المحاولة.'));
      console.error('Register error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { icon: User,   name: 'fullName',      placeholder: 'الاسم الكامل',       type: 'text',     dir: 'rtl' },
    { icon: AtSign, name: 'userName',      placeholder: 'اسم المستخدم',       type: 'text',     dir: 'ltr' },
    { icon: Hash,   name: 'nationalID',    placeholder: 'الرقم القومي (14 رقم)', type: 'text',  dir: 'ltr' },
    { icon: Mail,   name: 'email',         placeholder: 'البريد الإلكتروني',  type: 'email',    dir: 'ltr' },
    { icon: Phone,  name: 'phoneNumber',   placeholder: '01xxxxxxxxx',         type: 'tel',      dir: 'ltr' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 rounded-full px-3 py-1.5 text-xs font-bold mb-3">
          {roleLabels[role] || role}
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1.5">إنشاء حسابك</h2>
        <p className="text-slate-500 text-sm">أدخل بياناتك الأساسية للمتابعة</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Grid 2 columns for basic fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {fields.slice(0, 4).map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.name}>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    dir={field.dir}
                    required
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white p-3.5 pr-10 transition-all hover:border-slate-300 placeholder:text-slate-400"
                  />
                </div>
              </div>
            );
          })}

          {/* Phone - full width */}
          <div className="col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="01xxxxxxxxx"
                value={formData.phoneNumber}
                onChange={handleChange}
                dir="ltr"
                required
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white p-3.5 pr-10 transition-all hover:border-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* كلمة المرور */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white p-3.5 pr-10 transition-all hover:border-slate-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="تأكيد كلمة المرور"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full bg-slate-50 border-2 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:bg-white p-3.5 pr-10 transition-all
                ${formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'border-rose-400 focus:border-rose-400'
                  : 'border-slate-200 hover:border-slate-300 focus:border-sky-400'
                }`}
            />
          </div>

          {/* Password mismatch warning */}
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="col-span-2 text-xs text-rose-500 font-medium -mt-2">كلمتا المرور غير متطابقتان</p>
          )}
        </div>

        {/* Password hint */}
        <div className="flex items-start gap-2 bg-sky-50 border border-sky-200 rounded-xl p-3 -mt-2 mb-2">
          <span className="text-sky-500 text-xs mt-0.5">⚠️</span>
          <p className="text-xs text-sky-700 leading-relaxed">
            كلمة المرور يجب أن تحتوي على: حرف كبير (A-Z)، حرف صغير (a-z)، رقم (0-9)، ورمز خاص مثل (!@#$)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-12 h-12 bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="flex-1 gradient-sky text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-sky-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>إنشاء الحساب</span>
                <ArrowLeft className="w-4.5 h-4.5 rotate-180" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
