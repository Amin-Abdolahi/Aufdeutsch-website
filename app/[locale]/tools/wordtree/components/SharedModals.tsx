"use client";

/**
 * SharedModals — همه‌ی مودال‌های مشترک
 */

import { OnboardingTour } from "./OnboardingTour";
import { QuizMenu } from "./QuizMenu";
import { HelpModal } from "./HelpModal";
import { BackupModal } from "./BackupModal";
import { SnapshotModal } from "./SnapshotModal";
import { AddWordModal } from "./AddWordModal";
import { ImportWordsModal } from "./ImportWordsModal";

interface SharedModalsProps {
  state: any;
  setters: any;
  handlers: any;
}

export function SharedModals({ state, setters, handlers }: SharedModalsProps) {
  const { gameState, selectedTree, safeLocale, t, modals } = state;

  return (
    <>
      {modals.showTour && (
        <OnboardingTour
          isOpen={modals.showTour}
          onClose={handlers.handleTourClose}
          labels={{
            step1Title: t.tourStep1Title,
            step1Text: t.tourStep1Text,
            step2Title: t.tourStep2Title,
            step2Text: t.tourStep2Text,
            step3Title: t.tourStep3Title,
            step3Text: t.tourStep3Text,
            step4Title: t.tourStep4Title,
            step4Text: t.tourStep4Text,
            step5Title: t.tourStep5Title,
            step5Text: t.tourStep5Text,
            next: t.tourNext,
            skip: t.tourSkip,
            finish: t.tourFinish,
            stepCounter: t.tourStepCounter,
          }}
        />
      )}

      {modals.showQuizMenu && selectedTree && (
        <QuizMenu
          isOpen={modals.showQuizMenu}
          onClose={() => setters.setShowQuizMenu(false)}
          words={gameState.words}
          onQuizComplete={handlers.handleQuizComplete}
          labels={{
            title: t.quizMenuTitle || "آزمون‌ها",
            statsTitle: t.quizStatsTitle || "آمار",
            totalQuizzes: t.quizTotalQuizzes || "آزمون‌ها",
            overallAccuracy: t.quizOverallAccuracy || "دقت",
            bestAccuracy: t.quizBestAccuracy || "بهترین",
            totalQuestions: t.quizTotalQuestions || "کل",
            weakWordsTitle: t.quizWeakWords || "ضعیف",
            weakWordsEmpty: t.quizWeakWordsEmpty || "",
            startQuiz: t.quizStart || "شروع",
            close: t.close || "بستن",
            noStats: t.quizNoStats || "",
            modal: {
              title: t.quizModalTitle || "آزمون",
              subtitle: t.quizModalSubtitle || "",
              questionOf: t.quizQuestionOf || "سوال",
              next: t.quizNext || "بعدی",
              finish: t.quizFinish || "پایان",
              resultTitle: t.quizResultTitle || "نتیجه",
              correctCount: t.quizCorrectCount || "درست",
              totalCount: t.quizTotalCount || "کل",
              passed: t.quizPassed || "قبول!",
              failed: t.quizFailed || "نشد",
              coinsEarned: t.quizCoinsEarned || "سکه",
              close: t.close || "بستن",
              spellingTitle: t.spellingTitle || "",
              hint: t.spellingHint || "",
              confirm: t.spellingConfirm || "",
              correct: t.spellingCorrect || "",
              wrong: t.spellingWrong || "",
              tryAgain: t.spellingTryAgain || "",
              showAnswer: t.spellingShowAnswer || "",
            },
          }}
        />
      )}

      {modals.showHelp && (
        <HelpModal
          onClose={() => setters.setShowHelp(false)}
          labels={{
            title: t.helpTitle,
            basicsTitle: t.helpBasicsTitle,
            basicsWater: t.helpBasicsWater,
            basicsHarvest: t.helpBasicsHarvest,
            basicsDay: t.helpBasicsDay,
            fruitsTitle: t.helpFruitsTitle,
            fruitGreen: t.helpFruitGreen,
            fruitYellow: t.helpFruitYellow,
            fruitGolden: t.helpFruitGolden,
            fruitOrange: t.helpFruitOrange,
            fruitSilver: t.helpFruitSilver,
            quizzesTitle: t.helpQuizzesTitle,
            quizzesSilver: t.helpQuizzesSilver,
            quizzesPractice: t.helpQuizzesPractice,
            quizzesMenu: t.helpQuizzesMenu,
            customWordsTitle: t.helpCustomWordsTitle,
            customWordsManual: t.helpCustomWordsManual,
            customWordsImport: t.helpCustomWordsImport,
            customWordsReward: t.helpCustomWordsReward,
            reviewTitle: t.helpReviewTitle,
            reviewText: t.helpReviewText,
            close: t.close || "بستن",
            gotIt: t.helpGotIt,
          }}
        />
      )}

      {modals.showBackupModal && (
        <BackupModal
          onClose={() => setters.setShowBackupModal(false)}
          onImportSuccess={handlers.handleBackupImportSuccess}
          labels={{
            title: t.backupTitle || "",
            subtitle: t.backupSubtitle || "",
            exportTitle: t.backupExportTitle || "",
            exportDesc: t.backupExportDesc || "",
            exportButton: t.backupExportButton || "",
            exportSuccess: t.backupExportSuccess || "",
            exportEmpty: t.backupExportEmpty || "",
            importTitle: t.backupImportTitle || "",
            importDesc: t.backupImportDesc || "",
            importButton: t.backupImportButton || "",
            importSuccess: t.backupImportSuccess || "",
            importError: t.backupImportError || "",
            importResult: t.backupImportResult || "",
            importInvalidFile: t.backupImportInvalidFile || "",
            close: t.backupClose || "بستن",
            wordsCount: t.backupWordsCount || "",
            dragHere: t.backupDragHere || "",
            orClick: t.backupOrClick || "",
          }}
        />
      )}

      {modals.showSnapshotModal && (
        <SnapshotModal
          onClose={() => setters.setShowSnapshotModal(false)}
          onRestoreSuccess={handlers.handleSnapshotRestore}
          locale={safeLocale}
          labels={{
            title: t.snapshotsTitle || "",
            subtitle: t.snapshotsSubtitle || "",
            empty: t.snapshotsEmpty || "",
            createNow: t.snapshotsCreateNow || "",
            restore: t.snapshotsRestore || "",
            delete: t.snapshotsDelete || "",
            restoreConfirm: t.snapshotsRestoreConfirm || "",
            restoreSuccess: t.snapshotsRestoreSuccess || "",
            deleteConfirm: t.snapshotsDeleteConfirm || "",
            wordsCount: t.snapshotsWordsCount || "",
            version: t.snapshotsVersion || "",
            close: t.snapshotsClose || "بستن",
            maxNote: t.snapshotsMaxNote || "",
          }}
        />
      )}

      {modals.showAddWordModal && (
        <AddWordModal
          onClose={() => setters.setShowAddWordModal(false)}
          onSave={handlers.handleAddWord}
          labels={{
            title: t.addWordTitle,
            germanLabel: t.germanLabel,
            germanPlaceholder: t.germanPlaceholder,
            translationLabel: t.translationLabel,
            translationPlaceholder: t.translationPlaceholder,
            categoryLabel: t.categoryLabel,
            levelLabel: t.levelLabel,
            nounArticleLabel: t.nounArticleLabel,
            nounPluralLabel: t.nounPluralLabel,
            verbPraeteritumLabel: t.verbPraeteritumLabel,
            verbPerfektLabel: t.verbPerfektLabel,
            pronunciationLabel: t.pronunciationLabel,
            pronunciationPlaceholder: t.pronunciationPlaceholder,
            exampleLabel: t.exampleLabel,
            examplePlaceholder: t.examplePlaceholder,
            exampleTranslationLabel: t.exampleTranslationLabel,
            exampleTranslationPlaceholder: t.exampleTranslationPlaceholder,
            save: t.save,
            cancel: t.cancel,
            errorRequired: t.errorRequired,
            rewardInfo: t.addWordReward,
            categories: {
              noun: t.categoryNoun,
              verb: t.categoryVerb,
              adjective: t.categoryAdjective,
              phrase: t.categoryPhrase,
              number: t.categoryNumber,
              color: t.categoryColor,
            },
          }}
        />
      )}

      {modals.showImportModal && (
        <ImportWordsModal
          onClose={() => setters.setShowImportModal(false)}
          onImport={handlers.handleImportWords}
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
            tabPrompt: t.importTabPrompt,
            pastePlaceholder: t.importPastePlaceholder,
            pasteButton: t.importPasteButton,
            pasteEmpty: t.importPasteEmpty,
            promptBuilder: {
              title: t.promptBuilderTitle,
              subtitle: t.promptBuilderSubtitle,
              countLabel: t.promptCountLabel,
              topicLabel: t.promptTopicLabel,
              topicPlaceholder: t.promptTopicPlaceholder,
              levelLabel: t.promptLevelLabel,
              translationLabel: t.promptTranslationLabel,
              extraLabel: t.promptExtraLabel,
              extraPlaceholder: t.promptExtraPlaceholder,
              previewLabel: t.promptPreviewLabel,
              copyButton: t.promptCopyButton,
              copied: t.promptCopied,
              useButton: t.promptUseButton,
              topicSuggestions: [
                { label: "فرودگاه", value: "فرودگاه" },
                { label: "فروشگاه", value: "فروشگاه" },
                { label: "رستوران", value: "رستوران" },
                { label: "هتل", value: "هتل" },
                { label: "محیط کار", value: "محیط کار" },
                { label: "سفر", value: "سفر" },
                { label: "مراجعه به پزشک", value: "مراجعه به پزشک" },
                { label: "ایستگاه قطار", value: "ایستگاه قطار" },
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
                { label: "English", value: "en" },
                { label: "Deutsch", value: "de" },
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