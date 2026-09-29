/**
 * Word Tree — Quiz Stats (نسخه ۱.۰)
 *
 * این فایل، ذخیره‌سازی و مدیریت آمار آزمون‌ها رو مدیریت می‌کنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. آمار توی localStorage ذخیره می‌شه (کلید: USER_STATS_STORAGE_KEY).
 * ۲. ساختار:
 *    - quizzes: لیست همه‌ی آزمون‌ها
 *    - wordStats: آمار هر کلمه (چند بار درست، چند بار غلط)
 *    - exerciseStats: آمار هر نوع تمرین
 * ۳. برای محاسبه‌ی نقاط ضعف، از wordStats استفاده می‌شه.
 * ۴. برای فاز ۲ (نمودار)، می‌تونیم از quizzes استفاده کنیم.
 */

import {
  UserStats,
  QuizStat,
  ExerciseType,
} from "./types";
import { USER_STATS_STORAGE_KEY } from "./constants";

// ─────────────────────────────────────────────────────────────
// توابع اصلی
// ─────────────────────────────────────────────────────────────

/**
 * ساخت آمار خالی.
 */
export function createEmptyStats(): UserStats {
  return {
    quizzes: [],
    wordStats: {},
    exerciseStats: {
      "spelling-simple": { correct: 0, wrong: 0 },
      "spelling-medium": { correct: 0, wrong: 0 },
      "spelling-hard": { correct: 0, wrong: 0 },
      "article": { correct: 0, wrong: 0 },
      "conjugation": { correct: 0, wrong: 0 },
      "adjective-comparison": { correct: 0, wrong: 0 },
    },
  };
}

/**
 * ذخیره‌ی آمار توی localStorage.
 */
export function saveStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
}

/**
 * بازیابی آمار از localStorage.
 */
export function loadStats(): UserStats {
  if (typeof window === "undefined") return createEmptyStats();
  try {
    const data = localStorage.getItem(USER_STATS_STORAGE_KEY);
    if (!data) return createEmptyStats();

    const parsed = JSON.parse(data) as UserStats;

    // ⚠️ Migration: اگه فیلدی نبود، مقدار پیش‌فرض بذار
    const empty = createEmptyStats();
    return {
      ...empty,
      ...parsed,
      exerciseStats: {
        ...empty.exerciseStats,
        ...(parsed.exerciseStats || {}),
      },
    };
  } catch (error) {
    console.error("Failed to load stats:", error);
    return createEmptyStats();
  }
}

/**
 * پاک کردن آمار.
 */
export function clearStats(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_STATS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stats:", error);
  }
}

// ─────────────────────────────────────────────────────────────
// ثبت نتایج
// ─────────────────────────────────────────────────────────────

/**
 * ساخت یه QuizStat جدید.
 */
export function createQuizStat(
  totalQuestions: number,
  correctAnswers: number,
  timeSpentMs: number,
  wrongWordIds: string[]
): QuizStat {
  return {
    id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    totalQuestions,
    correctAnswers,
    accuracy:
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0,
    timeSpentMs,
    completedAt: Date.now(),
    wrongWordIds,
  };
}

/**
 * ذخیره‌ی نتیجه‌ی یه آزمون.
 *
 * @param stat - آمار آزمون
 * @returns آمار به‌روز شده
 */
export function recordQuiz(stat: QuizStat): UserStats {
  const stats = loadStats();
  const updatedStats = {
    ...stats,
    quizzes: [...stats.quizzes, stat],
  };
  saveStats(updatedStats);
  return updatedStats;
}

/**
 * ثبت نتیجه‌ی یه کلمه (درست یا غلط).
 *
 * @param wordId - شناسه‌ی کلمه
 * @param correct - آیا درست جواب داد
 */
export function recordWordResult(
  wordId: string,
  correct: boolean
): UserStats {
  const stats = loadStats();
  const current = stats.wordStats[wordId] || { correct: 0, wrong: 0 };

  const updatedStats: UserStats = {
    ...stats,
    wordStats: {
      ...stats.wordStats,
      [wordId]: {
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      },
    },
  };

  saveStats(updatedStats);
  return updatedStats;
}

/**
 * ثبت نتیجه‌ی یه نوع تمرین.
 *
 * @param type - نوع تمرین
 * @param correct - آیا درست جواب داد
 */
export function recordExerciseResult(
  type: ExerciseType,
  correct: boolean
): UserStats {
  const stats = loadStats();
  const current = stats.exerciseStats[type] || { correct: 0, wrong: 0 };

  const updatedStats: UserStats = {
    ...stats,
    exerciseStats: {
      ...stats.exerciseStats,
      [type]: {
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      },
    },
  };

  saveStats(updatedStats);
  return updatedStats;
}

// ─────────────────────────────────────────────────────────────
// تحلیل و آمار
// ─────────────────────────────────────────────────────────────

/**
 * محاسبه‌ی دقت کلی کاربر.
 */
export function getOverallAccuracy(stats: UserStats): number {
  const total = stats.quizzes.reduce(
    (sum, q) => sum + q.totalQuestions,
    0
  );
  const correct = stats.quizzes.reduce(
    (sum, q) => sum + q.correctAnswers,
    0
  );
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

/**
 * پیدا کردن ضعیف‌ترین کلمات کاربر.
 *
 * @param stats - آمار
 * @param count - تعداد کلمات موردنیاز
 * @returns لیست شناسه‌ی کلمات ضعیف (مرتب‌شده)
 */
export function getWeakestWordIds(
  stats: UserStats,
  count: number = 10
): string[] {
  const entries = Object.entries(stats.wordStats);

  // مرتب‌سازی بر اساس نرخ خطا (بالاترین اول)
  entries.sort(([, a], [, b]) => {
    const aTotal = a.correct + a.wrong;
    const bTotal = b.correct + b.wrong;
    const aRate = aTotal > 0 ? a.wrong / aTotal : 0;
    const bRate = bTotal > 0 ? b.wrong / bTotal : 0;
    return bRate - aRate;
  });

  return entries.slice(0, count).map(([wordId]) => wordId);
}

/**
 * پیدا کردن ضعیف‌ترین نوع تمرین.
 */
export function getWeakestExerciseType(
  stats: UserStats
): ExerciseType | null {
  const entries = Object.entries(stats.exerciseStats) as [
    ExerciseType,
    { correct: number; wrong: number }
  ][];

  let weakest: ExerciseType | null = null;
  let highestErrorRate = -1;

  for (const [type, data] of entries) {
    const total = data.correct + data.wrong;
    if (total === 0) continue;

    const errorRate = data.wrong / total;
    if (errorRate > highestErrorRate) {
      highestErrorRate = errorRate;
      weakest = type;
    }
  }

  return weakest;
}

/**
 * آمار کلی برای نمایش.
 */
export interface StatsSummary {
  totalQuizzes: number;
  overallAccuracy: number;
  bestAccuracy: number;
  totalQuestionsAnswered: number;
  weakestWords: string[];
  weakestExercise: ExerciseType | null;
}

/**
 * محاسبه‌ی آمار خلاصه برای نمایش.
 */
export function getStatsSummary(stats: UserStats): StatsSummary {
  const totalQuizzes = stats.quizzes.length;
  const overallAccuracy = getOverallAccuracy(stats);
  const bestAccuracy = stats.quizzes.reduce(
    (max, q) => Math.max(max, q.accuracy),
    0
  );
  const totalQuestionsAnswered = stats.quizzes.reduce(
    (sum, q) => sum + q.totalQuestions,
    0
  );

  return {
    totalQuizzes,
    overallAccuracy,
    bestAccuracy,
    totalQuestionsAnswered,
    weakestWords: getWeakestWordIds(stats, 5),
    weakestExercise: getWeakestExerciseType(stats),
  };
}