"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, Heart, Shield, Users, Star } from 'lucide-react';
import api from '../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import extractError from '../../lib/extractError';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { parseJwt } from '../../lib/jwt';

const stats = [
  { icon: Users, value: '٥٠٠٠+', label: 'مريض مستفيد' },
  { icon: Heart, value: '١٥٠٠+', label: 'متطوع نشط' },
  { icon: Shield, value: '٩٨%', label: 'نسبة الرضا' },
  { icon: Star, value: '٢٧', label: 'محافظة مغطاة' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        const accountStatus = payload["AccountStatus"] || payload["accountStatus"] || "";
        if (accountStatus === "Banned") {
          router.replace('/banned');
          return;
        }

        const r = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"] || "";
        const role = (Array.isArray(r) ? r[0] : String(r)).toLowerCase();
        if (role === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace(`/${role === 'pharmacist' ? 'pharmacist' : role}/dashboard`);
        }
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/Auth/login', {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });
      const data = response.data;

      if (data.token) {
        localStorage.setItem('token', data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        toast.success('تم تسجيل الدخول بنجاح!');

        const role = data.role?.toLowerCase();

        if (data.accountStatus === 'Banned') {
          router.push('/banned');
          return;
        }

        // ── Admin أولاً (قبل فحص hasCompletedProfile) ──
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (!data.hasCompletedProfile) {
          router.push('/complete-profile');
        } else {
          // توجيه كل دور لـ dashboard الخاص به
          const dashRoutes = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', pharmacist: '/pharmacist/dashboard', volunteer: '/volunteer/dashboard' };
          setTimeout(() => router.push(dashRoutes[role] || '/'), 800);
        }
      }
    } catch (error) {
      toast.error(extractError(error, 'بيانات الدخول غير صحيحة. حاول مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      <ToastContainer position="top-center" rtl theme="colored" />

      {/* ===== الجانب الأيمن — نموذج الدخول ===== */}
      <div className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-12 bg-white relative relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] mx-auto relative"
        >
          {/* زر الرجوع للخلف */}
          <Link href="/" className="absolute -top-12 lg:-top-16 right-0 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>

          {/* الشعار */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group mt-4 lg:mt-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow border-2 border-slate-100 flex items-center justify-center bg-white">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-2xl font-extrabold text-slate-800">رعاية</span>
          </Link>

          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">مرحباً بعودتك 👋</h1>
            <p className="text-slate-500 text-base">سجّل دخولك للوصول إلى حسابك على منصة رعاية</p>
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* البريد الإلكتروني أو اسم المستخدم */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني أو اسم المستخدم</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder="example@email.com أو اسم المستخدم"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                  dir="ltr"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white block p-4 pr-12 transition-all duration-200 hover:border-slate-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white block p-4 pr-12 transition-all duration-200 hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold"
                >
                  {showPassword ? 'إخفاء' : 'إظهار'}
                </button>
              </div>
            </div>

            {/* نسيت كلمة المرور */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-sky-600 font-semibold hover:text-sky-700 hover:underline transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* زر الدخول */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full gradient-sky text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-sky-200 hover:shadow-lg hover:shadow-sky-300 disabled:opacity-70 disabled:cursor-wait text-base mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </motion.button>
          </form>

          {/* فاصل */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">أو</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* رابط التسجيل */}
          <p className="text-center text-sm text-slate-500">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-sky-600 font-bold hover:text-sky-700 hover:underline transition-colors">
              أنشئ حساباً مجانياً
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ===== الجانب الأيسر — الـ Hero Panel (يظهر على الشاشات الكبيرة فقط) ===== */}
      <div className="hidden lg:flex lg:w-[48%] gradient-hero flex-col justify-between p-14 relative overflow-hidden">
        {/* خلفية زخرفية */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        {/* المحتوى العلوي */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-semibold mb-10">
            <Heart className="w-4 h-4" fill="currentColor" />
            رعاية صحية مجانية للجميع
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-5">
            معاً نبني<br />
            <span className="text-sky-200">مجتمعاً أصح</span>
          </h2>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            منصة رعاية تجمع الأطباء المتطوعين والمرضى المحتاجين في رحلة واحدة نحو صحة أفضل لجميع المصريين.
          </p>
        </div>

        {/* إحصائيات */}
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/65 mt-0.5">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-white/40 text-xs mt-6 text-center">© 2026 رعاية — منصة خيرية غير ربحية</p>
        </div>
      </div>
    </div>
  );
}
