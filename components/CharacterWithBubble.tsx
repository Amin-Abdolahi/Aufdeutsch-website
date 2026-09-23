"use client";

import { useState, useEffect } from "react";
import { MouseTrackingCharacter } from "./MouseTrackingCharacter";
import { SpeechBubble } from "./SpeechBubble";

// All possible directions the character can look at
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
  // Directional messages: key = direction, value = text to show
  messages: Partial<Record<Direction, string>>;
  // Fallback message when no directional message exists
  defaultMessage: string;
  // Message shown on click
  clickMessage?: string;
}

export function CharacterWithBubble({
  person,
  size = 280,
  messages,
  defaultMessage,
  clickMessage = "Klick mich!",
}: CharacterWithBubbleProps) {
  // Current look direction (updated by mouse tracking)
  const [direction, setDirection] = useState<Direction>("center");
  // Whether the character was just clicked
  const [clicked, setClicked] = useState(false);
  // Whether to play the bounce animation
  const [bouncing, setBouncing] = useState(false);

  // Determine the current bubble message:
  // - Clicked  → show click message
  // - Otherwise → show direction-specific message (or fallback)
  const currentMessage = clicked
    ? clickMessage
    : messages[direction] || defaultMessage;

  // Handle character click:
  // 1. Show click message
  // 2. Trigger bounce animation (600ms)
  // 3. Revert to normal after 5 seconds
  const handleClick = () => {
    setClicked(true);
    setBouncing(true);

    setTimeout(() => setBouncing(false), 600);
    setTimeout(() => setClicked(false), 5000);
  };

  // 📍 Bubble position:
  // When clicked, move bubble outward (toward empty space on the outer side).
  // Man (right character) → opens to the right
  // Woman (left character) → opens to the left
  const bubblePosition = clicked
    ? person === "man"
      ? "top-right"
      : "top-left"
    : "top";

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        // Bounce effect on click
        transform: bouncing ? "scale(1.05)" : "scale(1)",
        transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Speech bubble above the character */}
      <SpeechBubble
        text={currentMessage}
        position="top"
        delay={800}
        // Wider max-width when showing the (longer) click message
        maxWidth={clicked ? 220 : 200}
        // Multi-line mode for the click message
        multiline={clicked}
      />

      {/* The animated character itself */}
      <MouseTrackingCharacter
        person={person}
        size={size}
        onDirectionChange={setDirection}
        onClick={handleClick}
      />
    </div>
  );
}