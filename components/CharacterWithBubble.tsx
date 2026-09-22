"use client";

import { useState } from "react";
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
}

export function CharacterWithBubble({
  person,
  size = 280,
  messages,
  defaultMessage,
}: CharacterWithBubbleProps) {
  const [direction, setDirection] = useState<Direction>("center");
  const currentMessage = messages[direction] || defaultMessage;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* حباب گفتگو */}
      <SpeechBubble text={currentMessage} position="top" delay={800} />

      {/* کاراکتر */}
      <MouseTrackingCharacter
        person={person}
        size={size}
        onDirectionChange={setDirection}
      />
    </div>
  );
}