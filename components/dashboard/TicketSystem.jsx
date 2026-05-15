"use client";
import { useState, useEffect, useRef } from "react";
import api from "../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { MessageSquare, Plus, X, Send, Clock, User, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

// Role styling matrix
const getRoleTheme = (role) => {
  const themes = {
    Patient: { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-700", grad: "from-sky-500 to-blue-600" },
    Doctor: { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-700", grad: "from-sky-500 to-cyan-600" },
    Pharmacist: { bg: "bg-sky-50", border: "border-sky-100", text: "text-sky-700", grad: "from-sky-500 to-orange-600" },
    Volunteer: { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-700", grad: "from-rose-500 to-pink-600" },
    Admin: { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-700", grad: "from-indigo-500 to-purple-600" }
  };
  return themes[role] || themes.Patient;
};

export default function TicketSystem({ isAdmin = false, customUserId = null, targetTicketId = null }) {
  const [view, setView] = useState("list"); // list, chat, compose
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  const [viewedUserDetail, setViewedUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const [chatData, setChatData] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/Tickets/admin/all" : "/Tickets/my-tickets";
      const { data } = await api.get(endpoint);
      setTickets(data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل التذاكر");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [isAdmin]);

  const fetchTicketDetails = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/Tickets/${id}`);
      setChatData(data);
      setView("chat");
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      toast.error("لم نتمكن من فتح التذكرة.");
      setView("list");
    }
    setLoading(false);
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه التذكرة؟")) return;
    try {
      await api.delete(`/Tickets/${id}`);
      toast.success("تم حذف التذكرة");
      setView("list");
      fetchTickets();
    } catch (err) {
      toast.error("فشل حذف التذكرة");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showUserDetails = async (userId) => {
    if (!isAdmin) return;
    setDetailLoading(true);
    try {
      const { data } = await api.get(`/Admin/user-details/${userId}`);
      setViewedUserDetail(data);
    } catch (err) {
      toast.error("تعذر جلب بيانات المستخدم");
    }
    setDetailLoading(false);
  };

  // Listen for targeted deep link prop
  useEffect(() => {
    if (targetTicketId) {
      setSelectedTicketId(targetTicketId);
      fetchTicketDetails(targetTicketId);
    }
  }, [targetTicketId]);

  // Check URL params for direct URL deep linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ticketId = urlParams.get("ticketId");
      if (ticketId) {
        setSelectedTicketId(Number(ticketId));
        fetchTicketDetails(Number(ticketId));
        // clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!composeSubject || !composeMessage) return;
    setSending(true);
    try {
      const { data } = await api.post("/Tickets", { subject: composeSubject, message: composeMessage });
      toast.success("تم إنشاء التذكرة بنجاح!");
      setComposeSubject("");
      setComposeMessage("");
      await fetchTickets();
      fetchTicketDetails(data.ticketId);
    } catch (err) {
      toast.error("فشل في إنشاء التذكرة.");
    }
    setSending(false);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText || !chatData) return;
    setSending(true);
    try {
      await api.post(`/Tickets/${chatData.id}/reply`, { message: replyText });
      setReplyText("");
      // optimistically append or refetch
      await fetchTicketDetails(chatData.id);
    } catch (err) {
      toast.error("فشل إرسال الرد");
    }
    setSending(false);
  };

  const handleCloseTicket = async () => {
    if (!chatData || chatData.status === "Closed") return;
    try {
      await api.post(`/Tickets/${chatData.id}/close`);
      toast.success("تم إغلاق التذكرة");
      setChatData({ ...chatData, status: "Closed" });
    } catch (err) {
      toast.error("فشل الإغلاق");
    }
  };

  // --- RENDERS ---

  return (
    <div className="bg-white/60 backdrop-blur-3xl rounded-3xl p-6 shadow-xl border border-white/40 h-[calc(100vh-140px)] flex flex-col relative overflow-hidden" dir="rtl">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">مركز الدعم الفني</h2>
            <p className="text-sm text-slate-500">
              {isAdmin ? "إدارة תذاكر المراجعين واستفساراتهم" : "نحن هنا لمساعدتك والإجابة على استفساراتك"}
            </p>
          </div>
        </div>
        
        {view === "list" && !isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setView("compose")}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> تذكرة جديدة
          </motion.button>
        )}

        {view !== "list" && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setView("list"); fetchTickets(); }}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> عودة للقائمة
          </motion.button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          
          {/* ===================== LIST VIEW ===================== */}
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCw className="w-8 h-8 mb-4 opacity-50" />
                  </motion.div>
                  جاري تحميل التذاكر...
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-lg font-bold text-slate-600">لا توجد تذاكر مفتوحة</p>
                  {!isAdmin && <p className="text-sm mt-1">اضغط على زر تذكرة جديدة بالأعلى لبدء محادثة.</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map(t => {
                    const theme = getRoleTheme(t.userRole);
                    const isOpen = t.status === "Open";
                    return (
                      <Tilt key={t.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
                        <motion.button
                          onClick={() => fetchTicketDetails(t.id)}
                          className="w-full text-right bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden"
                        >
                          {/* Accent line */}
                          <div className={`absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b ${theme.grad}`} />
                          
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${isOpen ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}`}>
                              {isOpen ? "مفتوحة" : "مغلقة"}
                            </span>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(t.updatedAt).toLocaleDateString("ar-EG")}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{t.subject}</h3>
                          
                          {isAdmin && (
                            <div className={`flex items-center gap-1.5 mt-3 text-xs font-semibold px-2 py-1 rounded-lg w-max ${theme.bg} ${theme.text}`}>
                              <User className="w-3.5 h-3.5" />
                              {t.userName} ({t.userRole})
                            </div>
                          )}
                          {!isAdmin && t.subject && (
                            <p className="text-sm text-slate-500 mt-2 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">رقم التذكرة: #{t.id}</p>
                          )}
                        </motion.button>
                      </Tilt>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ===================== COMPOSE VIEW ===================== */}
          {view === "compose" && (
            <motion.form key="compose" onSubmit={handleCreateTicket} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> تحدث مع فريق الدعم
              </h3>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">موضوع التذكرة</label>
                  <input required value={composeSubject} onChange={e => setComposeSubject(e.target.value)} type="text" placeholder="مثال: مشكلة في صرف الروشتة" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">تفاصيل المشكلة</label>
                  <textarea required value={composeMessage} onChange={e => setComposeMessage(e.target.value)} placeholder="اشرح مشكلتك بالتفصيل..." rows={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button disabled={sending} type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-50">
                  {sending ? "جاري الإرسال..." : <><Send className="w-4 h-4 ml-1" dir="ltr" /> إرسال التذكرة</>}
                </button>
              </div>
            </motion.form>
          )}

          {/* ===================== CHAT VIEW ===================== */}
          {view === "chat" && chatData && (
            <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              
              <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {chatData.subject} 
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${chatData.status === "Open" ? "bg-sky-100 text-sky-700" : "bg-slate-200 text-slate-600"}`}>
                      {chatData.status === "Open" ? "مفتوحة" : "مغلقة"}
                    </span>
                  </h3>
                  {isAdmin && <p className="text-xs text-slate-500 mt-1">بواسطة: {chatData.userName} ({chatData.userRole})</p>}
                </div>
                {chatData.status === "Open" && !chatData.isDeletedByUser && (
                  <button onClick={handleCloseTicket} className="text-xs flex items-center gap-1 font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> إغلاق التذكرة
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteTicket(chatData.id)} 
                  className="mr-2 p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100"
                  title="حذف التذكرة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {chatData.messages?.map((m, i) => {
                  const isMine = isAdmin ? m.isFromAdmin : !m.isFromAdmin;
                  
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      
                      <div className={`flex gap-3 max-w-[80%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                        <button 
                          onClick={() => { if(isAdmin && !m.isFromAdmin) showUserDetails(m.senderId); }}
                          disabled={!isAdmin || m.isFromAdmin}
                          className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform ${isAdmin && !m.isFromAdmin ? 'hover:scale-105 cursor-pointer hover:shadow-lg' : 'cursor-default'} ${m.isFromAdmin ? "bg-gradient-to-br from-indigo-500 to-purple-600" : getRoleTheme(m.senderRole).grad}`}
                        >
                          {m.isFromAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </button>
                        
                        <div>
                          <div className={`flex items-center gap-2 mb-1 ${isMine ? "justify-end" : "justify-start"}`}>
                            <span className="text-xs font-bold text-slate-500">{m.isFromAdmin ? "مدير النظام" : m.senderName}</span>
                            <span className="text-[10px] text-slate-400 font-medium bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">{new Date(m.createdAt).toLocaleTimeString("ar-EG", {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          
                          <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} glareEnable glareMaxOpacity={0.1} glarePosition="all">
                            <div className={`p-4 rounded-2xl shadow-sm border leading-relaxed text-sm ${isMine ? "bg-slate-900 text-white border-slate-800 rounded-tr-sm" : "bg-white text-slate-800 border-slate-100 rounded-tl-sm shadow-slate-200/50"}`}>
                              {m.message}
                            </div>
                          </Tilt>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Area or Deleted Notice */}
              {isAdmin && chatData.isDeletedByUser ? (
                <div className="p-6 bg-rose-50 border-t border-rose-100 flex items-center gap-4 text-rose-700">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Trash2 className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base">قام المستخدم بحذف هذه التذكرة</h4>
                    <p className="text-sm opacity-80 mt-0.5">تمت إزالة التذكرة من سجلات المستخدم، لا يمكنك الرد عليها حالياً.</p>
                  </div>
                </div>
              ) : chatData.status === "Open" ? (
                <form onSubmit={handleReply} className="p-4 bg-white border-t border-slate-100 flex items-end gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all relative">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="اكتب ردك هنا..." rows={2} className="w-full bg-transparent px-4 py-3 outline-none text-sm resize-none" onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(e); }
                      }} />
                  </div>
                  <button disabled={sending || !replyText.trim()} type="submit" className="w-12 h-12 shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all">
                    <Send className="w-5 h-5 -ml-1 mt-0.5" dir="ltr" />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-slate-500 font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> لا يمكن الرد على تذكرة مغلقة.
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

        {/* User Details Modal (Admin Only) */}
        <AnimatePresence>
          {(viewedUserDetail || detailLoading) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl relative">
                <button onClick={() => setViewedUserDetail(null)} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10">
                  <X className="w-4 h-4" />
                </button>

                {detailLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-indigo-500 text-sm font-medium gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
                    جاري تحميل البيانات...
                  </div>
                ) : viewedUserDetail ? (
                  <>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 pt-10 text-center border-b border-indigo-100/50">
                      <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4">
                        <User className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{viewedUserDetail.fullName}</h3>
                      <p className="text-sm font-medium text-indigo-600 mt-1 uppercase tracking-wide">{viewedUserDetail.role}</p>
                    </div>
                    
                    <div className="p-6 space-y-4 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-500">البريد الإلكتروني</span>
                        <span className="font-semibold text-slate-700">{viewedUserDetail.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-500">رقم الهاتف</span>
                        <span className="font-semibold text-slate-700">{viewedUserDetail.phoneNumber || "غير متوفر"}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-slate-500">الرقم القومي</span>
                        <span className="font-semibold text-slate-700">{viewedUserDetail.nationalID || "غير متوفر"}</span>
                      </div>
                      
                      {viewedUserDetail.profile?.governorate && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                          <span className="text-slate-500">المحافظة</span>
                          <span className="font-semibold text-slate-700">{viewedUserDetail.profile.governorate}</span>
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <button onClick={() => setViewedUserDetail(null)} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">
                          إغلاق
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
