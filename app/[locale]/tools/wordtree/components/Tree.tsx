"use client";

/**
 * Tree — کامپوننت درخت (نسخه ۱۵.۰ — شکل‌های واقعی متفاوت)
 *
 * ⚠️ تغییرات نسخه ۱۵.۰:
 * - هر variant شکل SVG مخصوص خودش رو داره (بلوط/کاج/نخل/شکوفه/سیب/لیمو)
 * - TreeIcon: نسخه‌ی سبک برای نمایش توی مودال‌ها و کارت‌ها
 */

import { useMemo } from "react";
import { Fruit, TreeLevel, TreeVariant } from "@/lib/wordtree/types";
import { TREE_COLORS } from "@/lib/wordtree/constants";

interface TreePalette {
  canopy: string;
  canopyShadow: string;
  canopyLight: string;
  trunk: string;
  trunkShadow: string;
}

interface TreeProps {
  level: TreeLevel;
  variant?: TreeVariant;
  fruits?: Fruit[];
  onFruitClick?: (fruitId: string) => void;
  /** رنگ تاج درخت (پالت کلی درخت) */
  colors?: TreePalette;
}

// ─────────────────────────────────────────────────────────────
// هندسه‌ی تاج بر اساس variant
// ─────────────────────────────────────────────────────────────

const CROWN_GEOMETRY: Record<
  TreeVariant,
  { cx: number; cy: number; r: number }
> = {
  oak: { cx: 512, cy: 350, r: 215 },
  pine: { cx: 512, cy: 370, r: 205 },
  palm: { cx: 512, cy: 320, r: 195 },
  blossom: { cx: 512, cy: 350, r: 210 },
  apple: { cx: 512, cy: 350, r: 205 },
  lemon: { cx: 512, cy: 350, r: 205 },
};

const LEVEL_SCALE: Record<TreeLevel, number> = {
  seedling: 0.62,
  young: 0.8,
  mature: 0.92,
  ancient: 1.05,
};

const DEFAULT_PALETTE: TreePalette = {
  canopy: "#22C55E",
  canopyShadow: "#16A34A",
  canopyLight: "#4ADE80",
  trunk: "#8B4513",
  trunkShadow: "#6B3410",
};

export function paletteForColor(color?: string): TreePalette {
  if (!color) return DEFAULT_PALETTE;
  const c = TREE_COLORS[color];
  if (!c) return DEFAULT_PALETTE;
  return {
    canopy: c.main,
    canopyShadow: c.dark,
    canopyLight: c.light,
    trunk: "#8B4513",
    trunkShadow: "#6B3410",
  };
}

// ─────────────────────────────────────────────────────────────
// TreeShape — تاج + تنه (قابل استفاده با هر اندازه)
// ─────────────────────────────────────────────────────────────

interface ShapeProps {
  variant: TreeVariant;
  palette: TreePalette;
  cx: number;
  cy: number;
  r: number;
  /** y پایه‌ی تنه (زمین) */
  trunkBase: number;
}

export function TreeShape({
  variant,
  palette,
  cx,
  cy,
  r,
  trunkBase,
}: ShapeProps) {
  const { canopy, canopyShadow, canopyLight, trunk, trunkShadow } = palette;

  // ─── تنه (مشترک، به جز نخل) ───
  const trunkPath =
    variant === "palm"
      ? `M ${cx - r * 0.12} ${cy + r * 0.1} C ${cx - r * 0.22} ${trunkBase - 170}, ${cx - r * 0.3} ${trunkBase - 60}, ${cx - r * 0.32} ${trunkBase} L ${cx + r * 0.32} ${trunkBase} C ${cx + r * 0.28} ${trunkBase - 60}, ${cx + r * 0.17} ${trunkBase - 170}, ${cx + r * 0.12} ${cy + r * 0.1} Z`
      : `M ${cx - r * 0.18} ${cy + r * 0.82} C ${cx - r * 0.28} ${trunkBase - 130}, ${cx - r * 0.35} ${trunkBase - 45}, ${cx - r * 0.4} ${trunkBase} L ${cx + r * 0.4} ${trunkBase} C ${cx + r * 0.35} ${trunkBase - 45}, ${cx + r * 0.28} ${trunkBase - 130}, ${cx + r * 0.18} ${cy + r * 0.82} Z`;

  const trunkShadowPath = `M ${cx + r * 0.12} ${cy + r * 0.86} C ${cx + r * 0.22} ${trunkBase - 125}, ${cx + r * 0.28} ${trunkBase - 42}, ${cx + r * 0.32} ${trunkBase} L ${cx + r * 0.4} ${trunkBase} C ${cx + r * 0.35} ${trunkBase - 45}, ${cx + r * 0.28} ${trunkBase - 130}, ${cx + r * 0.18} ${cy + r * 0.82} Z`;

  return (
    <g>
      {/* ─── تنه ─── */}
      <path d={trunkPath} fill={trunk} />
      <path d={trunkShadowPath} fill={trunkShadow} opacity="0.55" />

      {/* ─── حلقه‌های تنه‌ی نخل ─── */}
      {variant === "palm" &&
        [trunkBase - 150, trunkBase - 100, trunkBase - 50].map((y) => (
          <path
            key={y}
            d={`M ${cx - r * 0.26} ${y} Q ${cx} ${y + r * 0.07} ${cx + r * 0.26} ${y}`}
            stroke={trunkShadow}
            strokeWidth={r * 0.045}
            fill="none"
            opacity="0.6"
          />
        ))}

      {/* ─── تاج بر اساس variant ─── */}
      {variant === "oak" && (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={canopyShadow} />
          <circle cx={cx - r * 0.55} cy={cy + r * 0.28} r={r * 0.55} fill={canopy} />
          <circle cx={cx + r * 0.55} cy={cy + r * 0.28} r={r * 0.55} fill={canopy} />
          <circle cx={cx} cy={cy - r * 0.28} r={r * 0.62} fill={canopyLight} />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.05} r={r * 0.28} fill={canopyLight} opacity="0.7" />
        </g>
      )}

      {variant === "pine" && (
        <g>
          <polygon
            points={`${cx},${cy - r} ${cx - r * 0.46},${cy - r * 0.28} ${cx + r * 0.46},${cy - r * 0.28}`}
            fill={canopyLight}
          />
          <polygon
            points={`${cx},${cy - r * 0.62} ${cx - r * 0.68},${cy + r * 0.12} ${cx + r * 0.68},${cy + r * 0.12}`}
            fill={canopy}
          />
          <polygon
            points={`${cx},${cy - r * 0.18} ${cx - r * 0.94},${cy + r * 0.62} ${cx + r * 0.94},${cy + r * 0.62}`}
            fill={canopyShadow}
          />
        </g>
      )}

      {variant === "palm" && (
        <g>
          {[25, 75, 125, 175, 225, 315].map((deg) => (
            <ellipse
              key={deg}
              cx={cx}
              cy={cy - r * 0.55}
              rx={r * 0.92}
              ry={r * 0.15}
              fill={deg % 50 === 25 ? canopy : canopyLight}
              transform={`rotate(${deg} ${cx} ${cy - r * 0.38})`}
            />
          ))}
          <circle cx={cx} cy={cy - r * 0.38} r={r * 0.26} fill={canopyShadow} />
          {/* نارگیل */}
          <circle cx={cx - r * 0.14} cy={cy - r * 0.08} r={r * 0.08} fill={trunk} />
          <circle cx={cx + r * 0.14} cy={cy - r * 0.08} r={r * 0.08} fill={trunk} />
        </g>
      )}

      {variant === "blossom" && (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={canopyShadow} />
          <circle cx={cx} cy={cy - r * 0.18} r={r * 0.76} fill={canopy} />
          <circle cx={cx - r * 0.3} cy={cy + r * 0.1} r={r * 0.34} fill={canopyLight} opacity="0.75" />
          {/* شکوفه‌ها */}
          {[
            [-0.5, -0.45],
            [0.5, -0.4],
            [-0.55, 0.25],
            [0.55, 0.3],
            [0, -0.72],
            [-0.15, 0.55],
            [0.25, 0.6],
          ].map(([dx, dy], i) => (
            <g key={i}>
              <circle
                cx={cx + r * dx}
                cy={cy + r * dy}
                r={r * 0.085}
                fill="#ffffff"
                opacity="0.95"
              />
              <circle
                cx={cx + r * dx}
                cy={cy + r * dy}
                r={r * 0.04}
                fill="#f9a8d4"
              />
            </g>
          ))}
        </g>
      )}

      {variant === "apple" && (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={canopyShadow} />
          <circle cx={cx} cy={cy - r * 0.18} r={r * 0.76} fill={canopy} />
          <circle cx={cx - r * 0.3} cy={cy + r * 0.1} r={r * 0.34} fill={canopyLight} opacity="0.75" />
          {/* سیب‌ها */}
          {[
            [-0.48, -0.3],
            [0.5, -0.15],
            [-0.1, 0.55],
            [0.42, 0.42],
          ].map(([dx, dy], i) => (
            <g key={i}>
              <circle cx={cx + r * dx} cy={cy + r * dy} r={r * 0.1} fill="#dc2626" />
              <circle
                cx={cx + r * dx - r * 0.035}
                cy={cy + r * dy - r * 0.035}
                r={r * 0.035}
                fill="#fecaca"
                opacity="0.85"
              />
            </g>
          ))}
        </g>
      )}

      {variant === "lemon" && (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={canopyShadow} />
          <circle cx={cx} cy={cy - r * 0.18} r={r * 0.76} fill={canopy} />
          <circle cx={cx - r * 0.3} cy={cy + r * 0.1} r={r * 0.34} fill={canopyLight} opacity="0.75" />
          {/* لیموها */}
          {[
            [-0.48, -0.25],
            [0.5, -0.1],
            [-0.05, 0.55],
            [0.45, 0.4],
          ].map(([dx, dy], i) => (
            <g key={i}>
              <ellipse
                cx={cx + r * dx}
                cy={cy + r * dy}
                rx={r * 0.11}
                ry={r * 0.075}
                fill="#facc15"
                transform={`rotate(${i * 35} ${cx + r * dx} ${cy + r * dy})`}
              />
              <ellipse
                cx={cx + r * dx - r * 0.03}
                cy={cy + r * dy - r * 0.025}
                rx={r * 0.035}
                ry={r * 0.02}
                fill="#fef9c3"
                opacity="0.85"
              />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

// ─────────────────────────────────────────────────────────────
// TreeIcon — نسخه‌ی سبک برای مودال/کارت
// ─────────────────────────────────────────────────────────────

interface TreeIconProps {
  variant: TreeVariant;
  color?: string;
  className?: string;
}

export function TreeIcon({ variant, color, className }: TreeIconProps) {
  const palette = paletteForColor(color);
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.15))" }}
    >
      <TreeShape
        variant={variant}
        palette={palette}
        cx={100}
        cy={92}
        r={62}
        trunkBase={250}
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Tree — درخت کامل با میوه‌ها
// ─────────────────────────────────────────────────────────────

function generateFruitPositions(
  count: number,
  variant: TreeVariant,
  level: TreeLevel
): { x: number; y: number }[] {
  const geom = CROWN_GEOMETRY[variant];
  const scale = LEVEL_SCALE[level];
  const cx = geom.cx;
  const cy = geom.cy;
  const effectiveRadius = geom.r * scale * 0.72;
  const minDistance = Math.max(44, geom.r * scale * 0.26);

  const positions: { x: number; y: number }[] = [];
  const maxAttempts = 60;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * effectiveRadius;
      const x = cx + distance * Math.cos(angle);
      const y = cy + distance * Math.sin(angle) * 0.92;

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

    if (!placed) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * effectiveRadius;
      positions.push({
        x: cx + distance * Math.cos(angle),
        y: cy + distance * Math.sin(angle) * 0.92,
      });
    }
  }

  return positions;
}

export function Tree({
  level,
  variant = "oak",
  fruits = [],
  onFruitClick,
  colors,
}: TreeProps) {
  const geom = CROWN_GEOMETRY[variant];
  const scale = LEVEL_SCALE[level];
  const palette = colors ?? DEFAULT_PALETTE;

  const positions = useMemo(
    () => generateFruitPositions(fruits.length, variant, level),
    [fruits.length, level, variant]
  );

  const fruitColors = {
    green: { base: "#22c55e", shadow: "#15803d", highlight: "#86efac", border: "#ffffff" },
    yellow: { base: "#facc15", shadow: "#ca8a04", highlight: "#fde047", border: "#ffffff" },
    golden: { base: "#eab308", shadow: "#a16207", highlight: "#fde047", border: "#fef3c7" },
    orange: { base: "#fb923c", shadow: "#c2410c", highlight: "#fdba74", border: "#ffffff" },
    silver: {
      base: "#cbd5e1",
      shadow: "#64748b",
      highlight: "#f1f5f9",
      border: "#94a3b8",
    },
  };

  const fruitRadius = 38 * scale;

  return (
    <div className="relative flex items-center justify-center w-full h-96">
      {/* ─── پس‌زمینه ─── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100" />

        <div className="absolute top-6 left-8 w-24 h-8 bg-white/70 rounded-full blur-[2px]" />
        <div className="absolute top-10 left-16 w-16 h-6 bg-white/50 rounded-full blur-[2px]" />
        <div className="absolute top-8 right-12 w-20 h-7 bg-white/60 rounded-full blur-[2px]" />

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-emerald-300 via-emerald-200 to-transparent" />
      </div>

      {/* ─── درخت و میوه‌ها ─── */}
      <svg
        viewBox="0 0 1024 1024"
        className="relative w-full h-full max-w-md"
        aria-label="Word tree"
        style={{
          transform: `scale(${scale}) translateY(-25px)`,
          transition: "transform 0.5s ease-out",
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
        }}
      >
        <TreeShape
          variant={variant}
          palette={palette}
          cx={geom.cx}
          cy={geom.cy}
          r={geom.r}
          trunkBase={920}
        />

        {/* ─── میوه‌ها ─── */}
        {fruits.map((fruit, index) => {
          const pos = positions[index];
          if (!pos) return null;

          const colors = fruitColors[fruit.type];
          const isReview = fruit.isReviewFruit;
          const isSilver = fruit.type === "silver";
          const r = fruitRadius;

          return (
            <g
              key={fruit.id}
              onClick={() => onFruitClick?.(fruit.id)}
              className="cursor-pointer"
              style={{
                filter: isSilver
                  ? "drop-shadow(0 0 12px rgba(203, 213, 225, 0.8)) drop-shadow(0 3px 4px rgba(0,0,0,0.3))"
                  : "drop-shadow(0 3px 4px rgba(0,0,0,0.3))",
              }}
            >
              {isReview && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r + 12}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  opacity="0.95"
                />
              )}

              <circle cx={pos.x} cy={pos.y} r={r + 3} fill={colors.border} />
              <circle cx={pos.x} cy={pos.y} r={r} fill={colors.base} />
              <path
                d={`M ${pos.x - r} ${pos.y} A ${r} ${r} 0 0 0 ${pos.x + r} ${pos.y} Z`}
                fill={colors.shadow}
                opacity="0.4"
              />
              <circle
                cx={pos.x - r * 0.35}
                cy={pos.y - r * 0.35}
                r={r * 0.5}
                fill={colors.highlight}
                opacity="0.75"
              />
              <circle
                cx={pos.x - r * 0.4}
                cy={pos.y - r * 0.4}
                r={r * 0.18}
                fill="white"
                opacity="0.95"
              />

              {isSilver && (
                <text
                  x={pos.x}
                  y={pos.y + r * 0.3}
                  textAnchor="middle"
                  fontSize={r * 1.1}
                  fontWeight="bold"
                  fill="#475569"
                  opacity="0.8"
                >
                  ⭐
                </text>
              )}

              {isSilver && (
                <g>
                  <rect
                    x={pos.x - 48}
                    y={pos.y - r - 55}
                    width="96"
                    height="40"
                    rx="20"
                    fill="#1e293b"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - r - 28}
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    آزمون
                  </text>
                </g>
              )}

              {isReview && (
                <g>
                  <rect
                    x={pos.x - 42}
                    y={pos.y - r - 52}
                    width="84"
                    height="38"
                    rx="19"
                    fill="#ffffff"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - r - 25}
                    textAnchor="middle"
                    fontSize="22"
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
