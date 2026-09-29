/**
 * Word Tree — Exercises (نسخه ۱.۰)
 *
 * این فایل، منطق تولید تمرین‌ها رو مدیریت می‌کنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. در فاز ۱، فقط تمرین املا (Spelling) داریم.
 * ۲. سه سطح دشواری:
 *    - ساده: ۱ حرف کم
 *    - متوسط: ۲ حرف کم
 *    - سخت: ۳ حرف کم
 * ۳. برای هر حرف گم‌شده، ۴ گزینه تولید می‌شه:
 *    - ۱ جواب درست + ۳ حرف اشتباه
 * ۴. حروف اشتباه از حروف نزدیک به حرف درست انتخاب می‌شن (برای چالش بیشتر).
 * ۵. برای فاز ۲ (article, conjugation)، تابع‌های جداگانه اضافه می‌شن.
 */

import {
  Exercise,
  ExerciseType,
  Word,
  WordEntry,
} from "./types";
import {
  SPELLING_EASY_BLANK_COUNT,
  SPELLING_MEDIUM_BLANK_COUNT,
  SPELLING_HARD_BLANK_COUNT,
  SPELLING_OPTIONS_PER_BLANK,
} from "./constants";

// ─────────────────────────────────────────────────────────────
// توابع کمکی
// ─────────────────────────────────────────────────────────────

/**
 * شافل کردن یه آرایه (Fisher-Yates algorithm).
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * انتخاب یه ایندکس تصادفی از یه آرایه.
 */
function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/**
 * تولید گزینه‌های اشتباه برای یه حرف.
 *
 * ⚠️ روش کار:
 * ۱. حروف الفبای آلمانی رو داریم.
 * ۲. حرف درست رو ازش حذف می‌کنیم.
 * ۳. ۳ تا حرف تصادفی از حروف باقی‌مونده انتخاب می‌کنیم.
 *
 * @param correctLetter - حرف درست
 * @param count - تعداد گزینه‌ها
 */
function generateWrongOptions(
  correctLetter: string,
  count: number
): string[] {
  // الفبای آلمانی + بعضی حروف خاص
  const germanAlphabet = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", "ä", "ö", "ü", "ß",
  ];

  // حذف حرف درست از لیست
  const available = germanAlphabet.filter(
    (l) => l.toLowerCase() !== correctLetter.toLowerCase()
  );

  // انتخاب تصادفی
  const shuffled = shuffle(available);
  return shuffled.slice(0, count);
}

/**
 * پیدا کردن موقعیت حروفی که باید حذف بشن.
 *
 * ⚠️ نکات:
 * - حروف اول کلمه (حرف بزرگ) رو حذف نمی‌کنیم (چون آسون می‌شه).
 * - حروف تکراری رو حذف نمی‌کنیم (برای اینکه جای خالی گم نشه).
 *
 * @param word - کلمه
 * @param blankCount - تعداد حروفی که باید حذف بشن
 * @returns ایندکس حروفی که باید حذف بشن
 */
function pickBlankPositions(word: string, blankCount: number): number[] {
  // ایندکس‌های قابل حذف: از ایندکس ۱ (دومین حرف) به بعد
  // (حرف اول رو نگه می‌داریم)
  const availableIndices: number[] = [];
  for (let i = 1; i < word.length; i++) {
    availableIndices.push(i);
  }

  // اگه کلمه خیلی کوتاهه، همه‌ی حروف رو حذف نکن
  const maxBlanks = Math.min(blankCount, availableIndices.length - 1);
  if (maxBlanks <= 0) return [];

  // انتخاب تصادفی از ایندکس‌ها
  const shuffled = shuffle(availableIndices);
  const selected = shuffled.slice(0, maxBlanks);

  // مرتب‌سازی برای اینکه ترتیب حفظ بشه
  return selected.sort((a, b) => a - b);
}

// ─────────────────────────────────────────────────────────────
// تولید تمرین املا
// ─────────────────────────────────────────────────────────────

/**
 * تولید تمرین املا برای یه کلمه.
 *
 * @param word - کلمه‌ی آلمانی (مثلاً "der Mann")
 * @param type - نوع تمرین (ساده، متوسط، سخت)
 * @returns یه Exercise
 *
 * ⚠️ مثال:
 * - کلمه: "der Mann"
 * - نوع ساده: "d_r Mann" (حرف 'e' گم شده)
 * - گزینه‌ها: ["e", "a", "i", "o"]
 */
export function generateSpellingExercise(
  word: string,
  type: "spelling-simple" | "spelling-medium" | "spelling-hard"
): Exercise {
  // ─── ۱. تعیین تعداد حروف گم‌شده ───
  let blankCount: number;
  if (type === "spelling-simple") {
    blankCount = SPELLING_EASY_BLANK_COUNT;
  } else if (type === "spelling-medium") {
    blankCount = SPELLING_MEDIUM_BLANK_COUNT;
  } else {
    blankCount = SPELLING_HARD_BLANK_COUNT;
  }

  // ─── ۲. پیدا کردن موقعیت حروف گم‌شده ───
  const blankPositions = pickBlankPositions(word, blankCount);

  // ─── ۳. ساخت متن سوال ───
  // مثلاً "der Mann" → "d_r M_nn"
  let questionText = "";
  const correctLetters: string[] = [];

  for (let i = 0; i < word.length; i++) {
    if (blankPositions.includes(i)) {
      questionText += "_";
      correctLetters.push(word[i]);
    } else {
      questionText += word[i];
    }
  }

  // ─── ۴. تولید گزینه‌ها ───
  // برای هر حرف گم‌شده، یه آرایه از گزینه‌ها
  const optionsPerBlank: string[][] = correctLetters.map((correctLetter) => {
    const wrongOptions = generateWrongOptions(
      correctLetter,
      SPELLING_OPTIONS_PER_BLANK - 1
    );
    // ترکیب درست + غلط، بعد شافل
    return shuffle([correctLetter, ...wrongOptions]);
  });

  // ─── ۵. گزینه‌ها رو توی یه آرایه‌ی تخت بذار ───
  // ⚠️ برای سادگی، فعلاً همه‌ی گزینه‌های هر حرف رو با هم ترکیب می‌کنیم
  // (کاربر باید برای هر حرف، از بین گزینه‌های خودش انتخاب کنه)
  const flatOptions = optionsPerBlank.flat();

  return {
    type,
    wordId: "", // بعداً پر می‌شه
    correctAnswer: word,
    questionText,
    options: flatOptions,
    hint: correctLetters.join(""),
  };
}

// ─────────────────────────────────────────────────────────────
// تولید تمرین بر اساس مرحله‌ی مرور
// ─────────────────────────────────────────────────────────────

/**
 * انتخاب نوع تمرین بر اساس مرحله‌ی مرور.
 *
 * ⚠️ جریان:
 * - reviewStage 0: تمرین نداره (فقط معنی)
 * - reviewStage 1: تمرین ساده
 * - reviewStage 2: تمرین متوسط
 * - reviewStage 3: تمرین متوسط
 * - reviewStage 4: تمرین سخت
 * - reviewStage 5: تمرین تصادفی
 *
 * @param reviewStage - مرحله‌ی مرور (0-5)
 * @returns نوع تمرین
 */
export function pickExerciseType(reviewStage: number): ExerciseType {
  if (reviewStage <= 0) return "spelling-simple"; // پیش‌فرض
  if (reviewStage === 1) return "spelling-simple";
  if (reviewStage === 2) return "spelling-medium";
  if (reviewStage === 3) return "spelling-medium";
  if (reviewStage === 4) return "spelling-hard";

  // reviewStage 5: تصادفی
  const types: ExerciseType[] = [
    "spelling-simple",
    "spelling-medium",
    "spelling-hard",
  ];
  return types[randomIndex(types.length)];
}

/**
 * تولید یه تمرین از یه کلمه بر اساس مرحله‌ی مرور.
 *
 * @param word - کلمه‌ی آلمانی
 * @param reviewStage - مرحله‌ی مرور
 * @returns یه Exercise
 */
export function generateExerciseForWord(
  word: string,
  reviewStage: number
): Exercise {
  const type = pickExerciseType(reviewStage);
  return generateSpellingExercise(word, type as any);
}

// ─────────────────────────────────────────────────────────────
// تولید آزمون (۵ سوال از کلمات چالش‌برانگیز)
// ─────────────────────────────────────────────────────────────

/**
 * انتخاب کلمات چالش‌برانگیز برای آزمون.
 *
 * ⚠️ معیارها:
 * ۱. کلماتی که `reviewCount` پایین دارن (کمتر مرور شدن).
 * ۲. کلماتی که `reviewStage` پایین دارن (هنوز قوی نشدن).
 * ۳. کلماتی که کاربر «یادم رفت» زده (اگه آمار داشته باشیم).
 *
 * @param words - همه‌ی کلمات کاربر
 * @param count - تعداد کلمات موردنیاز
 * @returns لیست کلمات چالش‌برانگیز
 */
export function pickChallengingWords(
  words: Word[],
  count: number
): Word[] {
  // ─── ۱. محاسبه‌ی امتیاز چالش برای هر کلمه ───
  const scored = words.map((word) => {
    // امتیاز بالاتر = چالش‌برانگیزتر
    // معیارها:
    // - reviewCount پایین → امتیاز بالا
    // - reviewStage پایین → امتیاز بالا
    const reviewCountScore = Math.max(0, 5 - word.reviewCount);
    const reviewStageScore = Math.max(0, 5 - word.reviewStage);
    const totalScore = reviewCountScore + reviewStageScore;

    return { word, score: totalScore };
  });

  // ─── ۲. مرتب‌سازی بر اساس امتیاز (بالاترین اول) ───
  scored.sort((a, b) => b.score - a.score);

  // ─── ۳. انتخاب `count` کلمه‌ی اول ───
  // ولی با کمی تصادفی بودن (تا هر بار یه آزمون متفاوت باشه)
  const topCandidates = scored.slice(0, count * 2); // ۲ برابر بگیر، بعد تصادفی
  const shuffled = shuffle(topCandidates);

  return shuffled.slice(0, count).map((s) => s.word);
}

/**
 * تولید یه آزمون کامل از کلمات چالش‌برانگیز.
 *
 * @param words - همه‌ی کلمات کاربر
 * @param count - تعداد سوالات
 * @returns لیست Exercise
 */
export function generateQuiz(
  words: Word[],
  count: number = 5
): Exercise[] {
  // ─── ۱. انتخاب کلمات چالش‌برانگیز ───
  const challengingWords = pickChallengingWords(words, count);

  // ─── ۲. تولید تمرین برای هر کلمه ───
  const exercises: Exercise[] = challengingWords.map((word) => {
    const exercise = generateExerciseForWord(
      word.german,
      word.reviewStage
    );
    return {
      ...exercise,
      wordId: word.id,
    };
  });

  return exercises;
}