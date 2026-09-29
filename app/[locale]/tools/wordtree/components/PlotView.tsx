"use client";

/**
 * PlotView — صفحه‌ی درخت‌های یه باغچه (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این صفحه، درخت‌های یه باغچه رو نشون می‌ده.
 * ۲. هر درخت یه کارت با اسم، شکل، و تعداد کلمه.
 * ۳. کاربر روی هر کارت کلیک می‌کنه → صفحه‌ی درخت (Tree View).
 * ۴. دکمه‌ی «➕ درخت جدید» → `CreateTreeModal`.
 * ۵. دکمه‌ی بازگشت به باغ (Garden).
 */

import { Plot, Tree } from "@/lib/wordtree/types";

interface PlotViewProps {
  plot: Plot;
  coins: number;
  onOpenTree: (treeId: string) => void;
  onCreateTree: () => void;
  onBackToGarden: () => void;
  labels: {
    treesCount: string;
    wordsCount: string;
    createTree: string;
    empty: string;
    backToGarden: string;
    progress: string;
  };
}

/**
 * آیکون درخت بر اساس variant.
 */
const VARIANT_ICONS: Record<string, string> = {
  oak: "🌳",
  pine: "🌲",
  palm: "🌴",
  blossom: "🌸",
  apple: "🍎",
  lemon: "🍋",
};

export function PlotView({
  plot,
  coins,
  onOpenTree,
  onCreateTree,
  onBackToGarden,
  labels,
}: PlotViewProps) {
  const totalWords = plot.trees.reduce(
    (sum, tree) => sum + tree.totalWords,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-paper-100 to-emerald-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ─── هدر ─── */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackToGarden}
            className="text-navy-900/60 hover:text-navy-900 transition text-sm font-mono flex items-center gap-1"
          >
            <span>←</span>
            <span>{labels.backToGarden}</span>
          </button>
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-br from-gold-300 to-gold-500/80 border border-gold-500/40 px-3 py-1.5 rounded-full shadow-md">
            <span className="text-base">🪙</span>
            <span className="font-mono font-bold text-navy-900 text-sm">
              {coins}
            </span>
          </div>
        </div>

        {/* ─── اطلاعات باغچه ─── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 font-mono mb-2">
            🌿 {plot.name}
          </h1>
          <div className="flex justify-center gap-4 text-xs text-navy-900/60 font-mono">
            <span>
              🌳{" "}
              {labels.treesCount.replace(
                "{count}",
                plot.trees.length.toString()
              )}
            </span>
            <span>
              📚{" "}
              {labels.wordsCount.replace(
                "{count}",
                totalWords.toString()
              )}
            </span>
          </div>
        </div>

        {/* ─── لیست درخت‌ها ─── */}
        {plot.trees.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-50">🌱</div>
            <p className="text-navy-900/60 text-sm">{labels.empty}</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {plot.trees.map((tree) => (
              <TreeCard
                key={tree.id}
                tree={tree}
                onClick={() => onOpenTree(tree.id)}
                labels={{
                  wordsCount: labels.wordsCount,
                  progress: labels.progress,
                }}
              />
            ))}
          </div>
        )}

        {/* ─── دکمه‌ی درخت جدید ─── */}
        <button
          onClick={onCreateTree}
          className="mt-4 w-full py-4 bg-gradient-to-br from-gold-300 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-gold-500/40 flex items-center justify-center gap-2"
        >
          <span className="text-xl">➕</span>
          <span>{labels.createTree}</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// کارت درخت
// ─────────────────────────────────────────────────────────────

function TreeCard({
  tree,
  onClick,
  labels,
}: {
  tree: Tree;
  onClick: () => void;
  labels: {
    wordsCount: string;
    progress: string;
  };
}) {
  const icon = VARIANT_ICONS[tree.variant] || "🌳";

  // ─── درصد پیشرفت ───
  const progressPercent = Math.min(
    (tree.totalWords / 50) * 100,
    100
  );

  return (
    <button
      onClick={onClick}
      className="group bg-white p-4 rounded-xl border-2 border-navy-900/10 hover:border-gold-400 hover:shadow-xl transition-all text-center"
    >
      {/* ─── آیکون درخت ─── */}
      <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      {/* ─── اسم درخت ─── */}
      <h3 className="font-bold text-navy-900 text-sm mb-2 truncate">
        {tree.name}
      </h3>

      {/* ─── تعداد کلمه ─── */}
      <p className="text-[10px] text-navy-900/60 font-mono mb-2">
        {labels.wordsCount.replace(
          "{count}",
          tree.totalWords.toString()
        )}
      </p>

      {/* ─── نوار پیشرفت ─── */}
      <div className="w-full bg-navy-900/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </button>
  );
}