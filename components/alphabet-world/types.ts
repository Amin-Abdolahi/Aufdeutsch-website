// ============================================================
//  Alphabet World — shared client types
// ============================================================

export type UiLang = "fa" | "de";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type SheetKind = "levels" | "vocab" | "word" | "games" | "settings" | null;

export interface LetterProfile {
  char: string;
  hue: string;
  personality: { fa: string; de: string };
  trait: string;
  idle: string[];
}

export interface VocabEntry {
  id: string;
  word: string;
  article: string;
  plural: string;
  pos: string;
  meaning: string;
  example: string;
  addedAt: number;
}

export interface Progress {
  level: Level;
  xp: number;
  streak: number;
  lastActive: string | null;
  vocab: VocabEntry[];
  gamesWon: number;
  onboarded: boolean;
}
