"use client";

/**
 * useWordActions — افزودن، ایمپورت کلمات
 */

import { GameState, WordEntry, ImportResult } from "@/lib/wordtree/types";
import { addCustomWord, loadCustomWords } from "@/lib/wordtree/customWords";
import { importWordsFromJSON } from "@/lib/wordtree/jsonImport";
import { REWARD_CUSTOM_WORD } from "@/lib/wordtree/constants";

interface UseWordActionsProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  setCustomWords: (words: WordEntry[]) => void;
  rewardEarned: string;
  coinsLabel: string;
  onReward: (message: string) => void;
}

export function useWordActions({
  gameState,
  setGameState,
  setCustomWords,
  rewardEarned,
  coinsLabel,
  onReward,
}: UseWordActionsProps) {
  const handleAddWord = (word: Omit<WordEntry, "source" | "createdAt">) => {
    const result = addCustomWord(word);
    if (result.success) {
      setCustomWords(loadCustomWords());
      setGameState({ ...gameState, coins: gameState.coins + REWARD_CUSTOM_WORD });
      onReward(`${rewardEarned} +${REWARD_CUSTOM_WORD} ${coinsLabel}`);
    }
    return result;
  };

  const handleImportWords = (fileContent: string): ImportResult => {
    const result = importWordsFromJSON(fileContent);
    if (result.imported > 0) {
      setCustomWords(loadCustomWords());
      setGameState({ ...gameState, coins: gameState.coins + result.coinsEarned });
      if (result.coinsEarned > 0) {
        onReward(`${rewardEarned} +${result.coinsEarned} ${coinsLabel}`);
      }
    }
    return result;
  };

  return { handleAddWord, handleImportWords };
}