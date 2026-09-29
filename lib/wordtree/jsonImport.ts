/**
 * Word Tree — JSON Import (نسخه ۱.۰)
 *
 * این فایل، تجزیه و اعتبارسنجی فایل‌های JSON برای ایمپورت گروهی رو مدیریت می‌کنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کاربر با کمک هوش مصنوعی یه فایل JSON می‌سازه
 *    (با استفاده از prompt آماده توی `public/wordtree/wordtree-prompt.txt`).
 *
 * ۲. این فایل، JSON رو تجزیه می‌کنه و به `WordEntry` تبدیل می‌کنه.
 *
 * ۳. اعتبارسنجی مرحله‌به‌مرحله:
 *    - چک کردن ساختار کلی
 *    - چک کردن هر کلمه
 *    - چک کردن تکراری‌ها
 *    - ذخیره‌ی کلمات موفق
 *
 * ۴. خطاها به کاربر نشون داده می‌شن (با شماره‌ی ردیف).
 */

import {
  ImportFile,
  ImportWord,
  ImportResult,
  WordEntry,
  WordCategory,
  GermanLevel,
} from "./types";
import {
  MAX_IMPORT_WORDS,
  REWARD_IMPORTED_WORD,
  MAX_DAILY_IMPORT_REWARD,
  IMPORT_FILE_VERSION,
} from "./constants";
import {
  loadCustomWords,
  saveCustomWords,
  generateCustomWordId,
} from "./customWords";

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

/**
 * تجزیه و ایمپورت کلمات از فایل JSON.
 *
 * @param fileContent - محتوای فایل (string)
 * @param currentDayCoinsEarned - سکه‌هایی که امروز از ایمپورت گرفته شده (برای محدودیت)
 * @returns نتیجه‌ی ایمپورت
 */
export function importWordsFromJSON(
  fileContent: string,
  currentDayCoinsEarned: number = 0
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

  // ─── مرحله ۳: گرفتن کلمات موجود (برای چک تکراری) ───
  const existingWords = loadCustomWords();
  const existingGermanWords = new Set(
    existingWords.map((w) => w.translations.de.toLowerCase().trim())
  );

  // ─── مرحله ۴: پردازش هر کلمه ───
  const newWords: WordEntry[] = [];
  const seenInFile = new Set<string>(); // برای چک تکراری توی خود فایل

  for (let i = 0; i < parsed.words.length; i++) {
    // اگه از حد مجاز رد شد، بقیه رو نادیده بگیر
    if (i >= MAX_IMPORT_WORDS) {
      rejected++;
      continue;
    }

    const word = parsed.words[i];
    const rowNumber = i + 1;

    // اعتبارسنجی کلمه
    const validation = validateImportWord(word, rowNumber);
    if (!validation.valid) {
      errors.push(...validation.errors);
      rejected++;
      continue;
    }

    // چک تکراری توی خود فایل
    const normalizedGerman = word.de.toLowerCase().trim();
    if (seenInFile.has(normalizedGerman)) {
      errors.push(`ردیف ${rowNumber}: کلمه "${word.de}" توی فایل تکراریه.`);
      rejected++;
      continue;
    }

    // چک تکراری با کلمات موجود
    if (existingGermanWords.has(normalizedGerman)) {
      errors.push(
        `ردیف ${rowNumber}: کلمه "${word.de}" قبلاً اضافه شده.`
      );
      rejected++;
      continue;
    }

    // تبدیل به WordEntry
    const wordEntry = convertToWordEntry(word);
    newWords.push(wordEntry);
    seenInFile.add(normalizedGerman);
    imported++;

    // محاسبه‌ی جایزه
    const rewardCoins = Math.min(
      REWARD_IMPORTED_WORD,
      MAX_DAILY_IMPORT_REWARD - currentDayCoinsEarned - coinsEarned
    );
    if (rewardCoins > 0) {
      coinsEarned += rewardCoins;
    }
  }

  // ─── مرحله ۵: ذخیره‌ی کلمات جدید ───
  if (newWords.length > 0) {
    saveCustomWords([...newWords, ...existingWords]);
  }

  return {
    total,
    imported,
    rejected,
    errors: errors.slice(0, 20), // حداکثر ۲۰ خطا نشون بده
    coinsEarned,
  };
}

// ─────────────────────────────────────────────────────────────
// اعتبارسنجی
// ─────────────────────────────────────────────────────────────

/**
 * اعتبارسنجی یه کلمه‌ی ایمپورت.
 */
function validateImportWord(
  word: ImportWord,
  rowNumber: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // فیلدهای اجباری
  if (!word.de || typeof word.de !== "string" || !word.de.trim()) {
    errors.push(`ردیف ${rowNumber}: فیلد "de" (کلمه‌ی آلمانی) اجباریه.`);
  }
  if (!word.fa || typeof word.fa !== "string" || !word.fa.trim()) {
    errors.push(`ردیف ${rowNumber}: فیلد "fa" (ترجمه) اجباریه.`);
  }

  // category
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

  // level
  const validLevels: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1"];
  if (!word.level || !validLevels.includes(word.level)) {
    errors.push(
      `ردیف ${rowNumber}: "level" باید یکی از این‌ها باشه: ${validLevels.join(", ")}`
    );
  }

  // چک گرامر اسم
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

  // چک گرامر فعل
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

/**
 * تبدیل ImportWord به WordEntry.
 */
function convertToWordEntry(word: ImportWord): WordEntry {
  return {
    id: generateCustomWordId(),
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
  };
}

// ─────────────────────────────────────────────────────────────
// توابع کمکی
// ─────────────────────────────────────────────────────────────

/**
 * بررسی اینکه آیا فایل JSON معتبره (بدون ایمپورت).
 */
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