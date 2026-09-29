"use client";

/**
 * PlotScreen — صفحه‌ی باغچه
 *
 * ⚠️ وظیفه: نمایش درخت‌های یه باغچه + ساخت درخت جدید
 */

import { GameState, Tree, WordEntry, Plot, Word } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { PlotView } from "../components/PlotView";
import { CreateTreeModal } from "../components/CreateTreeModal";
import { MyWordsModal } from "../components/MyWordsModal";
import { SharedModals } from "../components/SharedModals";
import { SettingsPanel } from "../components/SettingsPanel";

interface PlotScreenProps {
  gameState: GameState;
  selectedPlot: Plot;
  selectedTree: Tree | null;
  selectedFruitId: string | null;
  allWordsData: WordEntry[];
  safeLocale: Locale;
  t: any;
  modals: any;
  setters: any;
  handlers: any;
  availableForNewTree: Word[];
  onOpenTree: (treeId: string) => void;
  onBackToGarden: () => void;
}

export function PlotScreen({
  gameState,
  selectedPlot,
  selectedTree,
  selectedFruitId,
  allWordsData,
  safeLocale,
  t,
  modals,
  setters,
  handlers,
  availableForNewTree,
  onOpenTree,
  onBackToGarden,
}: PlotScreenProps) {
  return (
    <>
      <PlotView
        plot={selectedPlot}
        coins={gameState.coins}
        onOpenTree={onOpenTree}
        onCreateTree={() => setters.setShowCreateTreeModal(true)}
        onBackToGarden={onBackToGarden}
        labels={{
          treesCount: t.plotTreesCount || "{count} درخت",
          wordsCount: t.plotWordsCount || "{count} کلمه",
          createTree: t.plotCreateTree || "درخت جدید",
          empty: t.plotEmpty || "",
          backToGarden: t.plotBackToGarden || "بازگشت به باغ",
          progress: t.plotProgress || "پیشرفت",
        }}
      />

      {modals.showCreateTreeModal && (
        <CreateTreeModal
          onClose={() => setters.setShowCreateTreeModal(false)}
          onCreate={handlers.handleCreateTree}
          availableWords={availableForNewTree}
          labels={{
            title: t.createTreeTitle || "درخت جدید",
            subtitle: t.createTreeSubtitle || "",
            nameLabel: t.createTreeNameLabel || "اسم درخت",
            namePlaceholder: t.createTreeNamePlaceholder || "",
            variantLabel: t.createTreeVariantLabel || "شکل درخت",
            wordsLabel: t.createTreeWordsLabel || "کلمات این درخت",
            wordsSubtitle: t.createTreeWordsSubtitle || "",
            wordsSelected: t.createTreeWordsSelected || "",
            wordsSearch: t.createTreeWordsSearch || "",
            wordsEmpty: t.createTreeWordsEmpty || "",
            wordsNoResults: t.createTreeWordsNoResults || "",
            create: t.createTreeCreate || "بساز",
            cancel: t.createTreeCancel || "انصراف",
            next: t.createTreeNext || "بعدی",
            back: t.createTreeBack || "بازگشت",
            skipWords: t.createTreeSkipWords || "بدون کلمه بساز",
            errorRequired: t.createTreeErrorRequired || "",
            maxReached: t.createTreeMaxReached || "",
            variantOak: t.variantOak || "بلوط",
            variantPine: t.variantPine || "کاج",
            variantPalm: t.variantPalm || "نخل",
            variantBlossom: t.variantBlossom || "شکوفه",
            variantApple: t.variantApple || "سیب",
            variantLemon: t.variantLemon || "لیمو",
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
        state={{
          gameState,
          allWords: allWordsData,
          selectedTree,
          selectedFruitId,
          safeLocale,
          t,
          modals,
        }}
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