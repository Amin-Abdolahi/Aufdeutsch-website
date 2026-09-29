"use client";

import { useState } from "react";

interface WordCardProps {
  german: string;
  translation: string;
  example?: string;
  onLearned: () => void;
  learnedLabel: string;
  exampleLabel: string;
}

export function WordCard({
  german,
  translation,
  example,
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
              <p className="text-sm text-navy-900/80">{example}</p>
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