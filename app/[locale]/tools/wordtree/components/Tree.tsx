"use client";

import { Fruit, TreeLevel } from "@/lib/wordtree/types";

interface TreeProps {
  level: TreeLevel;
  fruits: Fruit[];
  onFruitClick?: (fruitId: string) => void;
}

export function Tree({ level, fruits, onFruitClick }: TreeProps) {
  const treeSize = {
    seedling: { trunkHeight: 60, trunkY: 240, crownRadius: 40, crownY: 200 },
    young: { trunkHeight: 90, trunkY: 210, crownRadius: 60, crownY: 160 },
    mature: { trunkHeight: 120, trunkY: 180, crownRadius: 80, crownY: 120 },
    ancient: { trunkHeight: 150, trunkY: 150, crownRadius: 100, crownY: 80 },
  }[level];

  return (
    <div className="relative flex items-center justify-center w-full h-96">
      <svg
        viewBox="0 0 300 400"
        className="w-72 h-96 drop-shadow-lg"
        aria-label="Word tree"
      >
        <ellipse cx="150" cy="355" rx="80" ry="10" fill="rgba(0,0,0,0.1)" />

        <rect
          x="138"
          y={treeSize.trunkY}
          width="24"
          height={treeSize.trunkHeight}
          fill="#8B4513"
          rx="4"
        />

        {(level === "mature" || level === "ancient") && (
          <>
            <line
              x1="150"
              y1={treeSize.trunkY + 30}
              x2="100"
              y2={treeSize.trunkY + 10}
              stroke="#8B4513"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1={treeSize.trunkY + 30}
              x2="200"
              y2={treeSize.trunkY + 10}
              stroke="#8B4513"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </>
        )}

        <circle
          cx="150"
          cy={treeSize.crownY}
          r={treeSize.crownRadius}
          fill="#228B22"
        />
        {level !== "seedling" && (
          <>
            <circle
              cx={150 - treeSize.crownRadius * 0.6}
              cy={treeSize.crownY + treeSize.crownRadius * 0.4}
              r={treeSize.crownRadius * 0.7}
              fill="#2E8B57"
            />
            <circle
              cx={150 + treeSize.crownRadius * 0.6}
              cy={treeSize.crownY + treeSize.crownRadius * 0.4}
              r={treeSize.crownRadius * 0.7}
              fill="#2E8B57"
            />
          </>
        )}
        {level === "ancient" && (
          <circle
            cx="150"
            cy={treeSize.crownY - treeSize.crownRadius * 0.5}
            r={treeSize.crownRadius * 0.7}
            fill="#32CD32"
          />
        )}
      </svg>

      {fruits.map((fruit, index) => {
        const positions = [
          { top: "30%", left: "35%" },
          { top: "25%", left: "50%" },
          { top: "30%", left: "65%" },
          { top: "40%", left: "42%" },
          { top: "40%", left: "58%" },
          { top: "50%", left: "50%" },
          { top: "45%", left: "30%" },
          { top: "45%", left: "70%" },
        ];
        const pos = positions[index % positions.length];

        const fruitColor = {
          green: "#4ade80",
          yellow: "#facc15",
          golden: "#eab308",
          orange: "#fb923c",
        }[fruit.type];

        const boxShadow =
          fruit.type === "golden"
            ? "0 0 12px #eab308, 0 0 4px #fbbf24"
            : fruit.type === "orange"
            ? "0 0 8px rgba(251, 146, 60, 0.6)"
            : "0 2px 4px rgba(0,0,0,0.2)";

        return (
          <button
            key={fruit.id}
            onClick={() => onFruitClick?.(fruit.id)}
            className="absolute w-6 h-6 rounded-full transition-transform hover:scale-150 focus:outline-none focus:ring-2 focus:ring-gold-300 cursor-pointer animate-pulse-slow"
            style={{
              top: pos.top,
              left: pos.left,
              backgroundColor: fruitColor,
              boxShadow,
            }}
            aria-label={`Fruit: ${fruit.type}`}
          />
        );
      })}
    </div>
  );
}