"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Hourglass, ArrowLeft, Clock, Info } from 'lucide-react';

export default function PendingReviewPage() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] font-['Cairo'] flex items-center justify-center p-6 selection:bg-sky-500/30" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
          
          <div className="h-1.5 bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 w-full animate-gradient-x" />
          
          <div className="p-10 text-center flex flex-col items-center">
            
            <motion.div 
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <Link href="/" className="font-black text-2xl tracking-tighter flex items-center gap-3 text-slate-800">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 overflow-hidden border-2 border-slate-100">
                  <Image src="/logo.jpg" alt="R3AIA Logo" width={48} height={48} className="object-cover" />
                </div>
                R3AIA
              </Link>
            </motion.div>

            {/* Animated Hourglass */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-28 h-28 bg-gradient-to-br from-sky-50 to-sky-100 rounded-[2rem] flex items-center justify-center mb-8 border border-sky-100 shadow-inner"
            >
              <Hourglass className="w-14 h-14 text-sky-500 animate-pulse" />
            </motion.div>

            <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">حسابك قيد المراجعة</h1>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed max-w-[280px]">
              نشكرك على التسجيل في رعاية. يقوم فريقنا حالياً بمراجعة بياناتك لضمان جودة الخدمة. 
              سنقوم بإشعارك فور التفعيل.
            </p>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 mb-10 text-right"
            >
              <div className="text-sky-500 bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 mb-0.5">حالة الحساب</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  <p className="text-xs text-sky-600 font-medium">جاري معالجة البيانات</p>
                </div>
              </div>
            </motion.div>

            <button onClick={handleLogout} className="group w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors duration-300 shadow-lg shadow-sky-500/30">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                تسجيل الخروج والعودة للرئيسية
              </div>
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <Info className="w-4 h-4" />
              قد تستغرق المراجعة ما يصل إلى 48 ساعة كحد أقصى.
            </div>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}
