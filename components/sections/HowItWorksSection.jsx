"use client";

import { motion } from "framer-motion";
import { Route } from "lucide-react";
import { TextReveal, GradientText, StaggerContainer, StaggerItem } from "../ui/aceternity";

const steps = [
  { num: "١", title: "سجّل حسابك", desc: "أنشئ حساباً مجانياً على المنصة في دقائق معدودة" },
  { num: "٢", title: "اختر الخدمة", desc: "حدد نوع الخدمة التي تحتاجها: استشارة أو روشتة" },
  { num: "٣", title: "تواصل مع الطبيب", desc: "احصل على استشارة طبية متخصصة مع أطبائنا المتطوعين" },
  { num: "٤", title: "استلم العلاج", desc: "يصلك الدواء لباب بيتك من خلال متطوعينا" },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <TextReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
            <Route className="w-3.5 h-3.5" />
            خطوات بسيطة
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            كيف <GradientText>يعمل النظام؟</GradientText>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            في خطوات بسيطة، يمكنك الحصول على الرعاية الصحية التي تحتاجها
          </p>
        </TextReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative" staggerDelay={0.12}>
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-[50px] left-[15%] right-[15%] h-[3px] bg-sky-100 z-0" />

          {steps.map((step) => (
            <StaggerItem key={step.num} className="text-center relative z-[1]">
              <motion.div
                whileHover={{ scale: 1.15, boxShadow: "0 0 30px rgba(14,165,233,0.3)" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full gradient-sky text-white text-xl font-black flex items-center justify-center shadow-md relative"
              >
                {step.num}
                <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-sky-200 animate-spin-slow" />
              </motion.div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
