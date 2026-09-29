"use client";

import { useState } from "react";

interface HarvestPanelProps {
  german: string;
  translation: string;
  example?: string;
  onAnswer: (remembered: boolean) => void;
  labels: {
    title: string;
    question: string;
    remembered: string;
    forgot: string;
    reveal: string;
  };
}

export function HarvestPanel({
  german,
  translation,
  example,
  onAnswer,
  labels,
}: HarvestPanelProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-sm shadow-2xl max-w-md w-full">
        {/* هدر */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            🍎 {labels.title}
          </h2>
          <p className="text-sm text-navy-900/60">{labels.question}</p>
        </div>

        {/* کلمه‌ی آلمانی */}
        <div className="bg-white p-6 rounded-sm border border-navy-900/10 mb-4">
          <p className="text-3xl font-bold text-navy-900 font-mono text-center mb-2">
            {german}
          </p>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full mt-4 py-3 text-navy-900/60 border border-dashed border-navy-900/30 rounded-sm hover:bg-navy-900/5 transition"
            >
              👁 {labels.reveal}
            </button>
          ) : (
            <div className="space-y-3 mt-4">
              <p className="text-lg text-navy-900 text-center">{translation}</p>
              {example && (
                <div className="bg-paper-100 p-3 rounded-sm border-r-4 border-gold-300">
                  <p className="text-sm text-navy-900/80">{example}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* دکمه‌ها - فقط بعد از دیدن معنی */}
        {revealed && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnswer(false)}
              className="py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition"
            >
              ✗ {labels.forgot}
            </button>
            <button
              onClick={() => onAnswer(true)}
              className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-sm transition"
            >
              ✓ {labels.remembered}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}