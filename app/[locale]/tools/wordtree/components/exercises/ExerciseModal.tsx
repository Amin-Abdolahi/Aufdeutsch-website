"use client";

/**
 * ExerciseModal — مدیریت آزمون (نسخه ۱.۱ — رفع باگ state)
 *
 * ⚠️ تغییرات نسخه ۱.۱:
 * - اضافه شدن `key` به SpellingExercise برای جلوگیری از باگ state
 * - هر سوال، کامپوننت جدید می‌سازه
 * - حالت آزمون آزاد (بدون میوه‌ی نقره‌ای) هم کار می‌کنه
 */

import { useState, useMemo } from "react";
import { Exercise, Word, QuizResult } from "@/lib/wordtree/types";
import { generateQuiz } from "@/lib/wordtree/exercises";
import {
  createQuizStat,
  recordQuiz,
  recordWordResult,
  recordExerciseResult,
} from "@/lib/wordtree/quizStats";
import {
  QUIZ_PASS_THRESHOLD,
  QUIZ_REWARD_COINS,
} from "@/lib/wordtree/constants";
import { SpellingExercise } from "./SpellingExercise";
import { Button } from "@/components/ui/Button";

interface ExerciseModalProps {
  words: Word[];
  quizWords?: string[];
  onClose: () => void;
  onComplete: (result: QuizResult) => void;
  labels: {
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
}

export function ExerciseModal({
  words,
  quizWords,
  onClose,
  onComplete,
  labels,
}: ExerciseModalProps) {
  // ─── ساخت آزمون ───
  const exercises = useMemo(() => {
    const targetWords = quizWords
      ? words.filter((w) => quizWords.includes(w.id))
      : words;

    if (targetWords.length === 0) {
      return generateQuiz(words, 5);
    }

    return generateQuiz(targetWords, 5);
  }, [words, quizWords]);

  // ─── state ───
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());

  const currentExercise = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;

  // ─── پاسخ به یه سوال ───
  const handleAnswer = (correct: boolean) => {
    // ثبت نتیجه
    const finalResults = [...results, correct];
    setResults(finalResults);

    // ثبت آمار کلمه
    recordWordResult(currentExercise.wordId, correct);

    // ثبت آمار نوع تمرین
    recordExerciseResult(currentExercise.type, correct);

    // ─── اگه آخرین سوال بود، تموم کن ───
    if (isLast) {
      const correctCount = finalResults.filter((r) => r).length;
      const wrongWordIds = exercises
        .filter((_, idx) => !finalResults[idx])
        .map((e) => e.wordId);

      const result: QuizResult = {
        totalQuestions: exercises.length,
        correctAnswers: correctCount,
        completedAt: Date.now(),
        coinsEarned:
          correctCount >= QUIZ_PASS_THRESHOLD ? QUIZ_REWARD_COINS : 0,
        timeSpentMs: Date.now() - startTime,
      };

      // ثبت آزمون توی آمار
      const stat = createQuizStat(
        exercises.length,
        correctCount,
        Date.now() - startTime,
        wrongWordIds
      );
      recordQuiz(stat);

      setIsComplete(true);
      onComplete(result);
    } else {
      // ─── برو سوال بعدی ───
      setCurrentIndex(currentIndex + 1);
    }
  };

  // ─── نتیجه‌ی نهایی ───
  const correctCount = results.filter((r) => r).length;
  const totalCount = exercises.length;
  const passed = correctCount >= QUIZ_PASS_THRESHOLD;

  // ─── نمایش نتیجه ───
  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full animate-panel-in border border-gold-300/30">
          <h2 className="text-xl font-bold text-navy-900 font-mono text-center mb-6">
            🎯 {labels.resultTitle}
          </h2>

          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-navy-900 mb-2">
              {correctCount} / {totalCount}
            </p>
            <p
              className={`text-lg font-bold ${
                passed ? "text-green-600" : "text-orange-600"
              }`}
            >
              {passed ? `✓ ${labels.passed}` : `✗ ${labels.failed}`}
            </p>
          </div>

          {passed && (
            <div className="bg-gold-300/30 border border-gold-500/40 rounded-sm p-3 mb-4 text-center">
              <p className="text-navy-900 font-bold">
                🪙 {labels.coinsEarned}: +{QUIZ_REWARD_COINS}
              </p>
            </div>
          )}

          <Button variant="primary" size="md" onClick={onClose}>
            {labels.close}
          </Button>
        </div>
      </div>
    );
  }

  // ─── اگه تمرینی نبود ───
  if (!currentExercise) {
    return (
      <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-paper-100 p-6 rounded-xl shadow-2xl max-w-md w-full">
          <p className="text-center text-navy-900 mb-4">
            کلمه‌ای برای آزمون پیدا نشد.
          </p>
          <Button variant="primary" size="md" onClick={onClose}>
            {labels.close}
          </Button>
        </div>
      </div>
    );
  }

  // ─── نمایش سوال ───
  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        {/* ─── هدر ─── */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-navy-900 font-mono mb-1">
            🥈 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
          <p className="text-sm text-navy-900/50 font-mono mt-2">
            {labels.questionOf} {currentIndex + 1} / {totalCount}
          </p>
        </div>

        {/* ─── تمرین ─── */}
        {currentExercise.type.startsWith("spelling") && (
          <SpellingExercise
            key={`exercise-${currentIndex}-${currentExercise.wordId}`}
            exercise={currentExercise}
            onComplete={handleAnswer}
            labels={{
              title: labels.spellingTitle,
              hint: labels.hint,
              confirm: labels.confirm,
              correct: labels.correct,
              wrong: labels.wrong,
              tryAgain: labels.tryAgain,
              showAnswer: labels.showAnswer,
            }}
          />
        )}
      </div>
    </div>
  );
}