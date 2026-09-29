"use client";

/**
 * WateringPanel — پنل آبیاری (نسخه ۲.۰)
 *
 * این پنل وقتی باز می‌شه که کاربر دکمه‌ی آبیاری رو می‌زنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 * - `example`: مثال آلمانی
 * - `exampleTranslation`: ترجمه‌ی مثال به زبان کاربر
 */

import { useState } from "react";
import { WordCard } from "./WordCard";

interface WordItem {
  id: string;
  german: string;
  translation: string;
  example?: string;
  exampleTranslation?: string;
}

interface WateringPanelProps {
  words: WordItem[];
  onComplete: (learnedWordIds: string[]) => void;
  labels: {
    title: string;
    subtitle: string;
    learned: string;
    example: string;
    finish: string;
  };
}

export function WateringPanel({
  words,
  onComplete,
  labels,
}: WateringPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);

  const currentWord = words[currentIndex];
  const isLast = currentIndex === words.length - 1;

  const handleLearned = () => {
    const newLearnedIds = [...learnedIds, currentWord.id];
    setLearnedIds(newLearnedIds);

    if (isLast) {
      onComplete(newLearnedIds);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
<div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full animate-panel-in border border-gold-300/30">        {/* هدر */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            💧 {labels.title}
          </h2>
          <p className="text-sm text-navy-900/60">{labels.subtitle}</p>
          <div className="mt-3 flex justify-center gap-1">
            {words.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx <= currentIndex ? "bg-gold-300" : "bg-navy-900/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* کارت کلمه */}
        <WordCard
          german={currentWord.german}
          translation={currentWord.translation}
          example={currentWord.example}
          exampleTranslation={currentWord.exampleTranslation}
          onLearned={handleLearned}
          learnedLabel={isLast ? labels.finish : labels.learned}
          exampleLabel={labels.example}
        />

        {/* شمارنده */}
        <p className="text-center text-xs text-navy-900/50 mt-4 font-mono">
          {currentIndex + 1} / {words.length}
        </p>
      </div>
    </div>
  );
}