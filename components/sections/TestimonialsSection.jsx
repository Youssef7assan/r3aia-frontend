"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TextReveal, GradientText, StaggerContainer, StaggerItem, SpotlightCard } from "../ui/aceternity";

const testimonials = [
  {
    text: "الحمد لله، كنت محتاجة استشارة طبية ومكنتش قادرة أروح دكتور. المنصة وفرت لي استشارة مجانية مع دكتور متخصص وكمان وصلولي الدواء لحد البيت.",
    name: "أم أحمد",
    role: "مريضة مستفيدة - القاهرة",
    avatar: "أ",
  },
  {
    text: "كطبيب، أشعر بسعادة كبيرة لمساعدة المرضى المحتاجين. المنصة نظمت العملية بشكل رائع وسهلت علينا تقديم الاستشارات بكفاءة.",
    name: "د. محمد إبراهيم",
    role: "طبيب متطوع - الإسكندرية",
    avatar: "د",
  },
  {
    text: "بتطوع في توصيل الأدوية من سنة وحاسس إن الشغل ده ليه معنى حقيقي. كل مرة بوصّل دواء لمريض محتاج بحس بفرحة كبيرة.",
    name: "عمرو سعيد",
    role: "متطوع توصيل - الجيزة",
    avatar: "ع",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <TextReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
            <Quote className="w-3.5 h-3.5" />
            آراء المستفيدين
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            ماذا يقول <GradientText>مستفيدونا؟</GradientText>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            قصص حقيقية من مرضى ومتطوعين شاركوا تجربتهم مع منصة رعاية
          </p>
        </TextReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" staggerDelay={0.12}>
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <SpotlightCard className="p-8 h-full">
                <Quote className="w-8 h-8 text-sky-200 mb-4" />
                <p className="text-sm text-slate-500 leading-[1.9] mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full gradient-sky flex items-center justify-center text-white text-lg font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
