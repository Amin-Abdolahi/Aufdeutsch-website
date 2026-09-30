"use client";

/**
 * HarvestPanel — پنل چیدن میوه (نسخه ۴.۰ — با تمرین اختیاری)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این پنل وقتی باز می‌شه که کاربر روی یه میوه کلیک می‌کنه.
 * ۲. کاربر می‌تونه:
 *    - معنی رو ببینه.
 *    - تمرین اختیاری کنه (SpellingExercise).
 *    - «یادم موند» یا «یادم رفت» رو بزنه.
 * ۳. تمرین اختیاری: کاربر می‌تونه رد کنه.
 * ۴. اگه تمرین انجام داد، نتیجه به `harvestFruit` پاس داده می‌شه.
 *
 * ⚠️ برای فاز ۲:
 * - اضافه کردن آرتیکل، صرف فعل، صفت تفضیلی.
 */

import { useState } from "react";
import { WordEntry } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { generateExerciseForWord } from "@/lib/wordtree/exercises";
import { SpellingExercise } from "./exercises/SpellingExercise";

interface HarvestPanelProps {
  wordEntry: WordEntry;
  locale: Locale;
  reviewStage: number;
  onAnswer: (remembered: boolean) => void;
  onClose: () => void;
  /** پیشرفت توی صف مرور (کلمه‌ی چندم از چندتا) */
  queueProgress?: { current: number; total: number };
  labels: {
    title: string;
    question: string;
    remembered: string;
    forgot: string;
    reveal: string;
    grammar: string;
    article: string;
    plural: string;
    praeteritum: string;
    perfekt: string;
    // ─── جدید ───
    practiceOptional: string;
    practiceTitle: string;
    practiceHint: string;
    practiceConfirm: string;
    practiceCorrect: string;
    practiceWrong: string;
    practiceTryAgain: string;
    practiceShowAnswer: string;
    skipPractice: string;
    // ─── نسخه‌ی ۵: حلقه‌ی مرور ───
    iKnow: string;
    iDontKnow: string;
    progress: string;
    loopHint: string;
    close: string;
    allDone: string;
  };
}

export function HarvestPanel({
  wordEntry,
  locale,
  reviewStage,
  onAnswer,
  onClose,
  queueProgress,
  labels,
}: HarvestPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceResult, setPracticeResult] = useState<"correct" | "wrong" | null>(null);

  const german = wordEntry.translations.de;
  const translation =
    wordEntry.translations[locale] || wordEntry.translations.fa;
  const example = wordEntry.example?.de;
  const exampleTranslation =
    wordEntry.example?.translations?.[locale] || wordEntry.example?.de;

  const hasGrammar = wordEntry.noun || wordEntry.verb;

  // ─── تولید تمرین ───
  // فقط برای کلماتی که کوتاه نیستن (حداقل ۴ حرف)
  const canPractice = german.length >= 4;

  const exercise = canPractice
    ? generateExerciseForWord(german, reviewStage)
    : null;

  // ─── شروع تمرین ───
  const handleStartPractice = () => {
    setShowPractice(true);
  };

  // ─── پایان تمرین ───
  const handlePracticeComplete = (correct: boolean) => {
    setPracticeResult(correct ? "correct" : "wrong");
    // بعد از ۱.۵ ثانیه، برمی‌گردیم به حالت اصلی
    setTimeout(() => {
      setShowPractice(false);
      setPracticeResult(null);
    }, 1500);
  };

  // ─── حالت تمرین ───
  if (showPractice && exercise && practiceResult === null) {
    return (
      <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
          <SpellingExercise
            exercise={exercise}
            onComplete={handlePracticeComplete}
            labels={{
              title: labels.practiceTitle,
              hint: labels.practiceHint,
              confirm: labels.practiceConfirm,
              correct: labels.practiceCorrect,
              wrong: labels.practiceWrong,
              tryAgain: labels.practiceTryAgain,
              showAnswer: labels.practiceShowAnswer,
            }}
          />
        </div>
      </div>
    );
  }

  // ─── پیام موفقیت تمرین ───
  if (practiceResult === "correct") {
    return (
      <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-paper-100 p-6 rounded-xl shadow-2xl max-w-md w-full animate-panel-in">
          <p className="text-center text-2xl font-bold text-green-600">
            ✓ {labels.practiceCorrect}
          </p>
        </div>
      </div>
    );
  }

  // ─── پنل اصلی ───
  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        {/* ─── هدر ─── */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
              🍎 {labels.title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-navy-900/5 hover:bg-navy-900/15 text-navy-900/60 hover:text-navy-900 transition text-sm"
              title={labels.close}
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-navy-900/60 text-center">
            {labels.question}
          </p>

          {/* ─── پیشرفت مرور ─── */}
          {queueProgress && queueProgress.total > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-navy-900/60 font-mono mb-1">
                <span>
                  {labels.progress
                    .replace("{current}", queueProgress.current.toString())
                    .replace("{total}", queueProgress.total.toString())}
                </span>
                <span>{labels.loopHint}</span>
              </div>
              <div className="w-full bg-navy-900/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-gold-300 to-gold-500 h-full rounded-full transition-all"
                  style={{
                    width: `${
                      ((queueProgress.total - queueProgress.current + 1) /
                        queueProgress.total) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── کلمه ─── */}
        <div className="bg-white p-6 rounded-sm border border-navy-900/10 mb-4">
          <p className="text-3xl font-bold text-navy-900 font-mono text-center mb-2">
            {german}
          </p>

          {wordEntry.pronunciation?.persian && (
            <p className="text-center text-sm text-navy-900/50 font-mono mb-2">
              [{wordEntry.pronunciation.persian}]
            </p>
          )}

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full mt-4 py-3 text-navy-900/60 border border-dashed border-navy-900/30 rounded-sm hover:bg-navy-900/5 transition"
            >
              👁 {labels.reveal}
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              {/* ─── ترجمه ─── */}
              <p className="text-lg text-navy-900 text-center font-bold">
                {translation}
              </p>

              {/* ─── اطلاعات گرامری ─── */}
              {hasGrammar && (
                <div className="bg-navy-900/5 p-3 rounded-sm">
                  <p className="text-xs text-navy-900/50 mb-2 font-mono">
                    {labels.grammar}
                  </p>

                  {wordEntry.noun && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-900/60">
                          {labels.article}:
                        </span>
                        <span className="font-mono font-bold text-navy-900">
                          {wordEntry.noun.article}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-900/60">
                          {labels.plural}:
                        </span>
                        <span className="font-mono font-bold text-navy-900">
                          {wordEntry.noun.plural}
                        </span>
                      </div>
                    </div>
                  )}

                  {wordEntry.verb && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-900/60">
                          {labels.praeteritum}:
                        </span>
                        <span className="font-mono font-bold text-navy-900">
                          {wordEntry.verb.praeteritum}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-900/60">
                          {labels.perfekt}:
                        </span>
                        <span className="font-mono font-bold text-navy-900">
                          {wordEntry.verb.perfekt}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── مثال ─── */}
              {example && (
                <div className="bg-paper-100 p-3 rounded-sm border-r-4 border-gold-300">
                  <p className="text-xs text-navy-900/50 mb-1 font-mono">
                    Beispiel:
                  </p>
                  <p
                    className="text-sm text-navy-900 font-medium mb-1"
                    dir="ltr"
                  >
                    {example}
                  </p>
                  {exampleTranslation && exampleTranslation !== example && (
                    <p className="text-xs text-navy-900/60">
                      {exampleTranslation}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── دکمه‌ها ─── */}
        {revealed && (
          <div className="space-y-3">
            {/* ─── دکمه‌ی بلدم / بلد نیستم ─── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onAnswer(false)}
                className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition"
              >
                ✗ {labels.iDontKnow}
              </button>
              <button
                onClick={() => onAnswer(true)}
                className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-sm transition"
              >
                ✓ {labels.iKnow}
              </button>
            </div>

            {/* ─── دکمه‌ی تمرین اختیاری ─── */}
            {canPractice && exercise && (
              <button
                onClick={handleStartPractice}
                className="w-full py-2 bg-gold-300 hover:bg-gold-500 text-navy-900 font-bold rounded-sm transition text-sm border border-gold-500/40"
              >
                🎯 {labels.practiceOptional}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}