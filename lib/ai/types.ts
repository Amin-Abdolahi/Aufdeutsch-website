// ============================================================
//  Alphabet World — shared AI types
// ============================================================

export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type UiLang = "fa" | "de";
export type Source = "ai" | "cache" | "offline";

export interface AskResult {
  text: string;
  source: Source;
  provider?: string;
  cached: boolean;
  // اگر کلید شخصی کاربر رد شده باشد، دلیل خوانا اینجاست
  byokError?: string;
}

export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "other";

export interface WordExplanation {
  word: string;
  pos: PartOfSpeech;
  article: string;
  plural: string;
  meaning: string;
  conjugation: string;
  forms: string;
  example: string;
  exampleTranslation: string;
  source: Source;
  provider?: string;
  cached: boolean;
  byokError?: string;
}

export class RateLimitError extends Error {
  constructor(public retryAfterSec: number) {
    super("rate-limit");
    this.name = "RateLimitError";
  }
}

const FALLBACK_EXPLANATION = {
  pos: "other" as PartOfSpeech,
  article: "",
  plural: "",
  conjugation: "",
  forms: "",
  meaning: "",
  example: "",
  exampleTranslation: "",
};

export interface TestResult {
  ok: boolean;
  provider?: string;
  model?: string;
  error?: string;
}

export function offlineExplanation(word: string): WordExplanation {
  return {
    word,
    ...FALLBACK_EXPLANATION,
    source: "offline",
    cached: false,
  };
}
