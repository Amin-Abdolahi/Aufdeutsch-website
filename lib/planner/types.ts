// ============================================================
//  Language Planner — types
//  پلنر «زبان‌مستقل»: کاربر زبان هدف خودش را تعریف می‌کند.
// ============================================================

export type TaskCategory =
  | "vocab"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing";

export type Weekday =
  | "sat"
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri";

export interface LanguageProfile {
  id: string;
  language: string;        // زبان هدف — تایپ آزاد، مثلاً "انگلیسی"
  level: string;           // "A1" ... "C2" یا "مبتدی"
  goal: string;            // "مکالمه روزمره"
  dailyMinutes: number;    // ۳۰
  weeklyTarget: number;    // دقیقه هدف هفتگی
  activeDays: Weekday[];   // روزهای فعال هفته
  createdAt: number;
}

export interface PlannerTask {
  id: string;
  languageId: string;      // ارجاع به پروفایل زبان
  day: Weekday | "bank";   // "bank" = بانک تسک (هنوز جاگذاری نشده)
  category: TaskCategory;
  title: string;
  duration: number;        // دقیقه
  completed: boolean;
  completedAt?: number;    // timestamp تکمیل (برای استریک)
  resource?: string;       // منبع اختیاری
  notes?: string;
}

export interface PlannerState {
  languages: LanguageProfile[];
  activeLanguageId: string | null;
  tasks: PlannerTask[];
  lastResetWeek: string | null;  // ISO date شروع هفته
}

// دسته‌بندی‌ها با رنگ و آیکون
export interface CategoryMeta {
  key: TaskCategory;
  color: string;       // tailwind bg class
  text: string;        // tailwind text class
  icon: string;        // emoji
}

export const CATEGORIES: CategoryMeta[] = [
  { key: "vocab",    color: "bg-rose-100",    text: "text-rose-700",    icon: "📚" },
  { key: "grammar",  color: "bg-amber-100",   text: "text-amber-700",   icon: "🧩" },
  { key: "listening",color: "bg-sky-100",     text: "text-sky-700",     icon: "🎧" },
  { key: "speaking", color: "bg-emerald-100", text: "text-emerald-700", icon: "🗣️" },
  { key: "reading",  color: "bg-violet-100",  text: "text-violet-700",  icon: "📖" },
  { key: "writing",  color: "bg-orange-100",  text: "text-orange-700",  icon: "✍️" },
];

export const WEEKDAYS: Weekday[] = [
  "sat", "sun", "mon", "tue", "wed", "thu", "fri",
];
