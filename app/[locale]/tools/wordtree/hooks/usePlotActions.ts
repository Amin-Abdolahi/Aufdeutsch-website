"use client";

/**
 * usePlotActions — ساخت باغچه و درخت
 */

import { GameState, TreeVariant, TreeColor } from "@/lib/wordtree/types";
import {
  createPlot,
  createTree,
  deleteTree,
} from "@/lib/wordtree/gameLogic";
import {
  MAX_PLOTS,
  MAX_TREES_PER_PLOT,
} from "@/lib/wordtree/constants";
import { WORDS_DE } from "@/data/wordtree/words-de";

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
    wordIds: string[],
    color?: TreeColor
  ) => {
    const selectedPlot = selectedPlotId
      ? gameState.plots.find((p) => p.id === selectedPlotId)
      : null;

    if (!selectedPlot) return { success: false, error: "باغچه‌ای انتخاب نشده" };
    if (selectedPlot.trees.length >= MAX_TREES_PER_PLOT) {
      return { success: false, error: createTreeMaxReached };
    }

    // کلمات انتخاب‌شده = استخر این درخت. اگه هیچی انتخاب نشد،
    // از استخر استاندارد آلمانی استفاده کن.
    const poolWordIds =
      wordIds.length > 0 ? wordIds : WORDS_DE.map((w) => w.id);

    const newTree = createTree(name, variant, poolWordIds, color);

    const updated: GameState = {
      ...gameState,
      plots: gameState.plots.map((plot) =>
        plot.id === selectedPlot.id
          ? { ...plot, trees: [...plot.trees, newTree] }
          : plot
      ),
    };

    setGameState(updated);
    return { success: true };
  };

  const handleDeleteTree = (treeId: string) => {
    setGameState(deleteTree(gameState, treeId));
  };

  return { handleCreatePlot, handleCreateTree, handleDeleteTree };
}