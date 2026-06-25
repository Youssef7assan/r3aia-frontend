/**
 * استخراج رسالة خطأ مفصّلة من استجابة الـ API
 * يدعم كل أنماط الأخطاء من ASP.NET Core:
 *   - { errors: ["..."] }              ← Repository Errors
 *   - { errors: { Field: ["..."] } }   ← ModelState / ValidationProblemDetails
 *   - { title: "..." }                 ← ProblemDetails
 *   - { message: "..." }               ← Custom Error Response
 *   - { error: "..." }                 ← Alternative Custom Error
 *   - "plain string"                   ← Raw String Response
 *
 * @param {Error} error - Axios error object
 * @param {string} fallback - رسالة افتراضية تظهر لو مفيش تفاصيل
 * @returns {string} رسالة خطأ واضحة بالعربي
 */
export function extractError(error, fallback = "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.") {
  // لو مفيش response أصلاً (مشكلة اتصال)
  if (!error?.response) {
    if (error?.message?.includes("Network Error")) {
      return "⚠️ خطأ في الاتصال: تأكد من اتصالك بالإنترنت وحاول مرة أخرى.";
    }
    if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
      return "⚠️ انتهت مهلة الاتصال: السيرفر لم يستجب في الوقت المحدد.";
    }
    return fallback;
  }

  const { status, data } = error.response;

  // حالة 401 - غير مصرّح
  if (status === 401) {
    return "⛔ غير مصرّح: يرجى تسجيل الدخول مرة أخرى.";
  }

  // حالة 403 - ممنوع الوصول
  if (status === 403) {
    return "🚫 ليس لديك صلاحية لتنفيذ هذا الإجراء.";
  }

  // حالة 404 - غير موجود
  if (status === 404) {
    return "❌ العنصر المطلوب غير موجود أو تم حذفه.";
  }

  // لو مفيش data خالص
  if (!data) {
    return `${fallback} (كود الخطأ: ${status})`;
  }

  // ── استخراج الرسالة من أنماط الأخطاء المختلفة ──

  // 1) { errors: [...] } — Array من الأخطاء
  if (data.errors && Array.isArray(data.errors)) {
    const mapped = data.errors.map(translateError);
    return mapped.join(" | ");
  }

  // 2) { errors: { FieldName: ["msg1", "msg2"] } } — ModelState
  if (data.errors && typeof data.errors === "object") {
    const allMsgs = [];
    for (const [field, msgs] of Object.entries(data.errors)) {
      const fieldLabel = fieldNames[field] || field;
      const messages = Array.isArray(msgs) ? msgs : [msgs];
      messages.forEach(msg => {
        allMsgs.push(`${fieldLabel}: ${translateError(msg)}`);
      });
    }
    return allMsgs.join(" | ") || fallback;
  }

  // 3) { title: "..." } — ProblemDetails
  if (data.title) {
    return translateError(data.title);
  }

  // 4) { message: "..." } — Custom
  if (data.message) {
    return translateError(data.message);
  }

  // 5) { error: "..." } — Alternative
  if (data.error) {
    return translateError(data.error);
  }

  // 6) Plain string response
  if (typeof data === "string" && data.length > 0 && data.length < 500) {
    return translateError(data);
  }

  // Fallback مع كود الخطأ
  return `${fallback} (كود الخطأ: ${status})`;
}

// ── ترجمة أخطاء ASP.NET Identity الشائعة ──
const translations = {
  // Registration
  "This National ID is banned.": "هذا الرقم القومي محظور من المنصة.",
  "This National ID is already registered.": "هذا الرقم القومي مسجل من قبل.",
  "This email is already in use.": "هذا البريد الإلكتروني مستخدم بالفعل.",
  "This username is already in use.": "اسم المستخدم مستخدم بالفعل.",
  "This account is under review.": "هذا الحساب لا يزال قيد المراجعة.",

  // Identity errors
  "Passwords must have at least one non alphanumeric character.": "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%).",
  "Passwords must have at least one digit ('0'-'9').": "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل.",
  "Passwords must have at least one uppercase ('A'-'Z').": "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z).",
  "Passwords must have at least one lowercase ('a'-'z').": "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل (a-z).",
  "Passwords must be at least 6 characters.": "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
  "Passwords must be at least 8 characters.": "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",

  // Login
  "Invalid login attempt.": "بيانات الدخول غير صحيحة.",
  "Incorrect password.": "كلمة المرور غير صحيحة.",

  // General
  "User not found": "المستخدم غير موجود.",
  "One or more validation errors occurred.": "يوجد أخطاء في البيانات المدخلة.",
  "An error occurred while processing your request.": "حدث خطأ أثناء معالجة طلبك.",
  "The request is invalid.": "الطلب غير صالح.",
};

// ── أسماء الحقول بالعربي ──
const fieldNames = {
  Email: "البريد الإلكتروني",
  Password: "كلمة المرور",
  FullName: "الاسم الكامل",
  UserName: "اسم المستخدم",
  NationalID: "الرقم القومي",
  PhoneNumber: "رقم الهاتف",
  GovernorateId: "المحافظة",
  CityId: "المدينة",
  Address: "العنوان",
  SpecialtyId: "التخصص",
  PharmacyName: "اسم الصيدلية",
  PrescriptionImage: "صورة الروشتة",
  NIDImage: "صورة البطاقة",
  SocialProofImage: "صورة البحث الاجتماعي",
  Title: "العنوان",
  Description: "الوصف",
  GoalAmount: "المبلغ المطلوب",
  PatientName: "اسم المريض",
  CaseImage: "صورة الحالة",
  Amount: "المبلغ",
  Subject: "الموضوع",
  Message: "الرسالة",
  CurrentPassword: "كلمة المرور الحالية",
  NewPassword: "كلمة المرور الجديدة",
  ClinicAddress: "عنوان العيادة",
  LicenseImage: "كارنيه المزاولة",
  ProfileImage: "الصورة الشخصية",
  OriginalPrice: "السعر الأصلي",
  DiscountedPrice: "السعر المخفض",
};

/**
 * ترجمة رسالة خطأ واحدة
 */
function translateError(msg) {
  if (!msg || typeof msg !== "string") return String(msg || "");
  
  // بحث مباشر
  if (translations[msg]) return translations[msg];

  // بحث جزئي لأخطاء Identity
  for (const [eng, ar] of Object.entries(translations)) {
    if (msg.toLowerCase().includes(eng.toLowerCase())) return ar;
  }

  // لو الرسالة بالانجليزي وطويلة، نرجعها زي ما هي مع إشارة
  if (/^[a-zA-Z\s\d'".!,()-]+$/.test(msg) && msg.length > 10) {
    return `⚠️ ${msg}`;
  }

  return msg;
}

export default extractError;
