import { motion } from 'framer-motion';
import { User, Stethoscope, HandHeart, Pill, Check, ArrowLeft } from 'lucide-react';

const roles = [
  {
    id: 'Patient',
    title: 'مريض',
    desc: 'أحتاج استشارة طبية أو أدوية',
    Icon: User,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    activeBorder: 'border-sky-400',
    activeBg: 'bg-sky-50',
    activeShadow: 'shadow-sky-100',
  },
  {
    id: 'Doctor',
    title: 'طبيب',
    desc: 'أريد تقديم استشارات مجانية',
    Icon: Stethoscope,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    activeBorder: 'border-sky-400',
    activeBg: 'bg-sky-50',
    activeShadow: 'shadow-sky-100',
  },
  {
    id: 'Volunteer',
    title: 'متطوع',
    desc: 'أريد المساعدة في توصيل الأدوية',
    Icon: HandHeart,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    activeBorder: 'border-rose-400',
    activeBg: 'bg-rose-50',
    activeShadow: 'shadow-rose-100',
  },
  {
    id: 'Pharmacist',
    title: 'صيدلانى',
    desc: 'أريد الانضمام كصيدلية شريكة',
    Icon: Pill,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    activeBorder: 'border-sky-400',
    activeBg: 'bg-sky-50',
    activeShadow: 'shadow-sky-100',
  },
];

export default function StepAccountType({ currentRole, setRole, onNext }) {
  return (
    <div className="w-full">
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1.5">اختر نوع حسابك</h2>
        <p className="text-slate-500 text-sm">حدد الدور الذي يناسبك للمتابعة في التسجيل</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-7">
        {roles.map((r, i) => {
          const isSelected = currentRole === r.id;
          const Icon = r.Icon;
          return (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setRole(r.id)}
              className={`relative flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-200 text-right w-full
                ${isSelected
                  ? `${r.activeBorder} ${r.activeBg} shadow-lg ${r.activeShadow}`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              {/* Checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 left-3 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center ${r.bg} ${r.color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <span className={`font-bold text-base mb-1 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                {r.title}
              </span>
              <span className="text-xs text-slate-400 leading-relaxed">{r.desc}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!currentRole}
        whileHover={currentRole ? { scale: 1.01 } : {}}
        whileTap={currentRole ? { scale: 0.98 } : {}}
        className="w-full gradient-sky text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-sky-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-base"
      >
        <span>متابعة التسجيل</span>
        <ArrowLeft className="w-5 h-5 rotate-180" />
      </motion.button>
    </div>
  );
}
