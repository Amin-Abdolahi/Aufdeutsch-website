"use client";

/**
 * HarvestPanel — پنل چیدن میوه (نسخه ۳.۰)
 *
 * این پنل وقتی باز می‌شه که کاربر روی یه میوه کلیک می‌کنه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. اطلاعات گرامری بر اساس نوع کلمه نمایش داده می‌شه:
 *    - اسم (noun): جنسیت (der/die/das) + جمع
 *    - فعل (verb): Präteritum + Perfekt
 *    - صفت (adjective): بدون اطلاعات گرامری
 *
 * ۲. برای فاز ۳ (تلفظ صوتی)، `pronunciation.audioUrl` اضافه می‌شه.
 */

import { useState } from "react";
import { WordEntry } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";

interface HarvestPanelProps {
  wordEntry: WordEntry;
  locale: Locale;
  onAnswer: (remembered: boolean) => void;
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
  };
}

export function HarvestPanel({
  wordEntry,
  locale,
  onAnswer,
  labels,
}: HarvestPanelProps) {
  const [revealed, setRevealed] = useState(false);

  const german = wordEntry.translations.de;
  const translation =
    wordEntry.translations[locale] || wordEntry.translations.fa;
  const example = wordEntry.example?.de;
  const exampleTranslation =
    wordEntry.example?.translations?.[locale] || wordEntry.example?.de;

  const hasGrammar = wordEntry.noun || wordEntry.verb;

  return (
    <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-sm shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

          {/* تلفظ فارسی‌نویسی */}
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
              {/* ترجمه */}
              <p className="text-lg text-navy-900 text-center font-bold">
                {translation}
              </p>

              {/* اطلاعات گرامری */}
              {hasGrammar && (
                <div className="bg-navy-900/5 p-3 rounded-sm">
                  <p className="text-xs text-navy-900/50 mb-2 font-mono">
                    {labels.grammar}
                  </p>

                  {/* اسم */}
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

                  {/* فعل */}
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

              {/* مثال آلمانی */}
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