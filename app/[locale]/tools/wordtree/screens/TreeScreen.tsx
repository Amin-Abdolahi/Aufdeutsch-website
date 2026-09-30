"use client";

/**
 * TreeScreen — صفحه‌ی درخت
 *
 * ⚠️ وظیفه: نمایش درخت، آبیاری، چیدن میوه، روز بعد
 */

import { useState } from "react";
import { GameState, Tree, WordEntry, Word } from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import {
  getDueReviewWords,
  getWateringsLeft,
  getWateringsToday,
} from "@/lib/wordtree/gameLogic";
import { MAX_WATERINGS_PER_DAY } from "@/lib/wordtree/constants";
import { TREE_COLORS } from "@/lib/wordtree/constants";
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
  onDeleteTree: () => void;
  onStartReview: () => void;
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
  onDeleteTree,
  onStartReview,
}: TreeScreenProps) {
  const wateringWords = dailyWords.map((w) => ({
    id: w.id,
    german: w.translations.de,
    translation: w.translations[safeLocale] || w.translations.fa,
    example: w.example?.de,
    exampleTranslation: w.example?.translations?.[safeLocale],
  }));

  // ─────────────────────────────────────────────────────────────
  // صف چرخشیِ مرور: میوه‌ها پشت سر هم نشون داده می‌شن.
  // ⚠️ کلماتی که کاربر «بلد نیستم» رو بزنه تو صف می‌مونن و بعد از
  // آخرین کلمه دوباره از اول نشون داده می‌شن — تا جایی که همه رو
  // «بلدم» بزنه.
  // ─────────────────────────────────────────────────────────────
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [reviewPos, setReviewPos] = useState(0);

  const currentFruitId =
    reviewQueue.length > 0 ? reviewQueue[reviewPos] : selectedFruitId;
  const currentFruit = currentFruitId
    ? selectedTree.fruits.find((f) => f.id === currentFruitId)
    : null;
  const currentWordEntry = currentFruit
    ? allWordsData.find((w) => w.id === currentFruit.wordId)
    : null;
  const currentWord = currentFruit
    ? gameState.words.find((w) => w.id === currentFruit.wordId)
    : null;

  // ─── کلیک روی یه میوه ───
  const handleFruitClick = (fruitId: string) => {
    const fruit = selectedTree.fruits.find((f) => f.id === fruitId);
    if (!fruit) return;

    if (fruit.type === "silver") {
      // میوه‌ی نقره‌ای → آزمون (توسط parent هندل می‌شه)
      onFruitClick(fruitId);
      return;
    }

    // ⚠️ صف رو از میوه‌ی کلیک‌شده شروع کن، بعد بقیه‌ی میوه‌های قابل چیدن
    const reviewableIds = selectedTree.fruits
      .filter((f) => f.type !== "silver")
      .map((f) => f.id);
    setReviewQueue([fruitId, ...reviewableIds.filter((id) => id !== fruitId)]);
    setReviewPos(0);
    onFruitClick(fruitId);
  };

  // ─── جواب کاربر به کلمه‌ی فعلی ───
  const handleAnswer = (remembered: boolean) => {
    const fruitId = reviewQueue[reviewPos];
    if (!fruitId) return;

    // state آپدیت می‌شه (بلدم → میوه چیده می‌شه / بلد نیستم → میوه می‌مونه)
    handlers.handleHarvestAnswer(fruitId, remembered);

    if (remembered) {
      // ─── بلدم: میوه از صف حذف می‌شه ───
      const newQueue = reviewQueue.filter((id) => id !== fruitId);
      if (newQueue.length === 0) {
        // همه‌ی کلمات یاد گرفته شدن → نشست تموم شد
        setReviewQueue([]);
        setReviewPos(0);
        setters.setSelectedFruitId(null);
        return;
      }
      setReviewQueue(newQueue);
      setReviewPos((p) => Math.min(p, newQueue.length - 1));
    } else {
      // ─── بلد نیستم: میوه تو صف می‌مونه، بعد از آخرین کلمه دوباره برمی‌گرده
      setReviewPos((p) => (p + 1) % reviewQueue.length);
    }
  };

  // ─── بستن پنل مرور ───
  const handleCloseReview = () => {
    setReviewQueue([]);
    setReviewPos(0);
    setters.setSelectedFruitId(null);
  };

  const getGuidanceMessage = () => {
    const hasDue = getDueReviewWords(gameState, selectedTree.id).length > 0;
    const hasSilver = selectedTree.fruits.some((f) => f.type === "silver");
    if (hasSilver) return "🥈 یه میوه‌ی نقره‌ای روی درختت هست! روش کلیک کن و آزمون بده.";
    if (!hasNew && !hasDue) return "🎉 همه‌ی کلماتت توی این درختن!";
    if (selectedTree.dayState === "completed") return `روز ${gameState.currentDay} تموم شد! 🎉`;
    if (!selectedTree.wateredToday)
      return hasDue && !hasNew
        ? "🔁 وقت مرور کلماته! آبیاری کن تا میوه‌های مرور بیان."
        : t.firstWaterMessage;
    if (readyFruits > 0) return t.harvestMessage;
    return `${t.wordsLearned}: ${selectedTree.totalWords}`;
  };

  const hasDueReviews = getDueReviewWords(gameState, selectedTree.id).length > 0;

  // ─── پالت رنگ درخت ───
  const treeColorPalette = selectedTree.color
    ? TREE_COLORS[selectedTree.color]
    : undefined;
  const treeColors = treeColorPalette
    ? {
        canopy: treeColorPalette.main,
        canopyShadow: treeColorPalette.dark,
        canopyLight: treeColorPalette.light,
        trunk: "#8B4513",
        trunkShadow: "#6B3410",
      }
    : undefined;

  const wateringsLeft = getWateringsLeft(selectedTree);
  const wateringsToday = getWateringsToday(selectedTree);

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
            <ProgressBar current={selectedTree.totalWords} total={selectedTree.poolWordIds.length} label={t.progress} />
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
              variant={selectedTree.variant}
              fruits={selectedTree.fruits}
              onFruitClick={handleFruitClick}
              colors={treeColors}
            />
          </div>

          {/* پیام */}
          <div className="text-center mb-6">
            <p className="text-navy-900/70">{getGuidanceMessage()}</p>
          </div>

          {/* دکمه‌ی اصلی */}
          <div className="flex justify-center" data-tour="water-button">
            {selectedTree.dayState === "completed" ||
            (selectedTree.fruits.length === 0 && selectedTree.wateredToday) ? (
              <Button variant="secondary" size="lg" onClick={handlers.handleStartNextDay}>
                🌅 روز بعد
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  // اگه کلمه‌ی جدید برای آموزش هست، پنل آبیاری باز می‌شه.
                  // وگرنه فقط میوه‌های مرور رسیده رو ظاهر می‌کنه.
                  if (dailyWords.length > 0) {
                    setters.setShowWateringPanel(true);
                  } else {
                    handlers.handleWateringComplete([]);
                  }
                }}
                disabled={!canWater || (!hasNew && !hasDueReviews)}
              >
                {!hasNew && !hasDueReviews
                  ? "🎉 همه‌ی کلماتت توی این درختن"
                  : canWater
                  ? `💧 ${t.waterButton}`
                  : t.waterButtonDisabled}
              </Button>
            )}
          </div>

          {/* ─── دکمه‌های ثانویه: مرور + حذف درخت ─── */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={onStartReview}
              disabled={treeWords.filter((w) => w.reviewStage > 0).length === 0}
              className={`px-4 py-2.5 rounded-sm text-sm font-bold transition border-2 ${
                treeWords.filter((w) => w.reviewStage > 0).length === 0
                  ? "border-navy-900/10 text-navy-900/30 cursor-not-allowed"
                  : "border-gold-400/60 text-navy-900 hover:bg-gold-300/20"
              }`}
              title={t.reviewButtonTitle || "مرور کلمات"}
            >
              🔁 {t.reviewButton || "مرور"} (
              {treeWords.filter((w) => w.reviewStage > 0).length})
            </button>

            <button
              onClick={onDeleteTree}
              className="px-4 py-2.5 rounded-sm text-sm font-bold border-2 border-red-300/60 text-red-600 hover:bg-red-50 transition"
              title={t.deleteTreeTitle || "حذف درخت"}
            >
              🗑 {t.deleteTree || "حذف درخت"}
            </button>
          </div>

          {/* ─── تعداد آبیاری‌های امروز ─── */}
          {wateringsToday > 0 && (
            <p className="text-center text-xs text-navy-900/50 mt-3 font-mono">
              {t.wateringsToday?.replace(
                "{count}",
                wateringsToday.toString()
              ).replace(
                "{max}",
                MAX_WATERINGS_PER_DAY.toString()
              ) || `${wateringsToday}/${MAX_WATERINGS_PER_DAY} آبیاری امروز`}
            </p>
          )}
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

      {/* پنل چیدن — صف چرخشیِ مرور */}
      {currentFruit && currentWordEntry && currentWord && (
        <HarvestPanel
          key={currentFruit.id}
          wordEntry={currentWordEntry}
          locale={safeLocale}
          reviewStage={currentWord.reviewStage}
          queueProgress={{
            current: reviewPos + 1,
            total: reviewQueue.length,
          }}
          onAnswer={handleAnswer}
          onClose={handleCloseReview}
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
            // ─── حلقه‌ی مرور ───
            iKnow: t.harvestIKnow || "بلدم",
            iDontKnow: t.harvestIDontKnow || "بلد نیستم",
            progress: t.harvestProgress || "کلمه‌ی {current} از {total}",
            loopHint: t.harvestLoopHint || "بلد نیستی؟ دوباره نشون داده می‌شه",
            close: t.harvestClose || "بستن",
            allDone: t.harvestAllDone || "آفرین! همه رو یاد گرفتی",
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