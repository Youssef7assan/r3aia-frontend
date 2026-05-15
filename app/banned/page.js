"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Ban, ArrowLeft, ShieldAlert, LogOut, MessageSquareWarning } from 'lucide-react';

export default function BannedPage() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] font-['Cairo'] flex items-center justify-center p-6 selection:bg-rose-500/30" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
          
          <div className="h-1.5 bg-gradient-to-r from-red-400 via-rose-500 to-red-400 w-full animate-gradient-x" />
          
          <div className="p-10 text-center flex flex-col items-center">
            
            <motion.div 
              initial={{ rotate: 10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-10"
            >
              <div className="font-black text-2xl tracking-tighter flex items-center gap-3 text-slate-800">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 overflow-hidden border-2 border-slate-100">
                  <Image src="/logo.jpg" alt="R3AIA Logo" width={48} height={48} className="object-cover grayscale" />
                </div>
                R3AIA
              </div>
            </motion.div>

            {/* Animated Ban Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-28 h-28 bg-gradient-to-br from-rose-50 to-red-100 rounded-[2rem] flex items-center justify-center mb-8 border border-rose-100 shadow-inner group relative"
            >
              <div className="absolute inset-0 bg-rose-200/50 rounded-[2rem] blur-xl animate-pulse" />
              <Ban className="w-14 h-14 text-rose-500 relative z-10" />
            </motion.div>

            <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">تم حظر حسابك</h1>
            
            <p className="text-slate-500 mb-4 text-sm leading-relaxed max-w-[280px]">
              لقد تم تعليق حسابك لمخالفته شروط وأحكام المنصة المتبعة لضمان بيئة آمنة للجميع.
            </p>
            <p className="text-slate-400 mb-8 text-xs leading-relaxed max-w-[280px]">
              إذا كنت تعتقد أن هذا الإجراء تم عن طريق الخطأ، يرجى التواصل مع الدعم الفني فوراً.
            </p>

            <button className="group w-full relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors duration-300 shadow-lg shadow-rose-500/30">
                <MessageSquareWarning className="w-5 h-5" />
                تواصل مع الدعم الفني
              </div>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-700 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 text-sm"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج والعودة للرئيسية
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
