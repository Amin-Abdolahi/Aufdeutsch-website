"use client";

/**
 * GardenView — صفحه‌ی باغچه‌ها (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این صفحه، لیست باغچه‌ها رو نشون می‌ده.
 * ۲. هر باغچه یه کارت با اسم، تم، و تعداد درخت‌ها.
 * ۳. کاربر می‌تونه روی هر کارت کلیک کنه → صفحه‌ی درخت‌های باغچه.
 * ۴. دکمه‌ی «➕ باغچه‌ی جدید» → `CreatePlotModal`.
 */

import { useState } from "react";
import { Plot } from "@/lib/wordtree/types";

interface GardenViewProps {
  plots: Plot[];
  onOpenPlot: (plotId: string) => void;
  onCreatePlot: () => void;
  onOpenSettings: () => void;
  coins: number;
  labels: {
    title: string;
    subtitle: string;
    createPlot: string;
    treesCount: string;
    wordsCount: string;
    empty: string;
    settings: string;
  };
}

export function GardenView({
  plots,
  onOpenPlot,
  onCreatePlot,
  onOpenSettings,
  coins,
  labels,
}: GardenViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-paper-100 to-emerald-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ─── هدر ─── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 font-mono">
              🌿 {labels.title}
            </h1>
            <p className="text-xs text-navy-900/60 mt-1">{labels.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-br from-gold-300 to-gold-500/80 border border-gold-500/40 px-3 py-1.5 rounded-full shadow-md">
              <span className="text-base">🪙</span>
              <span className="font-mono font-bold text-navy-900 text-sm">
                {coins}
              </span>
            </div>
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-navy-900/10 hover:bg-navy-900/20 transition text-navy-900 text-lg"
              aria-label="تنظیمات"
              title="تنظیمات"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* ─── لیست باغچه‌ها ─── */}
        {plots.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🌱</div>
            <p className="text-navy-900/60 text-sm">{labels.empty}</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {plots.map((plot) => {
              const treesCount = plot.trees.length;
              const wordsCount = plot.trees.reduce(
                (sum, tree) => sum + tree.totalWords,
                0
              );

              return (
                <button
                  key={plot.id}
                  onClick={() => onOpenPlot(plot.id)}
                  className="group bg-white p-5 rounded-xl border-2 border-navy-900/10 hover:border-gold-400 hover:shadow-xl transition-all text-right flex items-start gap-4"
                >
                  {/* ─── آیکون تم ─── */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center text-3xl">
                    🌿
                  </div>

                  {/* ─── محتوا ─── */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy-900 mb-2 truncate">
                      {plot.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-[11px] text-navy-900/60 font-mono">
                      <span>
                        🌳{" "}
                        {labels.treesCount.replace(
                          "{count}",
                          treesCount.toString()
                        )}
                      </span>
                      <span>
                        📚{" "}
                        {labels.wordsCount.replace(
                          "{count}",
                          wordsCount.toString()
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ─── فلش ─── */}
                  <span className="text-navy-900/30 group-hover:text-gold-500 transition text-xl">
                    ‹
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ─── دکمه‌ی باغچه‌ی جدید ─── */}
        <button
          onClick={onCreatePlot}
          className="mt-4 w-full py-4 bg-gradient-to-br from-gold-300 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gold-500/40 flex items-center justify-center gap-2"
        >
          <span className="text-xl">➕</span>
          <span>{labels.createPlot}</span>
        </button>
      </div>
    </div>
  );
}