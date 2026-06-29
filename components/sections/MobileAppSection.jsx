"use client";
import { motion } from "framer-motion";
import { Apple, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function MobileAppSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-[3rem] p-8 lg:p-16 shadow-2xl border border-sky-900/50 overflow-hidden relative">
          
          {/* Subtle grid pattern over the dark background */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
            
            {/* Content Side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center lg:text-right"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-400/20 mb-6">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <span className="text-sky-300 font-bold text-sm">الان على الهواتف الذكية</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                رعايتك الصحية، الآن في <span className="text-transparent bg-clip-text bg-gradient-to-l from-sky-400 to-emerald-400">جيبك!</span>
              </h2>
              
              <p className="text-sky-100/80 text-lg mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                احصل على تجربة أسرع وأكثر سلاسة مع تطبيق "رعاية". احجز استشارتك، اطلب أدويتك، وتابع مهام التوصيل في أي وقت ومن أي مكان بخطوات بسيطة.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* App Store Button */}
                <motion.a 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://www.mediafire.com/file/rqmaa4auw11ee2u/app-release.apk/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-2xl transition-all w-full sm:w-auto min-w-[200px]"
                >
                  <Apple className="w-8 h-8" />
                  <div className="text-right flex-1">
                    <div className="text-[10px] text-white/70 font-semibold mb-0.5">Download on the</div>
                    <div className="text-lg font-bold leading-none">App Store</div>
                  </div>
                </motion.a>

                {/* Google Play Button */}
                <motion.a 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://www.mediafire.com/file/rqmaa4auw11ee2u/app-release.apk/file"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-500/25 text-white px-6 py-3.5 rounded-2xl transition-all border border-sky-400/50 w-full sm:w-auto min-w-[200px]"
                >
                  <Play className="w-8 h-8 fill-current" />
                  <div className="text-right flex-1">
                    <div className="text-[10px] text-white/90 font-semibold mb-0.5">GET IT ON</div>
                    <div className="text-lg font-bold leading-none">Google Play</div>
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Mobile Mockup Side */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Decorative elements behind the phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-500/30 rounded-full filter blur-[80px]"></div>
              
              {/* iPhone Mockup (CSS only) */}
              <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                  <div className="w-32 h-6 bg-slate-800 rounded-b-3xl"></div>
                </div>
                
                {/* Screen Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center p-6">
                  {/* Glowing background inside screen */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                  </div>

                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-sky-500 to-emerald-400 rounded-3xl shadow-2xl flex items-center justify-center mb-6 border-4 border-white">
                      {/* Logo substitute if image is missing */}
                      <span className="text-4xl text-white font-black">ر</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">رعاية</h3>
                    <p className="text-sm font-bold text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100">
                      صحتك بين يديك
                    </p>
                  </motion.div>

                  {/* UI Skeleton mockup to look like an app */}
                  <div className="absolute bottom-8 left-6 right-6 space-y-3 z-10">
                    <div className="h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 gap-3">
                      <div className="w-8 h-8 rounded-full bg-sky-100"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-slate-200 rounded w-full"></div>
                        <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
