"use client";

/**
 * useGameState — مدیریت State بازی
 */

import { useState, useEffect } from "react";
import { GameState, WordEntry } from "@/lib/wordtree/types";
import { loadGameState, saveGameState } from "@/lib/wordtree/storage";
import { autoSnapshot } from "@/lib/wordtree/snapshot";
import { createInitialState } from "@/lib/wordtree/gameLogic";
import { loadCustomWords } from "@/lib/wordtree/customWords";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [customWords, setCustomWords] = useState<WordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadGameState();
    const initial = saved || createInitialState();
    setGameState(initial);
    setCustomWords(loadCustomWords());
    autoSnapshot();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  const reloadCustomWords = () => setCustomWords(loadCustomWords());

  return {
    gameState,
    setGameState,
    customWords,
    setCustomWords,
    reloadCustomWords,
    isLoaded,
  };
}