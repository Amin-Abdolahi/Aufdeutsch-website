"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { CharacterWithBubble } from "@/components/CharacterWithBubble";
import { AnimatedEntrance } from "@/components/AnimatedEntrance";
import { GoldenParticles } from "@/components/GoldenParticles";

interface HeroSectionProps {
  locale: Locale;
}

// ---------- Typewriter Hook ----------
// Reveals text character by character after a delay.
// Returns the partial text and whether typing is complete.
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

  // Respect user's reduced-motion preference
  const [reducedMotion, setReducedMotion] = useState(false);

  // Responsive character size (SSR-safe initial value)
  const [charSize, setCharSize] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 480
        ? 140
        : window.innerWidth < 768
        ? 180
        : window.innerWidth < 1024
        ? 240
        : 280
      : 280
  );

  // Detect mobile viewport (SSR-safe initial value)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 🎯 Responsive character size + mobile detection
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 480) setCharSize(140);
      else if (w < 768) setCharSize(180);
      else if (w < 1024) setCharSize(240);
      else setCharSize(280);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 🎯 Base title (without the emphasis word)
  const baseTitle =
    locale === "fa"
      ? "آلمانی را یاد بگیر"
      : locale === "de"
      ? "Deutsch lernen"
      : "Learn German";

  // 🎯 Emphasis word that gets added after typing completes
  const emphasisWord =
    locale === "fa" ? "درست" : locale === "de" ? "richtig" : "the right way";

  // Top blurred badge label
  const badge =
    locale === "fa"
      ? "مدرسه زبان آلمانی AUF Deutsch"
      : locale === "de"
      ? "Deutschschule AUF Deutsch"
      : "German School AUF Deutsch";

  const { displayed: typedText, done } = useTypewriter(baseTitle, 55, 500);
  const displayed = reducedMotion ? baseTitle : typedText;
  const isDone = reducedMotion ? true : done;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Dotted background pattern */}
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

      {/* Floating golden particles */}
      <GoldenParticles count={30} />

      {/* Decorative slanted bands */}
      <div className="absolute top-0 left-0 w-32 h-full bg-red-600/10 -skew-x-12 origin-top-left" />
      <div className="absolute bottom-0 right-0 w-40 h-60 bg-gold-500/10 skew-x-12 origin-bottom-right" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          {/* ============ Text side ============ */}
          <div className="lg:w-1/2 max-w-[36rem] order-2 lg:order-1">
            {/* 1. Blurred intro badge */}
            <AnimatedEntrance delay={0} direction="left" duration={600}>
              <p
                className="pointer-events-none select-none mb-5 sm:mb-6 text-paper-100"
                style={{
                  fontSize: "clamp(16px, 3.5vw, 26px)",
                  lineHeight: 1.3,
                  fontWeight: 400,
                  filter: "blur(2px)",
                  opacity: 0.7,
                }}
              >
                {badge}
              </p>
            </AnimatedEntrance>

            {/* 2. Main heading with typewriter + emphasis word */}
            <AnimatedEntrance delay={150} direction="left" duration={600}>
              <div
                className="relative mb-9"
                style={{
                  minHeight: isMobile ? "5rem" : "7rem",
                  paddingTop: isMobile ? "3rem" : "6rem", // space for emphasis word
                }}
              >
                <h1
                  className="font-bold text-paper-100 leading-[1.1] tracking-[-0.04em] relative inline-block"
                  style={{ fontSize: "clamp(1.75rem, 5vw, 4.2rem)" }}
                >
                  {displayed}
                  {/* Blinking cursor while typing */}
                  {!isDone && (
                    <span
                      className="inline-block w-[3px] h-[1em] bg-gold-400 align-middle ml-1"
                      style={{ animation: "blink 1s step-end infinite" }}
                    />
                  )}
                </h1>

                {/* Emphasis word ("درست") + curved connector lines */}
                {isDone && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      top: isMobile ? "-3.7rem" : "-9rem",
                      right: isMobile ? "3.5rem" : "30%",
                    }}
                  >
                    <div
                      className="relative inline-block emphasis-word"
                      style={{
                        fontSize: isMobile
                          ? "clamp(3rem, 12vw, 5rem)"
                          : "clamp(4rem, 12vw, 10rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: "#D4AF37",
                      }}
                    >
                      {emphasisWord}

                      {/* Curved connector lines pointing to "یاد" */}
                      <svg
                        width="180"
                        height="80"
                        viewBox="0 0 180 80"
                        className="absolute"
                        style={{
                          bottom: "-10px",
                          left: "90%",
                          transform: "translateX(-50%)",
                        }}
                        aria-hidden="true"
                      >
                        {/* Left curve */}
                        <path
                          d="M 6,60 Q 50,50 60,80"
                          stroke="#D4AF37"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 120,
                            strokeDashoffset: isDone ? 0 : 120,
                            transition: "stroke-dashoffset 1.8s ease-out 0.4s",
                          }}
                        />
                        {/* Right curve */}
                        <path
                          d="M 100,20 Q 50,50 60,90"
                          stroke="#D4AF37"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 120,
                            strokeDashoffset: isDone ? 0 : 120,
                            transition: "stroke-dashoffset 1.8s ease-out 0.8s",
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedEntrance>

            {/* 3. Underline SVG below the title */}
            <AnimatedEntrance delay={300} direction="left" duration={600}>
              <svg
                width="100%"
                height="12"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="mb-8 -mt-2"
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
                    strokeDashoffset: isDone ? 0 : 400,
                    transition: "stroke-dashoffset 1.8s ease-out 1.2s",
                  }}
                />
              </svg>
            </AnimatedEntrance>

            {/* 4. Subtitle */}
            <AnimatedEntrance delay={400} direction="left" duration={600}>
              <p className="text-paper-100/80 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed max-w-[32rem] border-t border-gold-400/40 pt-5">
                {t.home.heroSubtitle}
              </p>
            </AnimatedEntrance>

            {/* 5. Call-to-action buttons */}
            <AnimatedEntrance delay={500} direction="left" duration={600}>
              <div className="flex flex-col sm:flex-row gap-4">
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
            </AnimatedEntrance>
          </div>

          {/* ============ Characters side (two teachers) ============ */}
          <div className="lg:w-1/2 flex justify-center items-end relative order-1 lg:order-2 min-h-[300px] sm:min-h-[380px] lg:min-h-[450px]">
            {/* Soft golden glow behind characters */}
            <div
              className="absolute inset-0 -z-10 opacity-40 blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.5), transparent 60%)",
              }}
            />

            {/* Two characters side by side */}
            <div className="flex items-end justify-center -space-x-6 sm:-space-x-10 md:-space-x-14 lg:-space-x-16">
              {/* Man (Amin) */}
              <AnimatedEntrance delay={100} direction="right" duration={1500}>
                <CharacterWithBubble
                  person="man"
                  size={charSize}
                  defaultMessage="Guten Tag!"
                  clickMessage="Hi 👋, ich bin Amin! Ich helfe dir bei der Prüfungsvorbereitung. 🎯"
                  messages={{
                    center: "Guten Tag!",
                    top: "Willkommen!",
                    "top-right": "Wie geht's?",
                    right: "Los geht's!",
                    "bottom-right": "Bereit?",
                    bottom: "Alles klar?",
                    "bottom-left": "Fragen?",
                    left: "Interessant!",
                    "top-left": "Schön!",
                  }}
                />
              </AnimatedEntrance>

              {/* Woman (Fataneh) */}
              <AnimatedEntrance delay={300} direction="left" duration={1500}>
                <CharacterWithBubble
                  person="woman"
                  size={charSize - 20}
                  defaultMessage="Hallo!"
                  clickMessage="Hallo, ich bin Fataneh! Mit mir lernst du Deutsch von Null an. 🌱💜"
                  messages={{
                    center: "Hallo!",
                    top: "Herzlich willkommen!",
                    "top-right": "Alles gut?",
                    right: "Na, bereit?",
                    "bottom-right": "Fragen?",
                    bottom: "Verstanden?",
                    "bottom-left": "Interessant!",
                    left: "Schön dich zu sehen!",
                    "top-left": "Super!",
                  }}
                />
              </AnimatedEntrance>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}