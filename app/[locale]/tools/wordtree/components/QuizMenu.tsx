"use client";

/**
 * QuizMenu — منوی آزمون‌ها (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این منو توی پنل تنظیمات باز می‌شه.
 * ۲. کاربر می‌تونه:
 *    - آمار کلی خودش رو ببینه (تعداد آزمون‌ها، دقت، بهترین امتیاز)
 *    - کلمات ضعیفش رو ببینه
 *    - یه آزمون آزاد شروع کنه (از کلمات چالش‌برانگیز)
 * ۳. آمار از `quizStats.ts` میاد.
 * ۴. برای فاز ۲: نمودار پیشرفت.
 */

import { useState, useMemo } from "react";
import { Word, QuizResult } from "@/lib/wordtree/types";
import {
  loadStats,
  getStatsSummary,
} from "@/lib/wordtree/quizStats";
import { ExerciseModal } from "./exercises/ExerciseModal";
import { Button } from "@/components/ui/Button";

interface QuizMenuProps {
  isOpen: boolean;
  onClose: () => void;
  words: Word[];
  onQuizComplete?: (result: QuizResult) => void;
  labels: {
    title: string;
    statsTitle: string;
    totalQuizzes: string;
    overallAccuracy: string;
    bestAccuracy: string;
    totalQuestions: string;
    weakWordsTitle: string;
    weakWordsEmpty: string;
    startQuiz: string;
    close: string;
    noStats: string;
    // ExerciseModal labels
    modal: {
      title: string;
      subtitle: string;
      questionOf: string;
      next: string;
      finish: string;
      resultTitle: string;
      correctCount: string;
      totalCount: string;
      passed: string;
      failed: string;
      coinsEarned: string;
      close: string;
      spellingTitle: string;
      hint: string;
      confirm: string;
      correct: string;
      wrong: string;
      tryAgain: string;
      showAnswer: string;
    };
  };
}

export function QuizMenu({
  isOpen,
  onClose,
  words,
  onQuizComplete,
  labels,
}: QuizMenuProps) {
  const [showExercise, setShowExercise] = useState(false);

  // ─── بارگذاری آمار ───
  const stats = useMemo(() => loadStats(), [isOpen]);
  const summary = useMemo(() => getStatsSummary(stats), [stats]);

  // ─── کلمات ضعیف (از روی wordStats) ───
  const weakWords = useMemo(() => {
    return summary.weakestWords
      .map((wordId) => words.find((w) => w.id === wordId))
      .filter((w): w is Word => w !== undefined);
  }, [summary.weakestWords, words]);

  // ─── شروع آزمون آزاد ───
  const handleStartQuiz = () => {
    setShowExercise(true);
  };

  // ─── تکمیل آزمون ───
  const handleQuizComplete = (result: QuizResult) => {
    if (onQuizComplete) onQuizComplete(result);
  };

  if (!isOpen) return null;

  // ─── اگه آزمون فعاله، مودال رو نشون بده ───
  if (showExercise) {
    return (
      <ExerciseModal
        words={words}
        onClose={() => setShowExercise(false)}
        onComplete={handleQuizComplete}
        labels={labels.modal}
      />
    );
  }

  // ─── منوی اصلی آزمون ───
  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-40 animate-panel-in"
        onClick={onClose}
      />

      {/* ─── پنل ─── */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-paper-100 shadow-2xl z-50 animate-slide-in-right border-l border-gold-300/30 overflow-y-auto">
        {/* ─── هدر ─── */}
        <div className="flex items-center justify-between p-4 border-b border-navy-900/10 sticky top-0 bg-paper-100 z-10">
          <h2 className="text-lg font-bold text-navy-900 font-mono">
            🎯 {labels.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-navy-900/10 transition text-navy-900"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        {/* ─── محتوا ─── */}
        <div className="p-4 space-y-4">
          {/* ─── آمار ─── */}
          <div>
            <h3 className="text-sm font-bold text-navy-900/70 mb-3 font-mono">
              📊 {labels.statsTitle}
            </h3>

            {summary.totalQuizzes === 0 ? (
              <div className="bg-white p-4 rounded-sm border border-navy-900/10 text-center">
                <p className="text-sm text-navy-900/60">{labels.noStats}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label={labels.totalQuizzes}
                  value={summary.totalQuizzes.toString()}
                />
                <StatCard
                  label={labels.overallAccuracy}
                  value={`${summary.overallAccuracy}%`}
                />
                <StatCard
                  label={labels.bestAccuracy}
                  value={`${summary.bestAccuracy}%`}
                />
                <StatCard
                  label={labels.totalQuestions}
                  value={summary.totalQuestionsAnswered.toString()}
                />
              </div>
            )}
          </div>

          {/* ─── کلمات ضعیف ─── */}
          {weakWords.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-navy-900/70 mb-3 font-mono">
                ⚠️ {labels.weakWordsTitle}
              </h3>
              <div className="space-y-2">
                {weakWords.map((word) => {
                  const wordStat = stats.wordStats[word.id];
                  const total = wordStat
                    ? wordStat.correct + wordStat.wrong
                    : 0;
                  const accuracy =
                    total > 0 && wordStat
                      ? Math.round((wordStat.correct / total) * 100)
                      : 0;

                  return (
                    <div
                      key={word.id}
                      className="bg-white p-3 rounded-sm border border-navy-900/10 flex justify-between items-center"
                    >
                      <div>
                        <p
                          className="font-mono font-bold text-navy-900 text-sm"
                          dir="ltr"
                        >
                          {word.german}
                        </p>
                        <p className="text-xs text-navy-900/50">
                          {word.translation}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          accuracy >= 70
                            ? "text-green-600"
                            : accuracy >= 40
                            ? "text-orange-500"
                            : "text-red-600"
                        }`}
                      >
                        {accuracy}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── دکمه‌ی شروع آزمون ─── */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={handleStartQuiz}
              disabled={words.length === 0}
            >
              🎯 {labels.startQuiz}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// کامپوننت کوچیک برای کارت آمار
// ─────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-sm border border-navy-900/10 text-center">
      <p className="text-xs text-navy-900/50 mb-1">{label}</p>
      <p className="text-lg font-bold text-navy-900 font-mono">{value}</p>
    </div>
  );
}