/**
 * Word Tree — Storage (نسخه ۹.۰)
 *
 * ⚠️ تاریخچه‌ی نسخه‌ها:
 * - v1: ساختار اولیه
 * - v2: اطلاعات گرامری
 * - v3: روز بازی
 * - v4: Spaced Repetition با timestamp
 * - v5: Spaced Repetition بر اساس روز بازی
 * - v6: کلمات سفارشی
 * - v7: ایمپورت گروهی
 * - v8: چندزبانه (language, targetLanguage)
 * - v9: میوه‌ی نقره‌ای (totalWordsLearned, lastSilverFruitAt)
 */

import { GameState } from "./types";
import {
  STORAGE_KEY,
  STATE_VERSION,
  DEFAULT_TARGET_LANGUAGE,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// ذخیره‌سازی
// ─────────────────────────────────────────────────────────────

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as GameState;

    if (parsed.version && parsed.version < STATE_VERSION) {
      return migrateGameState(parsed);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
}

export function clearGameState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear game state:", error);
  }
}

// ─────────────────────────────────────────────────────────────
// Migration (مهاجرت داده‌ها)
// ─────────────────────────────────────────────────────────────

function migrateGameState(oldState: GameState): GameState {
  let newState = { ...oldState };

  // ─── Migration از v7 به v8: چندزبانه ───
  if ((oldState.version || 1) < 8) {
    newState = {
      ...newState,
      targetLanguage: oldState.targetLanguage || DEFAULT_TARGET_LANGUAGE,
      words: (oldState.words || []).map((w) => ({
        ...w,
        language: w.language || DEFAULT_TARGET_LANGUAGE,
      })),
    };
  }

  // ─── Migration از v8 به v9: میوه‌ی نقره‌ای ───
  if ((oldState.version || 1) < 9) {
    newState = {
      ...newState,
      // تعداد کل کلماتی که کاربر یاد گرفته
      // ⚠️ اگه از قبل نبود، از تعداد کلمات فعلی استفاده کن
      totalWordsLearned:
        (oldState as any).totalWordsLearned ||
        (oldState.words?.length || 0),
      // آخرین باری که میوه‌ی نقره‌ای گرفته
      lastSilverFruitAt: (oldState as any).lastSilverFruitAt,
    };
  }

  // آپدیت نسخه
  newState.version = STATE_VERSION;

  return newState;
}