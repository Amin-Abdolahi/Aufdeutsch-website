"use client";

/**
 * AddWordModal — فرم افزودن کلمه‌ی سفارشی (نسخه ۱.۱)
 *
 * ⚠️ تغییرات نسخه ۱.۱:
 * - اضافه شدن `language: "de"` به کلمه‌ی جدید
 */

import { useState } from "react";
import { WordEntry, WordCategory, GermanLevel } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";

interface AddWordModalProps {
  onClose: () => void;
  onSave: (word: Omit<WordEntry, "source" | "createdAt">) => {
    success: boolean;
    error?: string;
  };
  labels: {
    title: string;
    germanLabel: string;
    germanPlaceholder: string;
    translationLabel: string;
    translationPlaceholder: string;
    categoryLabel: string;
    levelLabel: string;
    nounArticleLabel: string;
    nounPluralLabel: string;
    verbPraeteritumLabel: string;
    verbPerfektLabel: string;
    pronunciationLabel: string;
    pronunciationPlaceholder: string;
    exampleLabel: string;
    examplePlaceholder: string;
    exampleTranslationLabel: string;
    exampleTranslationPlaceholder: string;
    save: string;
    cancel: string;
    categories: {
      noun: string;
      verb: string;
      adjective: string;
      phrase: string;
      number: string;
      color: string;
    };
    errorRequired: string;
    rewardInfo: string;
  };
}

export function AddWordModal({ onClose, onSave, labels }: AddWordModalProps) {
  const [german, setGerman] = useState("");
  const [translation, setTranslation] = useState("");
  const [category, setCategory] = useState<WordCategory>("noun");
  const [level, setLevel] = useState<GermanLevel>("A1");
  const [article, setArticle] = useState<"der" | "die" | "das">("der");
  const [plural, setPlural] = useState("");
  const [praeteritum, setPraeteritum] = useState("");
  const [perfekt, setPerfekt] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [example, setExample] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!german.trim() || !translation.trim()) {
      setError(labels.errorRequired);
      return;
    }

    const newWord: Omit<WordEntry, "source" | "createdAt"> = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      language: "de",
      level,
      category,
      translations: {
        de: german.trim(),
        fa: translation.trim(),
        en: translation.trim(),
      },
    };

    if (category === "noun") {
      newWord.noun = { article, plural: plural.trim() || "-" };
    } else if (category === "verb") {
      newWord.verb = {
        praeteritum: praeteritum.trim() || "-",
        perfekt: perfekt.trim() || "-",
        auxiliary: "haben",
      };
    }

    if (pronunciation.trim()) {
      newWord.pronunciation = { persian: pronunciation.trim() };
    }

    if (example.trim()) {
      newWord.example = {
        de: example.trim(),
        translations: {
          de: example.trim(),
          fa: exampleTranslation.trim() || example.trim(),
          en: exampleTranslation.trim() || example.trim(),
        },
      };
    }

    const result = onSave(newWord);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "خطا در ذخیره");
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            ➕ {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{labels.rewardInfo}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-navy-900/70 mb-1">
              {labels.germanLabel} *
            </label>
            <input
              type="text"
              value={german}
              onChange={(e) => setGerman(e.target.value)}
              placeholder={labels.germanPlaceholder}
              className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy-900/70 mb-1">
              {labels.translationLabel} *
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder={labels.translationPlaceholder}
              className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-navy-900/70 mb-1">
                {labels.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WordCategory)}
                className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
              >
                <option value="noun">{labels.categories.noun}</option>
                <option value="verb">{labels.categories.verb}</option>
                <option value="adjective">{labels.categories.adjective}</option>
                <option value="phrase">{labels.categories.phrase}</option>
                <option value="number">{labels.categories.number}</option>
                <option value="color">{labels.categories.color}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-navy-900/70 mb-1">
                {labels.levelLabel}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as GermanLevel)}
                className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>
          </div>

          {category === "noun" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-navy-900/70 mb-1">
                  {labels.nounArticleLabel}
                </label>
                <select
                  value={article}
                  onChange={(e) =>
                    setArticle(e.target.value as "der" | "die" | "das")
                  }
                  className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
                  dir="ltr"
                >
                  <option value="der">der</option>
                  <option value="die">die</option>
                  <option value="das">das</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900/70 mb-1">
                  {labels.nounPluralLabel}
                </label>
                <input
                  type="text"
                  value={plural}
                  onChange={(e) => setPlural(e.target.value)}
                  placeholder="die ..."
                  className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {category === "verb" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-navy-900/70 mb-1">
                  {labels.verbPraeteritumLabel}
                </label>
                <input
                  type="text"
                  value={praeteritum}
                  onChange={(e) => setPraeteritum(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy-900/70 mb-1">
                  {labels.verbPerfektLabel}
                </label>
                <input
                  type="text"
                  value={perfekt}
                  onChange={(e) => setPerfekt(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-navy-900/70 mb-1">
              {labels.pronunciationLabel}
            </label>
            <input
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder={labels.pronunciationPlaceholder}
              className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-bold text-navy-900/70 mb-1">
                {labels.exampleLabel}
              </label>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder={labels.examplePlaceholder}
                className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy-900/70 mb-1">
                {labels.exampleTranslationLabel}
              </label>
              <input
                type="text"
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                placeholder={labels.exampleTranslationPlaceholder}
                className="w-full px-3 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onClose}
            className="py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition"
          >
            {labels.cancel}
          </button>
          <Button variant="primary" size="md" onClick={handleSave}>
            {labels.save}
          </Button>
        </div>
      </div>
    </div>
  );
}