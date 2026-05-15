"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

export default function PageHeader({ title, breadcrumbs = [] }) {
  return (
    <section className="min-h-[40vh] gradient-hero flex items-center justify-center text-center relative overflow-hidden pt-24">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Floating shapes */}
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.04] -top-20 -right-20 animate-float" />
      <div className="absolute w-40 h-40 rounded-full bg-white/[0.06] bottom-10 -left-10 animate-float-slow" />

      <div className="relative z-[1] px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-black text-white mb-4"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-center gap-3 text-sm text-white/60"
        >
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            الرئيسية
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-3">
              <ChevronLeft className="w-3 h-3 opacity-40" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/90">{crumb.label}</span>
              )}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-[-2px] left-0 right-0 z-[3]">
        <svg viewBox="0 0 1440 60" fill="none" className="block w-full h-12" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
