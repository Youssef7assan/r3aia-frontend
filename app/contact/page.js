"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
import PageHeader from "@/components/layout/PageHeader";
import { TextReveal, GradientText, StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/aceternity";
import FAQSection from "@/components/sections/FAQSection";

// WhatsApp SVG icon
function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const contactInfo = [
  { icon: Phone, title: "اتصل بنا", detail: "01234567890", subDetail: "متاح من 9 صباحاً - 9 مساءً", href: "tel:+201234567890" },
  { icon: WhatsAppIcon, title: "واتساب", detail: "01234567890", subDetail: "رد سريع على رسائلك", href: "https://wa.me/201234567890" },
  { icon: Mail, title: "البريد الإلكتروني", detail: "info@r3aya.org", subDetail: "نرد خلال 24 ساعة", href: "mailto:info@r3aya.org" },
  { icon: MapPin, title: "العنوان", detail: "القاهرة، مصر", subDetail: "المقر الرئيسي", href: "#" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <PageHeader title="تواصل معنا" breadcrumbs={[{ label: "تواصل معنا" }]} />

      {/* Contact Info Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <TextReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold mb-4 border border-sky-100">
              <MessageSquare className="w-3.5 h-3.5" />
              نحن هنا لمساعدتك
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              تواصل معنا <GradientText>بأي طريقة</GradientText>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              فريقنا مستعد دائماً للإجابة على استفساراتك ومساعدتك
            </p>
          </TextReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" staggerDelay={0.08}>
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <StaggerItem key={info.title}>
                  <a href={info.href} className="block">
                    <SpotlightCard className="p-6 text-center h-full group">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300"
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <h3 className="text-base font-bold text-slate-800 mb-1">{info.title}</h3>
                      <p className="text-sm font-semibold text-sky-500 mb-1" dir="ltr">{info.detail}</p>
                      <p className="text-xs text-slate-400">{info.subDetail}</p>
                    </SpotlightCard>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Contact Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Sidebar Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-gradient-to-br from-sky-600 to-cyan-500 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">أرسل لنا رسالة</h3>
                <p className="text-sm text-white/80 leading-relaxed mb-8">
                  سواء كنت مريض محتاج، متطوع جديد، أو لديك استفسار - نحن هنا عشانك.
                  املأ النموذج وهنرد عليك في أقرب وقت.
                </p>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">أوقات العمل</p>
                      <p className="text-xs text-white/70">السبت - الخميس: 9 ص - 9 م</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">خط المساعدة</p>
                      <p className="text-xs text-white/70" dir="ltr">01234567890</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="mt-10 pt-6 border-t border-white/15">
                  <p className="text-sm font-semibold mb-3">تابعنا على</p>
                  <div className="flex gap-3">
                    {[FacebookIcon, WhatsAppIcon, TwitterIcon, InstagramIcon].map((Icon, i) => (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={{ y: -3 }}
                        className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-3xl">
                      ✓
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-sm text-slate-400">سنتواصل معك في أقرب وقت ممكن. شكراً لتواصلك.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">الاسم الكامل</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
                          placeholder="ادخل اسمك"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">رقم الهاتف</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
                        placeholder="example@email.com"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">نوع الرسالة</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
                      >
                        <option value="">اختر نوع الرسالة</option>
                        <option value="patient">طلب مساعدة طبية</option>
                        <option value="volunteer">تسجيل تطوع</option>
                        <option value="donation">استفسار عن التبرع</option>
                        <option value="suggestion">اقتراح أو شكوى</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">الموضوع</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm"
                        placeholder="موضوع الرسالة"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">الرسالة</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all text-sm resize-y"
                        placeholder="اكتب رسالتك هنا..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2.5 px-8 py-4 gradient-sky text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                      أرسل الرسالة
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
