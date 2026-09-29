/**
 * Word Tree — Type Definitions (نسخه ۹.۰)
 *
 * ⚠️ تغییرات نسخه ۹.۰:
 * - اضافه شدن `silver` به `FruitType` (میوه‌ی نقره‌ای برای آزمون)
 * - اضافه شدن `quizWords` به `Fruit` (کلماتی که توی آزمون میان)
 * - اضافه شدن `quizResult` به `Fruit` (نتیجه‌ی آزمون)
 * - اضافه شدن تایپ `QuizStat` (آمار آزمون‌ها)
 */

import { Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────
// انواع پایه
// ─────────────────────────────────────────────────────────────

export type TreeLevel = "seedling" | "young" | "mature" | "ancient";

/**
 * نوع میوه روی درخت.
 *
 * - green: کال (کلمه‌ی جدید)
 * - yellow: نیمه‌رس (مرحله‌ی ۱-۲)
 * - golden: رسیده (مرحله‌ی ۳-۵)
 * - orange: آسیب‌دیده (یادش رفته)
 * - silver: نقره‌ای (میوه‌ی آزمون — هر ۲۰ کلمه)
 */
export type FruitType = "green" | "yellow" | "golden" | "orange" | "silver";

export type WordStatus = "new" | "learning" | "learned";

export type WordCategory =
  | "noun"
  | "verb"
  | "adjective"
  | "phrase"
  | "number"
  | "color";

export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type WordSource = "builtin" | "custom" | "community";

export type TargetLanguage = string;

// ─────────────────────────────────────────────────────────────
// اطلاعات گرامری
// ─────────────────────────────────────────────────────────────

export interface NounInfo {
  article: "der" | "die" | "das";
  plural: string;
  genitive?: string;
}

export interface VerbInfo {
  praeteritum: string;
  perfekt: string;
  auxiliary: "haben" | "sein";
  irregular?: boolean;
}

// ─────────────────────────────────────────────────────────────
// مثال‌ها و تلفظ
// ─────────────────────────────────────────────────────────────

export interface Example {
  de: string;
  translations: Record<Locale, string>;
}

export interface Pronunciation {
  ipa?: string;
  persian?: string;
  audioUrl?: string;
}

// ─────────────────────────────────────────────────────────────
// کلمه‌ی اصلی (Word Entry)
// ─────────────────────────────────────────────────────────────

export interface WordEntry {
  id: string;
  language: TargetLanguage;
  level: GermanLevel;
  category: WordCategory;
  translations: Record<Locale, string>;
  noun?: NounInfo;
  verb?: VerbInfo;
  pronunciation?: Pronunciation;
  example?: Example;
  tags?: string[];
  source?: WordSource;
  createdAt?: number;
  createdBy?: string;
}

// ─────────────────────────────────────────────────────────────
// وضعیت بازی (Runtime State)
// ─────────────────────────────────────────────────────────────

export interface Word {
  id: string;
  language: TargetLanguage;
  german: string;
  translation: string;
  status: WordStatus;
  reviewCount: number;
  lastReviewed?: number;
  reviewStage: number;
  nextReviewDay?: number;
  source?: WordSource;
}

/**
 * میوه‌ی روی درخت.
 *
 * ⚠️ برای میوه‌ی نقره‌ای (silver):
 * - `quizWords`: لیست کلماتی که توی آزمون میان
 * - `quizResult`: نتیجه‌ی آزمون (اگه کاربر داده باشه)
 */
export interface Fruit {
  id: string;
  wordId: string;
  type: FruitType;
  createdAt: number;
  isReady: boolean;
  isReviewFruit?: boolean;
  /** ─── فقط برای میوه‌ی نقره‌ای ─── */
  quizWords?: string[];
  /** ─── نتیجه‌ی آزمون (فقط بعد از انجام) ─── */
  quizResult?: QuizResult;
}

/**
 * نتیجه‌ی آزمون.
 */
export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  completedAt: number;
  coinsEarned: number;
  timeSpentMs: number;
}

export interface TreeState {
  level: TreeLevel;
  totalWords: number;
  fruits: Fruit[];
  lastWatered?: number;
  streak: number;
  health?: number;
}

export interface GameState {
  tree: TreeState;
  words: Word[];
  coins: number;
  lastPlayed: number;
  version: number;
  currentDay: number;
  dayState: "watering" | "harvesting" | "ready" | "completed";
  wordsLearnedToday: string[];
  wateredToday: boolean;
  dailyRewardHistory?: {
    lastRewardDate: string;
    coinsEarnedToday: number;
  };
  targetLanguage: TargetLanguage;
  /** ─── جدید ─── */
  /** تعداد کل کلماتی که کاربر یاد گرفته (برای محاسبه‌ی میوه‌ی نقره‌ای) */
  totalWordsLearned: number;
  /** آخرین باری که کاربر میوه‌ی نقره‌ای گرفته */
  lastSilverFruitAt?: number;
}

// ─────────────────────────────────────────────────────────────
// ایمپورت گروهی
// ─────────────────────────────────────────────────────────────

export interface ImportFile {
  version: string;
  language: string;
  words: ImportWord[];
}

export interface ImportWord {
  de: string;
  fa: string;
  en?: string;
  category: WordCategory;
  level: GermanLevel;
  noun?: NounInfo;
  verb?: VerbInfo;
  pronunciation?: Pronunciation;
  example?: Example;
}

export interface ImportResult {
  total: number;
  imported: number;
  rejected: number;
  errors: string[];
  coinsEarned: number;
}

// ─────────────────────────────────────────────────────────────
// تمرین و آزمون (نسخه ۹.۰)
// ─────────────────────────────────────────────────────────────

/**
 * انواع تمرین‌ها.
 *
 * ⚠️ فاز ۱ فقط `spelling` رو داره. بقیه برای فاز ۲.
 */
export type ExerciseType =
  | "spelling-simple"    // یه حرف کم
  | "spelling-medium"    // چند حرف کم
  | "spelling-hard"      // تایپ کامل
  | "article"            // تشخیص آرتیکل (فاز ۲)
  | "conjugation"        // صرف فعل (فاز ۲)
  | "adjective-comparison"; // صفت تفضیلی (فاز ۲)

/**
 * یه سوال تمرین.
 */
export interface Exercise {
  /** نوع تمرین */
  type: ExerciseType;
  /** شناسه‌ی کلمه */
  wordId: string;
  /** کلمه‌ی آلمانی کامل */
  correctAnswer: string;
  /** متن سوال (مثلاً `d_r` برای der) */
  questionText: string;
  /** گزینه‌ها (برای انتخاب) */
  options?: string[];
  /** توضیح یا راهنما */
  hint?: string;
}

/**
 * آمار یه آزمون.
 */
export interface QuizStat {
  /** شناسه‌ی آزمون */
  id: string;
  /** تعداد کل سوالات */
  totalQuestions: number;
  /** تعداد جواب‌های درست */
  correctAnswers: number;
  /** دقت (درصد) */
  accuracy: number;
  /** زمان صرف‌شده (میلی‌ثانیه) */
  timeSpentMs: number;
  /** تاریخ انجام */
  completedAt: number;
  /** شناسه‌ی کلماتی که توش اشتباه کرده */
  wrongWordIds: string[];
}

/**
 * آمار کلی کاربر.
 *
 * ⚠️ این توی localStorage ذخیره می‌شه.
 */
export interface UserStats {
  /** همه‌ی آزمون‌ها */
  quizzes: QuizStat[];
  /** آمار هر کلمه: چند بار درست، چند بار غلط */
  wordStats: Record<string, { correct: number; wrong: number }>;
  /** آمار هر نوع تمرین */
  exerciseStats: Record<ExerciseType, { correct: number; wrong: number }>;
}