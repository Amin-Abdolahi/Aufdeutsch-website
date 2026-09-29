"use client";

/**
 * useTreeActions — آبیاری، چیدن، ساخت درخت
 *
 * ⚠️ وظیفه: فقط اکشن‌های مربوط به درخت
 */

import { GameState, Word, WordEntry, Tree, QuizResult } from "@/lib/wordtree/types";
import {
  waterTree,
  harvestFruit,
  startNextDay,
  completeQuiz,
  addWordsToTree,
  removeWordFromTree,
  getTreeWords,
} from "@/lib/wordtree/gameLogic";
import { Locale } from "@/lib/i18n";

interface UseTreeActionsProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  selectedTree: Tree | null;
  allWordsData: WordEntry[];
  safeLocale: Locale;
  onCloseWateringPanel: () => void;
}

export function useTreeActions({
  gameState,
  setGameState,
  selectedTree,
  allWordsData,
  safeLocale,
  onCloseWateringPanel,
}: UseTreeActionsProps) {
  const handleWateringComplete = (learnedWordIds: string[]) => {
    if (!selectedTree) return;
    const treeWords = getTreeWords(gameState, selectedTree.id);
    const treeWordIds = treeWords.map((w) => w.id);

    const newWords: Word[] = allWordsData
      .filter((w) => learnedWordIds.includes(w.id) && !treeWordIds.includes(w.id))
      .map((w) => ({
        id: w.id,
        language: w.language,
        german: w.translations.de,
        translation: w.translations[safeLocale] || w.translations.fa,
        status: "learning" as const,
        reviewCount: 0,
        reviewStage: 0,
        nextReviewDay: undefined,
        source: w.source ?? "builtin",
        treeIds: [],
      }));

    setGameState(waterTree(gameState, selectedTree.id, newWords));
    onCloseWateringPanel();
  };

  const handleHarvestAnswer = (fruitId: string, remembered: boolean) => {
    if (!selectedTree) return;
    setGameState(harvestFruit(gameState, selectedTree.id, fruitId, remembered));
  };

  const handleStartNextDay = () => {
    if (!selectedTree) return;
    setGameState(startNextDay(gameState, selectedTree.id));
  };

  const handleQuizComplete = (result: QuizResult) => {
    if (!selectedTree) return;
    const silverFruit = selectedTree.fruits.find((f) => f.type === "silver");
    if (silverFruit) {
      setGameState(completeQuiz(gameState, selectedTree.id, silverFruit.id, result));
    }
  };

  const handleAddWordsToTree = (wordIds: string[]) => {
    if (!selectedTree) return;
    setGameState(addWordsToTree(gameState, selectedTree.id, wordIds));
  };

  const handleRemoveWordsFromTree = (wordIds: string[]) => {
    if (!selectedTree) return;
    let updated = gameState;
    for (const wordId of wordIds) {
      updated = removeWordFromTree(updated, selectedTree.id, wordId);
    }
    setGameState(updated);
  };

  return {
    handleWateringComplete,
    handleHarvestAnswer,
    handleStartNextDay,
    handleQuizComplete,
    handleAddWordsToTree,
    handleRemoveWordsFromTree,
  };
}