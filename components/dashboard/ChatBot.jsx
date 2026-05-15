"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RotateCcw, Sparkles, Bot, Loader2 } from "lucide-react";

// اقتراحات سريعة حسب الدور
const QUICK_SUGGESTIONS = {
  Patient: [
    "كيف أطلب استشارة طبية؟",
    "كيف أطلب أدوية؟",
    "كيف أتبرع لحالة؟",
    "كيف أتابع حالة طلبي؟",
  ],
  Doctor: [
    "كيف أعرض الطلبات المتاحة؟",
    "كيف أقبل طلب وأحدد موعد؟",
    "ما هي نداءات الطوارئ؟",
    "كيف أسجل اكتمال الكشف؟",
  ],
  Pharmacist: [
    "كيف أقبل طلب أدوية؟",
    "كيف أتابع طلباتي النشطة؟",
    "هل يوجد متطوع للتوصيل؟",
    "ما هي نداءات الطوارئ؟",
  ],
  Volunteer: [
    "كيف آخذ مهمة توصيل؟",
    "كيف أؤكد اكتمال التوصيل؟",
    "أين أجد عنوان المريض؟",
    "ما هي نداءات الطوارئ؟",
  ],
  Admin: [
    "كيف أضيف حالة تبرع جديدة؟",
    "كيف أدير المستخدمين؟",
    "كيف أوافق على طبيب جديد؟",
    "كيف أتابع إحصائيات المنصة؟",
  ],
};

const ROLE_GREETINGS = {
  Patient: "مرحباً! أنا رعايا 🌟 مساعدتك الذكية في منصة رعاية. اسألني أي شيء عن الخدمات أو كيفية الاستخدام!",
  Doctor: "أهلاً دكتور! 👨‍⚕️ أنا رعايا، مساعدك الذكي. هل تحتاج مساعدة في استخدام المنصة؟",
  Pharmacist: "أهلاً بالصيدلي! 💊 أنا رعايا، هنا لمساعدتك في كل ما تحتاجه.",
  Volunteer: "أهلاً بالبطل! 🤝 أنا رعايا، رفيقك في رحلة التطوع.",
  Admin: "مرحباً بالمدير! 🔧 أنا رعايا، مساعدك في إدارة منصة رعاية.",
};

export default function ChatBot({ role = "Patient", userName = "" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const baseGreeting = ROLE_GREETINGS[role] || ROLE_GREETINGS.Patient;
  const greeting = userName ? baseGreeting.replace("مرحباً!", `مرحباً ${userName}!`).replace("أهلاً", `أهلاً ${userName}`) : baseGreeting;
  const suggestions = QUICK_SUGGESTIONS[role] || QUICK_SUGGESTIONS.Patient;

  // Initialize greeting when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ type: "bot", text: greeting }]);
    }
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setShowSuggestions(false);
    setMessages(prev => [...prev, { type: "user", text: userText }]);
    setLoading(true);

    try {
      // Send only last 10 messages for context (to avoid token limits)
      const recentHistory = messages.slice(-10);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: recentHistory, role, userName }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { type: "bot", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          type: "bot",
          text: "عذراً، حدث خطأ مؤقت. حاول مرة أخرى أو تواصل مع الدعم على 01097972975 😊"
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        type: "bot",
        text: "عذراً، لا يمكن الاتصال بالخادم الآن. تأكد من اتصالك بالإنترنت وحاول مرة أخرى."
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function reset() {
    setMessages([{ type: "bot", text: greeting }]);
    setInput("");
    setShowSuggestions(true);
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-6 left-6 z-[9999] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
          boxShadow: "0 8px 32px rgba(14,165,233,0.5)"
        }}
        aria-label="فتح المساعد الذكي"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div key="avatar" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="w-full h-full">
              <img src="/chatbot-avatar.png" alt="رعايا AI" className="w-full h-full object-cover rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-sky-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        )}
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-6 z-[9998] w-80 sm:w-[400px] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              maxHeight: "80vh",
              boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
            }}
            dir="rtl"
          >
            {/* ── Header ── */}
            <div className="relative p-4 flex items-center gap-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0c4a6e, #0369a1, #0284c7)" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0 border-2 border-white/30 shadow-lg">
                <img src="/chatbot-avatar.png" alt="رعايا" className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-extrabold text-base">رعايا AI</p>
                  <span className="flex items-center gap-1 bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    متاح
                  </span>
                </div>
                <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                  <Bot className="w-3 h-3" />
                  رعاية وفّرت لك AI لخدمتك 💙
                </p>
              </div>

              {/* Reset */}
              <button onClick={reset}
                className="relative w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/25 transition-colors"
                title="محادثة جديدة">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ minHeight: "280px", maxHeight: "400px" }}>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, x: m.type === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex ${m.type === "user" ? "justify-start" : "justify-end"}`}
                  >
                    {m.type === "bot" && (
                      <div className="flex items-end gap-2 max-w-[88%]">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border-2 border-sky-200 shadow-sm">
                          <img src="/chatbot-avatar.png" alt="رعايا" className="w-full h-full object-cover" />
                        </div>
                        <div className="bg-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm border border-slate-100">
                          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    )}
                    {m.type === "user" && (
                      <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm"
                        style={{ background: "linear-gradient(135deg, #0ea5e9, #0284c7)" }}>
                        <p className="text-white text-sm leading-relaxed">{m.text}</p>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border-2 border-sky-200 shadow-sm">
                      <img src="/chatbot-avatar.png" alt="رعايا" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-br-sm px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                      <span className="text-slate-500 text-xs">رعايا تفكر...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Suggestions ── */}
            <AnimatePresence>
              {showSuggestions && !loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border-t border-slate-100 px-3 pt-2 pb-1"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" /> اقتراحات سريعة
                  </p>
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendMessage(s)}
                        className="text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-full transition-all"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="bg-white border-t border-slate-100 p-3 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(false)}
                  placeholder="اكتب سؤالك هنا..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:border-sky-400 focus:bg-white transition-all disabled:opacity-60"
                  style={{ maxHeight: "100px", overflowY: "auto" }}
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                  }}
                />
                <motion.button
                  whileHover={!loading && input.trim() ? { scale: 1.1 } : {}}
                  whileTap={!loading && input.trim() ? { scale: 0.9 } : {}}
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-40"
                  style={{
                    background: loading || !input.trim()
                      ? "#e2e8f0"
                      : "linear-gradient(135deg, #0ea5e9, #0284c7)"
                  }}
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                    : <Send className="w-4 h-4 text-white" style={{ transform: "rotate(180deg)" }} />
                  }
                </motion.button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                ذكاء رعاية الاصطناعي • رعاية 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
