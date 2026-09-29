"use client";

/**
 * Word Tree — Main Page (نسخه ۱۱.۰ — با راهنمای اولیه)
 *
 * ⚠️ تغییرات نسخه ۱۱.۰:
 * - اضافه شدن OnboardingTour (تور اولیه برای کاربران جدید)
 * - اضافه شدن HelpModal (راهنمای کامل از تنظیمات)
 * - اضافه شدن گزینه‌ی «راهنما» به SettingsPanel
 * - اضافه شدن data-tour attributeها برای تور
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale, Locale } from "@/lib/i18n";
import {
  GameState,
  Word,
  WordEntry,
  ImportResult,
  QuizResult,
} from "@/lib/wordtree/types";
import { loadGameState, saveGameState } from "@/lib/wordtree/storage";
import {
  createInitialState,
  waterTree,
  harvestFruit,
  canWaterToday,
  startNextDay,
  countReadyFruits,
  completeQuiz,
} from "@/lib/wordtree/gameLogic";
import { WORDS_DE } from "@/data/wordtree/words-de";
import { loadCustomWords, addCustomWord } from "@/lib/wordtree/customWords";
import { importWordsFromJSON } from "@/lib/wordtree/jsonImport";
import { REWARD_CUSTOM_WORD } from "@/lib/wordtree/constants";
import { Tree } from "./components/Tree";
import { CoinDisplay } from "./components/CoinDisplay";
import { ProgressBar } from "./components/ProgressBar";
import { WateringPanel } from "./components/WateringPanel";
import { HarvestPanel } from "./components/HarvestPanel";
import { AddWordModal } from "./components/AddWordModal";
import { ImportWordsModal } from "./components/ImportWordsModal";
import {
  SettingsPanel,
  SettingsItem,
} from "./components/SettingsPanel";
import { QuizMenu } from "./components/QuizMenu";
import { OnboardingTour } from "./components/OnboardingTour";
import { HelpModal } from "./components/HelpModal";
import { Button } from "@/components/ui/Button";

export default function WordTreePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const safeLocale: Locale = isLocale(locale) ? locale : "fa";
  const dict = getDictionary(safeLocale);
  const t = dict.wordtree;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showWateringPanel, setShowWateringPanel] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [selectedFruitId, setSelectedFruitId] = useState<string | null>(null);
  const [customWords, setCustomWords] = useState<WordEntry[]>([]);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // ─── بارگذاری از localStorage ───
  useEffect(() => {
    const saved = loadGameState();
    const initialState = saved || createInitialState();
    setGameState(initialState);
    setCustomWords(loadCustomWords());

    // ─── اگه کاربر تور رو ندیده، نشون بده ───
    if (!initialState.hasSeenTutorial) {
      // کمی تاخیر تا صفحه رندر بشه
      setTimeout(() => setShowTour(true), 500);
    }
  }, []);

  // ─── ذخیره در localStorage ───
  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-100">
        <p className="text-navy-900 font-mono">...</p>
      </div>
    );
  }

  const canWater = canWaterToday(gameState);
  const readyFruits = countReadyFruits(gameState);

  const allWords = [...customWords, ...WORDS_DE];
  const learnedIds = gameState.words.map((w) => w.id);
  const hasNew = allWords.some((w) => !learnedIds.includes(w.id));

  const dailyWords = allWords
    .filter((w) => !learnedIds.includes(w.id))
    .slice(0, 5);

  // ─── شروع آبیاری ───
  const handleStartWatering = () => {
    setShowWateringPanel(true);
  };

  // ─── پایان آبیاری ───
  const handleWateringComplete = (learnedWordIds: string[]) => {
    const newWords: Word[] = dailyWords
      .filter((w) => learnedWordIds.includes(w.id))
      .map((w) => ({
        id: w.id,
        language: w.language,
        german: w.translations.de,
        translation: w.translations[safeLocale] || w.translations.fa,
        status: "learning" as const,
        reviewCount: 0,
        reviewStage: 0,
        nextReviewDay: undefined,
        source: w.source ?? "builtin",
      }));

    setGameState(waterTree(gameState, newWords));
    setShowWateringPanel(false);
  };

  // ─── کلیک روی میوه ───
  const handleFruitClick = (fruitId: string) => {
    const fruit = gameState.tree.fruits.find((f) => f.id === fruitId);
    if (!fruit) return;

    if (fruit.type === "silver") {
      setShowQuizMenu(true);
      return;
    }

    setSelectedFruitId(fruitId);
  };

  // ─── پاسخ به پنل چیدن ───
  const handleHarvestAnswer = (remembered: boolean) => {
    if (selectedFruitId) {
      setGameState(harvestFruit(gameState, selectedFruitId, remembered));
      setSelectedFruitId(null);
    }
  };

  // ─── شروع روز بعد ───
  const handleStartNextDay = () => {
    setGameState(startNextDay(gameState));
  };

  // ─── افزودن کلمه‌ی سفارشی ───
  const handleAddWord = (word: Omit<WordEntry, "source" | "createdAt">) => {
    const result = addCustomWord(word);
    if (result.success) {
      setCustomWords(loadCustomWords());
      setGameState({
        ...gameState,
        coins: gameState.coins + REWARD_CUSTOM_WORD,
      });
      setRewardMessage(
        `${t.rewardEarned} +${REWARD_CUSTOM_WORD} ${t.coins}`
      );
      setTimeout(() => setRewardMessage(null), 3000);
    }
    return result;
  };

  // ─── ایمپورت گروهی ───
  const handleImportWords = (fileContent: string): ImportResult => {
    const result = importWordsFromJSON(fileContent);

    if (result.imported > 0) {
      setCustomWords(loadCustomWords());
      setGameState({
        ...gameState,
        coins: gameState.coins + result.coinsEarned,
      });
      if (result.coinsEarned > 0) {
        setRewardMessage(
          `${t.rewardEarned} +${result.coinsEarned} ${t.coins}`
        );
        setTimeout(() => setRewardMessage(null), 3000);
      }
    }

    return result;
  };

  // ─── تکمیل آزمون ───
  const handleQuizComplete = (result: QuizResult) => {
    const silverFruit = gameState.tree.fruits.find((f) => f.type === "silver");
    if (silverFruit) {
      setGameState(completeQuiz(gameState, silverFruit.id, result));
    }
  };

  // ─── پایان تور ───
  const handleTourClose = () => {
    setShowTour(false);
    setGameState({
      ...gameState,
      hasSeenTutorial: true,
    });
  };

  // ─── کلمات برای پنل آبیاری ───
  const wateringWords = dailyWords.map((w) => ({
    id: w.id,
    german: w.translations.de,
    translation: w.translations[safeLocale] || w.translations.fa,
    example: w.example?.de,
    exampleTranslation: w.example?.translations?.[safeLocale],
  }));

  // ─── پیدا کردن میوه‌ی انتخاب‌شده ───
  const selectedFruit = selectedFruitId
    ? gameState.tree.fruits.find((f) => f.id === selectedFruitId)
    : null;

  const selectedWordEntry = selectedFruit
    ? allWords.find((w) => w.id === selectedFruit.wordId)
    : null;

  const selectedWord = selectedFruit
    ? gameState.words.find((w) => w.id === selectedFruit.wordId)
    : null;

  // ─── تعیین پیام راهنما ───
  const getGuidanceMessage = () => {
    const hasSilver = gameState.tree.fruits.some((f) => f.type === "silver");

    if (hasSilver) {
      return "🥈 یه میوه‌ی نقره‌ای روی درختت هست! روش کلیک کن و آزمون بده.";
    }

    if (!hasNew && gameState.words.length >= allWords.length) {
      return "🎉 تبریک! تو همه‌ی کلمات رو یاد گرفتی. حالا فقط مرورشون کن.";
    }

    if (gameState.dayState === "completed") {
      return `روز ${gameState.currentDay} تموم شد! 🎉`;
    }

    if (!gameState.wateredToday) {
      return t.firstWaterMessage;
    }

    if (readyFruits > 0) {
      return t.harvestMessage;
    }

    return `${t.wordsLearned}: ${gameState.tree.totalWords}`;
  };

  // ─── آیتم‌های پنل تنظیمات ───
  const settingsItems: SettingsItem[] = [
    {
      icon: "🎯",
      label: t.quizMenu || "آزمون‌ها",
      onClick: () => setShowQuizMenu(true),
      variant: "highlight",
    },
    {
      icon: "➕",
      label: t.addWord,
      onClick: () => setShowAddWordModal(true),
    },
    {
      icon: "📥",
      label: t.importWords,
      onClick: () => setShowImportModal(true),
    },
    {
      icon: "📚",
      label: t.help || "راهنما",
      onClick: () => setShowHelp(true),
      variant: "help",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-paper-100 to-paper-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ─── هدر ─── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${safeLocale}/tools`}
            className="text-navy-900/60 hover:text-navy-900 transition text-sm font-mono"
          >
            ← {t.backToTools}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-navy-900/60 font-mono hidden sm:inline">
              روز {gameState.currentDay}
            </span>
            <div data-tour="coins">
              <CoinDisplay coins={gameState.coins} />
            </div>
            <button
              data-tour="settings"
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-navy-900/10 hover:bg-navy-900/20 transition text-navy-900 text-lg"
              aria-label="تنظیمات"
              title="تنظیمات"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* ─── عنوان ─── */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-mono mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-navy-900/60">{t.pageSubtitle}</p>
        </div>

        {/* ─── پیام جایزه ─── */}
        {rewardMessage && (
          <div className="mb-4 text-center bg-gold-300/30 border border-gold-500/40 rounded-sm py-2 px-4 animate-panel-in">
            <p className="text-navy-900 font-bold">🎁 {rewardMessage}</p>
          </div>
        )}

        {/* ─── نوار پیشرفت ─── */}
        <div className="mb-8">
          <ProgressBar
            current={gameState.tree.totalWords}
            total={allWords.length}
            label={t.progress}
          />
        </div>

        {/* ─── درخت ─── */}
        <div className="my-8 flex justify-center" data-tour="tree">
          <Tree
            level={gameState.tree.level}
            fruits={gameState.tree.fruits}
            onFruitClick={handleFruitClick}
          />
        </div>

        {/* ─── پیام راهنما ─── */}
        <div className="text-center mb-6">
          <p className="text-navy-900/70">{getGuidanceMessage()}</p>
        </div>

        {/* ─── دکمه‌ی اصلی ─── */}
        <div className="flex justify-center" data-tour="water-button">
          {gameState.dayState === "completed" ? (
            <Button variant="secondary" size="lg" onClick={handleStartNextDay}>
              🌅 روز بعد
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartWatering}
              disabled={!canWater || !hasNew}
            >
              {!hasNew
                ? "🎉 همه‌ی کلمات یاد گرفته شدن"
                : canWater
                ? `💧 ${t.waterButton}`
                : t.waterButtonDisabled}
            </Button>
          )}
        </div>
      </div>

      {/* ─── تور اولیه ─── */}
      <OnboardingTour
        isOpen={showTour}
        onClose={handleTourClose}
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

      {/* ─── راهنمای کامل ─── */}
      {showHelp && (
        <HelpModal
          onClose={() => setShowHelp(false)}
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

      {/* ─── پنل تنظیمات ─── */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        items={settingsItems}
        title="تنظیمات"
      />

      {/* ─── منوی آزمون ─── */}
      <QuizMenu
        isOpen={showQuizMenu}
        onClose={() => setShowQuizMenu(false)}
        words={gameState.words}
        onQuizComplete={handleQuizComplete}
        labels={{
          title: t.quizMenuTitle || "آزمون‌ها",
          statsTitle: t.quizStatsTitle || "آمار شما",
          totalQuizzes: t.quizTotalQuizzes || "آزمون‌ها",
          overallAccuracy: t.quizOverallAccuracy || "دقت کلی",
          bestAccuracy: t.quizBestAccuracy || "بهترین",
          totalQuestions: t.quizTotalQuestions || "کل سوالات",
          weakWordsTitle: t.quizWeakWords || "کلمات ضعیف",
          weakWordsEmpty: t.quizWeakWordsEmpty || "هنوز کلمه‌ی ضعیفی نداری",
          startQuiz: t.quizStart || "شروع آزمون آزاد",
          close: t.close || "بستن",
          noStats: t.quizNoStats || "هنوز آزمونی ندادی",
          modal: {
            title: t.quizModalTitle || "آزمون",
            subtitle: t.quizModalSubtitle || "به سوالات جواب بده",
            questionOf: t.quizQuestionOf || "سوال",
            next: t.quizNext || "بعدی",
            finish: t.quizFinish || "پایان",
            resultTitle: t.quizResultTitle || "نتیجه‌ی آزمون",
            correctCount: t.quizCorrectCount || "درست",
            totalCount: t.quizTotalCount || "کل",
            passed: t.quizPassed || "قبول شدی!",
            failed: t.quizFailed || "این بار نشد",
            coinsEarned: t.quizCoinsEarned || "سکه گرفتی",
            close: t.close || "بستن",
            spellingTitle: t.spellingTitle || "حروف گم‌شده رو انتخاب کن",
            hint: t.spellingHint || "راهنما",
            confirm: t.spellingConfirm || "تأیید",
            correct: t.spellingCorrect || "درست!",
            wrong: t.spellingWrong || "اشتباه بود",
            tryAgain: t.spellingTryAgain || "دوباره تلاش کن",
            showAnswer: t.spellingShowAnswer || "نمایش جواب",
          },
        }}
      />

      {/* ─── پنل آبیاری ─── */}
      {showWateringPanel && (
        <WateringPanel
          words={wateringWords}
          onComplete={handleWateringComplete}
          labels={{
            title: t.waterButton,
            subtitle: t.pageSubtitle,
            learned: t.learned,
            example: t.newWord,
            finish: t.learned,
          }}
        />
      )}

      {/* ─── پنل چیدن ─── */}
      {selectedFruit && selectedWordEntry && selectedWord && (
        <HarvestPanel
          wordEntry={selectedWordEntry}
          locale={safeLocale}
          reviewStage={selectedWord.reviewStage}
          onAnswer={handleHarvestAnswer}
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

      {/* ─── مودال افزودن کلمه ─── */}
      {showAddWordModal && (
        <AddWordModal
          onClose={() => setShowAddWordModal(false)}
          onSave={handleAddWord}
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

      {/* ─── مودال ایمپورت گروهی ─── */}
      {showImportModal && (
        <ImportWordsModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportWords}
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
    </div>
  );
}