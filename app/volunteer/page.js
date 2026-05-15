"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Stethoscope,
  Truck,
  HandCoins,
  Megaphone,
  Check,
  ArrowLeft,
  Gift,
  Users,
  Clock,
  MapPin,
  Star,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { TextReveal, GradientText, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/aceternity";
import StatsSection from "@/components/sections/StatsSection";

const volunteerTypes = [
  {
    icon: Stethoscope,
    title: "تطوع كطبيب",
    desc: "قدم استشارات طبية مجانية للمرضى المحتاجين في تخصصك. ساعد في تشخيص الحالات ووصف العلاج المناسب.",
    features: [
      "حدد أوقات فراغك للاستشارات",
      "تخصصك يخدم من يحتاجه",
      "متابعة مع المرضى بشكل مستمر",
      "شهادة تقدير وتطوع معتمدة",
    ],
    gradient: "from-sky-500 to-cyan-400",
  },
  {
    icon: Truck,
    title: "متطوع توصيل",
    desc: "ساعد في توصيل الأدوية والعلاجات للمرضى في منطقتك. كل توصيلة تنقذ حياة.",
    features: [
      "اختر المنطقة الجغرافية",
      "توصيل في أوقات مرنة",
      "تطبيق خاص لتتبع الطلبات",
      "تقدير ومكافآت شهرية",
    ],
    gradient: "from-purple-500 to-sky-400",
  },
  {
    icon: HandCoins,
    title: "تبرع ماليّ",
    desc: "ساهم بتبرع مالي لشراء الأدوية وتمويل الاستشارات الطبية. كل جنيه يصنع فرقاً.",
    features: [
      "تبرع لمرة واحدة أو شهري",
      "شفافية كاملة في الصرف",
      "تقرير شهري بالإنجازات",
      "صدقة جارية في ميزان حسناتك",
    ],
    gradient: "from-sky-500 to-orange-400",
  },
];

const impactNumbers = [
  { icon: Heart, number: "٥,٠٠٠+", label: "مريض تمت مساعدته" },
  { icon: Users, number: "١,٥٠٠+", label: "متطوع نشط" },
  { icon: MapPin, number: "٢٧", label: "محافظة يتم تغطيتها" },
  { icon: Star, number: "٩٨%", label: "نسبة رضا المستفيدين" },
];

export default function VolunteerPage() {
  const impactRef = useRef(null);
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });

  return (
    <>
      <PageHeader title="تطوع معنا" breadcrumbs={[{ label: "تطوع معنا" }]} />

      {/* Intro */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -top-5 -right-5 w-32 h-32 rounded-2xl bg-rose-100 -z-[1] animate-float-slow" />
              <Image
                src="/images/volunteer-3d.png"
                alt="تطوع معنا"
                width={480}
                height={480}
                className="w-full max-w-md mx-auto animate-float rounded-3xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-500 rounded-full text-sm font-semibold mb-4 border border-rose-100">
                <Heart className="w-3.5 h-3.5" fill="currentColor" />
                كن جزءاً من التغيير
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                وقتك وجهدك يصنعان <GradientText>فرقاً حقيقياً</GradientText>
              </h2>

              <p className="text-base text-slate-400 leading-relaxed mb-5">
                انضم لمجتمع رعاية من المتطوعين المتفانين. سواء كنت طبيباً، سائقاً،
                أو حتى تريد المساعدة بأي طريقة - هناك مكان لك هنا.
              </p>
              <p className="text-base text-slate-400 leading-relaxed mb-8">
                كل ساعة تتطوع فيها، كل دواء توصله، كل استشارة تقدمها - تغيّر حياة إنسان للأفضل.
                انضم لنا اليوم واصنع أثراً يدوم.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#volunteer-types"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 gradient-sky text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Heart className="w-4 h-4" />
                  ابدأ التطوع
                </Link>
                <Link
                  href="#donate"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-sky-600 border border-sky-200 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Gift className="w-4 h-4" />
                  تبرع الآن
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Volunteer Types */}
      <section id="volunteer-types" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Users className="w-3.5 h-3.5" />
              طرق التطوع
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              اختر الطريقة <GradientText>المناسبة لك</GradientText>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              هناك أكثر من طريقة لتساهم معنا في خدمة المرضى المحتاجين
            </p>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7" staggerDelay={0.12}>
            {volunteerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <StaggerItem key={type.title}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-[0_20px_60px_rgba(14,165,233,0.15)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                    {/* Header */}
                    <div className={`p-8 bg-gradient-to-l ${type.gradient} text-white text-center`}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -10 }}
                        className="inline-block"
                      >
                        <Icon className="w-12 h-12 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-bold">{type.title}</h3>
                    </div>

                    {/* Body */}
                    <div className="p-7 flex-1 flex flex-col">
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">{type.desc}</p>
                      <ul className="space-y-3 mb-7 flex-1">
                        {type.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-slate-500">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/contact"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 gradient-sky text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        سجّل الآن
                        <ArrowLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Impact Section */}
      <section ref={impactRef} className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l4 3.5-4 3z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-7xl mx-auto px-6 relative z-[1]">
          <TextReveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              أثرنا الحقيقي
            </h2>
            <p className="text-base text-white/70 max-w-md mx-auto">
              أرقام تعكس حجم التأثير الذي صنعه متطوعونا
            </p>
          </TextReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactNumbers.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={impactInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15 }}
                  className="text-center text-white"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center"
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                  <span className="text-3xl font-black block mb-1">{item.number}</span>
                  <span className="text-sm opacity-70">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="donate" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Gift className="w-3.5 h-3.5" />
              ساهم بتبرعك
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              تبرعك يصنع <GradientText>الفرق</GradientText>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              كل جنيه تتبرع به يذهب مباشرة لشراء الأدوية وتمويل الاستشارات الطبية للمحتاجين
            </p>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 max-w-4xl mx-auto" staggerDelay={0.1}>
            {[
              { amount: "٥٠ جنيه", desc: "تكفي لعلاج مريض لمدة أسبوع", icon: "💊" },
              { amount: "١٥٠ جنيه", desc: "تكفي لعلاج مريض لمدة شهر", icon: "🏥" },
              { amount: "٥٠٠ جنيه", desc: "تكفي لعلاج عائلة كاملة", icon: "❤️" },
            ].map((donation) => (
              <StaggerItem key={donation.amount}>
                <SpotlightCard className="p-8 text-center h-full">
                  <span className="text-4xl block mb-4">{donation.icon}</span>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{donation.amount}</h3>
                  <p className="text-sm text-slate-400 mb-6">{donation.desc}</p>
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 gradient-sky text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    تبرع الآن
                  </Link>
                </SpotlightCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Trust note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex items-center justify-center gap-3 text-sm text-slate-400"
          >
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>جميع التبرعات آمنة ومشفرة. شفافية كاملة في صرف التبرعات.</span>
          </motion.div>
        </div>
      </section>

      {/* Volunteer Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              تجارب <GradientText>متطوعينا</GradientText>
            </h2>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-4xl mx-auto" staggerDelay={0.12}>
            {[
              {
                text: "التطوع في رعاية غيّر نظرتي للحياة. كل مريض بساعده بحس إن يومي ليه معنى حقيقي.",
                name: "د. فاطمة أحمد",
                role: "طبيبة أطفال متطوعة",
                avatar: "ف",
              },
              {
                text: "من سنتين وأنا متطوع توصيل. أجمل لحظة لما بشوف الفرحة في عيون المريض لما بوصلّه الدواء.",
                name: "كريم محمود",
                role: "متطوع توصيل - المنصورة",
                avatar: "ك",
              },
            ].map((t) => (
              <StaggerItem key={t.name}>
                <SpotlightCard className="p-8 h-full">
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

      <StatsSection />
    </>
  );
}
