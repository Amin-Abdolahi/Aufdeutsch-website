"use client";

/**
 * HelpModal — راهنمای کامل (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این مودال، راهنمای کامل بازی رو نشون می‌ده.
 * ۲. از تنظیمات قابل دسترسیه.
 * ۳. شامل بخش‌های:
 *    - شروع (آبیاری، چیدن)
 *    - میوه‌ها (رنگ‌ها و معناشون)
 *    - آزمون‌ها (میوه‌ی نقره‌ای، تمرین املا)
 *    - کلمات سفارشی (افزودن دستی، ایمپورت)
 * ۴. برای اضافه کردن بخش جدید، به آرایه‌ی `sections` اضافه کن.
 */

import { Button } from "@/components/ui/Button";

interface HelpModalProps {
  onClose: () => void;
  labels: {
    title: string;
    // بخش شروع
    basicsTitle: string;
    basicsWater: string;
    basicsHarvest: string;
    basicsDay: string;
    // بخش میوه‌ها
    fruitsTitle: string;
    fruitGreen: string;
    fruitYellow: string;
    fruitGolden: string;
    fruitOrange: string;
    fruitSilver: string;
    // بخش آزمون‌ها
    quizzesTitle: string;
    quizzesSilver: string;
    quizzesPractice: string;
    quizzesMenu: string;
    // بخش کلمات سفارشی
    customWordsTitle: string;
    customWordsManual: string;
    customWordsImport: string;
    customWordsReward: string;
    // بخش Spaced Repetition
    reviewTitle: string;
    reviewText: string;
    // دکمه
    close: string;
    gotIt: string;
  };
}

export function HelpModal({ onClose, labels }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        {/* ─── هدر ─── */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-navy-900 font-mono mb-1">
            📚 {labels.title}
          </h2>
        </div>

        {/* ─── بخش ۱: شروع ─── */}
        <Section title={labels.basicsTitle} icon="🌱">
          <Item icon="💧" text={labels.basicsWater} />
          <Item icon="🍎" text={labels.basicsHarvest} />
          <Item icon="🌅" text={labels.basicsDay} />
        </Section>

        {/* ─── بخش ۲: میوه‌ها ─── */}
        <Section title={labels.fruitsTitle} icon="🍇">
          <Item
            icon={<FruitDot color="green" />}
            text={labels.fruitGreen}
          />
          <Item
            icon={<FruitDot color="yellow" />}
            text={labels.fruitYellow}
          />
          <Item
            icon={<FruitDot color="golden" />}
            text={labels.fruitGolden}
          />
          <Item
            icon={<FruitDot color="orange" />}
            text={labels.fruitOrange}
          />
          <Item
            icon={<FruitDot color="silver" />}
            text={labels.fruitSilver}
          />
        </Section>

        {/* ─── بخش ۳: آزمون‌ها ─── */}
        <Section title={labels.quizzesTitle} icon="🎯">
          <Item icon="🥈" text={labels.quizzesSilver} />
          <Item icon="✏️" text={labels.quizzesPractice} />
          <Item icon="📊" text={labels.quizzesMenu} />
        </Section>

        {/* ─── بخش ۴: کلمات سفارشی ─── */}
        <Section title={labels.customWordsTitle} icon="➕">
          <Item icon="✍️" text={labels.customWordsManual} />
          <Item icon="📥" text={labels.customWordsImport} />
          <Item icon="🪙" text={labels.customWordsReward} />
        </Section>

        {/* ─── بخش ۵: مرور فاصله‌دار ─── */}
        <Section title={labels.reviewTitle} icon="🔄">
          <p className="text-sm text-navy-900/70 leading-relaxed">
            {labels.reviewText}
          </p>
        </Section>

        {/* ─── دکمه ─── */}
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={onClose}>
            {labels.gotIt}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// کامپوننت‌های کمکی
// ─────────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <h3 className="text-sm font-bold text-navy-900 font-mono mb-2 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      <div className="bg-white/60 rounded-sm p-3 border border-navy-900/10 space-y-2">
        {children}
      </div>
    </div>
  );
}

function Item({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="flex-shrink-0 w-5 text-center">{icon}</span>
      <span className="text-navy-900/70 leading-relaxed">{text}</span>
    </div>
  );
}

function FruitDot({ color }: { color: string }) {
  const colors: Record<string, string> = {
    green: "#22c55e",
    yellow: "#facc15",
    golden: "#eab308",
    orange: "#fb923c",
    silver: "#cbd5e1",
  };

  return (
    <span
      className="inline-block w-4 h-4 rounded-full"
      style={{
        backgroundColor: colors[color],
        border: color === "silver" ? "2px solid #94a3b8" : "2px solid white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    />
  );
}