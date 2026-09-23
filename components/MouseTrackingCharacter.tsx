"use client";

import { useEffect, useRef, useState } from "react";

type Direction =
  | "center"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

type Person = "man" | "woman";

interface MouseTrackingCharacterProps {
  person?: Person;
  size?: number;
  className?: string;
  onDirectionChange?: (direction: Direction) => void;
  onClick?: () => void;
}

export function MouseTrackingCharacter({
  person = "man",
  size = 420,
  className = "",
  onDirectionChange,
  onClick,
}: MouseTrackingCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("center");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);   // ← ✅ این خط اضافه شد

  // چک کن کاربر reduced motion می‌خواد یا نه
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // اگه reduced motion، eye-tracking رو غیرفعال کن
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // محاسبه‌ی جهت
      let newDirection: Direction = "center";
      if (distance >= 80) {
        if (angle >= -157.5 && angle < -112.5) newDirection = "top-left";
        else if (angle >= -112.5 && angle < -67.5) newDirection = "top";
        else if (angle >= -67.5 && angle < -22.5) newDirection = "top-right";
        else if (angle >= -22.5 && angle < 22.5) newDirection = "right";
        else if (angle >= 22.5 && angle < 67.5) newDirection = "bottom-right";
        else if (angle >= 67.5 && angle < 112.5) newDirection = "bottom";
        else if (angle >= 112.5 && angle < 157.5) newDirection = "bottom-left";
        else newDirection = "left";
      }

      setDirection(newDirection);
      if (onDirectionChange) onDirectionChange(newDirection);

      // offset
      const maxOffset = 6;
      const offsetX = (dx / window.innerWidth) * maxOffset * 2;
      const offsetY = (dy / window.innerHeight) * maxOffset;

      setOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, offsetX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, offsetY)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [onDirectionChange, reducedMotion]);   // ← ✅ reducedMotion به وابستگی اضافه شد

  const imageMap: Record<Direction, string> = {
    center: `/teacher/${person}/center.png`,
    top: `/teacher/${person}/top.png`,
    "top-right": `/teacher/${person}/top-right.png`,
    right: `/teacher/${person}/right.png`,
    "bottom-right": `/teacher/${person}/bottom-right.png`,
    bottom: `/teacher/${person}/bottom.png`,
    "bottom-left": `/teacher/${person}/bottom-left.png`,
    left: `/teacher/${person}/left.png`,
    "top-left": `/teacher/${person}/top-left.png`,
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none cursor-pointer ${className}`} 
      onClick={onClick}
      style={{ width: size, height: size, perspective: "1000px" }}
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full"
        style={{
          // اگه reduced motion، بدون تیلت و ترنزیشن
          transform: reducedMotion
            ? "none"
            : `translate3d(${offset.x}px, ${offset.y}px, 0) rotateY(${
                offset.x * 0.3
              }deg) rotateX(${-offset.y * 0.2}deg)`,
          transformStyle: "preserve-3d",
          transition: reducedMotion ? "none" : "transform 300ms ease-out",
        }}
      >
        <img
          src={imageMap[reducedMotion ? "center" : direction]}
          alt={`AUF Deutsch ${person === "man" ? "Lehrer" : "Lehrerin"}`}
          className="w-full h-full object-contain"
          style={{
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
            transition: reducedMotion ? "none" : "opacity 200ms",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}