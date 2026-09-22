"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { MouseTrackingCharacter } from "@/components/MouseTrackingCharacter";

interface HeroSectionProps {
  locale: Locale;
}

// ---------- هوک Typewriter ----------
function useTypewriter(text: string, speed = 55, startDelay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { t } = useLocale();
  const [showButtons, setShowButtons] = useState(false);

  // تیتر کامل بر اساس زبان
  const fullTitle =
    locale === "fa"
      ? "آلمانی را درست یاد بگیرید"
      : locale === "de"
      ? "Deutsch richtig lernen"
      : "Learn German the right way";

  // برچسب blur بالای تیتر
  const badge =
    locale === "fa"
      ? "مدرسه زبان آلمانی AUF Deutsch"
      : locale === "de"
      ? "Deutschschule AUF Deutsch"
      : "German School AUF Deutsch";

  const { displayed, done } = useTypewriter(fullTitle, 55, 500);

  // دکمه‌ها ۴۰۰ms بعد از لود ظاهر می‌شن
  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* پس‌زمینه‌ی نقطه‌چین */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23F3ECDD' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* نوارهای تزئینی */}
      <div className="absolute top-0 left-0 w-32 h-full bg-red-600/10 -skew-x-12 origin-top-left" />
      <div className="absolute bottom-0 right-0 w-40 h-60 bg-gold-500/10 skew-x-12 origin-bottom-right" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* ============ سمت راست: متن ============ */}
          <div className="lg:w-1/2 max-w-[36rem]">
            {/* ۱. برچسب blur */}
            <p
              className="pointer-events-none select-none mb-5 sm:mb-6 text-paper-100"
              style={{
                fontSize: "clamp(18px, 4vw, 26px)",
                lineHeight: 1.3,
                fontWeight: 400,
                filter: "blur(2px)",
                opacity: 0.7,
              }}
            >
              {badge}
            </p>

            {/* ۲. تیتر Typewriter */}
            <h1
              className="font-bold text-paper-100 leading-[1.1] tracking-[-0.04em] mb-8"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                minHeight: "1.2em",
              }}
            >
              {displayed}
              {!done && (
                <span
                  className="inline-block w-[3px] h-[1em] bg-gold-400 align-middle ml-1"
                  style={{
                    animation: "blink 1s step-end infinite",
                  }}
                />
              )}
            </h1>

            {/* ۳. خط SVG زیر تیتر */}
            <svg
              width="100%"
              height="12"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              className="mb-8 -mt-4"
              aria-hidden="true"
            >
              <path
                d="M0,8 Q75,2 150,7 T300,5"
                stroke="#D4AF37"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 400,
                  strokeDashoffset: done ? 0 : 400,
                  transition: "stroke-dashoffset 1.2s ease-out 0.3s",
                }}
              />
            </svg>

            {/* ۴. توضیح */}
            <p className="text-paper-100/80 text-lg md:text-xl mb-10 leading-relaxed max-w-[32rem] border-t border-gold-400/40 pt-5">
              {t.home.heroSubtitle}
            </p>

            {/* ۵. دکمه‌ها */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                opacity: showButtons ? 1 : 0,
                transform: showButtons ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              <Button
                href={`/${locale}/contact`}
                size="lg"
                className="font-mono tracking-[0.08em]"
              >
                {t.home.heroCta}
              </Button>
              <Button
                href={`/${locale}/courses`}
                variant="outline"
                size="lg"
                className="tracking-[0.08em]"
              >
                {t.home.heroViewCourses}
              </Button>
            </div>
          </div>

         {/* ============ سمت کاراکترها (دو مدرس) ============ */}
<div className="lg:w-1/2 flex justify-center items-end relative order-1 lg:order-2 min-h-[400px]">
  {/* هاله‌ی طلایی پشت */}
  <div
    className="absolute inset-0 -z-10 opacity-40 blur-3xl pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.5), transparent 60%)",
    }}
  />

  {/* دو کاراکتر کنار هم */}
  <div className="flex items-end justify-center -space-x-8 sm:-space-x-12 lg:-space-x-16">
    {/* مرد (چپ) */}
    <div className="relative" style={{ width: 280, height: 280 }}>
      <MouseTrackingCharacter person="man" size={280} />
    </div>

    {/* زن (راست) */}
    <div className="relative" style={{ width: 280, height: 280 }}>
      <MouseTrackingCharacter person="woman" size={280} />
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
