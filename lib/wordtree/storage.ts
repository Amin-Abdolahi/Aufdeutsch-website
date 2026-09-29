/**
 * Word Tree — Storage (نسخه ۲.۰)
 *
 * این فایل، ذخیره‌سازی و بازیابی وضعیت بازی رو مدیریت می‌کنه.
 *
 * ⚠️ نکته‌ی مهم برای توسعه‌دهنده‌های آینده:
 * هر بار که ساختار GameState رو تغییر می‌دی:
 * ۱. STATE_VERSION توی constants.ts رو زیاد کن.
 * ۲. یه تابع migration توی این فایل بنویس.
 * ۳. توی loadGameState، قبل از برگردوندن داده، migration رو صدا بزن.
 */

import { GameState } from "./types";
import { STORAGE_KEY, STATE_VERSION } from "./constants";

// ─────────────────────────────────────────────────────────────
// ذخیره‌سازی
// ─────────────────────────────────────────────────────────────

/**
 * ذخیره‌ی وضعیت بازی در localStorage.
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
 * اگه نسخه‌ی ذخیره‌شده قدیمی‌تر از نسخه‌ی فعلی باشه،
 * تابع migration صدا زده می‌شه.
 */
export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as GameState;

    // اگه نسخه قدیمی بود، migration کن
    if (parsed.version && parsed.version < STATE_VERSION) {
      return migrateGameState(parsed);
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

// ─────────────────────────────────────────────────────────────
// Migration (مهاجرت داده‌ها)
// ─────────────────────────────────────────────────────────────

/**
 * مهاجرت داده‌های قدیمی به ساختار جدید.
 *
 * ⚠️ این تابع رو برای هر نسخه‌ی جدید آپدیت کن.
 *
 * @example
 * اگه نسخه‌ی ۱ به ۲ مهاجرت می‌کنه:
 * - فیلد جدید `health` به tree اضافه می‌شه
 * - فیلد `tags` به words اضافه می‌شه
 */
function migrateGameState(oldState: GameState): GameState {
  let newState = { ...oldState };

  // ─── Migration از v1 به v2 ───
  // (اگه نسخه‌ی ۲ ساختار جدیدی داشت، اینجا اضافه کن)
  // مثال:
  // if (oldState.version < 2) {
  //   newState = {
  //     ...newState,
  //     tree: { ...newState.tree, health: 100 },
  //     version: 2,
  //   };
  // }

  // آپدیت نسخه
  newState.version = STATE_VERSION;

  return newState;
}