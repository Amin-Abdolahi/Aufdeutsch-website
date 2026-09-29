"use client";

/**
 * Word Tree — Main Page (نسخه ۱۹.۰ — Refactored)
 *
 * ⚠️ وظیفه: فقط Routing بین Garden/Plot/Tree/Plant
 *
 * معماری:
 * - useGameState → مدیریت state
 * - useModals → مدیریت مودال‌ها
 * - usePlotActions → ساخت باغچه/درخت
 * - useTreeActions → آبیاری/چیدن
 * - useWordActions → افزودن/ایمپورت کلمات
 * - useSettingsItems → آیتم‌های تنظیمات
 * - GardenScreen / PlotScreen / TreeScreen / PlantTreeScreen → صفحات
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDictionary, isLocale, Locale } from "@/lib/i18n";
import { getPlotById, getTreeById, getTreeWords, getAvailableWordsForTree, getWordsToNextLevel, canWaterToday, countReadyFruits } from "@/lib/wordtree/gameLogic";
import { WORDS_DE } from "@/data/wordtree/words-de";

import { useGameState } from "./hooks/useGameState";
import { useModals } from "./hooks/useModals";
import { usePlotActions } from "./hooks/usePlotActions";
import { useTreeActions } from "./hooks/useTreeActions";
import { useWordActions } from "./hooks/useWordActions";
import { useSettingsItems } from "./hooks/useSettingsItems";

import { PlantTreeScreen } from "./screens/PlantTreeScreen";
import { GardenScreen } from "./screens/GardenScreen";
import { PlotScreen } from "./screens/PlotScreen";
import { TreeScreen } from "./screens/TreeScreen";

type ViewType = "garden" | "plot" | "tree";

export default function WordTreePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const safeLocale: Locale = isLocale(locale) ? locale : "fa";
  const dict = getDictionary(safeLocale);
  const t = dict.wordtree;

  const { gameState, setGameState, customWords, setCustomWords, isLoaded } = useGameState();
  const modals = useModals();
  const [view, setView] = useState<ViewType>("garden");
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);
  const [selectedFruitId, setSelectedFruitId] = useState<string | null>(null);

  const allWordsData = [...customWords, ...WORDS_DE];

  const selectedPlot = gameState?.activePlotId
    ? getPlotById(gameState, gameState.activePlotId)
    : null;
  const selectedTree = gameState?.activeTreeId
    ? getTreeById(gameState, gameState.activeTreeId)
    : null;

  const { handleCreatePlot, handleCreateTree } = usePlotActions({
    gameState: gameState!,
    setGameState,
    selectedPlotId: gameState?.activePlotId || null,
    createPlotMaxReached: t.createPlotMaxReached || "",
    createTreeMaxReached: t.createTreeMaxReached || "",
  });

  const treeActions = useTreeActions({
    gameState: gameState!,
    setGameState,
    selectedTree,
    allWordsData,
    safeLocale,
    onCloseWateringPanel: () => modals.setShowWateringPanel(false),
  });

  const wordActions = useWordActions({
    gameState: gameState!,
    setGameState,
    setCustomWords,
    rewardEarned: t.rewardEarned,
    coinsLabel: t.coins,
    onReward: (msg) => {
      setRewardMessage(msg);
      setTimeout(() => setRewardMessage(null), 3000);
    },
  });

  const settingsItems = useSettingsItems({
    t,
    onQuiz: () => modals.setShowQuizMenu(true),
    onMyWords: () => modals.setShowMyWordsModal(true),
    onAddWord: () => modals.setShowAddWordModal(true),
    onImport: () => modals.setShowImportModal(true),
    onBackup: () => modals.setShowBackupModal(true),
    onSnapshots: () => modals.setShowSnapshotModal(true),
    onHelp: () => modals.setShowHelp(true),
  });

  const setters = {
    setShowAddWordModal: modals.setShowAddWordModal,
    setShowImportModal: modals.setShowImportModal,
    setShowBackupModal: modals.setShowBackupModal,
    setShowSnapshotModal: modals.setShowSnapshotModal,
    setShowQuizMenu: modals.setShowQuizMenu,
    setShowHelp: modals.setShowHelp,
    setShowTour: modals.setShowTour,
    setShowSettings: modals.setShowSettings,
    setShowCreatePlotModal: modals.setShowCreatePlotModal,
    setShowCreateTreeModal: modals.setShowCreateTreeModal,
    setShowTreeWordManager: modals.setShowTreeWordManager,
    setShowMyWordsModal: modals.setShowMyWordsModal,
    setShowWateringPanel: modals.setShowWateringPanel,
    setSelectedFruitId,
  };

  const handlers = {
    handleCreatePlot,
    handleCreateTree,
    handleAddWordsToTree: treeActions.handleAddWordsToTree,
    handleRemoveWordsFromTree: treeActions.handleRemoveWordsFromTree,
    handleWateringComplete: treeActions.handleWateringComplete,
    handleHarvestAnswer: treeActions.handleHarvestAnswer,
    handleStartNextDay: treeActions.handleStartNextDay,
    handleQuizComplete: treeActions.handleQuizComplete,
    handleAddWord: wordActions.handleAddWord,
    handleImportWords: wordActions.handleImportWords,
    handleTourClose: () => {
      modals.setShowTour(false);
      setGameState({ ...gameState!, hasSeenTutorial: true });
    },
    handleBackupImportSuccess: () => setCustomWords(customWords),
    handleSnapshotRestore: () => {
      setView("garden");
    },
    settingsItems,
  };

  if (!isLoaded || !gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-100">
        <p className="text-navy-900 font-mono">...</p>
      </div>
    );
  }

  if (!gameState.hasPlantedTree) {
    return (
      <PlantTreeScreen
        gameState={gameState}
        setGameState={setGameState}
        customWords={customWords}
        setCustomWords={setCustomWords}
        safeLocale={safeLocale}
        t={t}
        onTourStart={() => setTimeout(() => modals.setShowTour(true), 800)}
      />
    );
  }

  const handleOpenPlot = (plotId: string) => {
    setGameState({ ...gameState, activePlotId: plotId });
    setView("plot");
  };

  const handleOpenTree = (treeId: string) => {
    setGameState({ ...gameState, activeTreeId: treeId });
    setView("tree");
  };

  if (view === "garden") {
    return (
      <GardenScreen
        gameState={gameState}
        setGameState={setGameState}
        allWordsData={allWordsData}
        selectedTree={selectedTree}
        selectedFruitId={selectedFruitId}
        safeLocale={safeLocale}
        t={t}
        modals={modals}
        setters={setters}
        handlers={handlers}
        onOpenPlot={handleOpenPlot}
        onOpenSettings={() => modals.setShowSettings(true)}
      />
    );
  }

  if (view === "plot" && selectedPlot) {
    const availableForNewTree = allWordsData
      .filter((w) => {
        const wordInState = gameState.words.find((gw) => gw.id === w.id);
        return !wordInState || wordInState.treeIds.length === 0;
      })
      .map((w) => ({
        id: w.id,
        language: w.language,
        german: w.translations.de,
        translation: w.translations[safeLocale] || w.translations.fa,
        status: "new" as const,
        reviewCount: 0,
        reviewStage: 0,
        nextReviewDay: undefined,
        source: w.source ?? "builtin",
        treeIds: [],
      }));

    return (
      <PlotScreen
        gameState={gameState}
        selectedPlot={selectedPlot}
        selectedTree={selectedTree}
        selectedFruitId={selectedFruitId}
        allWordsData={allWordsData}
        safeLocale={safeLocale}
        t={t}
        modals={modals}
        setters={setters}
        handlers={handlers}
        availableForNewTree={availableForNewTree}
        onOpenTree={handleOpenTree}
        onBackToGarden={() => setView("garden")}
      />
    );
  }

  if (view === "tree" && selectedTree) {
    const canWater = canWaterToday(gameState, selectedTree.id);
    const readyFruits = countReadyFruits(gameState, selectedTree.id);
    const treeWords = getTreeWords(gameState, selectedTree.id);
    const treeWordIds = treeWords.map((w) => w.id);
    const availableWords = getAvailableWordsForTree(gameState, selectedTree.id);
    const hasNew = allWordsData.some((w) => !treeWordIds.includes(w.id));
    const dailyWords = allWordsData.filter((w) => !treeWordIds.includes(w.id)).slice(0, 5);
    const wordsToNext = getWordsToNextLevel(selectedTree.totalWords, selectedTree.level);

    return (
      <TreeScreen
        gameState={gameState}
        selectedTree={selectedTree}
        selectedPlotName={selectedPlot?.name || ""}
        selectedFruitId={selectedFruitId}
        allWordsData={allWordsData}
        safeLocale={safeLocale}
        t={t}
        modals={modals}
        setters={setters}
        handlers={handlers}
        canWater={canWater}
        readyFruits={readyFruits}
        treeWords={treeWords}
        availableWords={availableWords}
        hasNew={hasNew}
        dailyWords={dailyWords}
        wordsToNext={wordsToNext}
        onFruitClick={(fruitId) => {
          const fruit = selectedTree.fruits.find((f) => f.id === fruitId);
          if (!fruit) return;
          if (fruit.type === "silver") {
            modals.setShowQuizMenu(true);
            return;
          }
          setSelectedFruitId(fruitId);
        }}
        onBackToPlot={() => setView("plot")}
      />
    );
  }

  return null;
}