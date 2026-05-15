"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Users, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import api from "../../lib/axios";

export default function DonationsSection() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Donations/cases")
      .then(r => setCases(r.data.slice(0, 3))) // Show top 3 recent cases
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || cases.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50" dir="rtl">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-sm mb-6 shadow-sm border border-rose-200">
              <Heart className="w-4 h-4 fill-rose-600" />
              حالات تحتاج دعمك الطارئ
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              قطرة عطاء <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">تحيي أملاً</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              ساهم في إنقاذ حياة المرضى وتخفيف معاناتهم. كل تبرع مهما كان صغيراً، يصنع فارقاً حقيقياً في حياة إنسان.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cases.map((c, i) => {
            const progress = Math.min(100, (c.collectedAmount / c.goalAmount) * 100);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 border border-slate-100/80 overflow-hidden transition-all duration-500 flex flex-col"
              >
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img src={c.caseImageUrl || "https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?auto=format&fit=crop&q=80"} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20">
                    <Users className="w-3.5 h-3.5 text-rose-500" />
                    لأجل {c.patientName}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-xl text-slate-900 mb-2 leading-tight group-hover:text-rose-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="space-y-4 mt-auto">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-rose-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          تم جمع {c.collectedAmount.toLocaleString()} ج.م
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          الهدف {c.goalAmount.toLocaleString()} ج.م
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgoJPHJlY3Qgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30" />
                        </motion.div>
                      </div>
                      <p className="text-[10px] text-center text-slate-400 mt-2 font-semibold">
                        مكتمل بنسبة {Math.round(progress)}%
                      </p>
                    </div>

                    <Link href="/login" className="block w-full text-center bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl transition-colors border border-rose-200 shadow-sm group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent">
                      تبرع الآن لإنقاذ حياة
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
            عرض المزيد من الحالات <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
