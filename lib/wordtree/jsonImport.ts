/**
 * Word Tree — JSON Import (نسخه ۲.۰ — چندزبانه)
 */

import {
  ImportFile,
  ImportWord,
  ImportResult,
  WordEntry,
  WordCategory,
  GermanLevel,
  TargetLanguage,
} from "./types";
import {
  MAX_IMPORT_WORDS,
  REWARD_IMPORTED_WORD,
  MAX_DAILY_IMPORT_REWARD,
  DEFAULT_TARGET_LANGUAGE,
} from "./constants";
import {
  loadCustomWords,
  saveCustomWords,
  generateCustomWordId,
} from "./customWords";

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

export function importWordsFromJSON(
  fileContent: string,
  currentDayCoinsEarned: number = 0,
  fileId?: string,
  fileName?: string
): ImportResult {
  const errors: string[] = [];
  let imported = 0;
  let rejected = 0;
  let coinsEarned = 0;

  // ─── مرحله ۱: تجزیه‌ی JSON ───
  let parsed: ImportFile;
  try {
    parsed = JSON.parse(fileContent) as ImportFile;
  } catch (error) {
    return {
      total: 0,
      imported: 0,
      rejected: 0,
      errors: ["فایل JSON معتبر نیست. لطفاً دوباره چک کن."],
      coinsEarned: 0,
    };
  }

  // ─── مرحله ۲: اعتبارسنجی ساختار کلی ───
  if (!parsed.words || !Array.isArray(parsed.words)) {
    return {
      total: 0,
      imported: 0,
      rejected: 0,
      errors: ['ساختار فایل اشتباهه. فیلد "words" باید آرایه باشه.'],
      coinsEarned: 0,
    };
  }

  if (parsed.words.length === 0) {
    return {
      total: 0,
      imported: 0,
      rejected: 0,
      errors: ["فایل هیچ کلمه‌ای نداره."],
      coinsEarned: 0,
    };
  }

  if (parsed.words.length > MAX_IMPORT_WORDS) {
    errors.push(
      `فایل ${parsed.words.length} کلمه داره، ولی حداکثر ${MAX_IMPORT_WORDS} کلمه مجازه.`
    );
  }

  const total = parsed.words.length;

  // ─── مرحله ۳: زبان هدف ───
  const language: TargetLanguage =
    parsed.language || DEFAULT_TARGET_LANGUAGE;

  // ─── مرحله ۴: گرفتن کلمات موجود ───
  const existingWords = loadCustomWords();
  const existingKeys = new Set(
    existingWords.map(
      (w) => `${w.language}:${w.translations.de.toLowerCase().trim()}`
    )
  );

  // ─── مرحله ۵: پردازش هر کلمه ───
  const newWords: WordEntry[] = [];
  const seenInFile = new Set<string>();

  for (let i = 0; i < parsed.words.length; i++) {
    if (i >= MAX_IMPORT_WORDS) {
      rejected++;
      continue;
    }

    const word = parsed.words[i];
    const rowNumber = i + 1;

    const validation = validateImportWord(word, rowNumber);
    if (!validation.valid) {
      errors.push(...validation.errors);
      rejected++;
      continue;
    }

    const normalizedKey = `${language}:${word.de.toLowerCase().trim()}`;
    if (seenInFile.has(normalizedKey)) {
      errors.push(`ردیف ${rowNumber}: کلمه "${word.de}" توی فایل تکراریه.`);
      rejected++;
      continue;
    }

    if (existingKeys.has(normalizedKey)) {
      errors.push(`ردیف ${rowNumber}: کلمه "${word.de}" قبلاً اضافه شده.`);
      rejected++;
      continue;
    }

    const wordEntry = convertToWordEntry(word, language, fileId, fileName);
    newWords.push(wordEntry);
    seenInFile.add(normalizedKey);
    imported++;

    const rewardCoins = Math.min(
      REWARD_IMPORTED_WORD,
      MAX_DAILY_IMPORT_REWARD - currentDayCoinsEarned - coinsEarned
    );
    if (rewardCoins > 0) {
      coinsEarned += rewardCoins;
    }
  }

  // ─── مرحله ۶: ذخیره‌ی کلمات جدید ───
  if (newWords.length > 0) {
    saveCustomWords([...newWords, ...existingWords]);
  }

  return {
    total,
    imported,
    rejected,
    errors: errors.slice(0, 20),
    coinsEarned,
    importedWordIds: newWords.map((w) => w.id),
  };
}

// ─────────────────────────────────────────────────────────────
// اعتبارسنجی
// ─────────────────────────────────────────────────────────────

function validateImportWord(
  word: ImportWord,
  rowNumber: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!word.de || typeof word.de !== "string" || !word.de.trim()) {
    errors.push(`ردیف ${rowNumber}: فیلد "de" (کلمه) اجباریه.`);
  }
  if (!word.fa || typeof word.fa !== "string" || !word.fa.trim()) {
    errors.push(`ردیف ${rowNumber}: فیلد "fa" (ترجمه) اجباریه.`);
  }

  const validCategories: WordCategory[] = [
    "noun",
    "verb",
    "adjective",
    "phrase",
    "number",
    "color",
  ];
  if (!word.category || !validCategories.includes(word.category)) {
    errors.push(
      `ردیف ${rowNumber}: "category" باید یکی از این‌ها باشه: ${validCategories.join(", ")}`
    );
  }

  const validLevels: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1"];
  if (!word.level || !validLevels.includes(word.level)) {
    errors.push(
      `ردیف ${rowNumber}: "level" باید یکی از این‌ها باشه: ${validLevels.join(", ")}`
    );
  }

  if (word.category === "noun") {
    if (!word.noun || !word.noun.article || !word.noun.plural) {
      errors.push(
        `ردیف ${rowNumber}: برای اسم، "noun.article" و "noun.plural" اجباریه.`
      );
    } else if (!["der", "die", "das"].includes(word.noun.article)) {
      errors.push(
        `ردیف ${rowNumber}: "noun.article" باید der، die یا das باشه.`
      );
    }
  }

  if (word.category === "verb") {
    if (
      !word.verb ||
      !word.verb.praeteritum ||
      !word.verb.perfekt ||
      !word.verb.auxiliary
    ) {
      errors.push(
        `ردیف ${rowNumber}: برای فعل، "verb.praeteritum"، "verb.perfekt" و "verb.auxiliary" اجباریه.`
      );
    } else if (!["haben", "sein"].includes(word.verb.auxiliary)) {
      errors.push(
        `ردیف ${rowNumber}: "verb.auxiliary" باید haben یا sein باشه.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ─────────────────────────────────────────────────────────────
// تبدیل
// ─────────────────────────────────────────────────────────────

function convertToWordEntry(
  word: ImportWord,
  language: TargetLanguage,
  fileId?: string,
  fileName?: string
): WordEntry {
  return {
    id: generateCustomWordId(),
    language,
    level: word.level,
    category: word.category,
    translations: {
      de: word.de.trim(),
      fa: word.fa.trim(),
      en: word.en?.trim() || word.fa.trim(),
    },
    noun: word.noun,
    verb: word.verb,
    pronunciation: word.pronunciation,
    example: word.example,
    source: "custom",
    createdAt: Date.now(),
    fileId: fileId,
    fileName: fileName,
  };
}

export function validateImportFile(
  fileContent: string
): { valid: boolean; error?: string } {
  try {
    const parsed = JSON.parse(fileContent) as ImportFile;
    if (!parsed.words || !Array.isArray(parsed.words)) {
      return {
        valid: false,
        error: 'ساختار فایل اشتباهه. فیلد "words" باید آرایه باشه.',
      };
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: "فایل JSON معتبر نیست.",
    };
  }
}