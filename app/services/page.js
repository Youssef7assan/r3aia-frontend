"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserRound,
  Pill,
  Truck,
  CalendarCheck,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  Star,
  ArrowLeft,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { TextReveal, GradientText, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/aceternity";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

const mainServices = [
  {
    icon: UserRound,
    title: "استشارة طبية مجانية",
    desc: "احجز موعداً مع طبيب متخصص في أي تخصص طبي. استشارات مجانية بالكامل مع أطباء متطوعين ذوي خبرة عالية.",
    features: ["أكثر من 20 تخصص طبي", "أطباء معتمدين", "متابعة مستمرة", "سرية تامة"],
    image: "/images/consultation-3d.png",
    color: "from-sky-500 to-cyan-400",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    icon: Pill,
    title: "طلب روشتة طبية",
    desc: "بعد الاستشارة الطبية، يمكنك الحصول على روشتة معتمدة وصرف الأدوية مجاناً من صيدليات شريكة.",
    features: ["روشتة معتمدة", "أدوية أصلية", "صيدليات شريكة", "صرف مجاني"],
    image: "/images/prescription-3d.png",
    color: "from-cyan-500 to-sky-400",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
  {
    icon: Truck,
    title: "توصيل الأدوية",
    desc: "متطوعون مدربون يوصلون الأدوية لباب بيتك في الوقت المناسب. خدمة مجانية في جميع المحافظات.",
    features: ["توصيل مجاني", "متطوعين موثوقين", "تغطية واسعة", "تتبع مباشر"],
    image: "/images/delivery-3d.png",
    color: "from-purple-500 to-sky-400",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
];

const processSteps = [
  { icon: CalendarCheck, title: "احجز موعدك", desc: "اختر التخصص المطلوب وحدد الوقت المناسب لك" },
  { icon: UserRound, title: "تحدث مع الطبيب", desc: "استشارة شاملة مع طبيب متخصص" },
  { icon: FileText, title: "احصل على الروشتة", desc: "روشتة معتمدة مع التشخيص والعلاج" },
  { icon: Truck, title: "استلم الدواء", desc: "يصلك الدواء لباب بيتك عبر متطوعينا" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader title="خدماتنا" breadcrumbs={[{ label: "خدماتنا" }]} />

      {/* Services Detail */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {mainServices.map((service, idx) => {
            const Icon = service.icon;
            const isEven = idx % 2 === 1;
            return (
              <ServiceBlock key={service.title} service={service} isEven={isEven} />
            );
          })}
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Clock className="w-3.5 h-3.5" />
              رحلة العلاج
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              رحلتك معنا <GradientText>خطوة بخطوة</GradientText>
            </h2>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7" staggerDelay={0.12}>
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.title}>
                  <div className="text-center p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(14,165,233,0.3)" }}
                      className="w-16 h-16 mx-auto mb-5 rounded-full gradient-sky text-white flex items-center justify-center shadow-md"
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                    <div className="text-xs font-bold text-sky-400 mb-2">خطوة {i + 1}</div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              لماذا تثق في <GradientText>رعاية؟</GradientText>
            </h2>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
            {[
              { icon: Shield, title: "بيانات مشفرة", desc: "حمايتك أولويتنا" },
              { icon: Star, title: "أطباء معتمدين", desc: "خبرة واحترافية" },
              { icon: Clock, title: "متاح 24/7", desc: "في أي وقت تحتاجنا" },
              { icon: CheckCircle, title: "خدمة مجانية", desc: "بالكامل بدون رسوم" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <StaggerItem key={badge.title}>
                  <div className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all">
                    <div className="w-12 h-12 min-w-[48px] rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{badge.title}</h4>
                      <p className="text-xs text-slate-400">{badge.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </>
  );
}

function ServiceBlock({ service, isEven }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = service.icon;

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: isEven ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={`relative ${isEven ? "lg:order-2" : ""}`}
      >
        <div className={`absolute -top-5 ${isEven ? "-left-5" : "-right-5"} w-32 h-32 rounded-2xl ${service.bgColor} -z-[1] animate-float-slow`} />
        <Image
          src={service.image}
          alt={service.title}
          width={480}
          height={480}
          className="w-full max-w-md mx-auto animate-float rounded-3xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isEven ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={isEven ? "lg:order-1" : ""}
      >
        <div className={`inline-flex items-center gap-2 px-5 py-2 ${service.bgColor} ${service.textColor} rounded-full text-sm font-semibold mb-4`}>
          <Icon className="w-3.5 h-3.5" />
          {service.title}
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
          {service.title}
        </h2>

        <p className="text-base text-slate-400 leading-relaxed mb-8">{service.desc}</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {service.features.map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-500">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <Link
          href="#"
          className={`inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-l ${service.color} text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
        >
          ابدأ الآن
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
