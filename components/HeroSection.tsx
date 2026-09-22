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
function useTypewriter(text: string, speed = 38, startDelay = 600) {
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

  const { displayed, done } = useTypewriter(fullTitle, 55, 800);

  // دکمه‌ها ۴۰۰ms بعد از لود ظاهر می‌شن
  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* پس‌زمینه‌ی نقطه‌چین */}
      <div className="absolute inset-0 opacity-5">
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
      <div className="absolute bottom-0 right-0 w-40 h-full bg-gold-500/10 skew-x-12 origin-bottom-right" />

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
                filter: "blur(4px)",
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

// ---------- کارت پستال ----------
function PostcardCard({ locale }: { locale: Locale }) {
  return (
    <div className="relative group">
      {/* نوار چسب گوشه */}
      <div className="absolute -top-3 -left-3 w-20 h-6 bg-yellow-100/60 rotate-[-15deg] z-20 shadow-sm" />
      <div className="absolute -top-3 -right-3 w-16 h-6 bg-blue-100/60 rotate-[12deg] z-20 shadow-sm" />

      {/* کارت پستال اصلی */}
      <div
        className="relative w-[320px] sm:w-[380px] aspect-[3/4] p-6 sm:p-8"
        style={{
          background: "linear-gradient(180deg, #fefcf6 0%, #faf5e8 100%)",
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 8px), 97% 100%, 94% calc(100% - 5px), 90% 100%, 86% calc(100% - 7px), 82% 100%, 78% calc(100% - 4px), 74% 100%, 70% calc(100% - 6px), 66% 100%, 62% calc(100% - 3px), 58% 100%, 54% calc(100% - 6px), 50% 100%, 46% calc(100% - 4px), 42% 100%, 38% calc(100% - 7px), 34% 100%, 30% calc(100% - 5px), 26% 100%, 22% calc(100% - 6px), 18% 100%, 14% calc(100% - 3px), 10% 100%, 6% calc(100% - 5px), 3% 100%, 0 calc(100% - 7px))",
          filter:
            "drop-shadow(0 20px 30px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        }}
      >
        <div className="flex flex-col h-full">
          {/* تمبر */}
          <div className="flex justify-end mb-4">
            <div
              className="w-16 h-20 border-2 border-dashed border-navy-900/30 flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, #fefcf6, #f5efe0)",
              }}
            >
              <svg viewBox="0 0 40 50" className="w-10 h-12">
                {/* Brandenburg Gate ساده */}
                <rect x="4" y="20" width="32" height="20" fill="#1B2A44" />
                <rect x="6" y="22" width="4" height="18" fill="#fefcf6" />
                <rect x="12" y="22" width="4" height="18" fill="#fefcf6" />
                <rect x="18" y="22" width="4" height="18" fill="#fefcf6" />
                <rect x="24" y="22" width="4" height="18" fill="#fefcf6" />
                <rect x="30" y="22" width="4" height="18" fill="#fefcf6" />
                {/* سقف */}
                <polygon points="4,20 20,12 36,20" fill="#8B1A1A" />
                {/* ستاره */}
                <circle cx="20" cy="8" r="2" fill="#D4AF37" />
              </svg>
            </div>
          </div>

          {/* خط جداکننده */}
          <div className="border-t-2 border-dashed border-navy-900/20 mb-4" />

          {/* متن دست‌نویس */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <p
              className="text-navy-900 mb-3"
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "2rem",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {locale === "fa" ? "سلام!" : locale === "de" ? "Hallo!" : "Hello!"}
            </p>
            <p
              className="text-navy-900/80 mb-4"
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "1.4rem",
                lineHeight: 1.3,
              }}
            >
              {locale === "fa"
                ? "به آلمان خوش آمدید"
                : locale === "de"
                ? "Willkommen in Deutschland"
                : "Welcome to Germany"}
            </p>

            {/* خط تزئینی */}
            <svg width="80" height="8" viewBox="0 0 80 8" className="my-2">
              <path
                d="M0,4 Q20,1 40,4 T80,4"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <p
              className="text-navy-900/60 text-xs tracking-widest mt-2"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              AUF DEUTSCH
            </p>
          </div>

          {/* خطوط پایین (شبیه کارت پستال) */}
          <div className="space-y-1.5 mt-4">
            <div className="border-b border-navy-900/20 h-2" />
            <div className="border-b border-navy-900/20 h-2" />
            <div className="border-b border-navy-900/20 h-2 w-3/4" />
          </div>
        </div>
      </div>

      {/* مهر پاسپورت کوچیک گوشه */}
      <div
        className="absolute -bottom-4 -right-4 opacity-70 z-20 pointer-events-none"
        style={{
          color: "#8B1A1A",
          transform: "rotate(-12deg)",
        }}
      >
        <div
          className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-center"
          style={{ borderColor: "#8B1A1A" }}
        >
          <div className="text-[8px] font-bold leading-tight" style={{ color: "#8B1A1A" }}>
            AUF
            <br />
            DEUTSCH
            <br />
            ★★★
          </div>
        </div>
      </div>
    </div>
  );
}