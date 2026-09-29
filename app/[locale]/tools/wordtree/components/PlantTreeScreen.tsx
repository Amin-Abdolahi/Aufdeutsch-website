"use client";

/**
 * PlantTreeScreen — صفحه‌ی کاشت درخت (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این صفحه وقتی نشون داده می‌شه که کاربر هنوز درخت نکاشته.
 * ۲. کاربر از بین انواع درخت (مثلاً «آلمانی پیش‌فرض») یکی رو انتخاب می‌کنه.
 * ۳. بعد از انتخاب، دکمه‌ی «بکار» فعال می‌شه.
 * ۴. برای اضافه کردن نوع درخت جدید، `TREE_TYPES` توی `constants.ts` رو آپدیت کن.
 */

import { useState } from "react";
import { TREE_TYPES } from "@/lib/wordtree/constants";

interface PlantTreeScreenProps {
  onPlant: (treeTypeId: string) => void;
  labels: {
    welcome: string;
    subtitle: string;
    selectTree: string;
    treeTypeDefault: string;
    treeTypeDefaultDesc: string;
    plantButton: string;
    wordsCount: string;
  };
}

export function PlantTreeScreen({ onPlant, labels }: PlantTreeScreenProps) {
  const [selectedTreeType, setSelectedTreeType] = useState<string>(
    TREE_TYPES[0].id
  );

  const handlePlant = () => {
    onPlant(selectedTreeType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full">
        {/* ─── پس‌زمینه‌ی تزئینی ─── */}
        <div className="text-center mb-8">
          {/* ─── ایموجی درخت بزرگ ─── */}
          <div className="text-8xl mb-4 animate-pulse-slow">🌱</div>

          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-mono mb-3">
            {labels.welcome}
          </h1>
          <p className="text-sm md:text-base text-navy-900/70 leading-relaxed max-w-md mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* ─── انتخاب نوع درخت ─── */}
        <div className="bg-paper-100 p-6 rounded-2xl shadow-xl border border-gold-300/30 mb-6">
          <h2 className="text-lg font-bold text-navy-900 font-mono text-center mb-4">
            🌳 {labels.selectTree}
          </h2>

          <div className="space-y-3">
            {TREE_TYPES.map((treeType) => {
              const isSelected = selectedTreeType === treeType.id;
              const name = (labels as any)[treeType.nameKey] || treeType.nameKey;
              const desc =
                (labels as any)[treeType.descKey] || treeType.descKey;

              return (
                <button
                  key={treeType.id}
                  onClick={() => setSelectedTreeType(treeType.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-right flex items-start gap-3 ${
                    isSelected
                      ? "border-gold-500 bg-gold-300/30 scale-[1.02] shadow-md"
                      : "border-navy-900/10 bg-white hover:border-gold-400 hover:bg-gold-300/10"
                  }`}
                >
                  <span className="text-3xl flex-shrink-0">
                    {treeType.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-navy-900 mb-1">{name}</p>
                    <p className="text-xs text-navy-900/60 mb-2">{desc}</p>
                    <p className="text-[10px] text-navy-900/40 font-mono">
                      {labels.wordsCount.replace(
                        "{count}",
                        treeType.wordCount.toString()
                      )}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-gold-500 text-xl flex-shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── دکمه‌ی کاشت ─── */}
        <button
          onClick={handlePlant}
          className="w-full py-4 bg-gradient-to-br from-gold-300 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg border border-gold-500/40"
        >
          🌳 {labels.plantButton}
        </button>

        {/* ─── راهنمای کوچیک ─── */}
        <p className="text-center text-xs text-navy-900/50 mt-4">
          ⓘ هر روز از درختت مراقبت کن تا رشد کنه
        </p>
      </div>
    </div>
  );
}