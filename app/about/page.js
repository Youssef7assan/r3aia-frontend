"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Heart,
  Shield,
  Eye,
  Handshake,
  Target,
  Users,
  Award,
  Globe,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { TextReveal, GradientText, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/aceternity";
import StatsSection from "@/components/sections/StatsSection";
import CTASection from "@/components/sections/CTASection";

const values = [
  { icon: Heart, title: "الرحمة", desc: "نتعامل مع كل مريض بحب ورحمة، لأننا نؤمن بأن كل إنسان يستحق العناية.", color: "text-rose-500 bg-rose-50" },
  { icon: Shield, title: "الأمانة", desc: "نلتزم بأعلى معايير الشفافية والأمانة في كل ما نقدمه من خدمات.", color: "text-sky-500 bg-sky-50" },
  { icon: Eye, title: "الرؤية", desc: "نسعى لأن تصل الرعاية الصحية المجانية لكل مريض محتاج في مصر.", color: "text-purple-500 bg-purple-50" },
  { icon: Handshake, title: "التعاون", desc: "نعمل كفريق واحد - أطباء ومتطوعين ومتبرعين - لتحقيق هدف مشترك.", color: "text-cyan-500 bg-cyan-50" },
  { icon: Target, title: "التميز", desc: "نسعى للتميز في كل خدمة نقدمها لضمان أعلى جودة للرعاية الصحية.", color: "text-sky-500 bg-sky-50" },
  { icon: Globe, title: "الشمولية", desc: "خدماتنا متاحة لجميع المحتاجين بغض النظر عن مكانهم أو خلفيتهم.", color: "text-green-500 bg-green-50" },
];

const team = [
  { name: "د. أحمد محمود", role: "المدير الطبي", avatar: "أ" },
  { name: "سارة إبراهيم", role: "مدير العمليات", avatar: "س" },
  { name: "محمد حسن", role: "مدير التطوع", avatar: "م" },
  { name: "نور عبدالله", role: "مدير التواصل", avatar: "ن" },
];

export default function AboutPage() {
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  return (
    <>
      <PageHeader title="من نحن" breadcrumbs={[{ label: "من نحن" }]} />

      {/* About Intro */}
      <section ref={aboutRef} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Image
                src="/images/hero-illustration.png"
                alt="فريق رعاية"
                width={500}
                height={500}
                className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-5 -left-5 gradient-sky text-white px-7 py-5 rounded-2xl shadow-lg text-center"
              >
                <span className="block text-3xl font-black">+5</span>
                <span className="text-xs font-medium opacity-90">سنوات من العطاء</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                نحن منصة <GradientText>رعاية</GradientText> الخيرية
              </h2>
              <p className="text-base text-slate-400 leading-relaxed mb-4">
                تأسست رعاية بهدف سد الفجوة في الرعاية الصحية للمحتاجين في مصر. نؤمن بأن
                كل إنسان يستحق الحصول على رعاية صحية كريمة بغض النظر عن وضعه المادي.
              </p>
              <p className="text-base text-slate-400 leading-relaxed mb-4">
                نعمل من خلال شبكة واسعة من الأطباء المتطوعين والمتطوعين في مجال التوصيل
                والمتبرعين الكرام لتوفير استشارات طبية مجانية وأدوية للمرضى المحتاجين.
              </p>
              <p className="text-base text-slate-400 leading-relaxed">
                رؤيتنا هي الوصول لكل مريض محتاج في مصر وتقديم الرعاية الصحية التي يستحقها.
                نعمل بلا كلل لتحقيق هذه الرؤية يوماً بعد يوم.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Award className="w-3.5 h-3.5" />
              قيمنا ومبادئنا
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              القيم التي <GradientText>تحركنا</GradientText>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              نلتزم بمجموعة من القيم الراسخة التي توجه كل خطوة نخطوها
            </p>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" staggerDelay={0.08}>
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <SpotlightCard className="p-8 text-center h-full">
                    <motion.div
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-[68px] h-[68px] mx-auto mb-5 rounded-2xl flex items-center justify-center ${v.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Users className="w-3.5 h-3.5" />
              فريق العمل
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              تعرّف على <GradientText>فريقنا</GradientText>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              فريق متفانٍ يعمل بحب وإخلاص لخدمة المرضى المحتاجين
            </p>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7" staggerDelay={0.1}>
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(14,165,233,0.15)" }}
                  className="text-center p-8 rounded-2xl bg-white transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14,165,233,0.3)" }}
                    className="w-24 h-24 mx-auto mb-5 rounded-full gradient-sky flex items-center justify-center text-white text-3xl font-bold"
                  >
                    {member.avatar}
                  </motion.div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">{member.name}</h3>
                  <p className="text-sm text-sky-500 font-semibold">{member.role}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </>
  );
}
