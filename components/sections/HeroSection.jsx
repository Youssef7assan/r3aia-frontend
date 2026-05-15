"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Stethoscope, HandHelping, CheckCircle, Truck, LogIn, UserPlus } from "lucide-react";
import { AnimatedCounter, FloatingBadge } from "../ui/aceternity";
import ParticlesBackground from "../ui/ParticlesBackground";

export default function HeroSection() {
  useEffect(() => {
    // Keep any other initialization here if needed
  }, []);

  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* 3D Animated Particles Background */}
      <ParticlesBackground />

      <div className="max-w-7xl mx-auto px-6 relative z-[2] pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <FloatingBadge
                icon={<span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>}
                text="منصة خيرية معتمدة في مصر"
                className="mb-6"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white leading-[1.2] mb-5"
            >
              نقدم{" "}
              <span className="relative inline-block">
                رعاية صحية
                <span className="absolute bottom-1 right-0 w-full h-3 bg-sky-400/30 rounded -z-[1]" />
              </span>
              <br />
              مجانية لكل محتاج
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              نؤمن بأن الرعاية الصحية حق لكل إنسان. نوفر استشارات طبية مجانية،
              روشتات للصيدلية، وتوصيل الأدوية للمرضى المحتاجين في جميع أنحاء مصر.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-sky-700 rounded-2xl font-bold text-base shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-8 py-4 glass text-white rounded-2xl font-bold text-base border-2 border-white/20 hover:bg-white/15 hover:border-white/40 hover:-translate-y-1 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex gap-8 sm:gap-12 justify-center lg:justify-start"
            >
              {[
                { target: 5000, label: "مريض تمت مساعدته" },
                { target: 200, label: "طبيب متطوع" },
                { target: 1500, label: "متطوع نشط" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="text-2xl sm:text-3xl font-black text-white block">
                    <AnimatedCounter target={stat.target} />
                  </span>
                  <span className="text-xs sm:text-sm text-white/60 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative animate-float">
              <Image
                src="/images/hero-illustration.png"
                alt="رعاية - مساعدة المرضى المحتاجين"
                width={550}
                height={550}
                className="w-full max-w-md lg:max-w-lg mx-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="hidden md:flex absolute bottom-[15%] left-[-5%] glass-card rounded-2xl px-5 py-4 shadow-xl items-center gap-3 animate-float-slow"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">استشارة مكتملة</h4>
                <p className="text-xs text-slate-400">تم إرسال الروشتة</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="hidden md:flex absolute top-[15%] right-[-5%] glass-card rounded-2xl px-5 py-4 shadow-xl items-center gap-3 animate-float-slow"
              style={{ animationDelay: "1s" }}
            >
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">جاري توصيل الدواء</h4>
                <p className="text-xs text-slate-400">متطوع في الطريق</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-[-2px] left-0 right-0 z-[3]">
        <svg viewBox="0 0 1440 80" fill="none" className="block w-full h-16 sm:h-20" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
