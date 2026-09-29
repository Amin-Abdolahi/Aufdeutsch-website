/**
 * Word Tree — Custom Words Storage (نسخه ۱.۰)
 *
 * این فایل، ذخیره‌سازی و بازیابی کلمات سفارشی کاربر رو مدیریت می‌کنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کلمات سفارشی توی localStorage ذخیره می‌شن (نه Supabase).
 *    دلیل: فاز ۱ لوکاله. فاز ۲ (Supabase) اضافه می‌شه.
 *
 * ۲. برای هر کاربر، حداکثر `MAX_CUSTOM_WORDS` کلمه‌ی سفارشی.
 *
 * ۳. کلمات سفارشی با `source: "custom"` مشخص می‌شن.
 *
 * ۴. برای فاز ۲ (Supabase)، این فایل به یه API route تبدیل می‌شه.
 */

import { WordEntry, WordSource } from "./types";
import {
  CUSTOM_WORDS_STORAGE_KEY,
  MAX_CUSTOM_WORDS,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

/**
 * ذخیره‌ی همه‌ی کلمات سفارشی.
 */
export function saveCustomWords(words: WordEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error("Failed to save custom words:", error);
  }
}

/**
 * بازیابی همه‌ی کلمات سفارشی.
 */
export function loadCustomWords(): WordEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CUSTOM_WORDS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as WordEntry[];
  } catch (error) {
    console.error("Failed to load custom words:", error);
    return [];
  }
}

/**
 * اضافه کردن یه کلمه‌ی سفارشی جدید.
 *
 * @param word - کلمه‌ی جدید (بدون source — تابع خودش اضافه می‌کنه)
 * @returns نتیجه‌ی عملیات
 *
 * ⚠️ اگه تعداد کلمات سفارشی به حد مجاز رسیده باشه، خطا برمی‌گردونه.
 */
export function addCustomWord(
  word: Omit<WordEntry, "source" | "createdAt">
): { success: boolean; error?: string; word?: WordEntry } {
  const current = loadCustomWords();

  // چک کردن حد مجاز
  if (current.length >= MAX_CUSTOM_WORDS) {
    return {
      success: false,
      error: `حداکثر ${MAX_CUSTOM_WORDS} کلمه‌ی سفارشی مجازه.`,
    };
  }

  // چک کردن تکراری نبودن
  const isDuplicate = current.some(
    (w) => w.translations.de.toLowerCase() === word.translations.de.toLowerCase()
  );
  if (isDuplicate) {
    return {
      success: false,
      error: "این کلمه قبلاً اضافه شده.",
    };
  }

  // ساخت کلمه‌ی جدید
  const newWord: WordEntry = {
    ...word,
    source: "custom" as WordSource,
    createdAt: Date.now(),
  };

    // ذخیره (کلمه‌ی جدید اول لیست)
  saveCustomWords([newWord, ...current]);

  return {
    success: true,
    word: newWord,
  };
}

/**
 * حذف یه کلمه‌ی سفارشی.
 */
export function removeCustomWord(wordId: string): boolean {
  const current = loadCustomWords();
  const filtered = current.filter((w) => w.id !== wordId);

  if (filtered.length === current.length) {
    return false; // چیزی حذف نشد
  }

  saveCustomWords(filtered);
  return true;
}

/**
 * پاک کردن همه‌ی کلمات سفارشی.
 */
export function clearCustomWords(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CUSTOM_WORDS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear custom words:", error);
  }
}

/**
 * تعداد کلمات سفارشی.
 */
export function countCustomWords(): number {
  return loadCustomWords().length;
}

/**
 * ساخت شناسه‌ی یکتا برای کلمه‌ی سفارشی.
 *
 * ⚠️ پیشوند `custom-` باعث می‌شه کلمات سفارشی از داخلی‌ها
 * (که `w1`, `w2`... هستن) قابل تشخیص باشن.
 */
export function generateCustomWordId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}