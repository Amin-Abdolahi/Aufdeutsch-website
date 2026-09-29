/**
 * Word Tree — Game Logic (نسخه ۵.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. Spaced Repetition بر اساس «روز بازی»:
 *    - هر کلمه `reviewStage` داره (0-5)
 *    - `nextReviewDay` = شماره‌ی روز بازی که باید مرور بشه
 *    - وقتی کاربر «روز بعد» رو می‌زنه، اگه `nextReviewDay <= currentDay`،
 *      کلمه آماده‌ی مروره و یه میوه‌ی مرور ساخته می‌شه.
 *    - اینطوری کاربر توی یه روز تقویمی می‌تونه چند روز بازی جلو بره
 *      و مرورها هم درست کار کنن.
 *
 * ۲. هر تابع باید «pure» باشه.
 */

import { GameState, Word, Fruit, TreeLevel } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  WORDS_TO_YOUNG,
  WORDS_TO_MATURE,
  WORDS_TO_ANCIENT,
  STATE_VERSION,
  REVIEW_INTERVALS,
  MAX_REVIEW_STAGE,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// وضعیت اولیه
// ─────────────────────────────────────────────────────────────

export function createInitialState(): GameState {
  return {
    tree: {
      level: "seedling",
      totalWords: 0,
      fruits: [],
      streak: 0,
      health: 100,
    },
    words: [],
    coins: 0,
    lastPlayed: Date.now(),
    version: STATE_VERSION,
    currentDay: 1,
    dayState: "watering",
    wordsLearnedToday: [],
    wateredToday: false,
  };
}

// ─────────────────────────────────────────────────────────────
// سطح درخت
// ─────────────────────────────────────────────────────────────

export function calculateTreeLevel(totalWords: number): TreeLevel {
  if (totalWords >= WORDS_TO_ANCIENT) return "ancient";
  if (totalWords >= WORDS_TO_MATURE) return "mature";
  if (totalWords >= WORDS_TO_YOUNG) return "young";
  return "seedling";
}

// ─────────────────────────────────────────────────────────────
// Spaced Repetition — محاسبه‌ی روز مرور
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی روز بازی برای مرور بعدی.
 *
 * @param currentDay - روز بازی فعلی
 * @param stage - مرحله‌ی مرور (0-5)
 * @returns شماره‌ی روز بازیه که باید مرور بشه
 */
export function calculateNextReviewDay(
  currentDay: number,
  stage: number
): number {
  const safeStage = Math.min(stage, MAX_REVIEW_STAGE);
  const days = REVIEW_INTERVALS[safeStage];
  return currentDay + days;
}

/**
 * تبدیل مرحله‌ی مرور به نوع میوه.
 *
 * - stage 0: green (کال)
 * - stage 1-2: yellow (نیمه‌رس)
 * - stage 3-5: golden (رسیده)
 */
export function stageToFruitType(stage: number): "green" | "yellow" | "golden" {
  if (stage === 0) return "green";
  if (stage <= 2) return "yellow";
  return "golden";
}

/**
 * بررسی اینکه آیا کلمه آماده‌ی مروره.
 *
 * @param word - کلمه
 * @param currentDay - روز بازی فعلی
 * @returns true اگه `nextReviewDay <= currentDay` باشه
 */
export function isWordDueForReview(word: Word, currentDay: number): boolean {
  if (!word.nextReviewDay) return false;
  return word.nextReviewDay <= currentDay;
}

/**
 * آبیاری درخت — اضافه کردن کلمات جدید.
 *
 * ⚠️ نکته‌ی مهم:
 * - کلمات جدید با `reviewStage: 0` و `nextReviewDay: undefined` اضافه می‌شن.
 * - منبع کلمه (`source`) از `WordEntry` گرفته می‌شه.
 */
export function waterTree(state: GameState, newWords: Word[]): GameState {
  const totalWords = state.tree.totalWords + newWords.length;
  const newLevel = calculateTreeLevel(totalWords);

  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: false,
    isReviewFruit: false,
  }));

  return {
    ...state,
    words: [...state.words, ...newWords],
    tree: {
      ...state.tree,
      totalWords,
      level: newLevel,
      lastWatered: Date.now(),
      fruits: [...state.tree.fruits, ...newFruits],
    },
    lastPlayed: Date.now(),
    wateredToday: true,
    wordsLearnedToday: [
      ...state.wordsLearnedToday,
      ...newWords.map((w) => w.id),
    ],
    dayState: "harvesting",
  };
}

// ─────────────────────────────────────────────────────────────
// چیدن میوه (مرور کلمات)
// ─────────────────────────────────────────────────────────────

export function harvestFruit(
  state: GameState,
  fruitId: string,
  remembered: boolean
): GameState {
  const fruit = state.tree.fruits.find((f) => f.id === fruitId);
  if (!fruit) return state;

  // ─── حالت ۱: یادش مونده ───
  if (remembered) {
    const newState: GameState = {
      ...state,
      coins: state.coins + COIN_PER_GOLDEN_FRUIT,
      tree: {
        ...state.tree,
        fruits: state.tree.fruits.filter((f) => f.id !== fruitId),
      },
      words: state.words.map((w) => {
        if (w.id !== fruit.wordId) return w;

        const newStage = Math.min(w.reviewStage + 1, MAX_REVIEW_STAGE);
        return {
          ...w,
          reviewCount: w.reviewCount + 1,
          lastReviewed: Date.now(),
          reviewStage: newStage,
          nextReviewDay: calculateNextReviewDay(state.currentDay, newStage),
          status: newStage >= 3 ? "learned" : "learning",
        };
      }),
      lastPlayed: Date.now(),
    };
    return checkDayCompletion(newState);
  }

  // ─── حالت ۲: یادش رفته ───
  const newState: GameState = {
    ...state,
    tree: {
      ...state.tree,
      fruits: state.tree.fruits.map((f) =>
        f.id === fruitId ? { ...f, type: "orange" as const } : f
      ),
    },
    words: state.words.map((w) => {
      if (w.id !== fruit.wordId) return w;
      return {
        ...w,
        reviewStage: 1,
        nextReviewDay: calculateNextReviewDay(state.currentDay, 1),
        status: "learning",
      };
    }),
    lastPlayed: Date.now(),
  };
  return checkDayCompletion(newState);
}

// ─────────────────────────────────────────────────────────────
// مدیریت «روز بازی»
// ─────────────────────────────────────────────────────────────

export function checkDayCompletion(state: GameState): GameState {
  if (!state.wateredToday) return state;

  const remainingFruits = state.tree.fruits.filter(
    (f) => f.type === "green" || f.type === "orange"
  );

  if (remainingFruits.length > 0) return state;

  return {
    ...state,
    dayState: "completed",
    tree: {
      ...state.tree,
      streak: state.tree.streak + 1,
    },
  };
}

/**
 * شروع روز بعد بازی.
 *
 * ⚠️ نکته‌ی مهم:
 * ۱. روز بازی یکی جلو می‌ره.
 * ۲. کلماتی که `nextReviewDay <= currentDay` (روز جدید) هستن،
 *    میوه‌ی مرور می‌شن.
 * ۳. رنگ میوه بر اساس `reviewStage`:
 *    - stage 1-2: yellow
 *    - stage 3-5: golden
 */
export function startNextDay(state: GameState): GameState {
  const newDay = state.currentDay + 1;

  // پیدا کردن کلماتی که آماده‌ی مرورن (بر اساس روز بازی)
  const wordsDueForReview = state.words.filter((w) =>
    isWordDueForReview(w, newDay)
  );

  // ساختن میوه‌های مرور
  const reviewFruits: Fruit[] = wordsDueForReview.map((word, index) => ({
    id: `review-fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: stageToFruitType(word.reviewStage),
    createdAt: Date.now(),
    isReady: true,
    isReviewFruit: true,
  }));

  return {
    ...state,
    currentDay: newDay,
    dayState: "watering",
    wateredToday: false,
    wordsLearnedToday: [],
    tree: {
      ...state.tree,
      fruits: [...state.tree.fruits, ...reviewFruits],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// زمان و محدودیت‌ها
// ─────────────────────────────────────────────────────────────

export function canWaterToday(state: GameState): boolean {
  return !state.wateredToday && state.dayState !== "completed";
}

// ─────────────────────────────────────────────────────────────
// آمار و اطلاعات
// ─────────────────────────────────────────────────────────────

export function countFruits(state: GameState): number {
  return state.tree.fruits.length;
}

export function countReadyFruits(state: GameState): number {
  return state.tree.fruits.filter(
    (f) => f.type === "green" || f.type === "orange"
  ).length;
}

export function calculateProgress(state: GameState): number {
  const current = state.tree.totalWords;
  const thresholds = {
    seedling: { min: 0, max: WORDS_TO_YOUNG },
    young: { min: WORDS_TO_YOUNG, max: WORDS_TO_MATURE },
    mature: { min: WORDS_TO_MATURE, max: WORDS_TO_ANCIENT },
    ancient: { min: WORDS_TO_ANCIENT, max: WORDS_TO_ANCIENT },
  };

  const { min, max } = thresholds[state.tree.level];
  if (max === min) return 100;

  return Math.min(((current - min) / (max - min)) * 100, 100);
}