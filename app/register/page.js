"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Check, Users, Stethoscope, HandHeart, Pill, ArrowLeft } from 'lucide-react';
import StepAccountType from '../../components/auth/StepAccountType';
import StepBasicInfo from '../../components/auth/StepBasicInfo';
import StepCompleteProfile from '../../components/auth/StepCompleteProfile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { parseJwt } from '../../lib/jwt';

const steps = [
  { number: 1, label: 'نوع الحساب' },
  { number: 2, label: 'البيانات الأساسية' },
  { number: 3, label: 'إكمال الملف' },
];

const sideInfo = {
  1: {
    title: 'انضم لمجتمع رعاية',
    desc: 'سواء كنت مريضًا يحتاج مساعدة، أو طبيبًا يريد التطوع، أو صيدلانيًا أو متطوعًا — هنا مكانك.',
    items: [
      { icon: Users, text: 'أكثر من ٥،٠٠٠ مستفيد' },
      { icon: Stethoscope, text: 'أطباء متطوعون معتمدون' },
      { icon: HandHeart, text: 'خدمة مجانية بالكامل' },
      { icon: Pill, text: 'صيدليات شريكة في كل المحافظات' },
    ],
  },
  2: {
    title: 'بياناتك في أمان تام',
    desc: 'جميع بياناتك الشخصية مشفرة ولا تُشارك مع أي طرف ثالث. خصوصيتك هي أولويتنا.',
    items: [
      { icon: Check, text: 'تشفير كامل للبيانات' },
      { icon: Check, text: 'لا مشاركة مع أطراف ثالثة' },
      { icon: Check, text: 'التحقق من الهوية لضمان الأمان' },
      { icon: Check, text: 'سياسة خصوصية شفافة' },
    ],
  },
  3: {
    title: 'خطوة أخيرة فقط!',
    desc: 'أكمل رفع مستنداتك لنتمكن من التحقق من هويتك وتفعيل حسابك بأسرع وقت ممكن.',
    items: [
      { icon: Check, text: 'مراجعة سريعة خلال 24 ساعة' },
      { icon: Check, text: 'إشعار فور تفعيل الحساب' },
      { icon: Check, text: 'دعم فني متاح دائماً' },
      { icon: Check, text: 'مرحباً بك في عائلة رعاية!' },
    ],
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const info = sideInfo[step];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
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

  const renderStep = () => {
    switch (step) {
      case 1: return <StepAccountType currentRole={role} setRole={setRole} onNext={() => setStep(2)} />;
      case 2: return <StepBasicInfo role={role} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3: return <StepCompleteProfile role={role} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      <ToastContainer position="top-center" rtl theme="colored" />

      {/* ===== الجانب الأيمن — نموذج التسجيل ===== */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-10 bg-white overflow-y-auto relative">
        <div className="w-full max-w-[480px] mx-auto relative mt-8 lg:mt-0">
          {/* زر الرجوع للخلف */}
          <Link href="/" className="absolute -top-10 lg:-top-12 right-0 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>

          {/* الشعار */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <motion.div
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden"
            >
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover scale-105" />
            </motion.div>
            <span className="text-xl font-extrabold text-slate-800">رعاية</span>
          </Link>

          {/* شريط التقدم */}
          <div className="mb-8">
            <div className="flex items-center gap-0 mb-5">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center flex-1">
                  {/* Circle */}
                  <div className={`relative flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${step > s.number
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : step === s.number
                      ? 'bg-white border-sky-500 text-sky-600'
                      : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  {/* Label */}
                  <span className={`mr-2 text-xs font-semibold whitespace-nowrap ${step >= s.number ? 'text-sky-600' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                  {/* Line */}
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${step > s.number ? 'bg-sky-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* محتوى الخطوة */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* رابط الدخول */}
          {step < 3 && (
            <p className="text-center text-sm text-slate-500 mt-8 pt-6 border-t border-slate-100">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-sky-600 font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ===== الجانب الأيسر — Info Panel (شاشات كبيرة فقط) ===== */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero flex-col justify-between p-12 relative overflow-hidden">
        {/* خلفية */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }}
        />
        <div className="absolute -top-24 -left-16 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        {/* المحتوى */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-semibold mb-10">
            <Heart className="w-4 h-4" fill="currentColor" />
            انضم لأكثر من ١٥٠٠ متطوع
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">
                {info.title}
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-10 max-w-sm">
                {info.desc}
              </p>

              <ul className="space-y-4">
                {info.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                      className="flex items-center gap-3.5 text-white"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-white/85">{item.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicator في الأسفل */}
        <div className="relative z-10">
          <div className="flex gap-2 mb-4">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`h-1.5 rounded-full transition-all duration-500 ${step >= s.number ? 'bg-white flex-[2]' : 'bg-white/25 flex-1'}`}
              />
            ))}
          </div>
          <p className="text-white/40 text-xs">
            خطوة {step} من {steps.length} — {steps[step - 1].label}
          </p>
        </div>
      </div>
    </div>
  );
}
