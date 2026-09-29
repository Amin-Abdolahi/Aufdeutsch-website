"use client";

interface CoinDisplayProps {
  coins: number;
}

export function CoinDisplay({ coins }: CoinDisplayProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-gold-300 border border-gold-500/40 px-4 py-2 rounded-sm shadow-sm">
      <span className="text-xl" aria-hidden="true">
        🪙
      </span>
      <span className="font-mono font-bold text-navy-900 text-lg">
        {coins}
      </span>
    </div>
  );
}