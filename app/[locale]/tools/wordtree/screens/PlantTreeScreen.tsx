"use client";

/**
 * PlantTreeScreen — صفحه‌ی کاشت درخت
 *
 * ⚠️ وظیفه: نمایش صفحه‌ی کاشت + مودال ایمپورت
 *
 * ⚠️ تغییرات جدید:
 * - وقتی کاربر «درخت شخصی» رو می‌کاره، اول مودال ایمپورت باز می‌شه
 * - کاربر فایلش رو ایمپورت می‌کنه، بعد درخت با اون کلمات کاشته می‌شه
 * - اگه قبلاً کلمات سفارشی داره، می‌تونه مستقیم هم بکاره
 */

import { useState } from "react";
import { GameState, WordEntry } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { PlantTreeScreen as PlantTreeView } from "../components/PlantTreeScreen";
import { ImportWordsModal } from "../components/ImportWordsModal";
import { plantTree } from "@/lib/wordtree/gameLogic";
import { loadCustomWords, generateFileId } from "@/lib/wordtree/customWords";
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
      // ⚠️ همیشه اول ایمپورت رو پیشنهاد بده
      setPendingCustomPlant(true);
      setShowImportModal(true);
      return;
    }
    const defaultWordIds = WORDS_DE.slice(0, 50).map((w) => w.id);
    setGameState(plantTree(gameState, "درخت اصلی", "oak", defaultWordIds));
    onTourStart();
  };

  // ⚠️ وقتی کاربر ایمپورت رو رد می‌کنه و قبلاً کلمات داره، مستقیم بکار
  const handleSkipImport = () => {
    if (customWords.length > 0) {
      const customIds = customWords.map((w) => w.id);
      setGameState(plantTree(gameState, "درخت اصلی", "oak", customIds));
      onTourStart();
    }
    setPendingCustomPlant(false);
    setShowImportModal(false);
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
          customPlantWithoutImport: t.customPlantWithoutImport || "با کلمات فعلی",
        }}
      />

      {showImportModal && (
        <ImportWordsModal
          onClose={() => {
            if (pendingCustomPlant) {
              handleSkipImport();
            } else {
              setShowImportModal(false);
            }
          }}
          onImport={(fileContent, fileName) => {
            const fileId = generateFileId();
            const result = importWordsFromJSON(
              fileContent,
              0,
              fileId,
              fileName
            );
            if (result.imported > 0) {
              setCustomWords(loadCustomWords());
              if (pendingCustomPlant) {
                // ⚠️ درخت رو با کلمات همین فایل کاشته می‌شه
                setTimeout(() => {
                  const justImported = loadCustomWords().filter(
                    (w) => w.fileId === fileId
                  );
                  const customIds = justImported.map((w) => w.id);
                  setGameState(
                    plantTree(gameState, "درخت اصلی", "oak", customIds)
                  );
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
            tabPrompt: t.importTabPrompt || "ساخت پرامپت",
            pastePlaceholder: t.importPastePlaceholder,
            pasteButton: t.importPasteButton,
            pasteEmpty: t.importPasteEmpty,
            promptBuilder: {
              title: t.promptBuilderTitle || "ساخت پرامپت",
              subtitle: t.promptBuilderSubtitle || "",
              countLabel: t.promptCountLabel || "تعداد کلمات",
              topicLabel: t.promptTopicLabel || "حوزه کلمات",
              topicPlaceholder: t.promptTopicPlaceholder || "مثال: فرودگاه",
              levelLabel: t.promptLevelLabel || "سطح زبان",
              translationLabel: t.promptTranslationLabel || "زبان ترجمه",
              extraLabel: t.promptExtraLabel || "نکات اضافی",
              extraPlaceholder: t.promptExtraPlaceholder || "",
              previewLabel: t.promptPreviewLabel || "پیش‌نمایش پرامپت",
              copyButton: t.promptCopyButton || "کپی کن",
              copied: t.promptCopied || "کپی شد!",
              useButton: t.promptUseButton || "استفاده کن",
              topicSuggestions: [
                { label: "فرودگاه", value: "فرودگاه" },
                { label: "فروشگاه", value: "فروشگاه" },
                { label: "رستوران", value: "رستوران" },
                { label: "هتل", value: "هتل" },
                { label: "کار", value: "محیط کار" },
                { label: "سفر", value: "سفر" },
                { label: "پزشک", value: "مراجعه به پزشک" },
                { label: "قطار", value: "ایستگاه قطار" },
                { label: "دانشگاه", value: "دانشگاه" },
                { label: "خانه", value: "خانه" },
              ],
              levels: [
                { label: "A1", value: "A1" },
                { label: "A2", value: "A2" },
                { label: "B1", value: "B1" },
                { label: "B2", value: "B2" },
                { label: "C1", value: "C1" },
              ],
              translationLanguages: [
                { label: "فارسی", value: "fa" },
                { label: "انگلیسی", value: "en" },
                { label: "آلمانی", value: "de" },
              ],
            },
          }}
          promptUrl="/wordtree/wordtree-prompt.txt"
          templateUrl="/wordtree/wordtree-template.json"
        />
      )}
    </>
  );
}