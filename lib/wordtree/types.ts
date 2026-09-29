/**
 * Word Tree — Type Definitions (نسخه ۴.۰)
 *
 * این فایل، ساختار داده‌ای کل بازی رو تعریف می‌کنه.
 *
 * ⚠️ نکته‌ی مهم برای توسعه‌دهنده‌های آینده:
 *
 * ۱. ساختار برای «آینده‌نگر بودن» طراحی شده.
 *
 * ۲. مفهوم Spaced Repetition:
 *    - هر کلمه یه `reviewStage` داره (0 تا 5)
 *    - هر مرحله یه فاصله‌ی زمانی مشخص داره (۱ روز، ۳ روز، ۷ روز...)
 *    - `nextReviewAt` = زمان مرور بعدی
 *    - وقتی این زمان برسه، میوه دوباره روی درخت ظاهر می‌شه
 *
 * ۳. اگه می‌خوای فیلد جدیدی اضافه کنی:
 *    - اول ببین آیا می‌تونی از فیلدهای اختیاری (?) استفاده کنی.
 *    - اگه فیلد اجباریه، باید یه migration بنویسی (توی storage.ts).
 *    - کامنت بنویس که چرا اضافه شد.
 */

import { Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────
// انواع پایه
// ─────────────────────────────────────────────────────────────

/**
 * سطح درخت بر اساس تعداد کلمات یادگرفته‌شده.
 */
export type TreeLevel = "seedling" | "young" | "mature" | "ancient";

/**
 * نوع میوه روی درخت.
 *
 * - green: کال (کلمه‌ی جدید، هنوز مرور نشده) — reviewStage = 0
 * - yellow: نیمه‌رس (کلمه‌ی در حال یادگیری) — reviewStage = 1-2
 * - golden: رسیده (کلمه‌ی مرورشده) — reviewStage = 3-4
 * - orange: آسیب‌دیده (کلمه‌ای که کاربر یادش رفته)
 */
export type FruitType = "green" | "yellow" | "golden" | "orange";

/**
 * وضعیت یادگیری هر کلمه.
 *
 * - new: تازه اضافه شده، هنوز مرور نشده
 * - learning: در حال یادگیری (۱-۲ بار مرور شده)
 * - learned: یاد گرفته شده (۳+ بار مرور موفق)
 */
export type WordStatus = "new" | "learning" | "learned";

/**
 * دسته‌بندی کلمات.
 */
export type WordCategory =
  | "noun"
  | "verb"
  | "adjective"
  | "phrase"
  | "number"
  | "color";

/**
 * سطح زبان آلمانی (CEFR).
 */
export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1";

// ─────────────────────────────────────────────────────────────
// اطلاعات گرامری
// ─────────────────────────────────────────────────────────────

/**
 * اطلاعات گرامری اسم‌ها (Nomen).
 */
export interface NounInfo {
  /** حرف تعریف معین (Nominativ) */
  article: "der" | "die" | "das";
  /** حالت جمع */
  plural: string;
  /** حالت اضافی (Genitiv) — اختیاری، برای فاز ۳ */
  genitive?: string;
}

/**
 * اطلاعات گرامری فعل‌ها (Verben).
 */
export interface VerbInfo {
  /** گذشته‌ی ساده */
  praeteritum: string;
  /** گذشته‌ی کامل (با فعل کمکی) */
  perfekt: string;
  /** فعل کمکی: haben یا sein */
  auxiliary: "haben" | "sein";
  /** آیا فعل بی‌قاعده‌ست؟ (برای فاز ۳) */
  irregular?: boolean;
}

// ─────────────────────────────────────────────────────────────
// مثال‌ها و تلفظ
// ─────────────────────────────────────────────────────────────

/**
 * مثال دو زبانه.
 */
export interface Example {
  /** جمله‌ی آلمانی */
  de: string;
  /** ترجمه به زبان‌های مختلف */
  translations: Record<Locale, string>;
}

/**
 * اطلاعات تلفظ.
 */
export interface Pronunciation {
  /** تلفظ IPA (استاندارد بین‌المللی) */
  ipa?: string;
  /** تلفظ فارسی‌نویسی (برای فارسی‌زبان‌ها) */
  persian?: string;
  /** لینک فایل صوتی */
  audioUrl?: string;
}

// ─────────────────────────────────────────────────────────────
// کلمه‌ی اصلی (Word Entry)
// ─────────────────────────────────────────────────────────────

/**
 * کلمه‌ی اصلی در دیتابیس بازی.
 */
export interface WordEntry {
  /** شناسه‌ی یکتا */
  id: string;
  /** سطح زبانی */
  level: GermanLevel;
  /** دسته‌بندی گرامری */
  category: WordCategory;
  /** ترجمه به زبان‌های مختلف */
  translations: Record<Locale, string>;
  /** اطلاعات گرامری اسم (فقط اگه category = noun باشه) */
  noun?: NounInfo;
  /** اطلاعات گرامری فعل (فقط اگه category = verb باشه) */
  verb?: VerbInfo;
  /** تلفظ */
  pronunciation?: Pronunciation;
  /** مثال */
  example?: Example;
  /** تگ‌ها برای فیلتر کردن (فاز ۳) */
  tags?: string[];
}

// ─────────────────────────────────────────────────────────────
// وضعیت بازی (Runtime State)
// ─────────────────────────────────────────────────────────────

/**
 * کلمه‌ی درون بازی (نسخه‌ی runtime).
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * - `reviewStage`: مرحله‌ی مرور (0-5)
 * - `nextReviewDay`: شماره‌ی روز بازیه که این کلمه باید مرور بشه
 *   (به جای `nextReviewAt` که timestamp بود).
 *   اینطوری «زمان مرور» بر اساس روز بازی حساب می‌شه، نه زمان واقعی.
 */
export interface Word {
  /** شناسه (مطابق با WordEntry.id) */
  id: string;
  /** کلمه‌ی آلمانی */
  german: string;
  /** ترجمه به زبان کاربر */
  translation: string;
  /** وضعیت یادگیری */
  status: WordStatus;
  /** تعداد مرور موفق */
  reviewCount: number;
  /** آخرین زمان مرور (timestamp) */
  lastReviewed?: number;
  /** مرحله‌ی مرور (0 تا 5) */
  reviewStage: number;
  /** شماره‌ی روز بازی برای مرور بعدی */
  nextReviewDay?: number;
}

/**
 * میوه‌ی روی درخت.
 */
export interface Fruit {
  /** شناسه‌ی یکتا */
  id: string;
  /** شناسه‌ی کلمه‌ای که میوه بهش وصله */
  wordId: string;
  /** نوع میوه (رنگ) */
  type: FruitType;
  /** زمان ایجاد (timestamp) */
  createdAt: number;
  /** آیا آماده‌ی چیدنه؟ */
  isReady: boolean;
  /** آیا این میوه برای مرور دوره‌ای ایجاد شده؟ */
  isReviewFruit?: boolean;
}

/**
 * وضعیت درخت.
 */
export interface TreeState {
  /** سطح درخت */
  level: TreeLevel;
  /** تعداد کل کلمات یادگرفته‌شده */
  totalWords: number;
  /** میوه‌های روی درخت */
  fruits: Fruit[];
  /** آخرین زمان آبیاری (timestamp) */
  lastWatered?: number;
  /** تعداد روزهای متوالی (streak) */
  streak: number;
  /** سلامت درخت (0-100) — برای فاز ۲ */
  health?: number;
}

/**
 * وضعیت کل بازی.
 *
 * ⚠️ نکته‌ی مهم درباره‌ی «روز بازی»:
 *
 * `currentDay` = شماره‌ی روز بازی فعلی (۱، ۲، ۳، ...)
 * `dayState` = وضعیت روز فعلی:
 *   - "watering": کاربر باید آبیاری کنه
 *   - "harvesting": کاربر باید میوه‌ها رو بچینه
 *   - "ready": هر دو کار انجام شده، آماده‌ی روز بعد
 *   - "completed": روز تموم شده
 */
export interface GameState {
  /** وضعیت درخت */
  tree: TreeState;
  /** کلمات یادگرفته‌شده */
  words: Word[];
  /** سکه‌ها */
  coins: number;
  /** آخرین زمان بازی (timestamp) */
  lastPlayed: number;
  /** نسخه‌ی ساختار (برای migration) */
  version: number;
  /** شماره‌ی روز بازی فعلی */
  currentDay: number;
  /** وضعیت روز فعلی */
  dayState: "watering" | "harvesting" | "ready" | "completed";
  /** شناسه‌ی کلماتی که در روز جاری یاد گرفته شدن */
  wordsLearnedToday: string[];
  /** آیا کاربر امروز آبیاری کرده؟ */
  wateredToday: boolean;
}