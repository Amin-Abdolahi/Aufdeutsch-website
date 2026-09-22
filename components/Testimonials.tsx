"use client";

import { Stamp } from "@/components/ui/Stamp";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface Testimonial {
  id: string;
  authorName: string;
  authorInitial: string;
  course: string;
  text: string;
  rating: number;
  locale: "fa" | "de" | "en";
  approved: boolean;
  createdAt: string;
}

interface TestimonialsProps {
  locale: Locale;
  className?: string;
  initialCount?: number;
}

export function Testimonials({
  locale,
  className = "",
  initialCount = 5,
}: TestimonialsProps) {
  const { t } = useLocale();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(false);
    fetch(`/api/testimonials?locale=${locale}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load testimonials");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if (
          !active ||
          (fetchError instanceof DOMException && fetchError.name === "AbortError")
        )
          return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [locale]);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [locale, initialCount]);

  // ---------- حالت بارگذاری ----------
  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative p-6 pt-8 rounded-sm animate-pulse"
              style={{
                background: "linear-gradient(180deg, #fefcf6 0%, #faf5e8 100%)",
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.45)",
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-3deg] bg-yellow-100/70" />
              <div className="h-4 bg-navy-900/10 rounded w-full mb-3" />
              <div className="h-4 bg-navy-900/10 rounded w-5/6 mb-6" />
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-navy-900/10" />
                <div className="space-y-2">
                  <div className="h-3 bg-navy-900/10 rounded w-24" />
                  <div className="h-3 bg-navy-900/10 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------- حالت خالی یا خطا ----------
  if (testimonials.length === 0) {
    return (
      <div className={className} aria-live="polite">
        <p
          className="text-paper-100/70 text-center py-12 text-lg"
          role={error ? "alert" : undefined}
        >
          {locale === "fa"
            ? error
              ? "نمایش نظرات ممکن نشد. لطفاً صفحه را دوباره بارگذاری کنید."
              : "هنوز نظر تاییدشده‌ای وجود ندارد."
            : locale === "de"
            ? error
              ? "Bewertungen konnten nicht geladen werden. Bitte laden Sie die Seite neu."
              : "Noch keine genehmigten Bewertungen."
            : error
            ? "Reviews could not be loaded. Please reload the page."
            : "No approved reviews yet."}
        </p>
      </div>
    );
  }

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, testimonials.length));
  };

  return (
    <div className={className}>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleTestimonials.map((testimonial, index) => {
          // 🎨 پالت رنگ استیکی‌نوت‌های واقعی
          const paperColors = [
            { bg: "linear-gradient(180deg, #fefcf6 0%, #faf5e8 100%)" },
            { bg: "linear-gradient(180deg, #fff9c4 0%, #fff59d 100%)" },
            { bg: "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 100%)" },
            { bg: "linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)" },
            { bg: "linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)" },
            { bg: "linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%)" },
            { bg: "linear-gradient(180deg, #f3e5f5 0%, #e1bee7 100%)" },
          ];
          const paper = paperColors[index % paperColors.length];

          // 🎨 رنگ‌های نوار چسب
          const tapes = [
            "rgba(255, 245, 180, 0.75)",
            "rgba(200, 230, 240, 0.7)",
            "rgba(255, 220, 200, 0.7)",
            "rgba(220, 240, 210, 0.7)",
            "rgba(240, 220, 245, 0.7)",
          ];
          const tape = tapes[index % tapes.length];

          // 📐 تیلت
          const tilts = [
            "-1.6deg",
            "1.2deg",
            "-1.1deg",
            "1.8deg",
            "-1.4deg",
            "0.9deg",
            "-1.3deg",
          ];
          const tilt = tilts[index % tilts.length];

          // 📐 زاویه‌ی نوار چسب
          const tapeAngles = ["-4deg", "3deg", "-2deg", "5deg", "-3deg"];
          const baseTapeAngle = tapeAngles[index % tapeAngles.length];
          const tapeAngleNum = parseFloat(baseTapeAngle);

          // 📍 موقعیت نوار چسب
          const tapePositions = ["left-6", "left-1/2 -translate-x-1/2", "right-6"];
          const tapePosition = tapePositions[index % tapePositions.length];

          // 🌊 لبه‌های موج‌دار
          const wavePaths = [
            "polygon(0 0, 100% 0, 100% calc(100% - 8px), 97% 100%, 94% calc(100% - 5px), 90% 100%, 86% calc(100% - 7px), 82% 100%, 78% calc(100% - 4px), 74% 100%, 70% calc(100% - 6px), 66% 100%, 62% calc(100% - 3px), 58% 100%, 54% calc(100% - 6px), 50% 100%, 46% calc(100% - 4px), 42% 100%, 38% calc(100% - 7px), 34% 100%, 30% calc(100% - 5px), 26% 100%, 22% calc(100% - 6px), 18% 100%, 14% calc(100% - 3px), 10% 100%, 6% calc(100% - 5px), 3% 100%, 0 calc(100% - 7px))",
            "polygon(0 0, 100% 0, 100% calc(100% - 6px), 96% 100%, 92% calc(100% - 4px), 88% 100%, 84% calc(100% - 6px), 80% 100%, 76% calc(100% - 3px), 72% 100%, 68% calc(100% - 5px), 64% 100%, 60% calc(100% - 4px), 56% 100%, 52% calc(100% - 6px), 48% 100%, 44% calc(100% - 3px), 40% 100%, 36% calc(100% - 6px), 32% 100%, 28% calc(100% - 4px), 24% 100%, 20% calc(100% - 5px), 16% 100%, 12% calc(100% - 3px), 8% 100%, 4% calc(100% - 6px), 0 100%)",
            "polygon(0 0, 100% 0, 100% calc(100% - 7px), 95% 100%, 90% calc(100% - 5px), 85% 100%, 80% calc(100% - 4px), 75% 100%, 70% calc(100% - 7px), 65% 100%, 60% calc(100% - 3px), 55% 100%, 50% calc(100% - 6px), 45% 100%, 40% calc(100% - 4px), 35% 100%, 30% calc(100% - 7px), 25% 100%, 20% calc(100% - 5px), 15% 100%, 10% calc(100% - 3px), 5% 100%, 0 calc(100% - 6px))",
          ];
          const wavePath = wavePaths[index % wavePaths.length];

          // 🛂 رنگ‌های متنوع مهر پاسپورت
          const stampColors = [
            "#1B2A44",
            "#8B1A1A",
            "#1B5E20",
            "#4A148C",
            "#B34700",
            "#0D47A1",
          ];
          const stampColor = stampColors[index % stampColors.length];

          // 📐 زاویه‌ی مهر
          const stampRotations = [-8, 5, -6, 10, -4, 7, -9, 3];
          const stampRotation = stampRotations[index % stampRotations.length];

          return (
            <div
              key={testimonial.id}
              className="group relative transition-all duration-500 ease-out"
              style={{
                transform: `rotate(${tilt})`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "rotate(0deg) translateY(-6px)";
                const tapeEl =
                  e.currentTarget.querySelector<HTMLElement>("[data-tape]");
                if (tapeEl) {
                  const isTranslated = tapeEl.dataset.translated === "true";
                  tapeEl.style.transform = isTranslated
                    ? `translateX(-50%) rotate(${
                        tapeAngleNum + (index % 2 === 0 ? -3 : 3)
                      }deg)`
                    : `rotate(${tapeAngleNum + (index % 2 === 0 ? -3 : 3)}deg)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `rotate(${tilt})`;
                const tapeEl =
                  e.currentTarget.querySelector<HTMLElement>("[data-tape]");
                if (tapeEl) {
                  const isTranslated = tapeEl.dataset.translated === "true";
                  tapeEl.style.transform = isTranslated
                    ? `translateX(-50%) rotate(${baseTapeAngle})`
                    : `rotate(${baseTapeAngle})`;
                }
              }}
              itemScope
              itemType="https://schema.org/Review"
            >
              {/* نوار چسب بالای کاغذ */}
              <div
                data-tape="true"
                data-translated={
                  tapePosition.includes("translate") ? "true" : "false"
                }
                className={`absolute -top-3 ${tapePosition} w-24 h-6 z-20 transition-transform duration-500 ease-out`}
                style={{
                  transform: tapePosition.includes("translate")
                    ? `translateX(-50%) rotate(${baseTapeAngle})`
                    : `rotate(${baseTapeAngle})`,
                  background: `linear-gradient(180deg, ${tape}, ${tape
                    .replace("0.7", "0.5")
                    .replace("0.75", "0.55")})`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(0.5px)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.8) 3px, rgba(255,255,255,0.8) 4px)",
                  }}
                />
              </div>

              {/* کاغذ موج‌دار */}
              <div
                className="relative p-6 pt-8"
                style={{
                  background: paper.bg,
                  clipPath: wavePath,
                  filter:
                    "drop-shadow(0 10px 15px rgba(0,0,0,0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                }}
              >
                {/* متن نظر */}
                <p
                  itemProp="reviewBody"
                  className="text-navy-900/85 text-base leading-relaxed mb-5 relative z-10"
                >
                  “{testimonial.text}”
                </p>

                {/* اطلاعات نویسنده */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-11 h-11 rounded-full bg-white/60 flex items-center justify-center shrink-0 border border-navy-900/10">
                    <span className="text-gold-700 font-bold text-lg">
                      {testimonial.authorInitial}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div
                      itemProp="author"
                      className="font-bold text-navy-900 text-sm truncate"
                    >
                      {testimonial.authorName}
                    </div>
                    <div className="text-navy-900/60 text-xs truncate">
                      {testimonial.course}
                    </div>

                    {/* ستاره‌ها */}
                    <div
                      className="flex gap-0.5 mt-1"
                      aria-label={`Rating: ${testimonial.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < testimonial.rating
                              ? "text-gold-500 fill-current"
                              : "text-navy-900/20"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🛂 مهر پاسپورت */}
                <div
                  className="absolute bottom-2 left-2 opacity-50 group-hover:opacity-90 transition-opacity duration-500 z-20 pointer-events-none"
                  style={{
                    color: stampColor,
                    transform: `rotate(${stampRotation}deg)`,
                  }}
                >
                  <Stamp size={68} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* دکمه نظرات بیشتر */}
      {hasMore && (
        <div className="text-center pt-12 relative z-10">
          <button
            onClick={handleShowMore}
            className="group/more inline-flex flex-col items-center gap-3
                       text-paper-100/70 hover:text-gold-400
                       transition-all duration-300 cursor-pointer"
            aria-label={
              locale === "fa"
                ? "نمایش نظرات بیشتر"
                : locale === "de"
                ? "Weitere Bewertungen anzeigen"
                : "Show more reviews"
            }
          >
            {/* فلش گچی رو به پایین */}
            <svg
              width="40"
              height="48"
              viewBox="0 0 40 48"
              color="#D4AF37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover/more:translate-y-2"
            >
              <path
                d="M20 4 Q22 14 19 26 Q21 32 20 36"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              <path
                d="M10 32 Q15 36 20 42 Q25 36 30 32"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
              <circle cx="8" cy="30" r="0.8" fill="currentColor" opacity="0.4" />
              <circle cx="33" cy="34" r="0.6" fill="currentColor" opacity="0.3" />
              <circle cx="6" cy="42" r="0.5" fill="currentColor" opacity="0.3" />
              <circle cx="1" cy="20" r="1" fill="currentColor" opacity="0.5" />
              <circle cx="30" cy="7" r="1" fill="currentColor" opacity="0.3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}