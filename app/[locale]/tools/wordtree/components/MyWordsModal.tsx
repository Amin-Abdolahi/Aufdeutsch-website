"use client";

/**
 * MyWordsModal — مشاهده‌ی همه‌ی کلمات (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این مودال، همه‌ی کلمات کاربر رو نشون می‌ده.
 * ۲. شامل: کلمات داخلی (builtin) + کلمات سفارشی (custom).
 * ۳. هر کلمه نشون می‌ده که توی کدوم درخت‌هاست.
 * ۴. کاربر می‌تونه جستجو کنه.
 * ۵. برای فاز بعد: فیلتر بر اساس دسته، ویرایش، حذف.
 */

import { useState, useMemo } from "react";
import { Word, Tree } from "@/lib/wordtree/types";

interface MyWordsModalProps {
  words: Word[];
  trees: Tree[];
  onClose: () => void;
  labels: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    totalWords: string;
    inTrees: string;
    noTrees: string;
    empty: string;
    noResults: string;
    close: string;
  };
}

export function MyWordsModal({
  words,
  trees,
  onClose,
  labels,
}: MyWordsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // ─── نگاشت treeId → tree ───
  const treeMap = useMemo(() => {
    const map: Record<string, Tree> = {};
    for (const tree of trees) {
      map[tree.id] = tree;
    }
    return map;
  }, [trees]);

  // ─── فیلتر کلمات ───
  const filteredWords = useMemo(() => {
    if (!searchQuery.trim()) return words;
    const q = searchQuery.toLowerCase().trim();
    return words.filter(
      (w) =>
        w.german.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
    );
  }, [words, searchQuery]);

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-panel-in border border-gold-300/30 flex flex-col">
        {/* ─── هدر ─── */}
        <div className="mb-4 text-center flex-shrink-0">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            📖 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">
            {labels.subtitle.replace("{count}", words.length.toString())}
          </p>
        </div>

        {/* ─── جستجو ─── */}
        <div className="mb-4 flex-shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full px-4 py-2 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm"
          />
        </div>

        {/* ─── لیست کلمات ─── */}
        <div className="flex-1 overflow-y-auto bg-white rounded-sm border border-navy-900/10 mb-4">
          {words.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-navy-900/60">{labels.empty}</p>
            </div>
          ) : filteredWords.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-navy-900/60">{labels.noResults}</p>
            </div>
          ) : (
            <div className="divide-y divide-navy-900/5">
              {filteredWords.map((word) => {
                const wordTrees = word.treeIds
                  .map((id) => treeMap[id])
                  .filter(Boolean);

                return (
                  <div key={word.id} className="p-3">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p
                        className="font-mono font-bold text-navy-900 text-sm truncate flex-1"
                        dir="ltr"
                      >
                        {word.german}
                      </p>
                      <span className="text-[10px] text-navy-900/40 font-mono flex-shrink-0">
                        {word.source === "custom" ? "✏️" : "📚"}
                      </span>
                    </div>
                    <p className="text-xs text-navy-900/60 mb-2 truncate">
                      {word.translation}
                    </p>

                    {/* ─── درخت‌ها ─── */}
                    {wordTrees.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {wordTrees.map((tree) => (
                          <span
                            key={tree.id}
                            className="inline-block text-[9px] bg-gold-300/40 text-navy-900 px-2 py-0.5 rounded-full border border-gold-500/30"
                          >
                            🌳 {tree.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-block text-[9px] bg-navy-900/5 text-navy-900/40 px-2 py-0.5 rounded-full">
                        {labels.noTrees}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── دکمه‌ی بستن ─── */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm flex-shrink-0"
        >
          {labels.close}
        </button>
      </div>
    </div>
  );
}