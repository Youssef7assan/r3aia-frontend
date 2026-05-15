import { motion } from "framer-motion";
import { Stethoscope, Pill, MapPin, Heart, Sparkles, User, Truck, CheckCircle2, ClipboardList, Package } from "lucide-react";

export default function RoleInstructions({ role }) {
  let steps = [];
  let title = "";
  let subtitle = "";
  
  if (role === "Patient") {
    title = "كيف تعمل منصة رعاية؟";
    subtitle = "ثلاث خطوات بسيطة للحصول على الرعاية التي تستحقها!";
    steps = [
      { id: 1, title: "اطلب استشارة طبية", desc: "اختر التخصص واشرح حالتك بوضوح لطبيبك.", icon: Stethoscope, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 2, title: "تواصل مع الطبيب", desc: "سيقوم أحد الأطباء المتطوعين بقبول طلبك وتحديد موعد.", icon: User, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 3, title: "احصل على علاجك", desc: "ارفع صورة الروشتة وسنقوم بتوفيرها وتوصيلها لك مجاناً.", icon: Pill, color: "text-sky-500", bg: "bg-sky-50", line: "" },
    ];
  } else if (role === "Doctor") {
    title = "كيف تساهم في شفاء المرضى؟";
    subtitle = "خطواتك كطبيب متطوع تصنع فارقاً كبيراً في حياة الكثيرين.";
    steps = [
      { id: 1, title: "استكشف الطلبات", desc: "تصفح الحالات المتاحة في تخصصك ومحافظتك.", icon: ClipboardList, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 2, title: "اقبل وحدد الموعد", desc: "اقبل الحالة الطبية للمحتاج واكتب موعد العيادة أو الاتصال.", icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-rose-400" },
      { id: 3, title: "أنقذ الأرواح", desc: "اكتب الروشتة للمريض وسنتكفل نحن بتوصيل الدواء له.", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", line: "" },
    ];
  } else if (role === "Pharmacist") {
    title = "كيف تشارك بتوفير الأدوية؟";
    subtitle = "أنتم شريان الحياة.. إليك كيف يتم سد احتياجات المرضى المادية:";
    steps = [
      { id: 1, title: "استقبل הطلبات", desc: "راجع طلبات الأدوية المفتوحة داخل محافظتك.", icon: ClipboardList, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 2, title: "وفّر الدواء", desc: "طابق الروشتة وأكد قدرتك على تجهيز الأدوية المطلوبة.", icon: Pill, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-rose-400" },
      { id: 3, title: "سلّم الدواء", desc: "سيأتي إليك مريض أو مندوب متطوع لاستلام وتوصيل الدواء.", icon: Package, color: "text-rose-500", bg: "bg-rose-50", line: "" },
    ];
  } else if (role === "Volunteer") {
    title = "كيف تقوم بتوصيل الأمانات؟";
    subtitle = "أنت حلقة الوصل الأعظم في هذه المنصة الخيرية.";
    steps = [
      { id: 1, title: "تصفح المهام", desc: "ابحث عن المهام المتاحة للتوصيل في محافظتك والتزم بها.", icon: Truck, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 2, title: "استلم من الصيدلية", desc: "توجه للصيدلية التي تكفلت بالدواء واستلمه منها.", icon: Pill, color: "text-sky-500", bg: "bg-sky-50", line: "from-sky-500 to-sky-400" },
      { id: 3, title: "أوصله للمريض", desc: "اذهب لمنزل المريض لتسليمه الدواء بسلام.", icon: MapPin, color: "text-sky-500", bg: "bg-sky-50", line: "" },
    ];
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 my-8 relative overflow-hidden group">
      {/* Background decorations */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-50 rounded-full blur-3xl group-hover:bg-rose-100 transition-colors duration-1000"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-sky-50 rounded-full blur-3xl group-hover:bg-sky-100 transition-colors duration-1000"></div>
      
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 font-medium">{subtitle}</p>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative flex flex-col md:flex-row justify-between items-start gap-10 md:gap-4 max-w-4xl mx-auto z-10">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={step.id} variants={itemVariants} className="flex-1 relative w-full text-center group/card">
              {/* Connecting Line (only shown on desktop) */}
              {step.line && (
                <div className="hidden md:block absolute top-10 left-[50%] w-full h-[3px] z-0">
                  <div className={`w-full h-full bg-gradient-to-l ${step.line} origin-left scale-x-0 group-hover/card:scale-x-100 opacity-30 transition-transform duration-700 ease-in-out`}></div>
                  {/* Subtle static line */}
                  <div className="absolute inset-0 bg-slate-100 -z-10 w-full h-full"></div>
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 relative overflow-hidden ${step.bg}`}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
                  <Icon className={`w-10 h-10 ${step.color}`} />
                  <div className="absolute -right-2 -bottom-2 text-6xl font-black text-slate-900/5 opacity-50 select-none">
                    {step.id}
                  </div>
                </motion.div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 tracking-wide leading-relaxed max-w-[250px] mx-auto opacity-80 group-hover/card:opacity-100 transition-opacity">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Floating sparkles for that 3D magic feel */}
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-10 right-10 text-sky-300 opacity-50 hidden md:block">
        <Sparkles className="w-6 h-6" />
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-10 left-10 text-sky-300 opacity-50 hidden md:block">
        <Heart className="w-5 h-5" />
      </motion.div>
    </div>
  );
}
