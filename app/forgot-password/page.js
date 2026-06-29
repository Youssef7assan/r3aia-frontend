"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft, Heart, Shield, Users, Star, CreditCard } from 'lucide-react';
import api from '../../lib/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import extractError from '../../lib/extractError';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const stats = [
  { icon: Users, value: '٥٠٠٠+', label: 'مريض مستفيد' },
  { icon: Heart, value: '١٥٠٠+', label: 'متطوع نشط' },
  { icon: Shield, value: '٩٨%', label: 'نسبة الرضا' },
  { icon: Star, value: '٢٧', label: 'محافظة مغطاة' },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', nationalID: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/Auth/reset-password', {
        email: formData.email,
        nationalID: formData.nationalID,
        newPassword: formData.newPassword,
      });
      
      toast.success('تم تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (error) {
      toast.error(extractError(error, 'تأكد من صحة البريد الإلكتروني والرقم القومي.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      <ToastContainer position="top-center" rtl theme="colored" />

      {/* ===== الجانب الأيمن — نموذج الاسترجاع ===== */}
      <div className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-12 bg-white relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] mx-auto relative"
        >
          {/* زر الرجوع للخلف */}
          <Link href="/login" className="absolute -top-12 lg:-top-16 right-0 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            العودة لتسجيل الدخول
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
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">نسيت كلمة المرور؟ 🔑</h1>
            <p className="text-slate-500 text-base">قم بإدخال بريدك الإلكتروني ورقمك القومي لتعيين كلمة مرور جديدة.</p>
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  dir="ltr"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white block p-4 pr-12 transition-all duration-200 hover:border-slate-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* الرقم القومي */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">الرقم القومي</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="nationalID"
                  placeholder="الرقم القومي (14 رقم)"
                  value={formData.nationalID}
                  onChange={handleChange}
                  required
                  maxLength={14}
                  minLength={14}
                  dir="ltr"
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm rounded-2xl focus:ring-0 focus:border-sky-400 focus:bg-white block p-4 pr-12 transition-all duration-200 hover:border-slate-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">كلمة المرور الجديدة</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
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

            {/* زر التغيير */}
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
                  <span>تغيير كلمة المرور</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </motion.button>
          </form>
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
