/**
 * Word Tree — Game Logic (نسخه ۲.۰)
 *
 * این فایل، منطق اصلی بازی رو تعریف می‌کنه:
 * - ساخت وضعیت اولیه
 * - محاسبه سطح درخت
 * - آبیاری
 * - چیدن میوه
 * - بررسی امکان آبیاری
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 * هر تابع باید «pure» باشه. یعنی:
 * - ورودی بگیره
 * - خروجی بده
 * - state اصلی رو تغییر نده (immutable)
 * - از Date.now() فقط برای timestamp استفاده کنه
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
  };
}

// ─────────────────────────────────────────────────────────────
// سطح درخت
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی سطح درخت بر اساس تعداد کلمات.
 *
 * @param totalWords - تعداد کل کلمات یادگرفته‌شده
 * @returns سطح درخت
 *
 * ⚠️ اگه آستانه‌ها رو توی constants.ts تغییر دادی،
 * این تابع خودکار با مقادیر جدید کار می‌کنه.
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
 * ۴. زمان آبیاری رو ثبت می‌کنه
 *
 * @param state - وضعیت فعلی بازی
 * @param newWords - کلمات جدید که باید اضافه بشن
 * @returns وضعیت جدید بازی
 */
export function waterTree(state: GameState, newWords: Word[]): GameState {
  const totalWords = state.tree.totalWords + newWords.length;
  const newLevel = calculateTreeLevel(totalWords);

  // ساختن میوه‌های کال برای هر کلمه‌ی جدید
  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green", // کال
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
  };
}

// ─────────────────────────────────────────────────────────────
// چیدن میوه (مرور کلمات)
// ─────────────────────────────────────────────────────────────

/**
 * چیدن میوه — مرور یه کلمه.
 *
 * @param state - وضعیت فعلی بازی
 * @param fruitId - شناسه‌ی میوه‌ای که چیده می‌شه
 * @param remembered - آیا کاربر کلمه رو یادش مونده؟
 * @returns وضعیت جدید بازی
 *
 * رفتار:
 * - اگه remembered = true:
 *   - میوه حذف می‌شه
 *   - سکه اضافه می‌شه
 *   - reviewCount کلمه زیاد می‌شه
 * - اگه remembered = false:
 *   - میوه به نارنجی تغییر می‌کنه (آسیب‌دیده)
 *   - کلمه توی درخت می‌مونه
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
    return {
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
              // اگه ۳ بار مرور موفق شد → learned
              status: w.reviewCount + 1 >= 3 ? "learned" : "learning",
            }
          : w
      ),
      lastPlayed: Date.now(),
    };
  }

  // ─── حالت ۲: یادش رفته ───
  return {
    ...state,
    tree: {
      ...state.tree,
      fruits: state.tree.fruits.map((f) =>
        f.id === fruitId ? { ...f, type: "orange" as const } : f
      ),
    },
    lastPlayed: Date.now(),
  };
}

// ─────────────────────────────────────────────────────────────
// زمان و محدودیت‌ها
// ─────────────────────────────────────────────────────────────

/**
 * بررسی اینکه آیا کاربر امروز می‌تونه آبیاری کنه.
 *
 * قانون: هر ۲۴ ساعت یه بار.
 *
 * @param state - وضعیت فعلی بازی
 * @returns true اگه می‌تونه آبیاری کنه
 */
export function canWaterToday(state: GameState): boolean {
  if (!state.tree.lastWatered) return true;
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return state.tree.lastWatered < oneDayAgo;
}

// ─────────────────────────────────────────────────────────────
// آمار و اطلاعات
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی تعداد میوه‌های آماده‌ی چیدن.
 */
export function countReadyFruits(state: GameState): number {
  return state.tree.fruits.filter((f) => f.isReady || f.type === "green")
    .length;
}

/**
 * محاسبه‌ی درصد پیشرفت تا سطح بعدی.
 */
export function calculateProgress(state: GameState): number {
  const current = state.tree.totalWords;
  const nextThreshold =
    state.tree.level === "seedling"
      ? WORDS_TO_YOUNG
      : state.tree.level === "young"
      ? WORDS_TO_MATURE
      : state.tree.level === "mature"
      ? WORDS_TO_ANCIENT
      : WORDS_TO_ANCIENT;

  const previousThreshold =
    state.tree.level === "seedling"
      ? 0
      : state.tree.level === "young"
      ? WORDS_TO_YOUNG
      : state.tree.level === "mature"
      ? WORDS_TO_MATURE
      : WORDS_TO_ANCIENT;

  return Math.min(
    ((current - previousThreshold) / (nextThreshold - previousThreshold)) * 100,
    100
  );
}