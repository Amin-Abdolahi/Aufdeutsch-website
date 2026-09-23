"use client";

import { useEffect, useState } from "react";

interface SpeechBubbleProps {
  text: string;
  visible?: boolean;
  position?: "top" | "left" | "right" | "top-left" | "top-right";
  delay?: number;
  maxWidth?: number;
  multiline?: boolean;
}

export function SpeechBubble({
  text,
  visible = true,
  position = "top",
  delay = 0,
  maxWidth = 220,
  multiline = false,
}: SpeechBubbleProps) {
  // Controls the fade-in / slide-up animation
  const [show, setShow] = useState(false);

  // Whether user prefers reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect the user's reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Show the bubble after a delay (instant if reduced motion)
  useEffect(() => {
    if (reducedMotion) {
      setShow(true);
      return;
    }

    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);

  // Bubble position (relative to parent)
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-4",
    left: "right-full top-1/2 -translate-y-1/2 mr-4",
    right: "left-full top-1/2 -translate-y-1/2 ml-4",
    "top-left": "bottom-full right-0 mb-4",
    "top-right": "bottom-full left-0 mb-4",
  };

  // Tail (small arrow) position for each bubble position
  const tailClasses = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-1",
    left: "left-full top-1/2 -translate-y-1/2 -ml-1",
    right: "right-full top-1/2 -translate-y-1/2 -mr-1",
    "top-left": "top-full right-8 -mt-1",
    "top-right": "top-full left-8 -mt-1",
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-30 pointer-events-none`}
      style={{
        opacity: show && visible ? 1 : 0,
        // Subtle slide-up + scale entrance (skipped when reduced motion)
        transform: reducedMotion
          ? "translateX(-50%)"
          : `translateX(-50%) translateY(${show ? 0 : 8}px) scale(${
              show ? 1 : 0.9
            })`,
        transition: reducedMotion
          ? "opacity 0.01ms"
          : "opacity 0.5s ease, transform 0.5s ease",
        // Cap width so bubbles don't overflow on small screens
        maxWidth: `min(${maxWidth}px, 60vw)`,
      }}
      aria-hidden="true"
    >
      {/* The bubble itself */}
      <div
        className="relative px-5 py-3 rounded-2xl shadow-lg"
        style={{
          minWidth: "80px",
          background: "linear-gradient(180deg, #fefcf6 0%, #faf5e8 100%)",
          border: "2px solid rgba(212, 175, 55, 0.3)",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <p
          dir="ltr"
          className={`text-navy-900 font-bold text-xs sm:text-sm text-center ${
            // Allow wrapping only when multiline is enabled
            multiline ? "break-words whitespace-normal" : "whitespace-nowrap"
          }`}
          style={{
            fontFamily: "ui-monospace, 'Courier New', monospace",
            letterSpacing: "0.02em",
            fontSize: "clamp(10px, 2.5vw, 14px)",
          }}
        >
          {text}
        </p>

        {/* Small tail (arrow) pointing to the character */}
        <div
          className={`absolute ${tailClasses[position]}`}
          style={{
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: position === "top" ? "10px solid #faf5e8" : "none",
          }}
        />
      </div>
    </div>
  );
}