"use client";

/**
 * Word Tree — Main Page (نسخه ۷.۰ — کلمات سفارشی)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کاربر می‌تونه کلمه‌ی سفارشی اضافه کنه (دکمه‌ی «+ افزودن کلمه»).
 *    کلمه توی localStorage ذخیره می‌شه و به `gameState.words` اضافه می‌شه.
 *
 * ۲. جایزه‌ی افزودن کلمه: REWARD_CUSTOM_WORD (۵ سکه).
 *
 * ۳. کلمات سفارشی با `source: "custom"` مشخص می‌شن.
 *
 * ۴. برای فاز ۲ (Supabase)، کلمات عمومی اضافه می‌شن.
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale, Locale } from "@/lib/i18n";
import { GameState, Word, WordEntry } from "@/lib/wordtree/types";
import { loadGameState, saveGameState } from "@/lib/wordtree/storage";
import {
  createInitialState,
  waterTree,
  harvestFruit,
  canWaterToday,
  startNextDay,
  countReadyFruits,
} from "@/lib/wordtree/gameLogic";
import {
  getDailyWords,
  hasNewWords,
  WORDS_DE,
} from "@/data/wordtree/words-de";
import {
  loadCustomWords,
  addCustomWord,
  generateCustomWordId,
} from "@/lib/wordtree/customWords";
import { REWARD_CUSTOM_WORD } from "@/lib/wordtree/constants";
import { Tree } from "./components/Tree";
import { CoinDisplay } from "./components/CoinDisplay";
import { ProgressBar } from "./components/ProgressBar";
import { WateringPanel } from "./components/WateringPanel";
import { HarvestPanel } from "./components/HarvestPanel";
import { AddWordModal } from "./components/AddWordModal";
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
  const [selectedFruitId, setSelectedFruitId] = useState<string | null>(null);
  const [customWords, setCustomWords] = useState<WordEntry[]>([]);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // ─── بارگذاری از localStorage ───
  useEffect(() => {
    const saved = loadGameState();
    setGameState(saved || createInitialState());
    setCustomWords(loadCustomWords());
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

  // ⚠️ کلمات سفارشی اول، بعد داخلی‌ها
  // اینطوری توی لیست روزانه، اولویت دارن
  const allWords = [...customWords, ...WORDS_DE];

  // ─── لیست کلماتی که کاربر قبلاً یاد گرفته ───
  const learnedIds = gameState.words.map((w) => w.id);

  // ─── آیا کلمه‌ی جدیدی مونده؟ ───
  const hasNew = allWords.some((w) => !learnedIds.includes(w.id));

// ─── کلمات روزانه ───
// ⚠️ کلمات سفارشی اولویت دارن (کاربر خودش اضافه کرده)
const availableWords = allWords.filter((w) => !learnedIds.includes(w.id));

const customFirst = [
  ...availableWords.filter((w) => w.source === "custom"),
  ...availableWords.filter((w) => w.source !== "custom"),
];

const dailyWords = customFirst.slice(0, 5);

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
        german: w.translations.de,
        translation: w.translations[safeLocale] || w.translations.fa,
        status: "learning" as const,
        reviewCount: 0,
        reviewStage: 0,
        nextReviewDay: undefined,
        source: w.source,
      }));

    setGameState(waterTree(gameState, newWords));
    setShowWateringPanel(false);
  };

  // ─── کلیک روی میوه ───
  const handleFruitClick = (fruitId: string) => {
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
    // آپدیت لیست کلمات سفارشی
    const updatedCustomWords = loadCustomWords();
    setCustomWords(updatedCustomWords);

    // اضافه کردن جایزه
    setGameState({
      ...gameState,
      coins: gameState.coins + REWARD_CUSTOM_WORD,
    });

    // نمایش پیام جایزه
    setRewardMessage(
      `${t.rewardEarned} +${REWARD_CUSTOM_WORD} ${t.coins}`
    );
    setTimeout(() => setRewardMessage(null), 3000);
  }
    return result;
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

  // ─── پیدا کردن اطلاعات کامل کلمه ───
  const selectedWordEntry = selectedFruit
    ? allWords.find((w) => w.id === selectedFruit.wordId)
    : null;

  // ─── تعیین پیام راهنما ───
  const getGuidanceMessage = () => {
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-navy-900/60 font-mono">
              روز {gameState.currentDay}
            </span>
            <CoinDisplay coins={gameState.coins} />
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
        <div className="my-8 flex justify-center">
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

        {/* ─── دکمه‌ها ─── */}
        <div className="flex justify-center gap-3 flex-wrap">
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

          {/* دکمه‌ی افزودن کلمه */}
          <button
            onClick={() => setShowAddWordModal(true)}
            className="px-6 py-3 bg-gold-300 hover:bg-gold-500 text-navy-900 font-bold rounded-sm transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ➕ {t.addWord}
          </button>
        </div>
      </div>

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
      {selectedFruit && selectedWordEntry && (
        <HarvestPanel
          wordEntry={selectedWordEntry}
          locale={safeLocale}
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
    </div>
  );
}