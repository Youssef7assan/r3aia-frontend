"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleHelp, ChevronDown } from "lucide-react";
import { TextReveal, GradientText } from "../ui/aceternity";

const faqs = [
  {
    q: "هل الاستشارة الطبية مجانية فعلاً؟",
    a: "نعم، جميع الاستشارات الطبية على منصة رعاية مجانية بالكامل. نعتمد على أطباء متطوعين يقدمون وقتهم وخبرتهم مجاناً لخدمة المرضى المحتاجين.",
  },
  {
    q: "كيف يمكنني حجز استشارة طبية؟",
    a: "يمكنك حجز استشارة طبية من خلال التسجيل على المنصة واختيار التخصص الطبي المطلوب وتحديد الموعد المناسب. سيتم تعيين طبيب متخصص لحالتك.",
  },
  {
    q: "هل يمكنني التطوع كطبيب أو كمتطوع توصيل؟",
    a: "بالتأكيد! نرحب بجميع المتطوعين سواء كأطباء لتقديم الاستشارات أو كمتطوعين لتوصيل الأدوية أو حتى للمساعدة في التنسيق والدعم. يمكنك التسجيل من صفحة التطوع.",
  },
  {
    q: "من أين تأتي الأدوية المجانية؟",
    a: "الأدوية يتم توفيرها من خلال تبرعات المحسنين وشراكات مع صيدليات ومؤسسات خيرية. كل تبرع يساهم في شراء أدوية للمرضى المحتاجين.",
  },
  {
    q: "هل البيانات الطبية آمنة ومحمية؟",
    a: "نعم، نلتزم بأعلى معايير حماية البيانات والخصوصية. جميع البيانات الطبية مشفرة ومحمية ولا يتم مشاركتها مع أي طرف ثالث إلا بموافقة المريض.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <TextReveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
            <CircleHelp className="w-3.5 h-3.5" />
            أسئلة شائعة
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            الأسئلة <GradientText>الأكثر شيوعاً</GradientText>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            إجابات لأهم الأسئلة التي يسألها المرضى والمتطوعين عن منصة رعاية
          </p>
        </TextReveal>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                activeIndex === i
                  ? "border-sky-300 shadow-[0_4px_12px_rgba(14,165,233,0.12)]"
                  : "border-slate-100 hover:border-sky-200"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 bg-white flex items-center justify-between text-right text-base font-semibold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <motion.span
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sky-500 min-w-[24px]"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-slate-400 leading-[1.9]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
