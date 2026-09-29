/**
 * Word Tree — Game Logic (نسخه ۷.۰)
 *
 * ⚠️ تغییرات نسخه ۷.۰:
 * - اضافه شدن `hasPlantedTree` به GameState
 * - اضافه شدن تابع `plantTree` (کاشت درخت)
 */

import { GameState, Word, Fruit, TreeLevel, QuizResult } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  WORDS_TO_YOUNG,
  WORDS_TO_MATURE,
  WORDS_TO_ANCIENT,
  STATE_VERSION,
  REVIEW_INTERVALS,
  MAX_REVIEW_STAGE,
  DEFAULT_TARGET_LANGUAGE,
  SILVER_FRUIT_INTERVAL,
  QUIZ_REWARD_COINS,
  QUIZ_PASS_THRESHOLD,
} from "./constants";
import { generateQuiz } from "./exercises";

// ─────────────────────────────────────────────────────────────
// وضعیت اولیه
// ─────────────────────────────────────────────────────────────

/**
 * ساخت وضعیت اولیه‌ی بازی.
 *
 * ⚠️ اضافه شده در نسخه ۷.۰:
 * - `hasPlantedTree: false` → کاربر باید اول درخت بکاره.
 */
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
    targetLanguage: DEFAULT_TARGET_LANGUAGE,
    totalWordsLearned: 0,
    hasSeenTutorial: false,
    hasPlantedTree: false,
  };
}

// ─────────────────────────────────────────────────────────────
// کاشت درخت (نسخه ۷.۰)
// ─────────────────────────────────────────────────────────────

/**
 * کاشت درخت.
 *
 * ⚠️ این تابع وقتی صدا زده می‌شه که کاربر اولین درختش رو می‌کاره.
 * بعد از کاشت، `hasPlantedTree` به `true` می‌ره.
 *
 * @param state - وضعیت فعلی
 * @returns وضعیت جدید
 */
export function plantTree(state: GameState): GameState {
  return {
    ...state,
    hasPlantedTree: true,
    lastPlayed: Date.now(),
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
// Spaced Repetition
// ─────────────────────────────────────────────────────────────

export function calculateNextReviewDay(
  currentDay: number,
  stage: number
): number {
  const safeStage = Math.min(stage, MAX_REVIEW_STAGE);
  const days = REVIEW_INTERVALS[safeStage];
  return currentDay + days;
}

export function stageToFruitType(stage: number): "green" | "yellow" | "golden" {
  if (stage === 0) return "green";
  if (stage <= 2) return "yellow";
  return "golden";
}

export function isWordDueForReview(word: Word, currentDay: number): boolean {
  if (!word.nextReviewDay) return false;
  return word.nextReviewDay <= currentDay;
}

// ─────────────────────────────────────────────────────────────
// میوه‌ی نقره‌ای
// ─────────────────────────────────────────────────────────────

export function createSilverFruit(state: GameState): Fruit {
  const exercises = generateQuiz(state.words, 5);

  return {
    id: `silver-fruit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    wordId: "",
    type: "silver",
    createdAt: Date.now(),
    isReady: true,
    isReviewFruit: false,
    quizWords: exercises.map((e) => e.wordId),
  };
}

export function shouldAwardSilverFruit(state: GameState): boolean {
  const learned = state.totalWordsLearned;
  const interval = SILVER_FRUIT_INTERVAL;

  if (learned > 0 && learned % interval === 0) {
    if (state.lastSilverFruitAt === learned) return false;
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// آبیاری (یادگیری کلمات جدید)
// ─────────────────────────────────────────────────────────────

export function waterTree(state: GameState, newWords: Word[]): GameState {
  const totalWords = state.tree.totalWords + newWords.length;
  const newLevel = calculateTreeLevel(totalWords);
  const totalWordsLearned = state.totalWordsLearned + newWords.length;

  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: false,
    isReviewFruit: false,
  }));

  let updatedState: GameState = {
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
    totalWordsLearned,
  };

  if (shouldAwardSilverFruit(updatedState)) {
    const silverFruit = createSilverFruit(updatedState);
    updatedState = {
      ...updatedState,
      tree: {
        ...updatedState.tree,
        fruits: [...updatedState.tree.fruits, silverFruit],
      },
      lastSilverFruitAt: totalWordsLearned,
    };
  }

  return updatedState;
}

// ─────────────────────────────────────────────────────────────
// چیدن میوه
// ─────────────────────────────────────────────────────────────

export function harvestFruit(
  state: GameState,
  fruitId: string,
  remembered: boolean
): GameState {
  const fruit = state.tree.fruits.find((f) => f.id === fruitId);
  if (!fruit) return state;

  if (fruit.type === "silver") {
    return state;
  }

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
// تکمیل آزمون
// ─────────────────────────────────────────────────────────────

export function completeQuiz(
  state: GameState,
  fruitId: string,
  result: QuizResult
): GameState {
  const fruit = state.tree.fruits.find((f) => f.id === fruitId);
  if (!fruit || fruit.type !== "silver") return state;

  const passed = result.correctAnswers >= QUIZ_PASS_THRESHOLD;
  const coinsEarned = passed ? QUIZ_REWARD_COINS : 0;

  return {
    ...state,
    coins: state.coins + coinsEarned,
    tree: {
      ...state.tree,
      fruits: state.tree.fruits.filter((f) => f.id !== fruitId),
    },
    lastPlayed: Date.now(),
  };
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

export function startNextDay(state: GameState): GameState {
  const newDay = state.currentDay + 1;

  const wordsDueForReview = state.words.filter((w) =>
    isWordDueForReview(w, newDay)
  );

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
    (f) => f.type === "green" || f.type === "orange" || f.type === "silver"
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