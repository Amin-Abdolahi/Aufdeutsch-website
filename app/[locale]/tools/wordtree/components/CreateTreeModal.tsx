"use client";

/**
 * CreateTreeModal — مودال ساخت درخت (نسخه ۲.۰)
 *
 * ⚠️ تغییرات نسخه ۲.۰:
 * - سه مرحله: انتخاب شکل → انتخاب اسم → انتخاب کلمات
 * - کاربر می‌تونه کلمات موجود رو انتخاب کنه
 * - کاربر می‌تونه بدون کلمه هم بسازه (بعداً اضافه کنه)
 */

import { useState, useMemo } from "react";
import { TreeVariant, Word } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";

interface CreateTreeModalProps {
  onClose: () => void;
  onCreate: (
    name: string,
    variant: TreeVariant,
    wordIds: string[]
  ) => { success: boolean; error?: string };
  availableWords: Word[];
  labels: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    variantLabel: string;
    wordsLabel: string;
    wordsSubtitle: string;
    wordsSelected: string;
    wordsSearch: string;
    wordsEmpty: string;
    wordsNoResults: string;
    create: string;
    cancel: string;
    next: string;
    back: string;
    skipWords: string;
    errorRequired: string;
    maxReached: string;
    variantOak: string;
    variantPine: string;
    variantPalm: string;
    variantBlossom: string;
    variantApple: string;
    variantLemon: string;
  };
}

const VARIANTS: { id: TreeVariant; icon: string; labelKey: string }[] = [
  { id: "oak", icon: "🌳", labelKey: "variantOak" },
  { id: "pine", icon: "🌲", labelKey: "variantPine" },
  { id: "palm", icon: "🌴", labelKey: "variantPalm" },
  { id: "blossom", icon: "🌸", labelKey: "variantBlossom" },
  { id: "apple", icon: "🍎", labelKey: "variantApple" },
  { id: "lemon", icon: "🍋", labelKey: "variantLemon" },
];

type Step = "info" | "words";

export function CreateTreeModal({
  onClose,
  onCreate,
  availableWords,
  labels,
}: CreateTreeModalProps) {
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [variant, setVariant] = useState<TreeVariant>("oak");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // ─── فیلتر کلمات ───
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return availableWords;
    const q = searchQuery.toLowerCase().trim();
    return availableWords.filter(
      (w) =>
        w.german.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
    );
  }, [availableWords, searchQuery]);

  // ─── رفتن به مرحله‌ی بعد ───
  const handleNext = () => {
    if (!name.trim()) {
      setError(labels.errorRequired);
      return;
    }
    setError("");
    setStep("words");
  };

  // ─── ساخت درخت ───
  const handleCreate = () => {
    if (!name.trim()) {
      setError(labels.errorRequired);
      setStep("info");
      return;
    }

    const result = onCreate(name.trim(), variant, selectedWordIds);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "خطا در ساخت درخت");
    }
  };

  // ─── انتخاب/لغو انتخاب کلمه ───
  const toggleWord = (wordId: string) => {
    setSelectedWordIds((prev) =>
      prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId]
    );
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-panel-in border border-gold-300/30 flex flex-col">
        {/* ─── مرحله ۱: اطلاعات ─── */}
        {step === "info" && (
          <>
            <div className="mb-6 text-center flex-shrink-0">
              <div className="text-5xl mb-3">🌳</div>
              <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
                {labels.title}
              </h2>
              <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
            </div>

            {/* ─── انتخاب شکل درخت ─── */}
            <div className="mb-4 flex-shrink-0">
              <label className="block text-sm font-bold text-navy-900/70 mb-2">
                {labels.variantLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {VARIANTS.map((v) => {
                  const isSelected = variant === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariant(v.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-gold-500 bg-gold-300/30 scale-105"
                          : "border-navy-900/10 bg-white hover:border-gold-400"
                      }`}
                    >
                      <div className="text-3xl mb-1">{v.icon}</div>
                      <div className="text-[10px] text-navy-900/70 font-mono truncate">
                        {(labels as any)[v.labelKey]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── اسم درخت ─── */}
            <div className="mb-4 flex-shrink-0">
              <label className="block text-sm font-bold text-navy-900/70 mb-2">
                {labels.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder={labels.namePlaceholder}
                className="w-full px-4 py-3 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4 flex-shrink-0">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition"
              >
                {labels.cancel}
              </button>
              <Button variant="primary" size="md" onClick={handleNext}>
                {labels.next}
              </Button>
            </div>
          </>
        )}

        {/* ─── مرحله ۲: انتخاب کلمات ─── */}
        {step === "words" && (
          <>
            <div className="mb-4 text-center flex-shrink-0">
              <h2 className="text-lg font-bold text-navy-900 font-mono mb-1">
                📚 {labels.wordsLabel}
              </h2>
              <p className="text-xs text-navy-900/60">
                {labels.wordsSubtitle}
              </p>
              <p className="text-[10px] text-gold-600 font-bold mt-1">
                {labels.wordsSelected.replace(
                  "{count}",
                  selectedWordIds.length.toString()
                )}
              </p>
            </div>

            {availableWords.length > 0 && (
              <div className="mb-3 flex-shrink-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={labels.wordsSearch}
                  className="w-full px-4 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm"
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto bg-white rounded-sm border border-navy-900/10 mb-4">
              {availableWords.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-navy-900/60">
                    {labels.wordsEmpty}
                  </p>
                </div>
              ) : filteredWords.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-navy-900/60">
                    {labels.wordsNoResults}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-navy-900/5">
                  {filteredWords.map((word) => {
                    const isSelected = selectedWordIds.includes(word.id);
                    return (
                      <button
                        key={word.id}
                        onClick={() => toggleWord(word.id)}
                        className={`w-full p-3 text-right flex items-center gap-3 transition ${
                          isSelected
                            ? "bg-gold-300/30"
                            : "hover:bg-navy-900/5"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-gold-500 border-gold-500"
                              : "border-navy-900/30"
                          }`}
                        >
                          {isSelected && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-mono font-bold text-navy-900 text-sm truncate"
                            dir="ltr"
                          >
                            {word.german}
                          </p>
                          <p className="text-xs text-navy-900/50 truncate">
                            {word.translation}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4 flex-shrink-0">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setStep("info")}
                className="py-3 px-4 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm"
              >
                ← {labels.back}
              </button>
              <Button variant="primary" size="md" onClick={handleCreate}>
                {selectedWordIds.length === 0
                  ? labels.skipWords
                  : `✓ ${labels.create} (${selectedWordIds.length})`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}