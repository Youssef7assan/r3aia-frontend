"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJwt } from "../../lib/jwt";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import StepCompleteProfile from "../../components/auth/StepCompleteProfile";
import { motion } from "framer-motion";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const payload = parseJwt(token);
      if (!payload) throw new Error("Invalid token");
      // قراءة الـ role من التوكن
      const r =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || payload["role"]
        || "";
      const roleStr = Array.isArray(r) ? r[0] : String(r);
      const accountStatus = payload["AccountStatus"] || payload["accountStatus"] || "";
      if (accountStatus === "Banned") { router.replace("/banned"); return; }
      setRole(roleStr);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* ── نموذج الإتمام ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-12 bg-white relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px] mx-auto relative mt-8 lg:mt-0"
        >
          {/* زر الرجوع للخلف */}
          <Link href="/" className="absolute -top-10 lg:-top-16 right-0 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-sky-600 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            العودة للرئيسية
          </Link>

          {/* الشعار */}
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-11 h-11 rounded-2xl gradient-sky flex items-center justify-center text-white shadow-md">
              <Heart className="w-5 h-5" fill="currentColor" />
            </div>
            <span className="text-2xl font-extrabold text-slate-800">رعاية</span>
          </Link>

          <StepCompleteProfile role={role} />
        </motion.div>
      </div>

      {/* ── الجانب الأيسر ── */}
      <div className="hidden lg:flex lg:w-[45%] gradient-hero flex-col justify-center p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: "32px 32px" }}
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-semibold mb-8">
            <Heart className="w-4 h-4" fill="currentColor" />
            خطوة أخيرة فقط
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-5">
            أكمل بياناتك<br />
            <span className="text-sky-200">وانضم لعائلة رعاية</span>
          </h2>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            بعد مراجعة بياناتك من قِبل فريقنا، ستتمكن من الاستفادة من كل خدمات المنصة مجاناً.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "استشارة طبية مجانية مع أطباء متخصصين",
              "طلب أدوية من الصيدليات المشاركة",
              "توصيل الأدوية لباب بيتك",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-white/90 text-sm font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
