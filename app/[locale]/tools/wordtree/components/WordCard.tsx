"use client";

/**
 * WordCard — کارت کلمه (نسخه ۲.۰)
 *
 * این کامپوننت، یه کلمه رو با معنی و مثال نشون می‌ده.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 * - `example`: مثال آلمانی
 * - `exampleTranslation`: ترجمه‌ی مثال
 * - برای فاز ۳ (تلفظ صوتی)، دکمه‌ی پخش صدا اضافه می‌شه.
 */

import { useState } from "react";

interface WordCardProps {
  german: string;
  translation: string;
  example?: string;
  exampleTranslation?: string;
  onLearned: () => void;
  learnedLabel: string;
  exampleLabel: string;
}

export function WordCard({
  german,
  translation,
  example,
  exampleTranslation,
  onLearned,
  learnedLabel,
  exampleLabel,
}: WordCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-white p-6 shadow-md rounded-sm border border-navy-900/10 w-full">
      {/* کلمه‌ی آلمانی */}
      <div className="text-center mb-4">
        <p className="text-2xl font-bold text-navy-900 font-mono">
          {german}
        </p>
      </div>

      {/* معنی - فقط بعد از کلیک نشون داده می‌شه */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 text-navy-900/60 border border-dashed border-navy-900/30 rounded-sm hover:bg-navy-900/5 transition"
        >
          👁 نمایش معنی
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg text-navy-900">{translation}</p>
          </div>

          {example && (
            <div className="bg-paper-100 p-3 rounded-sm border-r-4 border-gold-300">
              <p className="text-xs text-navy-900/50 mb-1 font-mono">
                {exampleLabel}
              </p>
              {/* مثال آلمانی */}
              <p className="text-sm text-navy-900 font-medium mb-1" dir="ltr">
                {example}
              </p>
              {/* ترجمه‌ی مثال */}
              {exampleTranslation && exampleTranslation !== example && (
                <p className="text-xs text-navy-900/60">
                  {exampleTranslation}
                </p>
              )}
            </div>
          )}

          <button
            onClick={onLearned}
            className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-paper-100 font-bold rounded-sm transition"
          >
            ✓ {learnedLabel}
          </button>
        </div>
      )}
    </div>
  );
}