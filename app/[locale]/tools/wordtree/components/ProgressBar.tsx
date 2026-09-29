"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-sm text-navy-900/70 font-mono">
        <span>{label}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-navy-900/10 rounded-sm h-3 overflow-hidden">
        <div
          className="bg-gold-300 h-3 rounded-sm transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}