"use client";

/**
 * usePlotActions — ساخت باغچه و درخت
 */

import { GameState, TreeVariant } from "@/lib/wordtree/types";
import {
  createPlot,
  createTree,
  addWordsToTree,
} from "@/lib/wordtree/gameLogic";
import {
  MAX_PLOTS,
  MAX_TREES_PER_PLOT,
} from "@/lib/wordtree/constants";

interface UsePlotActionsProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  selectedPlotId: string | null;
  createPlotMaxReached: string;
  createTreeMaxReached: string;
}

export function usePlotActions({
  gameState,
  setGameState,
  selectedPlotId,
  createPlotMaxReached,
  createTreeMaxReached,
}: UsePlotActionsProps) {
  const handleCreatePlot = (name: string) => {
    if (gameState.plots.length >= MAX_PLOTS) {
      return { success: false, error: createPlotMaxReached };
    }
    const newPlot = createPlot(name);
    setGameState({ ...gameState, plots: [...gameState.plots, newPlot] });
    return { success: true };
  };

  const handleCreateTree = (
    name: string,
    variant: TreeVariant,
    wordIds: string[]
  ) => {
    const selectedPlot = selectedPlotId
      ? gameState.plots.find((p) => p.id === selectedPlotId)
      : null;

    if (!selectedPlot) return { success: false, error: "باغچه‌ای انتخاب نشده" };
    if (selectedPlot.trees.length >= MAX_TREES_PER_PLOT) {
      return { success: false, error: createTreeMaxReached };
    }

    const newTree = createTree(name, variant);

    let updated: GameState = {
      ...gameState,
      plots: gameState.plots.map((plot) =>
        plot.id === selectedPlot.id
          ? { ...plot, trees: [...plot.trees, newTree] }
          : plot
      ),
    };

    if (wordIds && wordIds.length > 0) {
      updated = addWordsToTree(updated, newTree.id, wordIds);
    }

    setGameState(updated);
    return { success: true };
  };

  return { handleCreatePlot, handleCreateTree };
}