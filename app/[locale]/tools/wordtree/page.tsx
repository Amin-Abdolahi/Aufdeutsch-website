"use client";

/**
 * Word Tree — Main Page (نسخه ۵.۰)
 *
 * این صفحه، رابط اصلی بازیه.
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کلمات جدید روزانه از `getDailyWords(5, learnedIds)` میان.
 *    `learnedIds` لیست کلماتی‌ست که کاربر قبلاً یاد گرفته.
 *    اینطوری هر روز کلمات **جدید** یاد می‌گیره، نه تکراری.
 *
 * ۲. اگه کلمه‌ی جدیدی نمونه (کاربر همه‌ی ۵۰ کلمه رو یاد گرفته)،
 *    پیام مناسب نشون داده می‌شه و دکمه‌ی آبیاری غیرفعال می‌شه.
 *
 * ۳. اطلاعات کلمه از دو منبع میاد:
 *    - `gameState.words`: اطلاعات وضعیت (status, reviewCount)
 *    - `WORDS_DE`: اطلاعات ثابت (گرامر، مثال، تلفظ)
 *
 * ۴. مفهوم «روز بازی»:
 *    - هر روز بازی دو مرحله داره: آبیاری + چیدن
 *    - وقتی هر دو انجام شد، `dayState` = "completed"
 *    - کاربر روی دکمه‌ی «روز بعد» کلیک می‌کنه و روز جدید شروع می‌شه
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDictionary, isLocale, Locale } from "@/lib/i18n";
import { GameState, Word } from "@/lib/wordtree/types";
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
import { Tree } from "./components/Tree";
import { CoinDisplay } from "./components/CoinDisplay";
import { ProgressBar } from "./components/ProgressBar";
import { WateringPanel } from "./components/WateringPanel";
import { HarvestPanel } from "./components/HarvestPanel";
import { Button } from "@/components/ui/Button";

export default function WordTreePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "fa";
  const safeLocale: Locale = isLocale(locale) ? locale : "fa";
  const dict = getDictionary(safeLocale);
  const t = dict.wordtree;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showWateringPanel, setShowWateringPanel] = useState(false);
  const [selectedFruitId, setSelectedFruitId] = useState<string | null>(null);

  // ─── بارگذاری از localStorage ───
  useEffect(() => {
    const saved = loadGameState();
    setGameState(saved || createInitialState());
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

  // ─── لیست کلماتی که کاربر قبلاً یاد گرفته ───
  const learnedIds = gameState.words.map((w) => w.id);

  // ─── آیا کلمه‌ی جدیدی برای یادگیری مونده؟ ───
  const hasNew = hasNewWords(learnedIds);

  // ─── کلمات روزانه (کلماتی که کاربر قبلاً یاد نگرفته) ───
  const dailyWords = getDailyWords(5, learnedIds);

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
    ? WORDS_DE.find((w) => w.id === selectedFruit.wordId)
    : null;

  // ─── تعیین پیام راهنما بر اساس وضعیت روز بازی ───
  const getGuidanceMessage = () => {
    // حالت ۱: کاربر همه‌ی کلمات رو یاد گرفته
    if (!hasNew && gameState.words.length >= WORDS_DE.length) {
      return "🎉 تبریک! تو همه‌ی کلمات رو یاد گرفتی. حالا فقط مرورشون کن.";
    }

    // حالت ۲: روز تموم شده، منتظر روز بعد
    if (gameState.dayState === "completed") {
      return `روز ${gameState.currentDay} تموم شد! 🎉`;
    }

    // حالت ۳: کاربر باید آبیاری کنه
    if (!gameState.wateredToday) {
      return t.firstWaterMessage;
    }

    // حالت ۴: میوه‌های روی درخت منتظر چیده شدنن
    if (readyFruits > 0) {
      return t.harvestMessage;
    }

    // حالت پیش‌فرض
    return `${t.wordsLearned}: ${gameState.tree.totalWords}`;
  };

  return (
    <div className="min-h-screen bg-paper-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ─── هدر: لینک بازگشت + شماره‌ی روز + سکه ─── */}
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

        {/* ─── نوار پیشرفت ─── */}
        <div className="mb-8">
          <ProgressBar
            current={gameState.tree.totalWords}
            total={WORDS_DE.length}
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
        <div className="flex justify-center gap-4">
          {gameState.dayState === "completed" ? (
            // روز تموم شده: دکمه‌ی «روز بعد»
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartNextDay}
            >
              🌅 روز بعد
            </Button>
          ) : (
            // روز فعال: دکمه‌ی «آبیاری»
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
    </div>
  );
}