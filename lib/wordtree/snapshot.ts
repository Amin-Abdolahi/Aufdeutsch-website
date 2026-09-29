/**
 * Word Tree — Snapshots (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. Snapshot = یه کپی کامل از وضعیت بازی + کلمات سفارشی + آمار.
 * ۲. هر روز که کاربر وارد می‌شه، اگه از آخرین snapshot بیشتر از
 *    ۲۴ ساعت گذشته باشه، یه snapshot جدید ساخته می‌شه.
 * ۳. آخرین ۵ snapshot نگه داشته می‌شن (بقیه پاک می‌شن).
 * ۴. کاربر می‌تونه از تنظیمات، به هر snapshot برگرده.
 * ۵. کلید localStorage: `wordtree_snapshots_v1`
 */

import { Snapshot, GameState, WordEntry, UserStats } from "./types";
import {
  STORAGE_KEY,
  CUSTOM_WORDS_STORAGE_KEY,
  USER_STATS_STORAGE_KEY,
  STATE_VERSION,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// تنظیمات
// ─────────────────────────────────────────────────────────────

/** کلید localStorage برای snapshots */
export const SNAPSHOTS_STORAGE_KEY = "wordtree_snapshots_v1";

/** حداکثر تعداد snapshotهایی که نگه داشته می‌شن */
export const MAX_SNAPSHOTS = 5;

/** فاصله‌ی زمانی بین snapshotها (۲۴ ساعت) */
export const SNAPSHOT_INTERVAL_MS = 24 * 60 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

/**
 * بازیابی همه‌ی snapshots از localStorage.
 *
 * @returns آرایه‌ای از Snapshot (مرتب‌شده بر اساس زمان، جدیدترین اول)
 */
export function loadSnapshots(): Snapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!data) return [];
    const snapshots = JSON.parse(data) as Snapshot[];
    // مرتب‌سازی بر اساس زمان (جدیدترین اول)
    return snapshots.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Failed to load snapshots:", error);
    return [];
  }
}

/**
 * ذخیره‌ی snapshots توی localStorage.
 */
export function saveSnapshots(snapshots: Snapshot[]): void {
  if (typeof window === "undefined") return;
  try {
    // مرتب‌سازی + محدود به MAX_SNAPSHOTS
    const sorted = snapshots
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_SNAPSHOTS);
    localStorage.setItem(
      SNAPSHOTS_STORAGE_KEY,
      JSON.stringify(sorted)
    );
  } catch (error) {
    console.error("Failed to save snapshots:", error);
  }
}

/**
 * ساخت یه snapshot جدید از وضعیت فعلی.
 *
 * @param label - توضیح کوتاه (پیش‌فرض: "خودکار")
 * @returns Snapshot یا null اگه داده‌ای نبود
 */
export function createSnapshot(label: string = "خودکار"): Snapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const gameStateData = localStorage.getItem(STORAGE_KEY);
    if (!gameStateData) return null;

    const gameState = JSON.parse(gameStateData) as GameState;

    // ─── کلمات سفارشی ───
    const customWordsData = localStorage.getItem(CUSTOM_WORDS_STORAGE_KEY);
    const customWords = customWordsData
      ? (JSON.parse(customWordsData) as WordEntry[])
      : [];

    // ─── آمار ───
    const userStatsData = localStorage.getItem(USER_STATS_STORAGE_KEY);
    const userStats = userStatsData
      ? (JSON.parse(userStatsData) as UserStats)
      : null;

    // ─── ساخت snapshot ───
    const snapshot: Snapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      version: gameState.version || STATE_VERSION,
      gameState,
      customWords,
      userStats,
      label,
    };

    return snapshot;
  } catch (error) {
    console.error("Failed to create snapshot:", error);
    return null;
  }
}

/**
 * گرفتن snapshot خودکار (اگه از آخرین snapshot بیشتر از ۲۴ ساعت گذشته).
 *
 * ⚠️ این تابع هر بار که کاربر وارد بازی می‌شه صدا زده می‌شه.
 * اگه از آخرین snapshot بیشتر از ۲۴ ساعت گذشته باشه، یه snapshot جدید می‌سازه.
 *
 * @returns true اگه snapshot جدید ساخته شد
 */
export function autoSnapshot(): boolean {
  const snapshots = loadSnapshots();
  const now = Date.now();

  // ─── اگه هیچ snapshotی نبود، یکی بساز ───
  if (snapshots.length === 0) {
    const snapshot = createSnapshot("خودکار (اولین)");
    if (snapshot) {
      saveSnapshots([snapshot]);
      return true;
    }
    return false;
  }

  // ─── چک کن از آخرین snapshot چقدر گذشته ───
  const lastSnapshot = snapshots[0];
  const elapsed = now - lastSnapshot.createdAt;

  if (elapsed < SNAPSHOT_INTERVAL_MS) {
    return false; // هنوز ۲۴ ساعت نشده
  }

  // ─── ساخت snapshot جدید ───
  const snapshot = createSnapshot("خودکار");
  if (snapshot) {
    saveSnapshots([snapshot, ...snapshots]);
    return true;
  }
  return false;
}

/**
 * برگردوندن به یه snapshot.
 *
 * ⚠️ این تابع:
 * ۱. یه snapshot جدید از وضعیت فعلی می‌سازه (برای امنیت).
 * ۲. وضعیت رو به snapshot انتخاب‌شده برمی‌گردونه.
 *
 * @param snapshotId - شناسه‌ی snapshot
 * @returns true اگه موفق بود
 */
export function restoreSnapshot(snapshotId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const snapshots = loadSnapshots();
    const snapshot = snapshots.find((s) => s.id === snapshotId);
    if (!snapshot) return false;

    // ─── ۱. یه snapshot جدید از وضعیت فعلی بساز (قبل از بازگردانی) ───
    const currentSnapshot = createSnapshot("قبل از بازگردانی");
    if (currentSnapshot) {
      saveSnapshots([currentSnapshot, ...snapshots]);
    }

    // ─── ۲. بازگردانی ───
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(snapshot.gameState)
    );
    localStorage.setItem(
      CUSTOM_WORDS_STORAGE_KEY,
      JSON.stringify(snapshot.customWords)
    );
    if (snapshot.userStats) {
      localStorage.setItem(
        USER_STATS_STORAGE_KEY,
        JSON.stringify(snapshot.userStats)
      );
    }

    return true;
  } catch (error) {
    console.error("Failed to restore snapshot:", error);
    return false;
  }
}

/**
 * پاک کردن یه snapshot.
 */
export function deleteSnapshot(snapshotId: string): boolean {
  const snapshots = loadSnapshots();
  const filtered = snapshots.filter((s) => s.id !== snapshotId);
  if (filtered.length === snapshots.length) return false;
  saveSnapshots(filtered);
  return true;
}

/**
 * پاک کردن همه‌ی snapshotها.
 */
export function clearAllSnapshots(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear snapshots:", error);
  }
}

/**
 * محاسبه‌ی زمان نسبی (مثلاً "۲ ساعت پیش").
 *
 * @param timestamp - زمان
 * @param locale - زبان (برای متن)
 * @returns متن زمان نسبی
 */
export function getRelativeTime(timestamp: number, locale: string = "fa"): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (locale === "fa") {
    if (minutes < 1) return "همین الان";
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    if (hours < 24) return `${hours} ساعت پیش`;
    if (days < 30) return `${days} روز پیش`;
    return `${Math.floor(days / 30)} ماه پیش`;
  }
  if (locale === "de") {
    if (minutes < 1) return "gerade eben";
    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    if (days < 30) return `vor ${days} Tagen`;
    return `vor ${Math.floor(days / 30)} Monaten`;
  }
  // en
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}