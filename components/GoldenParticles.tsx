"use client";

import { useEffect, useState, useRef } from "react";

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  size: number;
  curve: boolean;
}

export function GoldenParticles({ count = 30 }: { count?: number }) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shooting, setShooting] = useState<ShootingStar[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // ⭐ ساخت ستاره‌های ثابت چشمک‌زن
  useEffect(() => {
    if (reducedMotion) return;

    const newStars: Star[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      twinkleDelay: Math.random() * 5,
      twinkleDuration: 1.5 + Math.random() * 2.5,
    }));

    setStars(newStars);
  }, [count, reducedMotion]);

  // 🌠 شهاب‌سنگ هر ۵ ثانیه
  useEffect(() => {
    if (reducedMotion) return;

    const createShootingStar = () => {
      // ۸ جهت ممکن
      const directions = [
        { x: -1, y: 1 },      // پایین-چپ
        { x: 1, y: 1 },       // پایین-راست
        { x: -1, y: 0.5 },    // چپ (کمی پایین)
        { x: 1, y: 0.5 },     // راست (کمی پایین)
        { x: -1, y: -1 },     // بالا-چپ
        { x: 1, y: -1 },      // بالا-راست
        { x: 0.7, y: 1 },     // پایین-راست تند
        { x: -0.7, y: 1 },    // پایین-چپ تند
      ];

      const dir = directions[Math.floor(Math.random() * directions.length)];
      const distance = 600 + Math.random() * 500;

      // نقطه‌ی شروع بر اساس جهت
      let startX = 50;
      let startY = 50;

      if (dir.x > 0) startX = -10;
      else if (dir.x < 0) startX = 110;

      if (dir.y > 0) startY = -10;
      else if (dir.y < 0) startY = 110;

      const newStar: ShootingStar = {
        id: idRef.current++,
        startX,
        startY,
        endX: dir.x * distance,
        endY: dir.y * distance,
        duration: 1.5 + Math.random() * 2,
        size: 2 + Math.random() * 2,
        curve: Math.random() < 0.4, // ۴۰٪ منحنی
      };

      setShooting((prev) => [...prev, newStar]);

      // حذف بعد از اتمام
      setTimeout(() => {
        setShooting((prev) => prev.filter((s) => s.id !== newStar.id));
      }, newStar.duration * 1000 + 200);
    };

    // اولین شهاب بعد از ۲ ثانیه
    const initialTimeout = setTimeout(createShootingStar, 2000);
    // هر ۵ ثانیه بعدی
    const interval = setInterval(createShootingStar, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      dir="ltr"
      aria-hidden="true"
    >
      {/* ⭐ ذرات ستاره‌ای چشمک‌زن */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background:
              "radial-gradient(circle, #FFD966 0%, #D4AF37 60%, transparent 100%)",
            boxShadow: `0 0 ${s.size * 3}px rgba(212, 175, 55, 0.6)`,
            animation: `twinkle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
          }}
        />
      ))}

      {/* 🌠 شهاب‌سنگ‌ها با هاله‌ی نرم */}
      {shooting.map((s) => {
        const curveStyle = s.curve
          ? {
              "--mid-x": `${s.endX * 0.6}px`,
              "--mid-y": `${s.endY * 0.8}px`,
              "--end-x": `${s.endX}px`,
              "--end-y": `${s.endY}px`,
            }
          : {
              "--end-x": `${s.endX}px`,
              "--end-y": `${s.endY}px`,
            };

        return (
          <div
            key={s.id}
            className="absolute"
            style={{
              left: `${s.startX}%`,
              top: `${s.startY}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ...(curveStyle as any),
              animation: s.curve
                ? `shoot-curve ${s.duration}s ease-in forwards`
                : `shoot-straight ${s.duration}s linear forwards`,
            }}
          >
            {/* 🌀 هاله‌ی نرم پشت شهاب (دنباله‌ی محو) */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${s.size * 3}px`,
                height: `${s.size * 3}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(255, 217, 102, 0.5) 0%, rgba(255, 217, 102, 0.2) 40%, transparent 70%)",
                filter: "blur(3px)",
                pointerEvents: "none",
              }}
            />

            {/* ✨ سر شهاب (نقطه‌ی درخشان) */}
            <div
              className="absolute rounded-full"
              style={{
                width: `${s.size}px`,
                height: `${s.size}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, #FFFFFF 0%, #FFD966 50%, #D4AF37 100%)",
                boxShadow: "0 0 15px 4px rgba(255, 217, 102, 0.9)",
              }}
            />
          </div>
        );
      })}

      <style jsx>{`
        /* ⭐ چشمک‌زدن ستاره */
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        /* 🌠 شهاب مستقیم */
        @keyframes shoot-straight {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
          }
        }

        /* 🌊 شهاب منحنی */
        @keyframes shoot-curve {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          50% {
            transform: translate(var(--mid-x), var(--mid-y));
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}