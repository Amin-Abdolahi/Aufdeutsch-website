"use client";

import { useEffect, useState, ReactNode } from "react";

interface AnimatedEntranceProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  duration?: number;
  className?: string;
}

export function AnimatedEntrance({
  children,
  delay = 0,
  direction = "up",
  duration = 700,
  className = "",
}: AnimatedEntranceProps) {
  // Controls whether the entrance animation has started
  const [visible, setVisible] = useState(false);

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

  // Trigger the entrance after the specified delay
  // (instant if reduced motion is enabled)
  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, reducedMotion]);

  // Starting transform for each entrance direction
  const initialTransforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.85)",
  };

  // Skip the animation entirely when reduced motion is enabled
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        // Snap to final position once visible
        transform: visible
          ? "translate(0, 0) scale(1)"
          : initialTransforms[direction],
        // Smooth easing for both opacity and transform
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        // Hint the browser to optimize for these properties
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}