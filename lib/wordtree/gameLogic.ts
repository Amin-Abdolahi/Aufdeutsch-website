import { GameState, Word, Fruit, TreeLevel } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  WORDS_TO_YOUNG,
  WORDS_TO_MATURE,
  WORDS_TO_ANCIENT,
} from "./constants";

export function createInitialState(): GameState {
  return {
    tree: {
      level: "seedling",
      totalWords: 0,
      fruits: [],
      streak: 0,
    },
    words: [],
    coins: 0,
    lastPlayed: Date.now(),
  };
}

export function calculateTreeLevel(totalWords: number): TreeLevel {
  if (totalWords >= WORDS_TO_ANCIENT) return "ancient";
  if (totalWords >= WORDS_TO_MATURE) return "mature";
  if (totalWords >= WORDS_TO_YOUNG) return "young";
  return "seedling";
}

export function waterTree(state: GameState, newWords: Word[]): GameState {
  const totalWords = state.tree.totalWords + newWords.length;
  const newLevel = calculateTreeLevel(totalWords);

  // اضافه کردن میوه‌های کال جدید
  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: false,
  }));

  return {
    ...state,
    words: [...state.words, ...newWords],
    tree: {
      ...state.tree,
      totalWords,
      level: newLevel,
      lastWatered: Date.now(),
      fruits: [...state.tree.fruits, ...newFruits],
    },
  };
}

export function harvestFruit(
  state: GameState,
  fruitId: string,
  remembered: boolean
): GameState {
  const fruit = state.tree.fruits.find((f) => f.id === fruitId);
  if (!fruit) return state;

  // اگه یادش مونده بود → میوه طلایی + سکه
  if (remembered) {
    const coinsEarned = COIN_PER_GOLDEN_FRUIT;
    return {
      ...state,
      coins: state.coins + coinsEarned,
      tree: {
        ...state.tree,
        fruits: state.tree.fruits.filter((f) => f.id !== fruitId),
      },
      words: state.words.map((w) =>
        w.id === fruit.wordId
          ? { ...w, reviewCount: w.reviewCount + 1, lastReviewed: Date.now() }
          : w
      ),
    };
  }

  // اگه یادش رفته بود → میوه نارنجی می‌مونه
  return {
    ...state,
    tree: {
      ...state.tree,
      fruits: state.tree.fruits.map((f) =>
        f.id === fruitId ? { ...f, type: "orange" as const } : f
      ),
    },
  };
}

export function canWaterToday(state: GameState): boolean {
  if (!state.tree.lastWatered) return true;
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return state.tree.lastWatered < oneDayAgo;
}