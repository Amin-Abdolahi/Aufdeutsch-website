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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // موقعیت اولیه (قبل از ورود)
  const initialTransforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.85)",
  };

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0) scale(1)" : initialTransforms[direction],
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}