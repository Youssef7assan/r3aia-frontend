"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserRound,
  Pill,
  Truck,
  HandCoins,
  Users,
  Headset,
  ArrowLeft,
  Star,
} from "lucide-react";
import { SpotlightCard, StaggerContainer, StaggerItem, TextReveal, GradientText } from "../ui/aceternity";

const services = [
  {
    icon: UserRound,
    title: "استشارة طبية مجانية",
    desc: "احجز استشارة طبية مجانية مع أطباء متخصصين في جميع التخصصات الطبية. نوفر لك الرعاية التي تحتاجها.",
    link: "/services",
    linkText: "احجز الآن",
    color: "bg-sky-50 text-sky-500",
  },
  {
    icon: Pill,
    title: "طلب روشتة طبية",
    desc: "يمكنك طلب روشتة طبية من الصيدلية مباشرة. نساعدك في الحصول على الأدوية التي تحتاجها مجاناً.",
    link: "/services",
    linkText: "اطلب الآن",
    color: "bg-cyan-50 text-cyan-500",
  },
  {
    icon: Truck,
    title: "توصيل الأدوية",
    desc: "متطوعين مستعدين لتوصيل الأدوية لباب بيتك. نضمن وصول العلاج في الوقت المناسب.",
    link: "/volunteer",
    linkText: "اعرف المزيد",
    color: "bg-purple-50 text-purple-500",
  },
  {
    icon: HandCoins,
    title: "التبرع للمرضى",
    desc: "ساهم في تقديم الرعاية الصحية للمحتاجين. كل تبرع يصنع فرقاً في حياة مريض محتاج.",
    link: "/volunteer",
    linkText: "تبرع الآن",
    color: "bg-sky-50 text-sky-500",
  },
  {
    icon: Users,
    title: "التطوع",
    desc: "انضم لفريقنا من المتطوعين. اصنع أثراً إيجابياً في مجتمعك وساعد المرضى المحتاجين.",
    link: "/volunteer",
    linkText: "انضم لنا",
    color: "bg-green-50 text-green-500",
  },
  {
    icon: Headset,
    title: "دعم المرضى",
    desc: "فريق متخصص لدعم المرضى ومتابعة حالاتهم. نهتم بك من البداية حتى الشفاء بإذن الله.",
    link: "/contact",
    linkText: "تواصل معنا",
    color: "bg-rose-50 text-rose-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <TextReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
            <Star className="w-3.5 h-3.5" />
            خدماتنا المميزة
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            كيف يمكننا <GradientText>مساعدتك؟</GradientText>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            نقدم مجموعة متكاملة من الخدمات الصحية المجانية لخدمة المرضى المحتاجين في كل مكان
          </p>
        </TextReveal>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" staggerDelay={0.08}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <SpotlightCard className="p-8 text-center group cursor-pointer h-full">
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-sky-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl ${service.color}`}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-5">{service.desc}</p>

                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-2 text-sky-500 font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    <span>{service.linkText}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
