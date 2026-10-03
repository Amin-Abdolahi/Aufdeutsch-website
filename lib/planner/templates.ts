// ============================================================
//  Language Planner — قالب‌های پیشنهادی
//  بر اساس زبان، سطح و هدف، یک هفته از پیش پر می‌کند.
// ============================================================

import type { PlannerTask, TaskCategory, Weekday } from "./types";

export interface TemplateInput {
  language: string;
  level: string;
  goal: string;
  dailyMinutes: number;
  activeDays: Weekday[];
}

interface Template {
  id: string;
  category: TaskCategory;
  title: string;
  resource?: string;
  /** نسبت وزن این تسک از زمان روزانه */
  weight: number;
}

// قالب بر اساس هدف
const TEMPLATES: Record<string, Template[]> = {
  // مکالمه روزمره
  conversation: [
    { id: "c1", category: "speaking", title: "Shadowing — تکرار بلند ۱۰ جمله", weight: 0.3 },
    { id: "c2", category: "listening", title: "گوش دادن به پادکست کوتاه", resource: "Podcast", weight: 0.25 },
    { id: "c3", category: "vocab", title: "مرور ۲۰ واژه کاربردی با جمله", weight: 0.2 },
    { id: "c4", category: "speaking", title: "توصیف روزم از ۵ جمله", weight: 0.25 },
  ],
  // آزمون
  exam: [
    { id: "e1", category: "grammar", title: "تمرین گرامر بخش هدف", weight: 0.3 },
    { id: "e2", category: "reading", title: "درک مطلب نمونه‌آزمون زمان‌دار", resource: "Prüfung", weight: 0.25 },
    { id: "e3", category: "listening", title: "درک شنیداری نمونه‌آزمون", weight: 0.25 },
    { id: "e4", category: "writing", title: "نوشتن یک متن کوتاه موضوعی", weight: 0.2 },
  ],
  // مهاجرت / زندگی روزمره
  migration: [
    { id: "m1", category: "vocab", title: "واژگان کاربردی (فروشگاه، پزشک، اداره)", weight: 0.3 },
    { id: "m2", category: "speaking", title: "دیالوگ کوتاه تمرینی با خود", weight: 0.25 },
    { id: "m3", category: "reading", title: "خواندن یک متن خبری ساده", weight: 0.25 },
    { id: "m4", category: "listening", title: "گوش دادن به اعلام عمومی", weight: 0.2 },
  ],
  // شغل / کاری
  work: [
    { id: "w1", category: "vocab", title: "واژگان تخصصی حوزه کاری", weight: 0.3 },
    { id: "w2", category: "writing", title: "نوشتن ایمیل کاری کوتاه", weight: 0.25 },
    { id: "w3", category: "speaking", title: "معرفی کاری شفاهی ۱ دقیقه‌ای", weight: 0.25 },
    { id: "w4", category: "reading", title: "خواندن مقاله کوتاه صنعتی", weight: 0.2 },
  ],
  // عمومی / تعادل
  general: [
    { id: "g1", category: "vocab", title: "مرور واژه‌های روز قبل", weight: 0.25 },
    { id: "g2", category: "grammar", title: "یک نکته گرامری + ۳ مثال", weight: 0.25 },
    { id: "g3", category: "listening", title: "گوش دادن به محتوای کوتاه", weight: 0.25 },
    { id: "g4", category: "reading", title: "خواندن یک پاراگراف با دقت", weight: 0.25 },
  ],
};

function pickTemplates(goal: string): Template[] {
  const g = goal.toLowerCase();
  if (/(مکالم|گفتگو|conversation|speak)/.test(g)) return TEMPLATES.conversation;
  if (/(آزمون|امتحان|exam|test|pruf|prüfung)/.test(g)) return TEMPLATES.exam;
  if (/(مهاجر|کوچ|migration|immigr|leben|زندگی)/.test(g)) return TEMPLATES.migration;
  if (/(شغل|کار|job|work|beruf)/.test(g)) return TEMPLATES.work;
  return TEMPLATES.general;
}

/**
 * ساخت یک هفته‌ی پیشنهادی بر اساس پروفایل زبان.
 * تسک‌ها به‌صورت متناوب بین دسته‌بندی‌ها بین روزهای فعال پخش می‌شوند.
 */
export function buildWeek(
  input: TemplateInput,
  languageId: string
): Omit<PlannerTask, "id" | "completed">[] {
  const templates = pickTemplates(input.goal);
  const out: Omit<PlannerTask, "id" | "completed">[] = [];
  const days = input.activeDays;

  days.forEach((day, dayIdx) => {
    // هر روز ۱-۲ تسک (بسته به زمان روزانه)
    const tpls: Template[] = [];
    if (input.dailyMinutes <= 15) {
      tpls.push(templates[dayIdx % templates.length]);
    } else {
      tpls.push(templates[dayIdx % templates.length]);
      tpls.push(templates[(dayIdx + 1) % templates.length]);
    }

    let remaining = input.dailyMinutes;
    tpls.forEach((tpl, ti) => {
      const isLast = ti === tpls.length - 1;
      const dur = isLast
        ? remaining
        : Math.max(5, Math.round(input.dailyMinutes * tpl.weight));
      remaining -= dur;
      out.push({
        languageId,
        day,
        category: tpl.category,
        title: tpl.title,
        duration: Math.max(5, dur),
        resource: tpl.resource,
      });
    });
  });

  return out;
}
