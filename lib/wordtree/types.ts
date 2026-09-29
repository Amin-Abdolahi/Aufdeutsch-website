/**
 * Word Tree — Type Definitions (نسخه ۱۳.۰)
 *
 * ⚠️ تغییرات بزرگ نسخه ۱۳.۰:
 * - `Word.treeIds` اضافه شد (کلمه می‌تونه توی چند درخت باشه)
 * - `Tree.wordIds` حذف شد (کلمات از `Word.treeIds` پیدا می‌شن)
 * - `Tree.totalWords` کش شده (از `Word.treeIds` محاسبه می‌شه)
 */

import { Locale } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────
// انواع پایه
// ─────────────────────────────────────────────────────────────

export type TreeLevel = "seedling" | "young" | "mature" | "ancient";

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

export type PlotTheme = "spring" | "summer" | "autumn" | "winter" | "default";

export type TreeVariant =
  | "oak"
  | "pine"
  | "palm"
  | "blossom"
  | "apple"
  | "lemon";

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
// وضعیت کلمه (Runtime)
// ─────────────────────────────────────────────────────────────

/**
 * یه کلمه توی وضعیت runtime.
 *
 * ⚠️ تغییر نسخه ۱۳.۰:
 * - `treeIds`: کلمه می‌تونه توی چند درخت باشه.
 *   مثلاً `machen` توی «افعال» + «روزمره».
 */
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
  /** شناسه‌ی درخت‌هایی که این کلمه توشون هست */
  treeIds: string[];
}

// ─────────────────────────────────────────────────────────────
// میوه
// ─────────────────────────────────────────────────────────────

export interface Fruit {
  id: string;
  wordId: string;
  type: FruitType;
  createdAt: number;
  isReady: boolean;
  isReviewFruit?: boolean;
  quizWords?: string[];
  quizResult?: QuizResult;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  completedAt: number;
  coinsEarned: number;
  timeSpentMs: number;
}

// ─────────────────────────────────────────────────────────────
// درخت (Tree) — سطح سوم
// ─────────────────────────────────────────────────────────────

/**
 * یه درخت توی یه باغچه.
 *
 * ⚠️ تغییرات نسخه ۱۴.۰:
 * - `poolWordIds` اضافه شد: استخر کلمات اختصاصی این درخت.
 *
 * ⚠️ تغییر نسخه ۱۳.۰:
 * - `wordIds` حذف شد. کلمات از طریق `Word.treeIds` پیدا می‌شن.
 * - `totalWords` از روی `Word.treeIds` محاسبه می‌شه (کش شده).
 */
export interface Tree {
  id: string;
  name: string;
  variant: TreeVariant;
  level: TreeLevel;
  /** تعداد کلمات (کش شده — از Word.treeIds محاسبه می‌شه) */
  totalWords: number;
  /** استخر کلمات این درخت (کلماتی که می‌شه یاد گرفت) */
  poolWordIds: string[];
  fruits: Fruit[];
  lastWatered?: number;
  wateredToday: boolean;
  wordsLearnedToday: string[];
  dayState: "watering" | "harvesting" | "ready" | "completed";
  streak: number;
  health?: number;
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────
// باغچه (Plot) — سطح دوم
// ─────────────────────────────────────────────────────────────

export interface Plot {
  id: string;
  name: string;
  theme: PlotTheme;
  trees: Tree[];
  createdAt: number;
}

// ─────────────────────────────────────────────────────────────
// وضعیت کل بازی (GameState)
// ─────────────────────────────────────────────────────────────

export interface GameState {
  /** ─── باغچه‌ها ─── */
  plots: Plot[];
  activePlotId: string | null;
  activeTreeId: string | null;

  /** ─── داده‌های مشترک ─── */
  words: Word[];
  coins: number;
  lastPlayed: number;
  version: number;
  currentDay: number;
  targetLanguage: TargetLanguage;
  totalWordsLearned: number;
  hasSeenTutorial: boolean;
  hasPlantedTree: boolean;
  dailyRewardHistory?: {
    lastRewardDate: string;
    coinsEarnedToday: number;
  };
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
// تمرین و آزمون
// ─────────────────────────────────────────────────────────────

export type ExerciseType =
  | "spelling-simple"
  | "spelling-medium"
  | "spelling-hard"
  | "article"
  | "conjugation"
  | "adjective-comparison";

export interface Exercise {
  type: ExerciseType;
  wordId: string;
  correctAnswer: string;
  questionText: string;
  options?: string[];
  hint?: string;
}

export interface QuizStat {
  id: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentMs: number;
  completedAt: number;
  wrongWordIds: string[];
}

export interface UserStats {
  quizzes: QuizStat[];
  wordStats: Record<string, { correct: number; wrong: number }>;
  exerciseStats: Record<ExerciseType, { correct: number; wrong: number }>;
}

// ─────────────────────────────────────────────────────────────
// Snapshot
// ─────────────────────────────────────────────────────────────

export interface Snapshot {
  id: string;
  createdAt: number;
  version: number;
  gameState: GameState;
  customWords: WordEntry[];
  userStats: UserStats | null;
  label: string;
}