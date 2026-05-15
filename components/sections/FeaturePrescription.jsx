"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Pill, UserPlus, Check } from "lucide-react";
import { GradientText } from "../ui/aceternity";

export default function FeaturePrescription() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    "روشتة معتمدة من أطباء متخصصين",
    "أدوية أصلية من صيدليات معتمدة",
    "إمكانية توصيل الأدوية لباب البيت",
  ];

  return (
    <section ref={ref} className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text (left on desktop due to RTL reverse) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <Pill className="w-3.5 h-3.5" />
              الروشتة والأدوية
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              اطلب <GradientText>روشتتك</GradientText> واحصل على العلاج
            </h2>

            <p className="text-base text-slate-400 leading-relaxed mb-8">
              يمكنك طلب روشتة طبية من الصيدلية مباشرة بعد الاستشارة الطبية.
              نعمل مع شبكة من الصيدليات لتوفير الأدوية مجاناً للمرضى المحتاجين.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 min-w-[28px] rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-slate-500 leading-relaxed">{f}</span>
                </motion.div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 gradient-sky text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              سجّل واطلب روشتتك
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute -top-5 -left-5 w-32 h-32 rounded-2xl bg-cyan-100 -z-[1] animate-float-slow" />
            <Image
              src="/images/prescription-3d.png"
              alt="طلب روشتة طبية"
              width={480}
              height={480}
              className="w-full max-w-md mx-auto animate-float rounded-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
