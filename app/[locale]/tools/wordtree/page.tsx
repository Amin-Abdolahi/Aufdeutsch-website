"use client";

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
} from "@/lib/wordtree/gameLogic";
import { getDailyWords } from "@/data/wordtree/words-de";
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

  useEffect(() => {
    const saved = loadGameState();
    setGameState(saved || createInitialState());
  }, []);

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

  const handleStartWatering = () => {
    setShowWateringPanel(true);
  };

  const handleWateringComplete = (learnedWordIds: string[]) => {
    const dailyWords = getDailyWords(5);
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

  const handleFruitClick = (fruitId: string) => {
    setSelectedFruitId(fruitId);
  };

  const handleHarvestAnswer = (remembered: boolean) => {
    if (selectedFruitId) {
      setGameState(harvestFruit(gameState, selectedFruitId, remembered));
      setSelectedFruitId(null);
    }
  };

  const wateringWords = getDailyWords(5).map((w) => ({
    id: w.id,
    german: w.translations.de,
    translation: w.translations[safeLocale] || w.translations.fa,
    example: w.example?.[safeLocale] || w.example?.fa,
  }));

  // پیدا کردن میوه‌ی انتخاب شده
  const selectedFruit = selectedFruitId
    ? gameState.tree.fruits.find((f) => f.id === selectedFruitId)
    : null;

  // پیدا کردن کلمه‌ی مربوط به میوه
  const selectedWord = selectedFruit
    ? gameState.words.find((w) => w.id === selectedFruit.wordId)
    : null;

  return (
    <div className="min-h-screen bg-paper-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${safeLocale}/tools`}
            className="text-navy-900/60 hover:text-navy-900 transition text-sm font-mono"
          >
            ← {t.backToTools}
          </Link>
          <CoinDisplay coins={gameState.coins} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 font-mono mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-navy-900/60">{t.pageSubtitle}</p>
        </div>

        <div className="mb-8">
          <ProgressBar
            current={gameState.tree.totalWords}
            total={50}
            label={t.progress}
          />
        </div>

        <div className="my-8 flex justify-center">
          <Tree
            level={gameState.tree.level}
            fruits={gameState.tree.fruits}
            onFruitClick={handleFruitClick}
          />
        </div>

        <div className="text-center mb-6">
          {gameState.tree.totalWords === 0 ? (
            <p className="text-navy-900/70">{t.firstWaterMessage}</p>
          ) : gameState.tree.fruits.length > 0 ? (
            <p className="text-navy-900/70">{t.harvestMessage}</p>
          ) : (
            <p className="text-navy-900/70">
              {t.wordsLearned}: {gameState.tree.totalWords}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartWatering}
            disabled={!canWater}
          >
            {canWater ? `💧 ${t.waterButton}` : t.waterButtonDisabled}
          </Button>
        </div>
      </div>

      {/* پنل آبیاری */}
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

      {/* پنل چیدن */}
      {selectedFruit && selectedWord && (
        <HarvestPanel
          german={selectedWord.german}
          translation={selectedWord.translation}
          example={
            getDailyWords(5).find((w) => w.id === selectedWord.id)?.example?.[
              safeLocale
            ] ||
            getDailyWords(5).find((w) => w.id === selectedWord.id)?.example?.fa
          }
          onAnswer={handleHarvestAnswer}
          labels={{
            title: t.harvestPanelTitle,
            question: t.harvestPanelQuestion,
            reveal: t.harvestReveal,
            forgot: t.harvestForgot,
            remembered: t.harvestRemembered,
          }}
        />
      )}
    </div>
  );
}