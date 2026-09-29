/**
 * Word Tree — Storage (نسخه ۵.۰)
 *
 * ⚠️ تاریخچه‌ی نسخه‌ها:
 * - v1: ساختار اولیه
 * - v2: اطلاعات گرامری
 * - v3: روز بازی
 * - v4: Spaced Repetition با timestamp
 * - v5: Spaced Repetition بر اساس روز بازی
 */

import { GameState } from "./types";
import { STORAGE_KEY, STATE_VERSION } from "./constants";

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

function migrateGameState(oldState: GameState): GameState {
  let newState = { ...oldState };

  // ─── Migration از v1/v2/v3/v4 به v5 ───
  if ((oldState.version || 1) < 5) {
    newState = {
      ...newState,
      words: (oldState.words || []).map((w) => ({
        ...w,
        reviewStage: w.reviewStage ?? 0,
        nextReviewDay: undefined, // از اول شروع می‌کنیم
      })),
    };
  }

  newState.version = STATE_VERSION;

  return newState;
}