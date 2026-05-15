"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserRound, Users, Pill, Hospital } from "lucide-react";
import { AnimatedCounter } from "../ui/aceternity";

const stats = [
  { icon: Hospital, target: 5000, label: "مريض تم مساعدته" },
  { icon: UserRound, target: 200, label: "طبيب متطوع" },
  { icon: Users, target: 1500, label: "متطوع نشط" },
  { icon: Pill, target: 10000, label: "روشتة تم صرفها" },
];

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 gradient-hero relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l4 3.5-4 3z'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-[1]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center text-white"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5, background: "rgba(255,255,255,0.2)" }}
                  className="w-[68px] h-[68px] mx-auto mb-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center transition-all"
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
                <span className="text-3xl sm:text-[2.7rem] font-black block mb-2">
                  <AnimatedCounter target={stat.target} />
                </span>
                <span className="text-sm opacity-75 font-medium">{stat.label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
