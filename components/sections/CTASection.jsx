"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LogIn, UserPlus } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="gradient-hero rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-1/2 -right-[30%] w-[400px] h-[400px] bg-white/[0.06] rounded-full" />
          <div className="absolute -bottom-[40%] -left-[20%] w-[300px] h-[300px] bg-white/[0.04] rounded-full" />

          <div className="relative z-[1]">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              جاهز تبدأ رحلتك مع رعاية؟
            </h2>
            <p className="text-base sm:text-lg text-white/75 mb-9 max-w-xl mx-auto">
              سواء كنت محتاج مساعدة طبية أو عايز تتطوع وتساعد غيرك، إحنا هنا عشانك
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-sky-700 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-8 py-4 glass text-white rounded-2xl font-bold border-2 border-white/20 hover:bg-white/15 hover:border-white/40 hover:-translate-y-1 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
