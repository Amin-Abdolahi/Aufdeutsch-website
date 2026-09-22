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
}

export function MouseTrackingCharacter({
  person = "man",
  size = 420,
  className = "",
}: MouseTrackingCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("center");
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // --- تشخیص جهت ---
      if (distance < 80) {
        setDirection("center");
      } else if (angle >= -157.5 && angle < -112.5) {
        setDirection("top-left");
      } else if (angle >= -112.5 && angle < -67.5) {
        setDirection("top");
      } else if (angle >= -67.5 && angle < -22.5) {
        setDirection("top-right");
      } else if (angle >= -22.5 && angle < 22.5) {
        setDirection("right");
      } else if (angle >= 22.5 && angle < 67.5) {
        setDirection("bottom-right");
      } else if (angle >= 67.5 && angle < 112.5) {
        setDirection("bottom");
      } else if (angle >= 112.5 && angle < 157.5) {
        setDirection("bottom-left");
      } else {
        setDirection("left");
      }

      // --- offset برای tilt سه‌بعدی ---
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
  }, []);

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
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        perspective: "1000px",
      }}
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotateY(${
            offset.x * 0.3
          }deg) rotateX(${-offset.y * 0.2}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={imageMap[direction]}
          alt={`AUF Deutsch ${person === "man" ? "Lehrer" : "Lehrerin"}`}
          className="w-full h-full object-contain transition-opacity duration-200"
          style={{
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}