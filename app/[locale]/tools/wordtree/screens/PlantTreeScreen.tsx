"use client";

/**
 * PlantTreeScreen — صفحه‌ی کاشت درخت
 *
 * ⚠️ وظیفه: نمایش صفحه‌ی کاشت + مودال ایمپورت
 */

import { useState } from "react";
import { GameState, WordEntry } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { PlantTreeScreen as PlantTreeView } from "../components/PlantTreeScreen";
import { ImportWordsModal } from "../components/ImportWordsModal";
import { plantTree } from "@/lib/wordtree/gameLogic";
import { loadCustomWords } from "@/lib/wordtree/customWords";
import { WORDS_DE } from "@/data/wordtree/words-de";
import { CUSTOM_TREE_TYPE } from "@/lib/wordtree/constants";
import { importWordsFromJSON } from "@/lib/wordtree/jsonImport";

interface PlantTreeScreenProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  customWords: WordEntry[];
  setCustomWords: (words: WordEntry[]) => void;
  safeLocale: Locale;
  t: any;
  onTourStart: () => void;
}

export function PlantTreeScreen({
  gameState,
  setGameState,
  customWords,
  setCustomWords,
  safeLocale,
  t,
  onTourStart,
}: PlantTreeScreenProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingCustomPlant, setPendingCustomPlant] = useState(false);

  const handlePlant = (treeTypeId: string) => {
    if (treeTypeId === CUSTOM_TREE_TYPE) {
      if (customWords.length > 0) {
        const customIds = customWords.map((w) => w.id);
        setGameState(plantTree(gameState, "درخت اصلی", "oak", customIds));
        onTourStart();
      } else {
        setPendingCustomPlant(true);
        setShowImportModal(true);
      }
      return;
    }
    const defaultWordIds = WORDS_DE.slice(0, 50).map((w) => w.id);
    setGameState(plantTree(gameState, "درخت اصلی", "oak", defaultWordIds));
    onTourStart();
  };

  return (
    <>
      <PlantTreeView
        onPlant={handlePlant}
        onOpenImport={() => {
          setPendingCustomPlant(true);
          setShowImportModal(true);
        }}
        customWordsCount={customWords.length}
        labels={{
          welcome: t.plantWelcome || "به باغت خوش اومدی! 🌱",
          subtitle: t.plantSubtitle || "",
          selectTree: t.plantSelectTree || "",
          treeTypeDefault: t.treeTypeDefault || "آلمانی پیش‌فرض",
          treeTypeDefaultDesc: t.treeTypeDefaultDesc || "",
          treeTypeCustom: t.treeTypeCustom || "درخت شخصی",
          treeTypeCustomDesc: t.treeTypeCustomDesc || "",
          plantButton: t.plantButton || "بکار",
          customWordsImported: t.customWordsImported || "{count} کلمه آماده",
          wordsCount: t.plantWordsCount || "{count} کلمه",
        }}
      />

      {showImportModal && (
        <ImportWordsModal
          onClose={() => {
            setShowImportModal(false);
            setPendingCustomPlant(false);
          }}
          onImport={(fileContent) => {
            const result = importWordsFromJSON(fileContent);
            if (result.imported > 0) {
              setCustomWords(loadCustomWords());
              if (pendingCustomPlant) {
                setTimeout(() => {
                  const newCustom = loadCustomWords();
                  const customIds = newCustom.map((w) => w.id);
                  setGameState(plantTree(gameState, "درخت اصلی", "oak", customIds));
                  setPendingCustomPlant(false);
                  setShowImportModal(false);
                  onTourStart();
                }, 1500);
              }
            }
            return result;
          }}
          labels={{
            title: t.importWordsTitle,
            subtitle: t.importWordsSubtitle,
            dropzone: t.importDropzone,
            dropzoneActive: t.importDropzoneActive,
            selectFile: t.importSelectFile,
            downloadPrompt: t.importDownloadPrompt,
            downloadTemplate: t.importDownloadTemplate,
            importing: t.importImporting,
            resultTitle: t.importResultTitle,
            totalLabel: t.importTotalLabel,
            importedLabel: t.importImportedLabel,
            rejectedLabel: t.importRejectedLabel,
            coinsLabel: t.importCoinsLabel,
            errorsTitle: t.importErrorsTitle,
            close: t.importClose,
            invalidFile: t.importInvalidFile,
            guideTitle: t.importGuideTitle,
            guideStep1: t.importGuideStep1,
            guideStep2: t.importGuideStep2,
            guideStep3: t.importGuideStep3,
            guideFull: t.importGuideFull,
            guideFullTitle: t.importGuideFullTitle,
            guideFullContent: t.importGuideFullContent,
            guideBack: t.importGuideBack,
            tabPaste: t.importTabPaste,
            tabUpload: t.importTabUpload,
            pastePlaceholder: t.importPastePlaceholder,
            pasteButton: t.importPasteButton,
            pasteEmpty: t.importPasteEmpty,
          }}
          promptUrl="/wordtree/wordtree-prompt.txt"
          templateUrl="/wordtree/wordtree-template.json"
        />
      )}
    </>
  );
}