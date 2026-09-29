"use client";

/**
 * Tree — کامپوننت درخت (نسخه ۷.۰ — موقعیت تصادفی میوه‌ها)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. میوه‌ها **داخل خود SVG** رسم می‌شن.
 *
 * ۲. موقعیت میوه‌ها **تصادفی** و **داخل تاج درخت** محاسبه می‌شه:
 *    - برای هر سطح، یه مرکز و شعاع داریم.
 *    - با استفاده از مختصات قطبی (زاویه + فاصله)، موقعیت میوه ساخته می‌شه.
 *    - الگوریتم از افتادن میوه‌ها روی هم جلوگیری می‌کنه.
 *
 * ۳. موقعیت‌ها با `useMemo` محاسبه می‌شن تا با هر رندر عوض نشن.
 *    فقط وقتی تعداد میوه‌ها تغییر می‌کنه، دوباره محاسبه می‌شن.
 */

import { useMemo } from "react";
import { Fruit, TreeLevel } from "@/lib/wordtree/types";

interface TreeProps {
  level: TreeLevel;
  fruits: Fruit[];
  onFruitClick?: (fruitId: string) => void;
}

/**
 * اطلاعات هندسی تاج درخت برای هر سطح.
 *
 * - centerX, centerY: مرکز تاج
 * - radius: شعاع تاج
 * - fruitRadius: شعاع میوه (برای جلوگیری از همپوشانی)
 */
const CROWN_INFO: Record<
  TreeLevel,
  { centerX: number; centerY: number; radius: number; fruitRadius: number }
> = {
  seedling: { centerX: 150, centerY: 200, radius: 45, fruitRadius: 9 },
  young: { centerX: 150, centerY: 155, radius: 65, fruitRadius: 9 },
  mature: { centerX: 150, centerY: 120, radius: 85, fruitRadius: 9 },
  ancient: { centerX: 150, centerY: 95, radius: 100, fruitRadius: 9 },
};

/**
 * تولید موقعیت تصادفی برای میوه‌ها.
 *
 * الگوریتم:
 * ۱. برای هر میوه، یه موقعیت تصادفی داخل دایره تولید می‌کنیم.
 * ۲. چک می‌کنیم که با میوه‌های قبلی همپوشانی نداشته باشه.
 * ۳. اگه همپوشانی داشت، دوباره تلاش می‌کنیم (حداکثر ۵۰ بار).
 *
 * @param count - تعداد میوه‌ها
 * @param level - سطح درخت
 * @returns آرایه‌ای از موقعیت‌ها (x, y)
 */
function generateFruitPositions(
  count: number,
  level: TreeLevel
): { x: number; y: number }[] {
  const { centerX, centerY, radius, fruitRadius } = CROWN_INFO[level];
  const positions: { x: number; y: number }[] = [];
  const maxAttempts = 50;

  // شعاع مؤثر: کمی کمتر از شعاع تاج تا میوه‌ها لبه‌ی تاج نریزن
  const effectiveRadius = radius * 0.75;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      // زاویه‌ی تصادفی (0 تا 2π)
      const angle = Math.random() * Math.PI * 2;

      // فاصله‌ی تصادفی از مرکز
      // از sqrt استفاده می‌کنیم تا توزیع یکنواخت‌تر باشه
      const distance = Math.sqrt(Math.random()) * effectiveRadius;

      // مختصات قطبی → دکارتی
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

      // چک کردن همپوشانی با میوه‌های قبلی
      const minDistance = fruitRadius * 2.2; // فاصله‌ی حداقل بین میوه‌ها
      const hasOverlap = positions.some((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });

      if (!hasOverlap) {
        positions.push({ x, y });
        placed = true;
      }
    }

    // اگه بعد از ۵۰ تلاش نتونستیم جای مناسب پیدا کنیم،
    // یه موقعیت تصادفی می‌ذاریم (حتی اگه همپوشانی داشته باشه)
    if (!placed) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * effectiveRadius;
      positions.push({
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
      });
    }
  }

  return positions;
}

export function Tree({ level, fruits, onFruitClick }: TreeProps) {
  // ─── اندازه‌ی درخت بر اساس سطح ───
  const treeConfig = {
    seedling: {
      trunkHeight: 70,
      trunkY: 230,
      trunkWidth: 16,
      crownLayers: [{ cx: 150, cy: 200, r: 45, fill: "#4ade80" }],
    },
    young: {
      trunkHeight: 100,
      trunkY: 200,
      trunkWidth: 22,
      crownLayers: [
        { cx: 150, cy: 155, r: 65, fill: "#22c55e" },
        { cx: 105, cy: 185, r: 50, fill: "#16a34a" },
        { cx: 195, cy: 185, r: 50, fill: "#16a34a" },
      ],
    },
    mature: {
      trunkHeight: 130,
      trunkY: 170,
      trunkWidth: 28,
      crownLayers: [
        { cx: 150, cy: 120, r: 85, fill: "#22c55e" },
        { cx: 80, cy: 165, r: 60, fill: "#16a34a" },
        { cx: 220, cy: 165, r: 60, fill: "#16a34a" },
        { cx: 150, cy: 60, r: 55, fill: "#4ade80" },
      ],
    },
    ancient: {
      trunkHeight: 155,
      trunkY: 145,
      trunkWidth: 34,
      crownLayers: [
        { cx: 150, cy: 95, r: 100, fill: "#22c55e" },
        { cx: 60, cy: 150, r: 70, fill: "#16a34a" },
        { cx: 240, cy: 150, r: 70, fill: "#16a34a" },
        { cx: 150, cy: 30, r: 70, fill: "#4ade80" },
        { cx: 95, cy: 70, r: 55, fill: "#4ade80" },
        { cx: 205, cy: 70, r: 55, fill: "#4ade80" },
      ],
    },
  }[level];

  /**
   * موقعیت میوه‌ها — با `useMemo` محاسبه می‌شه.
   *
   * ⚠️ وابستگی‌ها:
   * - `fruits.length`: تعداد میوه‌ها (اگه تغییر کنه، موقعیت‌ها دوباره محاسبه می‌شن)
   * - `level`: سطح درخت (اگه تغییر کنه، تاج درخت عوض می‌شه)
   *
   * این یعنی موقعیت‌ها **فقط وقتی تعداد میوه‌ها یا سطح درخت تغییر کنه**
   * دوباره محاسبه می‌شن. با هر رندر عوض نمی‌شن.
   */
  const positions = useMemo(
    () => generateFruitPositions(fruits.length, level),
    [fruits.length, level]
  );

  // ─── رنگ میوه‌ها ───
  const fruitColors = {
    green: { base: "#22c55e", shadow: "#15803d", highlight: "#4ade80" },
    yellow: { base: "#facc15", shadow: "#ca8a04", highlight: "#fde047" },
    golden: { base: "#eab308", shadow: "#a16207", highlight: "#facc15" },
    orange: { base: "#fb923c", shadow: "#c2410c", highlight: "#fdba74" },
  };

  return (
    <div className="relative flex items-center justify-center w-full h-96">
      {/* ─── پس‌زمینه: آسمان و چمن ─── */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-paper-100" />
        <div className="absolute top-4 left-8 w-20 h-6 bg-white/60 rounded-full blur-sm" />
        <div className="absolute top-8 right-12 w-24 h-8 bg-white/50 rounded-full blur-sm" />
        <div className="absolute top-16 left-1/3 w-16 h-5 bg-white/40 rounded-full blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-200 to-transparent" />
      </div>

      {/* ─── SVG درخت + میوه‌ها ─── */}
      <svg
        viewBox="0 0 300 400"
        className="relative w-80 h-96 drop-shadow-xl"
        aria-label="Word tree"
      >
        {/* ─── تعریف گرادیان‌ها ─── */}
        <defs>
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5d3a1a" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#5d3a1a" />
          </linearGradient>
          <radialGradient id="leafGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="fruitGlow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* ─── سایه‌ی زیر درخت ─── */}
        <ellipse cx="150" cy="360" rx="90" ry="12" fill="rgba(0,0,0,0.15)" />

        {/* ─── تنه ─── */}
        <rect
          x={150 - treeConfig.trunkWidth / 2}
          y={treeConfig.trunkY}
          width={treeConfig.trunkWidth}
          height={treeConfig.trunkHeight}
          fill="url(#trunkGradient)"
          rx="3"
        />

        {/* ─── شاخه‌های اضافی ─── */}
        {(level === "mature" || level === "ancient") && (
          <>
            <line
              x1="150"
              y1={treeConfig.trunkY + 30}
              x2="95"
              y2={treeConfig.trunkY - 10}
              stroke="#6b4423"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1={treeConfig.trunkY + 30}
              x2="205"
              y2={treeConfig.trunkY - 10}
              stroke="#6b4423"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </>
        )}

        {/* ─── برگ‌های لایه‌ای ─── */}
        {treeConfig.crownLayers.map((layer, i) => (
          <g key={i}>
            <circle
              cx={layer.cx + 3}
              cy={layer.cy + 3}
              r={layer.r}
              fill="rgba(0,0,0,0.1)"
            />
            <circle cx={layer.cx} cy={layer.cy} r={layer.r} fill={layer.fill} />
            <circle
              cx={layer.cx - layer.r * 0.3}
              cy={layer.cy - layer.r * 0.3}
              r={layer.r * 0.7}
              fill="url(#leafGlow)"
            />
          </g>
        ))}

        {/* ─── میوه‌ها (داخل SVG) ─── */}
        {fruits.map((fruit, index) => {
          const pos = positions[index];
          if (!pos) return null;

          const colors = fruitColors[fruit.type];
          const isReview = fruit.isReviewFruit;

          return (
            <g
              key={fruit.id}
              onClick={() => onFruitClick?.(fruit.id)}
              className="cursor-pointer"
              style={{
                transition: "transform 0.2s",
                transformOrigin: `${pos.x}px ${pos.y}px`,
              }}
            >
              {/* حلقه‌ی سفید برای میوه‌های مرور */}
              {isReview && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="12"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity="0.9"
                />
              )}

              {/* سایه‌ی میوه */}
              <circle
                cx={pos.x + 1}
                cy={pos.y + 1}
                r="8"
                fill="rgba(0,0,0,0.2)"
              />

              {/* بدنه‌ی میوه */}
              <circle cx={pos.x} cy={pos.y} r="8" fill={colors.base} />

              {/* هایلایت */}
              <circle
                cx={pos.x - 2.5}
                cy={pos.y - 2.5}
                r="5"
                fill="url(#fruitGlow)"
              />

              {/* برگ کوچیک بالای میوه */}
              <ellipse
                cx={pos.x + 1}
                cy={pos.y - 8}
                rx="2.5"
                ry="1.5"
                fill="#15803d"
                transform={`rotate(-20 ${pos.x + 1} ${pos.y - 8})`}
              />

              {/* تگ «مرور» */}
              {isReview && (
                <g>
                  <rect
                    x={pos.x - 12}
                    y={pos.y - 24}
                    width="24"
                    height="10"
                    rx="5"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 16.5}
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="bold"
                    fill="#1e293b"
                  >
                    مرور
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}