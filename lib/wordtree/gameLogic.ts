/**
 * Word Tree — Game Logic (نسخه ۳.۰)
 *
 * این فایل، منطق اصلی بازی رو تعریف می‌کنه:
 * - ساخت وضعیت اولیه
 * - محاسبه سطح درخت
 * - آبیاری
 * - چیدن میوه
 * - مدیریت «روز بازی»
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. هر تابع باید «pure» باشه. یعنی:
 *    - ورودی بگیره
 *    - خروجی بده
 *    - state اصلی رو تغییر نده (immutable)
 *    - از Date.now() فقط برای timestamp استفاده کنه
 *
 * ۲. مفهوم «روز بازی»:
 *    - هر روز بازی شامل دو مرحله‌ست: آبیاری + چیدن
 *    - وقتی کاربر هر دو رو انجام داد، روز بعد بازی شروع می‌شه
 *    - کاربر می‌تونه چند روز بازی رو در یه روز تقویمی جلو ببره
 */

import { GameState, Word, Fruit, TreeLevel } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  WORDS_TO_YOUNG,
  WORDS_TO_MATURE,
  WORDS_TO_ANCIENT,
  STATE_VERSION,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// وضعیت اولیه
// ─────────────────────────────────────────────────────────────

/**
 * ساخت وضعیت اولیه‌ی بازی.
 *
 * این تابع وقتی صدا زده می‌شه که کاربر اولین بار وارد بازی می‌شه.
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
  };
}

// ─────────────────────────────────────────────────────────────
// سطح درخت
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی سطح درخت بر اساس تعداد کلمات.
 */
export function calculateTreeLevel(totalWords: number): TreeLevel {
  if (totalWords >= WORDS_TO_ANCIENT) return "ancient";
  if (totalWords >= WORDS_TO_MATURE) return "mature";
  if (totalWords >= WORDS_TO_YOUNG) return "young";
  return "seedling";
}

// ─────────────────────────────────────────────────────────────
// آبیاری (یادگیری کلمات جدید)
// ─────────────────────────────────────────────────────────────

/**
 * آبیاری درخت — اضافه کردن کلمات جدید.
 *
 * این تابع:
 * ۱. کلمات جدید رو به state اضافه می‌کنه
 * ۲. میوه‌های کال جدید روی درخت می‌سازه
 * ۳. سطح درخت رو دوباره محاسبه می‌کنه
 * ۴. `wateredToday` رو true می‌کنه
 * ۵. `dayState` رو به "harvesting" تغییر می‌ده
 */
export function waterTree(state: GameState, newWords: Word[]): GameState {
  const totalWords = state.tree.totalWords + newWords.length;
  const newLevel = calculateTreeLevel(totalWords);

  // ساختن میوه‌های کال برای هر کلمه‌ی جدید
  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: false,
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
    wordsLearnedToday: [...state.wordsLearnedToday, ...newWords.map((w) => w.id)],
    dayState: "harvesting",
  };
}

// ─────────────────────────────────────────────────────────────
// چیدن میوه (مرور کلمات)
// ─────────────────────────────────────────────────────────────

/**
 * چیدن میوه — مرور یه کلمه.
 *
 * رفتار:
 * - اگه remembered = true:
 *   - میوه حذف می‌شه
 *   - سکه اضافه می‌شه
 *   - reviewCount کلمه زیاد می‌شه
 * - اگه remembered = false:
 *   - میوه به نارنجی تغییر می‌کنه
 *   - کلمه توی درخت می‌مونه
 *
 * ⚠️ بعد از چیدن همه‌ی میوه‌ها، `checkDayCompletion` صدا زده می‌شه
 * تا ببینه آیا روز بازی تموم شده یا نه.
 */
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
      words: state.words.map((w) =>
        w.id === fruit.wordId
          ? {
              ...w,
              reviewCount: w.reviewCount + 1,
              lastReviewed: Date.now(),
              status: w.reviewCount + 1 >= 3 ? "learned" : "learning",
            }
          : w
      ),
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
    lastPlayed: Date.now(),
  };
  return checkDayCompletion(newState);
}

// ─────────────────────────────────────────────────────────────
// مدیریت «روز بازی»
// ─────────────────────────────────────────────────────────────

/**
 * بررسی اینکه آیا روز بازی تموم شده یا نه.
 *
 * روز بازی تموم می‌شه اگه:
 * ۱. کاربر امروز آبیاری کرده باشه
 * ۲. هیچ میوه‌ی سبز یا نارنجی روی درخت نمونه (همه چیده شده باشن)
 *
 * وقتی روز تموم شد:
 * - `dayState` به "completed" تغییر می‌کنه
 * - `streak` یکی زیاد می‌شه
 */
export function checkDayCompletion(state: GameState): GameState {
  // اگه کاربر امروز آبیاری نکرده، روز تموم نمی‌شه
  if (!state.wateredToday) return state;

  // اگه میوه‌ای روی درخت مونده، روز تموم نمی‌شه
  const remainingFruits = state.tree.fruits.filter(
    (f) => f.type === "green" || f.type === "orange"
  );

  if (remainingFruits.length > 0) return state;

  // روز تموم شد
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
 * این تابع وقتی صدا زده می‌شه که:
 * - `dayState` = "completed"
 * - کاربر روی دکمه‌ی «روز بعد» کلیک می‌کنه
 *
 * تغییرات:
 * - `currentDay` یکی زیاد می‌شه
 * - `dayState` به "watering" برمی‌گرده
 * - `wateredToday` false می‌شه
 * - `wordsLearnedToday` خالی می‌شه
 */
export function startNextDay(state: GameState): GameState {
  return {
    ...state,
    currentDay: state.currentDay + 1,
    dayState: "watering",
    wateredToday: false,
    wordsLearnedToday: [],
  };
}

// ─────────────────────────────────────────────────────────────
// زمان و محدودیت‌ها
// ─────────────────────────────────────────────────────────────

/**
 * بررسی اینکه آیا کاربر می‌تونه آبیاری کنه.
 *
 * در نسخه‌ی جدید (روز بازی):
 * - کاربر فقط اگه امروز آبیاری نکرده باشه، می‌تونه آبیاری کنه.
 * - محدودیت زمانی حذف شده.
 */
export function canWaterToday(state: GameState): boolean {
  return !state.wateredToday && state.dayState !== "completed";
}

// ─────────────────────────────────────────────────────────────
// آمار و اطلاعات
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی تعداد میوه‌های روی درخت.
 */
export function countFruits(state: GameState): number {
  return state.tree.fruits.length;
}

/**
 * محاسبه‌ی تعداد میوه‌های آماده‌ی چیدن.
 */
export function countReadyFruits(state: GameState): number {
  return state.tree.fruits.filter(
    (f) => f.type === "green" || f.type === "orange"
  ).length;
}

/**
 * محاسبه‌ی درصد پیشرفت تا سطح بعدی.
 */
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