"use client";

/**
 * Tree — کامپوننت درخت (نسخه ۱۴.۰ — با میوه‌ی نقره‌ای)
 *
 * ⚠️ تغییرات نسخه ۱۴.۰:
 * - اضافه شدن میوه‌ی نقره‌ای (silver) برای آزمون
 * - رنگ‌بندی مخصوص میوه‌ی نقره‌ای (خاکستری نقره‌ای)
 * - تگ «آزمون» بالای میوه‌ی نقره‌ای
 */

import { useMemo } from "react";
import { Fruit, TreeLevel } from "@/lib/wordtree/types";

interface TreeProps {
  level: TreeLevel;
  fruits: Fruit[];
  onFruitClick?: (fruitId: string) => void;
  /** رنگ تاج درخت (پالت کلی درخت) */
  colors?: {
    canopy: string;
    canopyShadow: string;
    canopyLight: string;
    trunk: string;
    trunkShadow: string;
  };
}

const CROWN_INFO: Record<
  TreeLevel,
  { centerX: number; centerY: number; radius: number; scale: number }
> = {
  seedling: { centerX: 512, centerY: 400, radius: 180, scale: 0.65 },
  young: { centerX: 512, centerY: 380, radius: 230, scale: 0.78 },
  mature: { centerX: 512, centerY: 360, radius: 280, scale: 0.9 },
  ancient: { centerX: 512, centerY: 360, radius: 320, scale: 1.05 },
};

function generateFruitPositions(
  count: number,
  level: TreeLevel
): { x: number; y: number }[] {
  const { centerX, centerY, radius } = CROWN_INFO[level];
  const positions: { x: number; y: number }[] = [];
  const maxAttempts = 50;
  const effectiveRadius = radius * 0.72;
  const minDistance = 80;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * effectiveRadius;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);

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
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
      });
    }
  }

  return positions;
}

export function Tree({
  level,
  fruits,
  onFruitClick,
  colors,
}: TreeProps) {
  const config = CROWN_INFO[level];

  // ─── پالت پیش‌فرض: سبز ───
  const palette = colors ?? {
    canopy: "#22C55E",
    canopyShadow: "#16A34A",
    canopyLight: "#4ADE80",
    trunk: "#8B4513",
    trunkShadow: "#6B3410",
  };

  const positions = useMemo(
    () => generateFruitPositions(fruits.length, level),
    [fruits.length, level]
  );

  const fruitColors = {
    green: { base: "#22c55e", shadow: "#15803d", highlight: "#86efac", border: "#ffffff" },
    yellow: { base: "#facc15", shadow: "#ca8a04", highlight: "#fde047", border: "#ffffff" },
    golden: { base: "#eab308", shadow: "#a16207", highlight: "#fde047", border: "#fef3c7" },
    orange: { base: "#fb923c", shadow: "#c2410c", highlight: "#fdba74", border: "#ffffff" },
    // ─── میوه‌ی نقره‌ای: رنگ خاکستری نقره‌ای ───
    silver: {
      base: "#cbd5e1",
      shadow: "#64748b",
      highlight: "#f1f5f9",
      border: "#94a3b8",
    },
  };

  const fruitRadius = 42 * config.scale;

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
          transform: `scale(${config.scale}) translateY(-25px)`,
          transition: "transform 0.5s ease-out",
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
        }}
      >
        {/* ─── درخت ─── */}
        <path fill={palette.canopyShadow} d="M376.361 175.653C382.066 167.724 387.25 160.567 393.876 153.302C452.074 89.4855 547.591 69.3684 628.365 96.6686C691.457 117.993 749.195 170.686 760.663 238.283C764.449 260.539 761.706 275.893 756.983 297.185L757.061 297.382C761.181 300.197 765.934 306.448 769.327 310.291C819.841 367.504 824.606 441.532 781.369 504.549L778.388 508.834L778.101 509.582C785.373 555.854 774.801 592.008 747.552 629.628C718.981 669.071 668.098 698.72 620.192 706.274C619.421 706.392 618.647 706.489 617.871 706.564C613.164 707.83 575.613 734.948 568.982 739.533C570.325 760.914 571.793 782.287 573.387 803.651C575.411 830.391 577.323 848.954 576.506 875.721C583.142 881.577 588.112 886.943 593.316 894.148C595.567 897.265 598.333 901.999 600.528 904.805C605.518 911.361 607.231 919.203 608.754 927.093C568.643 927.513 528.53 927.623 488.417 927.421C469.034 927.401 448.962 926.932 429.678 927.492C430.243 918.703 433.375 912.256 437.467 904.628C439.237 902.551 442.759 896.753 444.662 894.151C448.981 888.249 452.353 884.861 457.461 879.8C458.445 859.06 459.67 838.332 461.138 817.621C463.139 782.702 465.346 747.795 467.761 712.902C461.663 711.987 450.558 711.766 443.383 710.946C420.198 708.454 397.48 702.706 375.899 693.87C310.747 667.027 253.566 606.725 254.36 532.321C254.527 516.612 257.873 496.752 263.925 482.172L263.918 481.901C248.134 468.038 231.775 445.036 222.613 426.292C197.796 375.52 202.094 316.905 232.224 269.443C266.044 216.168 315.663 188.603 376.09 175.848L376.361 175.653Z"/>
        <path fill={palette.trunk} d="M263.925 482.172C271.021 487.11 277.882 494.751 285.051 500.285C319.969 527.237 359.494 545.131 403.604 549.867C424.932 552.321 445.984 553.308 467.292 550.065C469.318 549.756 477.515 548.247 477.629 549.992C477.599 549.534 478.195 551.784 478.087 551.397L478.847 551.733C481.554 552.961 485.189 555.384 487.833 557.023C502.4 566.051 517.896 573.689 534.182 579.091C541.817 581.624 549.805 583.512 557.473 586.072C562.638 586.627 571.074 588.519 576.668 589.385C588.676 591.23 600.821 592.041 612.967 591.809C669.89 590.845 726.202 568.874 764.349 525.657C768.823 520.589 772.974 514.819 777.672 510.014L778.101 509.582C785.373 555.854 774.801 592.008 747.552 629.628C718.981 669.071 668.098 698.72 620.192 706.274C619.421 706.392 618.647 706.489 617.871 706.564C613.164 707.83 575.613 734.948 568.982 739.533C570.325 760.914 571.793 782.287 573.387 803.651C575.411 830.391 577.323 848.954 576.506 875.721C583.142 881.577 588.112 886.943 593.316 894.148C595.567 897.265 598.333 901.999 600.528 904.805C605.518 911.361 607.231 919.203 608.754 927.093C568.643 927.513 528.53 927.623 488.417 927.421C469.034 927.401 448.962 926.932 429.678 927.492C430.243 918.703 433.375 912.256 437.467 904.628C439.237 902.551 442.759 896.753 444.662 894.151C448.981 888.249 452.353 884.861 457.461 879.8C458.445 859.06 459.67 838.332 461.138 817.621C463.139 782.702 465.346 747.795 467.761 712.902C461.663 711.987 450.558 711.766 443.383 710.946C420.198 708.454 397.48 702.706 375.899 693.87C310.747 667.027 253.566 606.725 254.36 532.321C254.527 516.612 257.873 496.752 263.925 482.172Z"/>
        <path fill={palette.canopyLight} d="M263.925 482.172C271.021 487.11 277.882 494.751 285.051 500.285C319.969 527.237 359.494 545.131 403.604 549.867C424.932 552.321 445.984 553.308 467.292 550.065C469.318 549.756 477.515 548.247 477.629 549.992C477.599 549.534 478.195 551.784 478.087 551.397C476.888 564.491 476.428 576.643 475.605 589.685C473.881 614.044 472.541 638.429 471.586 662.83C464.217 659.342 439.534 643.636 434.386 638.321C432.423 636.294 431.486 633.486 430.544 630.879C426.663 620.131 423.105 609.265 419.21 598.515C417.867 594.807 417.016 590.723 415.132 587.248C414.272 585.662 413.192 584.257 411.495 583.517C410.324 583.007 408.906 582.835 407.701 583.331C406.209 583.945 404.825 585.486 404.506 587.094C403.583 591.738 414.318 620.885 416.572 626.978C410.596 622.912 384.343 603.722 379.504 602.824C374.241 603.852 371.741 610.553 377.116 614.412C407.261 636.057 440.229 655.634 470.106 677.46C469.844 684.907 469.143 692.544 468.593 699.992C468.363 703.11 468.254 710.147 467.761 712.902C461.663 711.987 450.558 711.766 443.383 710.946C420.198 708.454 397.48 702.706 375.899 693.87C310.747 667.027 253.566 606.725 254.36 532.321C254.527 516.612 257.873 496.752 263.925 482.172Z"/>
        <path fill={palette.canopyLight} d="M778.101 509.582C785.373 555.854 774.801 592.008 747.552 629.628C718.981 669.071 668.098 698.72 620.192 706.274C619.421 706.392 618.647 706.489 617.871 706.564C620.256 703.729 625.671 700.214 628.797 697.966C637.874 691.429 647.026 684.996 656.249 678.666C662.344 674.465 672.867 668.788 677.329 663.31C678.276 662.148 678.626 660.83 678.531 659.339C678.428 657.726 677.696 656.046 676.495 654.951C675.586 654.122 674.329 653.55 673.077 653.646C669.102 653.951 641.741 673.956 636.442 677.478C638.584 671.654 650.92 641.661 649.52 638.196C648.872 636.59 646.84 634.716 645.222 634.129C644.024 633.695 642.645 633.889 641.552 634.543C636.004 637.86 624.767 681.006 618.095 689.392C613.918 694.641 593.451 708.631 586.938 712.061C580.132 712.799 574.556 712.403 567.39 713.426C563.467 688.893 563.824 660.258 561.704 635.309C560.371 619.605 557.871 601.494 557.473 586.072C562.638 586.627 571.074 588.519 576.668 589.385C588.676 591.23 600.821 592.041 612.967 591.809C669.89 590.845 726.202 568.874 764.349 525.657C768.823 520.589 772.974 514.819 777.672 510.014L778.101 509.582Z"/>
        <path fill="white" d="M567.39 713.426C574.556 712.403 580.132 712.799 586.938 712.061C580.692 716.498 574.209 720.859 568.058 725.358C567.874 721.332 567.56 717.518 567.39 713.426Z"/>
        <path fill={palette.canopy} d="M376.361 175.653C382.066 167.724 387.25 160.567 393.876 153.302C452.074 89.4855 547.591 69.3684 628.365 96.6686C691.457 117.993 749.195 170.686 760.663 238.283C764.449 260.539 761.706 275.893 756.983 297.185C755.379 295.475 753.733 293.805 752.045 292.177C708.214 249.676 660.532 229.547 599.405 226.638C590.493 226.214 581.924 226.829 573.025 226.967C567.42 223.616 557.748 214.528 551.35 210.119C498.631 173.786 438.21 165.292 376.361 175.653Z"/>
        <path fill={palette.canopyShadow} d="M263.918 481.901C248.134 468.038 231.775 445.036 222.613 426.292C197.796 375.52 202.094 316.905 232.224 269.443C266.044 216.168 315.663 188.603 376.09 175.848L375.837 176.331C369.813 187.622 364.035 194.92 357.893 207.922C341.669 242.54 338.736 281.914 349.651 318.554C354.831 335.939 363.297 351.82 373.467 366.777C326.02 386.389 288.201 423.893 268.194 471.175C266.722 474.732 265.296 478.307 263.918 481.901Z"/>
        <path fill={palette.canopyShadow} d="M757.061 297.382C761.181 300.197 765.934 306.448 769.327 310.291C819.841 367.504 824.606 441.532 781.369 504.549L778.388 508.834C777.675 507.298 777.257 505.32 776.831 503.642C774.31 495.027 771.798 485.9 767.974 477.797C750.699 441.188 721.309 416.123 686.693 396.949C693.137 391.361 698.692 387.241 705.155 381.116C724.655 362.634 739.298 341.868 750.029 317.223C752.786 310.891 754.286 303.739 756.875 297.797L757.061 297.382Z"/>

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
              {/* حلقه‌ی سفید برای مرور */}
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

              {/* حاشیه */}
              <circle cx={pos.x} cy={pos.y} r={r + 3} fill={colors.border} />

              {/* بدنه */}
              <circle cx={pos.x} cy={pos.y} r={r} fill={colors.base} />

              {/* نیمه‌ی پایین تیره‌تر */}
              <path
                d={`M ${pos.x - r} ${pos.y} A ${r} ${r} 0 0 0 ${pos.x + r} ${pos.y} Z`}
                fill={colors.shadow}
                opacity="0.4"
              />

              {/* هایلایت */}
              <circle
                cx={pos.x - r * 0.35}
                cy={pos.y - r * 0.35}
                r={r * 0.5}
                fill={colors.highlight}
                opacity="0.75"
              />

              {/* نقطه‌ی براق */}
              <circle
                cx={pos.x - r * 0.4}
                cy={pos.y - r * 0.4}
                r={r * 0.18}
                fill="white"
                opacity="0.95"
              />

              {/* ─── آیکون ستاره برای میوه‌ی نقره‌ای ─── */}
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

              {/* تگ «آزمون» برای میوه‌ی نقره‌ای */}
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

              {/* تگ «مرور» */}
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