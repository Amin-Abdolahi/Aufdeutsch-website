"use client";

/**
 * CoinDisplay — نمایش سکه (نسخه ۲.۰ — زیباسازی شده)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 * - انیمیشن `animate-pop-in` وقتی سکه اضافه می‌شه.
 * - برای فاز ۲: انیمیشن چرخش سکه.
 */

interface CoinDisplayProps {
  coins: number;
}

export function CoinDisplay({ coins }: CoinDisplayProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-br from-gold-300 to-gold-500/80 border border-gold-500/40 px-4 py-2 rounded-full shadow-md">
      <span
        className="text-xl drop-shadow-sm animate-pop-in"
        aria-hidden="true"
        key={coins}
      >
        🪙
      </span>
      <span className="font-mono font-bold text-navy-900 text-lg">
        {coins}
      </span>
    </div>
  );
}