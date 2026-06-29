"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Users, Target, CheckCircle2, Clock, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import api from "../../lib/axios";

const BASE = "https://shendico-001-site1.rtempurl.com";

export default function DonationsSection() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Donations/cases")
      .then(r => setCases(r.data.filter(c => !c.isCompleted).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-24 bg-slate-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="w-10 h-10 border-3 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </section>
  );

  if (cases.length === 0) return null;

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${BASE}/${img}`;
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50" dir="rtl" id="donations">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      {/* Animated floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/30"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.5 }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 font-bold text-sm mb-6 shadow-sm border border-rose-200">
              <Heart className="w-4 h-4 fill-rose-600 animate-pulse" />
              حالات تحتاج دعمك
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              قطرة عطاء <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">تحيي أملاً</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              ساهم في إنقاذ حياة المرضى وتخفيف معاناتهم. كل تبرع مهما كان صغيراً، يصنع فارقاً حقيقياً في حياة إنسان.
            </p>
          </motion.div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cases.map((c, i) => {
            const progress = Math.min(100, (c.collectedAmount / c.goalAmount) * 100);
            const remaining = Math.max(0, c.goalAmount - c.collectedAmount);
            const imgUrl = getImageUrl(c.caseImageUrl || c.caseImage);
            
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 border border-slate-100/80 overflow-hidden transition-all duration-500 flex flex-col hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  {imgUrl ? (
                    <img 
                      src={imgUrl} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-rose-300" />
                    </div>
                  )}

                  {/* Patient Name Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20">
                    <Users className="w-3.5 h-3.5 text-rose-500" />
                    لأجل {c.patientName}
                  </div>

                  {/* Progress Badge */}
                  <div className="absolute bottom-4 left-4 z-20 bg-rose-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {Math.round(progress)}%
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-xl text-slate-900 mb-2 leading-tight group-hover:text-rose-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">
                    {c.description || "ساهم في مساعدة هذه الحالة وكن سبباً في تخفيف معاناتهم."}
                  </p>

                  <div className="space-y-4 mt-auto">
                    {/* Amount Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                        <div className="text-emerald-600 font-black text-lg">{c.collectedAmount?.toLocaleString()}</div>
                        <div className="text-emerald-500 text-[10px] font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          تم جمعه (ج.م)
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                        <div className="text-slate-700 font-black text-lg">{c.goalAmount?.toLocaleString()}</div>
                        <div className="text-slate-400 text-[10px] font-bold flex items-center justify-center gap-1">
                          <Target className="w-3 h-3" />
                          الهدف (ج.م)
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          مكتمل بنسبة {Math.round(progress)}%
                        </span>
                        <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          متبقي {remaining.toLocaleString()} ج.م
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link 
                      href="/login" 
                      className="block w-full text-center bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3.5 rounded-xl transition-all border border-rose-200 shadow-sm group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-rose-500/25"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        تبرع الآن لإنقاذ حياة
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View More */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 font-bold text-sm bg-white border border-slate-200 hover:border-rose-200 px-8 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all">
            <Sparkles className="w-4 h-4" />
            عرض المزيد من الحالات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
