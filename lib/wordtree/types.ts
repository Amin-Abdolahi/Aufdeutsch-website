import { Locale } from "@/lib/i18n";

export type TreeLevel = "seedling" | "young" | "mature" | "ancient";
export type FruitType = "green" | "yellow" | "golden" | "orange";
export type WordStatus = "new" | "learning" | "learned";

export interface WordEntry {
  id: string;
  level: "A1" | "A2" | "B1";
  category: "noun" | "verb" | "adjective" | "phrase";
  translations: Record<Locale, string>;
  example?: Record<Locale, string>;
}

export interface Word {
  id: string;
  german: string;
  translation: string;
  status: WordStatus;
  reviewCount: number;
  lastReviewed?: number;
}

export interface Fruit {
  id: string;
  wordId: string;
  type: FruitType;
  createdAt: number;
  isReady: boolean;
}

export interface TreeState {
  level: TreeLevel;
  totalWords: number;
  fruits: Fruit[];
  lastWatered?: number;
  streak: number;
}

export interface GameState {
  tree: TreeState;
  words: Word[];
  coins: number;
  lastPlayed: number;
}