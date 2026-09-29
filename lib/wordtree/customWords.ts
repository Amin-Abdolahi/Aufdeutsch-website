/**
 * Word Tree — Custom Words Storage (نسخه ۲.۰)
 *
 * ⚠️ تغییرات نسخه ۲.۰:
 * - اضافه شدن `exportCustomWords` (خروجی فایل JSON)
 * - اضافه شدن `importCustomWords` (وارد کردن فایل JSON)
 * - اضافه شدن `downloadJSON` (دانلود فایل)
 */

import { WordEntry, WordSource, TargetLanguage } from "./types";
import {
  CUSTOM_WORDS_STORAGE_KEY,
  MAX_CUSTOM_WORDS,
  DEFAULT_TARGET_LANGUAGE,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

export function saveCustomWords(words: WordEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_WORDS_STORAGE_KEY, JSON.stringify(words));
  } catch (error) {
    console.error("Failed to save custom words:", error);
  }
}

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

export function loadCustomWordsByLanguage(
  language: TargetLanguage
): WordEntry[] {
  return loadCustomWords().filter((w) => w.language === language);
}

export function addCustomWord(
  word: Omit<WordEntry, "source" | "createdAt">
): { success: boolean; error?: string; word?: WordEntry } {
  const current = loadCustomWords();

  if (current.length >= MAX_CUSTOM_WORDS) {
    return {
      success: false,
      error: `حداکثر ${MAX_CUSTOM_WORDS} کلمه‌ی سفارشی مجازه.`,
    };
  }

  const isDuplicate = current.some(
    (w) =>
      w.language === word.language &&
      w.translations.de.toLowerCase() === word.translations.de.toLowerCase()
  );
  if (isDuplicate) {
    return {
      success: false,
      error: "این کلمه قبلاً اضافه شده.",
    };
  }

  const newWord: WordEntry = {
    ...word,
    source: "custom" as WordSource,
    createdAt: Date.now(),
  };

  saveCustomWords([newWord, ...current]);

  return {
    success: true,
    word: newWord,
  };
}

export function removeCustomWord(wordId: string): boolean {
  const current = loadCustomWords();
  const filtered = current.filter((w) => w.id !== wordId);

  if (filtered.length === current.length) {
    return false;
  }

  saveCustomWords(filtered);
  return true;
}

export function clearCustomWords(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CUSTOM_WORDS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear custom words:", error);
  }
}

export function countCustomWords(): number {
  return loadCustomWords().length;
}

export function generateCustomWordId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─────────────────────────────────────────────────────────────
// Export / Import (نسخه ۲.۰)
// ─────────────────────────────────────────────────────────────

/**
 * ساختار فایل بک‌آپ.
 *
 * ⚠️ این ساختار برای export و import استفاده می‌شه.
 */
export interface BackupFile {
  /** نسخه‌ی فرمت */
  version: string;
  /** زمان ساخت بک‌آپ */
  exportedAt: number;
  /** تعداد کلمات */
  count: number;
  /** کلمات سفارشی */
  words: WordEntry[];
}

/**
 * نسخه‌ی فرمت بک‌آپ.
 */
export const BACKUP_VERSION = "1.0";

/**
 * خروجی گرفتن از کلمات سفارشی.
 *
 * @returns آبجکت BackupFile
 */
export function exportCustomWords(): BackupFile {
  const words = loadCustomWords();
  return {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    count: words.length,
    words,
  };
}

/**
 * دانلود فایل JSON.
 *
 * @param data - داده برای دانلود
 * @param filename - اسم فایل
 */
export function downloadJSON(data: unknown, filename: string): void {
  if (typeof window === "undefined") return;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * وارد کردن کلمات سفارشی از فایل بک‌آپ.
 *
 * @param fileContent - محتوای فایل JSON
 * @returns نتیجه‌ی وارد کردن
 */
export function importCustomWords(fileContent: string): {
  success: boolean;
  imported: number;
  rejected: number;
  error?: string;
} {
  let parsed: BackupFile;
  try {
    parsed = JSON.parse(fileContent) as BackupFile;
  } catch (error) {
    return {
      success: false,
      imported: 0,
      rejected: 0,
      error: "فایل JSON معتبر نیست.",
    };
  }

  // ─── اعتبارسنجی ───
  if (!parsed.words || !Array.isArray(parsed.words)) {
    return {
      success: false,
      imported: 0,
      rejected: 0,
      error: 'ساختار فایل اشتباهه. فیلد "words" باید آرایه باشه.',
    };
  }

  // ─── گرفتن کلمات موجود ───
  const existing = loadCustomWords();
  const existingKeys = new Set(
    existing.map(
      (w) => `${w.language}:${w.translations.de.toLowerCase().trim()}`
    )
  );

  // ─── پردازش هر کلمه ───
  const newWords: WordEntry[] = [];
  let imported = 0;
  let rejected = 0;

  for (const word of parsed.words) {
    // چک کردن فیلدهای اجباری
    if (!word.translations?.de || !word.language) {
      rejected++;
      continue;
    }

    const key = `${word.language}:${word.translations.de.toLowerCase().trim()}`;

    // تکراری؟
    if (existingKeys.has(key)) {
      rejected++;
      continue;
    }

    // چک کردن حداکثر تعداد
    if (existing.length + newWords.length >= MAX_CUSTOM_WORDS) {
      rejected++;
      continue;
    }

    newWords.push({
      ...word,
      source: "custom",
      createdAt: word.createdAt || Date.now(),
    });
    imported++;
  }

  // ─── ذخیره ───
  if (newWords.length > 0) {
    saveCustomWords([...newWords, ...existing]);
  }

  return {
    success: true,
    imported,
    rejected,
  };
}