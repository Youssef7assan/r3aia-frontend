"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center gap-6"
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="relative"
          >
            {/* The "Circle that loads" (Rotating Border) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-[3px] border-slate-100 border-t-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.1)]"
            />
            {/* Logo in the center */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img src="/logo.jpg" alt="Logo" className="w-20 h-20 object-cover scale-110 mix-blend-multiply" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-extrabold gradient-text"
          >
            رعـايـة
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
