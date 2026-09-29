"use client";

/**
 * TreeScreen — صفحه‌ی درخت
 *
 * ⚠️ وظیفه: نمایش درخت، آبیاری، چیدن میوه، روز بعد
 */

import { GameState, Tree, WordEntry, Word } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { Tree as TreeComponent } from "../components/Tree";
import { CoinDisplay } from "../components/CoinDisplay";
import { ProgressBar } from "../components/ProgressBar";
import { WateringPanel } from "../components/WateringPanel";
import { HarvestPanel } from "../components/HarvestPanel";
import { TreeWordManager } from "../components/TreeWordManager";
import { MyWordsModal } from "../components/MyWordsModal";
import { AlertBanner } from "../components/AlertBanner";
import { SharedModals } from "../components/SharedModals";
import { SettingsPanel } from "../components/SettingsPanel";
import { Button } from "@/components/ui/Button";

interface TreeScreenProps {
  gameState: GameState;
  selectedTree: Tree;
  selectedPlotName: string;
  selectedFruitId: string | null;
  allWordsData: WordEntry[];
  safeLocale: Locale;
  t: any;
  modals: any;
  setters: any;
  handlers: any;
  canWater: boolean;
  readyFruits: number;
  treeWords: Word[];
  availableWords: Word[];
  hasNew: boolean;
  dailyWords: WordEntry[];
  wordsToNext: number;
  onFruitClick: (fruitId: string) => void;
  onBackToPlot: () => void;
}

export function TreeScreen({
  gameState,
  selectedTree,
  selectedPlotName,
  selectedFruitId,
  allWordsData,
  safeLocale,
  t,
  modals,
  setters,
  handlers,
  canWater,
  readyFruits,
  treeWords,
  availableWords,
  hasNew,
  dailyWords,
  wordsToNext,
  onFruitClick,
  onBackToPlot,
}: TreeScreenProps) {
  const wateringWords = dailyWords.map((w) => ({
    id: w.id,
    german: w.translations.de,
    translation: w.translations[safeLocale] || w.translations.fa,
    example: w.example?.de,
    exampleTranslation: w.example?.translations?.[safeLocale],
  }));

  const selectedFruit = selectedFruitId
    ? selectedTree.fruits.find((f) => f.id === selectedFruitId)
    : null;

  const selectedWordEntry = selectedFruit
    ? allWordsData.find((w) => w.id === selectedFruit.wordId)
    : null;

  const selectedWord = selectedFruit
    ? gameState.words.find((w) => w.id === selectedFruit.wordId)
    : null;

  const getGuidanceMessage = () => {
    const hasSilver = selectedTree.fruits.some((f) => f.type === "silver");
    if (hasSilver) return "🥈 یه میوه‌ی نقره‌ای روی درختت هست! روش کلیک کن و آزمون بده.";
    if (!hasNew) return "🎉 همه‌ی کلماتت توی این درختن!";
    if (selectedTree.dayState === "completed") return `روز ${gameState.currentDay} تموم شد! 🎉`;
    if (!selectedTree.wateredToday) return t.firstWaterMessage;
    if (readyFruits > 0) return t.harvestMessage;
    return `${t.wordsLearned}: ${selectedTree.totalWords}`;
  };

  return (
    <>
      <AlertBanner
        onBackupClick={() => setters.setShowBackupModal(true)}
        labels={{
          message: t.alertMessage || "⚠️ بازی در حال توسعه‌ست.",
          backupButton: t.alertBackupButton || "بک‌آپ بگیر",
          dismiss: t.alertDismiss || "بستن",
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-paper-100 to-paper-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* هدر */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToPlot}
              className="text-navy-900/60 hover:text-navy-900 transition text-sm font-mono flex items-center gap-1"
            >
              <span>←</span>
              <span>{selectedPlotName}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-900/60 font-mono hidden sm:inline">
                روز {gameState.currentDay}
              </span>
              <div data-tour="coins">
                <CoinDisplay coins={gameState.coins} />
              </div>
              <button
                onClick={() => setters.setShowTreeWordManager(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gold-300/40 hover:bg-gold-300/60 transition text-navy-900 text-lg"
                title={t.treeWordsManage || "مدیریت کلمات"}
              >
                📚
              </button>
              <button
                data-tour="settings"
                onClick={() => setters.setShowSettings(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-navy-900/10 hover:bg-navy-900/20 transition text-navy-900 text-lg"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* عنوان */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-mono mb-2">
              {selectedTree.name}
            </h1>
            <p className="text-navy-900/60 text-sm">{selectedPlotName}</p>
          </div>

          {/* نوار پیشرفت */}
          <div className="mb-8">
            <ProgressBar current={selectedTree.totalWords} total={50} label={t.progress} />
            {wordsToNext > 0 && (
              <p className="text-xs text-navy-900/50 text-center mt-2 font-mono">
                {t.toNextLevel?.replace("{count}", wordsToNext.toString())}
              </p>
            )}
          </div>

          {/* درخت */}
          <div className="my-8 flex justify-center" data-tour="tree">
            <TreeComponent
              level={selectedTree.level}
              fruits={selectedTree.fruits}
              onFruitClick={onFruitClick}
            />
          </div>

          {/* پیام */}
          <div className="text-center mb-6">
            <p className="text-navy-900/70">{getGuidanceMessage()}</p>
          </div>

          {/* دکمه‌ی اصلی */}
          <div className="flex justify-center" data-tour="water-button">
            {selectedTree.dayState === "completed" ? (
              <Button variant="secondary" size="lg" onClick={handlers.handleStartNextDay}>
                🌅 روز بعد
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setters.setShowWateringPanel(true)}
                disabled={!canWater || !hasNew}
              >
                {!hasNew
                  ? "🎉 همه‌ی کلماتت توی این درختن"
                  : canWater
                  ? `💧 ${t.waterButton}`
                  : t.waterButtonDisabled}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* مدیریت کلمات درخت */}
      {modals.showTreeWordManager && (
        <TreeWordManager
          treeId={selectedTree.id}
          treeName={selectedTree.name}
          treeWords={treeWords}
          availableWords={availableWords}
          onClose={() => setters.setShowTreeWordManager(false)}
          onAddWords={handlers.handleAddWordsToTree}
          onRemoveWords={handlers.handleRemoveWordsFromTree}
          labels={{
            title: t.treeWordsTitle || "کلمات این درخت",
            subtitle: t.treeWordsSubtitle || "",
            inTree: t.treeWordsInTree || "در این درخت",
            available: t.treeWordsAvailable || "کلمات موجود",
            addSelected: t.treeWordsAddSelected || "افزودن",
            removeSelected: t.treeWordsRemoveSelected || "حذف",
            selectAll: t.treeWordsSelectAll || "انتخاب همه",
            deselectAll: t.treeWordsDeselectAll || "لغو",
            noWords: t.treeWordsNoWords || "",
            noAvailable: t.treeWordsNoAvailable || "",
            close: t.treeWordsClose || "بستن",
            categoryAll: "همه",
            categoryNoun: t.categoryNoun,
            categoryVerb: t.categoryVerb,
            categoryAdjective: t.categoryAdjective,
            categoryPhrase: t.categoryPhrase,
            categoryNumber: t.categoryNumber,
            categoryColor: t.categoryColor,
          }}
        />
      )}

      {/* مودال‌های مشترک */}
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

      {/* کلمات من */}
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

      {/* پنل آبیاری */}
      {modals.showWateringPanel && (
        <WateringPanel
          words={wateringWords}
          onComplete={handlers.handleWateringComplete}
          labels={{
            title: t.waterButton,
            subtitle: t.pageSubtitle,
            learned: t.learned,
            example: t.newWord,
            finish: t.learned,
          }}
        />
      )}

      {/* پنل چیدن */}
      {selectedFruit && selectedWordEntry && selectedWord && (
        <HarvestPanel
          wordEntry={selectedWordEntry}
          locale={safeLocale}
          reviewStage={selectedWord.reviewStage}
          onAnswer={(remembered) =>
            handlers.handleHarvestAnswer(selectedFruit.id, remembered)
          }
          labels={{
            title: t.harvestPanelTitle,
            question: t.harvestPanelQuestion,
            reveal: t.harvestReveal,
            forgot: t.harvestForgot,
            remembered: t.harvestRemembered,
            grammar: t.grammar,
            article: t.article,
            plural: t.plural,
            praeteritum: t.praeteritum,
            perfekt: t.perfekt,
            practiceOptional: t.practiceOptional || "🎯 تمرین کن (اختیاری)",
            practiceTitle: t.spellingTitle || "حروف گم‌شده رو انتخاب کن",
            practiceHint: t.spellingHint || "راهنما",
            practiceConfirm: t.spellingConfirm || "تأیید",
            practiceCorrect: t.spellingCorrect || "درست!",
            practiceWrong: t.spellingWrong || "اشتباه بود",
            practiceTryAgain: t.spellingTryAgain || "دوباره تلاش کن",
            practiceShowAnswer: t.spellingShowAnswer || "نمایش جواب",
            skipPractice: t.skipPractice || "رد کن",
          }}
        />
      )}

      {/* پنل تنظیمات */}
      <SettingsPanel
        isOpen={modals.showSettings}
        onClose={() => setters.setShowSettings(false)}
        items={handlers.settingsItems}
        title="تنظیمات"
      />
    </>
  );
}