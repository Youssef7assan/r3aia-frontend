import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Bell, CheckCircle2, Info } from "lucide-react";

export default function ModernNotifications({ notifs, markRead, onNotificationClick, accent = "sky" }) {
  // Config map for different accents
  const colors = {
    sky: {
      bg: "bg-sky-50/50",
      border: "border-sky-200/60",
      text: "text-sky-600",
      dot: "bg-sky-500",
      glow: "shadow-sky-500/20",
      iconBg: "bg-gradient-to-br from-sky-400 to-blue-500",
      emptyBtn: "bg-sky-50 hover:bg-sky-100 text-sky-600"
    },
    emerald: {
      bg: "bg-sky-50/50",
      border: "border-sky-200/60",
      text: "text-sky-600",
      dot: "bg-sky-500",
      glow: "shadow-sky-500/20",
      iconBg: "bg-gradient-to-br from-sky-400 to-cyan-500",
      emptyBtn: "bg-sky-50 hover:bg-sky-100 text-sky-600"
    },
    amber: {
      bg: "bg-sky-50/50",
      border: "border-sky-200/60",
      text: "text-sky-600",
      dot: "bg-sky-500",
      glow: "shadow-sky-500/20",
      iconBg: "bg-gradient-to-br from-sky-400 to-orange-500",
      emptyBtn: "bg-sky-50 hover:bg-sky-100 text-sky-600"
    },
    rose: {
      bg: "bg-rose-50/50",
      border: "border-rose-200/60",
      text: "text-rose-600",
      dot: "bg-rose-500",
      glow: "shadow-rose-500/20",
      iconBg: "bg-gradient-to-br from-rose-400 to-pink-500",
      emptyBtn: "bg-rose-50 hover:bg-rose-100 text-rose-600"
    }
  };

  const theme = colors[accent] || colors.sky;

  if (!notifs || notifs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ type: "spring", bounce: 0.6 }}
          className={`w-24 h-24 rounded-full ${theme.bg} flex items-center justify-center mb-6 relative`}
        >
          <Bell className={`w-10 h-10 ${theme.text} opacity-50`} />
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-1 -right-1">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
          </motion.div>
        </motion.div>
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">لا توجد إشعارات حالياً</h3>
        <p className="text-slate-400 max-w-xs text-sm">أنت على اطلاع بكل شيء! سيظهر هنا كل جديد يخص حسابك.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifs.map((n, i) => {
          const isRead = n.isRead;
          
          const Content = () => (
            <motion.div
              initial={{ opacity: 0, x: -30, rotateX: 45 }}
              animate={{ opacity: 1, x: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 + 0.1, type: "spring", stiffness: 100 }}
              onClick={() => {
                if (!isRead && markRead) markRead(n.id);
                if (onNotificationClick) onNotificationClick(n);
              }}
              className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer border backdrop-blur-md transition-all duration-300
                ${isRead ? "bg-white/80 border-slate-100/60 shadow-sm hover:shadow-md" : `${theme.bg} ${theme.border} shadow-lg ${theme.glow}`}
              `}
            >
              {/* Glass Reflection effect for unread */}
              {!isRead && (
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm
                  ${isRead ? "bg-slate-100/80 text-slate-400" : `${theme.iconBg} text-white shadow-xl`}`}
                >
                  <Bell className={`w-5 h-5 ${!isRead && "animate-[wiggle_1s_ease-in-out_infinite]"}`} />
                  {!isRead && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${theme.dot}`} 
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 mt-1">
                  <p className={`text-base font-extrabold mb-1 ${isRead ? "text-slate-600" : "text-slate-900"}`}>
                    {n.title}
                  </p>
                  <p className={`text-sm leading-relaxed mb-3 ${isRead ? "text-slate-400" : "text-slate-600 font-medium"}`}>
                    {n.message}
                  </p>
                  
                  {/* Timestamp & Action hint */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100/50 px-2 py-1 rounded-lg">
                      {new Date(n.createdAt).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {!isRead && (
                      <span className={`text-[10px] font-bold ${theme.emptyBtn} px-2 py-1 rounded-lg flex items-center gap-1`}>
                        <Info className="w-3 h-3" /> اضغط للفتح
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );

          if (!isRead) {
            // Aggressive 3D stack for unread
            return (
              <Tilt key={n.id} tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={1500} glareEnable={true} glareMaxOpacity={0.1} glareColor="#ffffff" glarePosition="all" className="rounded-3xl">
                <Content />
              </Tilt>
            );
          }

          // Flat for read notifications to not overwhelm the UI
          return (
            <div key={n.id}>
              <Content />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
