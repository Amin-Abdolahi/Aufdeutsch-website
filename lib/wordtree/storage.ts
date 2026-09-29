/**
 * Word Tree — Storage (نسخه ۱۰.۰)
 *
 * ⚠️ تغییرات نسخه ۱۰.۰:
 * - migrationها به `migrations.ts` منتقل شدن
 * - `storage.ts` فقط ذخیره/بازیابی رو مدیریت می‌کنه
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
 */

import { GameState } from "./types";
import { STORAGE_KEY, STATE_VERSION } from "./constants";
import { runMigrations } from "./migrations";

// ─────────────────────────────────────────────────────────────
// ذخیره‌سازی
// ─────────────────────────────────────────────────────────────

/**
 * ذخیره‌ی وضعیت بازی توی localStorage.
 */
export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
}

/**
 * بازیابی وضعیت بازی از localStorage.
 *
 * ⚠️ اگه نسخه‌ی ذخیره‌شده قدیمی‌تر از نسخه‌ی فعلی باشه،
 * `runMigrations` صدا زده می‌شه.
 */
export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as GameState;

    // ─── اگه نسخه قدیمی بود، migration کن ───
    if (parsed.version && parsed.version < STATE_VERSION) {
      return runMigrations(parsed);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
}

/**
 * پاک کردن وضعیت بازی.
 */
export function clearGameState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear game state:", error);
  }
}