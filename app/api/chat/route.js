import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `أنت "رعايا" المساعد الذكي لمنصة رعاية الخيرية الطبية في مصر.

معلومات المنصة:
- منصة خيرية تقدم رعاية صحية مجانية للمحتاجين في مصر
- الخدمات: استشارات طبية مجانية، طلب أدوية بالروشتة، توصيل أدوية، أطباء بأسعار مخفضة، تبرعات، نداءات طوارئ
- المريض: يطلب استشارة من "استشاراتي"، يطلب دواء من "طلبات الأدوية" برفع روشتة، يتبرع من "التبرعات"
- الطبيب: يرى الطلبات في محافظته، يقبل ويحدد مواعيد، يسجل اكتمال الكشف
- الصيدلي: يرى طلبات الأدوية، يقبل ما يستطيع توفيره
- المتطوع: يأخذ مهام توصيل، يستلم من الصيدلية ويوصل للمريض
- التواصل: 01097972975، info@r3aya.org، القاهرة

قواعد مهمة جداً:
- رد بالعربية فقط بجملة أو جملتين كحد أقصى
- لا تكتب تفكيرك أو تحليلك أو أي شيء بالإنجليزية
- لا تكرر السؤال ولا تكتب مقدمات
- رد مباشرة على السؤال بإجابة قصيرة`;

// Only non-thinking models
const FREE_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
  "minimax/minimax-m2.5:free",
];

// Strip any thinking/reasoning text that leaks through
function cleanResponse(text) {
  let cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
    .replace(/\[INST\][\s\S]*?\[\/INST\]/gi, "")
    .trim();

  // If response contains English reasoning before Arabic, extract only the Arabic part
  const arabicStart = cleaned.search(/[\u0600-\u06FF]/);
  if (arabicStart > 50) {
    // There's a lot of non-Arabic text before the Arabic - likely thinking
    cleaned = cleaned.substring(arabicStart).trim();
  }

  return cleaned;
}

async function callModel(model, msgs, apiKey) {
  return await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://r3aya.vercel.app",
      "X-Title": "R3aya AI",
    },
    body: JSON.stringify({
      model,
      messages: msgs,
      temperature: 0.7,
      max_tokens: 200,
    }),
  });
}

export async function POST(request) {
  try {
    const { message, history, role, userName } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Build messages
    let systemContent = SYSTEM_PROMPT + `\nدور المستخدم: ${role || "مستخدم"}`;
    if (userName) {
      systemContent += `\nاسم المستخدم: ${userName}. ناديه باسمه.`;
    }

    const messages = [{ role: "system", content: systemContent }];

    // Add history (last 6 only)
    if (history && history.length > 0) {
      const recent = history.slice(-6);
      for (const msg of recent) {
        if (msg.type === "user") {
          messages.push({ role: "user", content: msg.text });
        } else if (msg.type === "bot" && msg.text) {
          messages.push({ role: "assistant", content: msg.text });
        }
      }
    }

    messages.push({ role: "user", content: message });

    // Try models in order
    for (const model of FREE_MODELS) {
      try {
        const response = await callModel(model, messages, apiKey);

        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) {
            const cleaned = cleanResponse(text);
            if (cleaned.length > 0) {
              console.log(`OK: ${model}`);
              return NextResponse.json({ reply: cleaned });
            }
          }
        } else {
          const errText = await response.text();
          console.warn(`${model}: ${response.status}`, errText.substring(0, 80));
          if (response.status === 401 || response.status === 403) break;
        }
      } catch (e) {
        console.warn(`${model}: ${e.message}`);
      }
    }

    return NextResponse.json({ error: "الخدمة غير متاحة حالياً، حاول لاحقاً" }, { status: 500 });
  } catch (error) {
    console.error("Chat error:", error.message);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
