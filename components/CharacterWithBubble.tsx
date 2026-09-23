"use client";

import { useState, useEffect } from "react";
import { MouseTrackingCharacter } from "./MouseTrackingCharacter";
import { SpeechBubble } from "./SpeechBubble";

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

interface CharacterWithBubbleProps {
  person: "man" | "woman";
  size?: number;
  messages: Partial<Record<Direction, string>>;
  defaultMessage: string;
  clickMessage?: string;   // ← پیام کلیک
}

export function CharacterWithBubble({
  person,
  size = 280,
  messages,
  defaultMessage,
  clickMessage = "Klick mich!",   // ← پیش‌فرض
}: CharacterWithBubbleProps) {
  const [direction, setDirection] = useState<Direction>("center");
  const [clicked, setClicked] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  // پیام فعلی حباب
  const currentMessage = clicked
    ? clickMessage
    : messages[direction] || defaultMessage;

  // مدیریت کلیک
  const handleClick = () => {
    setClicked(true);
    setBouncing(true);

    // افکت bounce
    setTimeout(() => setBouncing(false), 600);

    // بعد از ۳ ثانیه، برگرد به حالت عادی
    setTimeout(() => setClicked(false), 5000);
  };
   // 📍 موقعیت حباب: وقتی کلیک شده، از لبه‌ی داخلی به بیرون (به سمت فضای خالی)
  const bubblePosition = clicked
    ? person === "man"
      ? "top-right"   // مرد: به سمت راست (فضای خالی)
      : "top-left"    // زن: به سمت چپ (فضای خالی)
    : "top";


  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        transform: bouncing ? "scale(1.05)" : "scale(1)",
        transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* حباب گفتگو */}
      <SpeechBubble 
      text={currentMessage} 
      position="top" 
      delay={800} 
      maxWidth={clicked ? 220 : 200}
      multiline={clicked}
      />

      {/* کاراکتر */}
      <MouseTrackingCharacter
        person={person}
        size={size}
        onDirectionChange={setDirection}
        onClick={handleClick}
      />
    </div>
  );
}