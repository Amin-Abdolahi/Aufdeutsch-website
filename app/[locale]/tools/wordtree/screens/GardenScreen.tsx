"use client";

/**
 * GardenScreen — صفحه‌ی باغ
 */

import { GameState, Tree, WordEntry } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { GardenView } from "../components/GardenView";
import { CreatePlotModal } from "../components/CreatePlotModal";
import { MyWordsModal } from "../components/MyWordsModal";
import { SharedModals } from "../components/SharedModals";
import { SettingsPanel } from "../components/SettingsPanel";

interface GardenScreenProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  allWordsData: WordEntry[];
  selectedTree: Tree | null;
  selectedFruitId: string | null;
  safeLocale: Locale;
  t: any;
  modals: any;
  setters: any;
  handlers: any;
  onOpenPlot: (id: string) => void;
  onOpenSettings: () => void;
}

export function GardenScreen({
  gameState,
  allWordsData,
  selectedTree,
  selectedFruitId,
  safeLocale,
  t,
  modals,
  setters,
  handlers,
  onOpenPlot,
  onOpenSettings,
}: GardenScreenProps) {
  return (
    <>
      <GardenView
        plots={gameState.plots}
        coins={gameState.coins}
        onOpenPlot={onOpenPlot}
        onCreatePlot={() => setters.setShowCreatePlotModal(true)}
        onOpenSettings={onOpenSettings}
        labels={{
          title: t.gardenTitle || "باغ من",
          subtitle: t.gardenSubtitle || "",
          createPlot: t.gardenCreatePlot || "باغچه‌ی جدید",
          treesCount: t.gardenTreesCount || "{count} درخت",
          wordsCount: t.gardenWordsCount || "{count} کلمه",
          empty: t.gardenEmpty || "",
          settings: t.gardenSettings || "تنظیمات",
        }}
      />

      {modals.showCreatePlotModal && (
        <CreatePlotModal
          onClose={() => setters.setShowCreatePlotModal(false)}
          onCreate={handlers.handleCreatePlot}
          labels={{
            title: t.createPlotTitle || "باغچه‌ی جدید",
            subtitle: t.createPlotSubtitle || "",
            nameLabel: t.createPlotNameLabel || "اسم باغچه",
            namePlaceholder: t.createPlotNamePlaceholder || "",
            create: t.createPlotCreate || "بساز",
            cancel: t.createPlotCancel || "انصراف",
            errorRequired: t.createPlotErrorRequired || "",
          }}
        />
      )}

      {modals.showMyWordsModal && (
        <MyWordsModal
          words={gameState.words}
          trees={gameState.plots.flatMap((p) => p.trees)}
          onClose={() => setters.setShowMyWordsModal(false)}
          labels={{
            title: t.myWordsTitle || "کلمات من",
            subtitle: t.myWordsSubtitle || "",
            searchPlaceholder: t.myWordsSearchPlaceholder || "",
            totalWords: t.myWordsSubtitle || "",
            inTrees: t.myWordsInTrees || "",
            noTrees: t.myWordsNoTrees || "",
            empty: t.myWordsEmpty || "",
            noResults: t.myWordsNoResults || "",
            close: t.myWordsClose || "بستن",
          }}
        />
      )}

      <SharedModals
        state={{ gameState, allWords: allWordsData, selectedTree, selectedFruitId, safeLocale, t, modals }}
        setters={setters}
        handlers={handlers}
      />

      <SettingsPanel
        isOpen={modals.showSettings}
        onClose={() => setters.setShowSettings(false)}
        items={handlers.settingsItems}
        title="تنظیمات"
      />
    </>
  );
}