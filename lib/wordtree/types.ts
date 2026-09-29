/**
 * Word Tree — Type Definitions (نسخه ۶.۰)
 *
 * این فایل، ساختار داده‌ای کل بازی رو تعریف می‌کنه.
 *
 * ⚠️ نکته‌ی مهم برای توسعه‌دهنده‌های آینده:
 *
 * ۱. ساختار برای «آینده‌نگر بودن» طراحی شده.
 *
 * ۲. مفهوم Spaced Repetition:
 *    - هر کلمه یه `reviewStage` داره (0-5)
 *    - `nextReviewDay` = شماره‌ی روز بازی که باید مرور بشه
 *
 * ۳. سه منبع کلمه داریم:
 *    - builtin: کلمات پیش‌فرض ما (۵۰ تا)
 *    - custom: کلمات کاربر (localStorage)
 *    - community: کلمات عمومی (Supabase — فاز ۲)
 *
 * ۴. اگه می‌خوای فیلد جدیدی اضافه کنی:
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
 */
export type FruitType = "green" | "yellow" | "golden" | "orange";

/**
 * وضعیت یادگیری هر کلمه.
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

/**
 * منبع کلمه.
 *
 * - builtin: کلمات پیش‌فرض (فایل `words-de.ts`)
 * - custom: کلمات سفارشی کاربر (localStorage)
 * - community: کلمات عمومی (Supabase — فاز ۲)
 */
export type WordSource = "builtin" | "custom" | "community";

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
  /** آیا فعل بی‌قاعده‌ست؟ */
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
 *
 * ⚠️ اضافه شده در نسخه ۶.۰:
 * - `source`: منبع کلمه (builtin, custom, community)
 * - `createdAt`: زمان ایجاد
 * - `createdBy`: شناسه‌ی کاربر (برای فاز ۲)
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
  /** ─── جدید ─── */
  /** منبع کلمه */
  source: WordSource;
  /** زمان ایجاد (برای کلمات سفارشی) */
  createdAt?: number;
  /** شناسه‌ی کاربر (برای فاز ۲ — Supabase) */
  createdBy?: string;
}

// ─────────────────────────────────────────────────────────────
// وضعیت بازی (Runtime State)
// ─────────────────────────────────────────────────────────────

/**
 * کلمه‌ی درون بازی (نسخه‌ی runtime).
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
  /** ─── جدید ─── */
  /** منبع کلمه (برای تشخیص سفارشی از داخلی) */
  source: WordSource;
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
  /** سلامت درخت (0-100) */
  health?: number;
}

/**
 * وضعیت کل بازی.
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
  /** ─── جدید ─── */
  /** تاریخچه‌ی جوایز روزانه (برای محدودیت) */
  dailyRewardHistory?: {
    /** تاریخ آخرین جایزه */
    lastRewardDate: string;
    /** مجموع سکه‌های جایزه در روز جاری */
    coinsEarnedToday: number;
  };
}