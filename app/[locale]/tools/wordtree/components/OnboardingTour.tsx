"use client";

/**
 * OnboardingTour — تور اولیه (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این تور، ۵ مرحله داره:
 *    - مرحله ۰: خوش‌آمدگویی (وسط صفحه)
 *    - مرحله ۱: آشنایی با درخت
 *    - مرحله ۲: دکمه‌ی آبیاری
 *    - مرحله ۳: سکه‌ها
 *    - مرحله ۴: تنظیمات
 * ۲. کاربر می‌تونه با دکمه‌ی «رد کن» تور رو ببنده.
 * ۳. کاربر می‌تونه با دکمه‌ی «بعدی» مرحله‌به‌مرحله جلو بره.
 * ۴. برای اضافه کردن مرحله‌ی جدید، به آرایه‌ی `steps` اضافه کن.
 *
 * ⚠️ هر مرحله یه `target` داره که با `data-tour` توی `page.tsx` مطابقت داره.
 */

import { useState } from "react";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  labels: {
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
    step4Title: string;
    step4Text: string;
    step5Title: string;
    step5Text: string;
    next: string;
    skip: string;
    finish: string;
    stepCounter: string;
  };
}

/**
 * مراحل تور.
 *
 * ⚠️ هر مرحله یه `target` داره که با `data-tour` توی `page.tsx` مطابقت داره.
 * اگه `target` نداشته باشه، حباب وسط صفحه نشون داده می‌شه.
 */
const STEPS = [
  { id: "welcome", target: null },
  { id: "tree", target: "tree" },
  { id: "water", target: "water-button" },
  { id: "coins", target: "coins" },
  { id: "settings", target: "settings" },
];

export function OnboardingTour({
  isOpen,
  onClose,
  labels,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  // ─── محتوای هر مرحله ───
  const stepContent = [
    { title: labels.step1Title, text: labels.step1Text },
    { title: labels.step2Title, text: labels.step2Text },
    { title: labels.step3Title, text: labels.step3Text },
    { title: labels.step4Title, text: labels.step4Text },
    { title: labels.step5Title, text: labels.step5Text },
  ][currentStep];

  // ─── بعدی ───
  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // ─── رد کردن ───
  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* ─── Backdrop ─── */}
      <div className="absolute inset-0 bg-navy-900/80 backdrop-blur-md" />

      {/* ─── حباب تور ─── */}
      <div className="relative bg-paper-100 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full animate-panel-in border-2 border-gold-300/60">
        {/* ─── شمارنده ─── */}
        <div className="flex justify-center gap-1.5 mb-5">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? "w-8 bg-gold-500"
                  : idx < currentStep
                  ? "w-1.5 bg-gold-300"
                  : "w-1.5 bg-navy-900/20"
              }`}
            />
          ))}
        </div>

        {/* ─── آیکون ─── */}
        <div className="text-center mb-4">
          <span className="text-5xl">
            {["👋", "🌳", "💧", "🪙", "⚙️"][currentStep]}
          </span>
        </div>

        {/* ─── محتوا ─── */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-3">
            {stepContent.title}
          </h2>
          <p className="text-sm text-navy-900/70 leading-relaxed">
            {stepContent.text}
          </p>
        </div>

        {/* ─── شمارنده‌ی مرحله ─── */}
        <p className="text-center text-xs text-navy-900/40 font-mono mb-4">
          {labels.stepCounter
            .replace("{current}", (currentStep + 1).toString())
            .replace("{total}", STEPS.length.toString())}
        </p>

        {/* ─── دکمه‌ها ─── */}
        <div className="flex gap-3">
          {!isLast && (
            <button
              onClick={handleSkip}
              className="flex-1 py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900/70 font-bold rounded-sm transition text-sm"
            >
              {labels.skip}
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-sm transition"
          >
            {isLast ? labels.finish : labels.next}
          </button>
        </div>
      </div>
    </div>
  );
}