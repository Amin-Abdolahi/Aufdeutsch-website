/**
 * Word Tree — Migrations (نسخه ۲.۰)
 *
 * ⚠️ تغییرات نسخه ۲.۰:
 * - اضافه شدن migration از v10 به v11 (hasPlantedTree)
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
 * - v10: تور اولیه (hasSeenTutorial)
 * - v11: کاشت درخت (hasPlantedTree)
 */

import { GameState, TargetLanguage } from "./types";
import {
  DEFAULT_TARGET_LANGUAGE,
  STATE_VERSION,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// Migrationها
// ─────────────────────────────────────────────────────────────

/**
 * Migration از v7 به v8: چندزبانه.
 */
function migrateV7toV8(state: GameState): GameState {
  return {
    ...state,
    targetLanguage:
      state.targetLanguage || DEFAULT_TARGET_LANGUAGE,
    words: (state.words || []).map((w) => ({
      ...w,
      language: w.language || DEFAULT_TARGET_LANGUAGE,
    })),
  };
}

/**
 * Migration از v8 به v9: میوه‌ی نقره‌ای.
 */
function migrateV8toV9(state: GameState): GameState {
  return {
    ...state,
    totalWordsLearned:
      state.totalWordsLearned || state.words?.length || 0,
    lastSilverFruitAt: state.lastSilverFruitAt,
  };
}

/**
 * Migration از v9 به v10: تور اولیه.
 */
function migrateV9toV10(state: GameState): GameState {
  return {
    ...state,
    hasSeenTutorial:
      state.hasSeenTutorial ?? (state.words?.length || 0) > 0,
  };
}

/**
 * Migration از v10 به v11: کاشت درخت.
 *
 * ⚠️ اگه کاربر قبلاً درخت داشت (words.length > 0)، درخت رو کاشته در نظر بگیر.
 * تا کاربرهای قدیمی مجبور نشن دوباره درخت بکارن.
 */
function migrateV10toV11(state: GameState): GameState {
  return {
    ...state,
    hasPlantedTree:
      state.hasPlantedTree ?? (state.words?.length || 0) > 0,
  };
}

// ─────────────────────────────────────────────────────────────
// اجرای migrationها
// ─────────────────────────────────────────────────────────────

/**
 * اجرای همه‌ی migrationهای لازم.
 */
export function runMigrations(state: GameState): GameState {
  let newState = { ...state };
  const oldVersion = state.version || 1;

  if (oldVersion < 8) {
    newState = migrateV7toV8(newState);
  }
  if (oldVersion < 9) {
    newState = migrateV8toV9(newState);
  }
  if (oldVersion < 10) {
    newState = migrateV9toV10(newState);
  }
  if (oldVersion < 11) {
    newState = migrateV10toV11(newState);
  }

  newState.version = STATE_VERSION;

  return newState;
}