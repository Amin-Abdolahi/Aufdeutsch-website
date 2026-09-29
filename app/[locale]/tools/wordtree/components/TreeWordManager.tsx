"use client";

/**
 * TreeWordManager — مدیریت کلمات درخت (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این مودال، کلمات یه درخت رو مدیریت می‌کنه.
 * ۲. دو بخش داره:
 *    - «کلمات این درخت»: کلماتی که توی این درختن (قابل حذف)
 *    - «کلمات موجود»: کلماتی که توی این درخت نیستن (قابل اضافه)
 * ۳. کاربر می‌تونه چند کلمه رو انتخاب کنه.
 * ۴. فیلتر بر اساس دسته (اسم، فعل، صفت، ...).
 */

import { useState, useMemo } from "react";
import { Word, WordCategory } from "@/lib/wordtree/types";

interface TreeWordManagerProps {
  treeId: string;
  treeName: string;
  treeWords: Word[];
  availableWords: Word[];
  onClose: () => void;
  onAddWords: (wordIds: string[]) => void;
  onRemoveWords: (wordIds: string[]) => void;
  labels: {
    title: string;
    subtitle: string;
    inTree: string;
    available: string;
    addSelected: string;
    removeSelected: string;
    selectAll: string;
    deselectAll: string;
    noWords: string;
    noAvailable: string;
    close: string;
    // ─── دسته‌ها ───
    categoryAll: string;
    categoryNoun: string;
    categoryVerb: string;
    categoryAdjective: string;
    categoryPhrase: string;
    categoryNumber: string;
    categoryColor: string;
  };
}

type TabType = "inTree" | "available";

export function TreeWordManager({
  treeId,
  treeName,
  treeWords,
  availableWords,
  onClose,
  onAddWords,
  onRemoveWords,
  labels,
}: TreeWordManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<WordCategory | "all">(
    "all"
  );

  // ─── کلمات فیلترشده ───
  const currentWords = activeTab === "inTree" ? treeWords : availableWords;

  const filteredWords = useMemo(() => {
    if (categoryFilter === "all") return currentWords;

    // ⚠️ فعلاً Word.category نداره، پس از german استنتاج می‌کنیم
    // برای MVP، فیلتر بر اساس دسته رو غیرفعال می‌کنیم
    return currentWords;
  }, [currentWords, categoryFilter]);

  // ─── انتخاب/لغو انتخاب ───
  const toggleWord = (wordId: string) => {
    setSelectedWordIds((prev) =>
      prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId]
    );
  };

  const selectAll = () => {
    setSelectedWordIds(filteredWords.map((w) => w.id));
  };

  const deselectAll = () => {
    setSelectedWordIds([]);
  };

  // ─── اضافه/حذف ───
  const handleAction = () => {
    if (selectedWordIds.length === 0) return;

    if (activeTab === "available") {
      onAddWords(selectedWordIds);
      setSelectedWordIds([]);
      setActiveTab("inTree");
    } else {
      onRemoveWords(selectedWordIds);
      setSelectedWordIds([]);
      setActiveTab("available");
    }
  };

  // ─── تغییر تب → پاک کردن انتخاب ───
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedWordIds([]);
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-panel-in border border-gold-300/30 flex flex-col">
        {/* ─── هدر ─── */}
        <div className="mb-4 text-center flex-shrink-0">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            📚 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{treeName}</p>
        </div>

        {/* ─── تب‌ها ─── */}
        <div className="flex gap-2 mb-4 bg-navy-900/5 p-1 rounded-sm flex-shrink-0">
          <button
            onClick={() => handleTabChange("inTree")}
            className={`flex-1 py-2 text-xs font-bold rounded-sm transition ${
              activeTab === "inTree"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-900/60 hover:text-navy-900"
            }`}
          >
            ✓ {labels.inTree} ({treeWords.length})
          </button>
          <button
            onClick={() => handleTabChange("available")}
            className={`flex-1 py-2 text-xs font-bold rounded-sm transition ${
              activeTab === "available"
                ? "bg-white text-navy-900 shadow-sm"
                : "text-navy-900/60 hover:text-navy-900"
            }`}
          >
            ➕ {labels.available} ({availableWords.length})
          </button>
        </div>

        {/* ─── دکمه‌های انتخاب همه ─── */}
        {filteredWords.length > 0 && (
          <div className="flex gap-2 mb-3 flex-shrink-0">
            <button
              onClick={selectAll}
              className="text-[10px] text-navy-900/60 hover:text-navy-900 underline"
            >
              {labels.selectAll}
            </button>
            <button
              onClick={deselectAll}
              className="text-[10px] text-navy-900/60 hover:text-navy-900 underline"
            >
              {labels.deselectAll}
            </button>
          </div>
        )}

        {/* ─── لیست کلمات ─── */}
        <div className="flex-1 overflow-y-auto bg-white rounded-sm border border-navy-900/10 mb-4">
          {filteredWords.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-navy-900/60">
                {activeTab === "inTree"
                  ? labels.noWords
                  : labels.noAvailable}
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
                    {/* ─── چک‌باکس ─── */}
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

                    {/* ─── محتوا ─── */}
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

        {/* ─── دکمه‌ها ─── */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm"
          >
            {labels.close}
          </button>
          <button
            onClick={handleAction}
            disabled={selectedWordIds.length === 0}
            className={`flex-1 py-3 font-bold rounded-sm transition text-sm ${
              selectedWordIds.length === 0
                ? "bg-navy-900/10 text-navy-900/30 cursor-not-allowed"
                : activeTab === "available"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {activeTab === "available"
              ? `➕ ${labels.addSelected} (${selectedWordIds.length})`
              : `🗑 ${labels.removeSelected} (${selectedWordIds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}