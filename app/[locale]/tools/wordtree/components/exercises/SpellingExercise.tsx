"use client";

/**
 * SpellingExercise — تمرین املا (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این کامپوننت، یه تمرین املا رو نشون می‌ده.
 * ۲. کاربر باید حروف گم‌شده رو از بین گزینه‌ها انتخاب کنه.
 * ۳. برای هر حرف گم‌شده، یه ردیف گزینه داریم.
 * ۴. بعد از انتخاب همه‌ی حروف، دکمه‌ی «تأیید» فعال می‌شه.
 * ۵. اگه جواب درست بود → پیام موفقیت + ادامه.
 * ۶. اگه جواب اشتباه بود → یه فرصت دوباره.
 */

import { useState } from "react";
import { Exercise } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";

interface SpellingExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  labels: {
    title: string;
    hint: string;
    confirm: string;
    correct: string;
    wrong: string;
    tryAgain: string;
    showAnswer: string;
  };
}

export function SpellingExercise({
  exercise,
  onComplete,
  labels,
}: SpellingExerciseProps) {
  // ─── تجزیه‌ی questionText به بخش‌ها ───
  // مثلاً "d_r M_nn" → ["d", "_", "r", " ", "M", "_", "n", "n"]
  const characters = exercise.questionText.split("");

  // ─── پیدا کردن موقعیت حروف گم‌شده ───
  const blankPositions = characters
    .map((char, idx) => (char === "_" ? idx : -1))
    .filter((idx) => idx !== -1);

  // ─── حروف درست (به ترتیب) ───
  const correctLetters = exercise.hint?.split("") || [];

  // ─── گزینه‌ها برای هر حرف ───
  // ⚠️ فعلاً همه‌ی گزینه‌ها رو یه بار تولید می‌کنیم
  // (هر حرف گم‌شده، ۴ گزینه داره)
  const optionsPerBlank = 4;
  const options: string[][] = blankPositions.map((_, blankIdx) => {
    const correctLetter = correctLetters[blankIdx];
    const wrongOptions = exercise.options
      ?.filter((o) => o.toLowerCase() !== correctLetter.toLowerCase())
      .slice(0, optionsPerBlank - 1) || [];

    // ترکیب درست + غلط، بعد شافل
    const all = [correctLetter, ...wrongOptions];
    // شافل ساده
    return all.sort(() => Math.random() - 0.5);
  });

  // ─── state: حروف انتخاب‌شده ───
  const [selectedLetters, setSelectedLetters] = useState<(string | null)[]>(
    new Array(blankPositions.length).fill(null)
  );
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // ─── انتخاب یه حرف ───
  const handleSelectLetter = (blankIndex: number, letter: string) => {
    if (result === "correct") return;
    const updated = [...selectedLetters];
    updated[blankIndex] = letter;
    setSelectedLetters(updated);
    setResult(null);
  };

  // ─── بررسی جواب ───
  const handleConfirm = () => {
    if (selectedLetters.some((l) => l === null)) return;

    // چک کردن همه‌ی حروف
    const allCorrect = selectedLetters.every(
      (letter, idx) =>
        letter?.toLowerCase() === correctLetters[idx]?.toLowerCase()
    );

    if (allCorrect) {
      setResult("correct");
      setTimeout(() => {
        onComplete(true);
      }, 1200);
    } else {
      setResult("wrong");
      setAttemptCount(attemptCount + 1);
    }
  };

  // ─── نمایش جواب ───
  const handleShowAnswer = () => {
    setSelectedLetters(correctLetters);
    setShowAnswer(true);
    setResult("wrong");
  };

  // ─── ادامه بعد از جواب اشتباه ───
  const handleContinue = () => {
    onComplete(false);
  };

  // ─── ساخت متن نمایشی ───
  // ⚠️ حروف انتخاب‌شده رو توی جای خالی می‌ذاریم
  const displayCharacters = characters.map((char, idx) => {
    const blankIdx = blankPositions.indexOf(idx);
    if (blankIdx === -1) return { char, isBlank: false, blankIdx: -1 };

    const selected = selectedLetters[blankIdx];
    return {
      char: selected || "_",
      isBlank: true,
      blankIdx,
    };
  });

  return (
    <div className="space-y-4">
      {/* ─── عنوان ─── */}
      <div className="text-center">
        <p className="text-xs text-navy-900/50 font-mono mb-2">
          {labels.title}
        </p>
      </div>

      {/* ─── کلمه با حروف گم‌شده ─── */}
      <div className="bg-white p-6 rounded-sm border border-navy-900/10">
        <div
          className="text-center font-mono text-3xl font-bold text-navy-900"
          dir="ltr"
        >
          {displayCharacters.map((item, idx) => {
            if (!item.isBlank) {
              return <span key={idx}>{item.char}</span>;
            }
            const isSelected = item.char !== "_";
            const isCorrect =
              result === "correct" ||
              (showAnswer &&
                item.char.toLowerCase() ===
                  correctLetters[item.blankIdx]?.toLowerCase());
            return (
              <span
                key={idx}
                className={`inline-block mx-0.5 ${
                  isSelected
                    ? isCorrect
                      ? "text-green-600"
                      : "text-red-600"
                    : "text-navy-900/30"
                }`}
              >
                {item.char}
              </span>
            );
          })}
        </div>
      </div>

      {/* ─── گزینه‌ها ─── */}
      {!showAnswer && result !== "correct" && (
        <div className="space-y-3">
          {blankPositions.map((_, blankIdx) => (
            <div
              key={blankIdx}
              className="flex items-center gap-2 justify-center flex-wrap"
            >
              <span className="text-xs text-navy-900/50 font-mono ml-2">
                {blankIdx + 1}:
              </span>
              {options[blankIdx]?.map((letter, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelectLetter(blankIdx, letter)}
                  disabled={result === "wrong" && attemptCount >= 2}
                  className={`w-12 h-12 rounded-full border-2 font-mono text-xl font-bold transition-all ${
                    selectedLetters[blankIdx] === letter
                      ? "bg-gold-300 border-gold-500 text-navy-900 scale-110"
                      : "bg-white border-navy-900/20 text-navy-900 hover:border-gold-400 hover:bg-gold-300/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ─── پیام نتیجه ─── */}
      {result === "correct" && (
        <div className="bg-green-50 border border-green-300 rounded-sm p-4 text-center animate-panel-in">
          <p className="text-green-700 font-bold text-lg">
            ✓ {labels.correct}
          </p>
        </div>
      )}

      {result === "wrong" && !showAnswer && attemptCount >= 2 && (
        <div className="bg-red-50 border border-red-300 rounded-sm p-4 text-center animate-panel-in">
          <p className="text-red-700 font-bold mb-2">{labels.wrong}</p>
          <p className="text-sm text-red-600 mb-3">{labels.tryAgain}</p>
          <button
            onClick={handleShowAnswer}
            className="text-sm text-navy-900/70 underline"
          >
            {labels.showAnswer}
          </button>
        </div>
      )}

      {/* ─── دکمه‌ها ─── */}
      {result !== "correct" && !showAnswer && attemptCount < 2 && (
        <div className="flex justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleConfirm}
            disabled={selectedLetters.some((l) => l === null)}
          >
            {labels.confirm}
          </Button>
        </div>
      )}

      {showAnswer && (
        <div className="flex justify-center">
          <Button variant="secondary" size="md" onClick={handleContinue}>
            {labels.confirm}
          </Button>
        </div>
      )}
    </div>
  );
}