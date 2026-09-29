/**
 * Word Tree — Type Definitions (نسخه ۱۰.۰)
 *
 * ⚠️ تغییرات نسخه ۱۰.۰:
 * - اضافه شدن `hasSeenTutorial` به `GameState`
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
  totalWordsLearned: number;
  lastSilverFruitAt?: number;
  /** ─── جدید ─── */
  /** آیا کاربر تور اولیه رو دیده؟ */
  hasSeenTutorial: boolean;
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