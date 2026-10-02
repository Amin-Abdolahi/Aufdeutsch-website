// ============================================================
//  Alphabet World — client API helper
//  تنها ارتباط مرورگر با بک‌اند. کلیدی اینجا نیست — همه
//  چیزها از طریق این endpoint امن انجام می‌شود.
// ============================================================

import type { Level, UiLang } from "./types";
import type { ByokConfig } from "./byok";

export interface TestKeyResult {
  ok: boolean;
  error?: string;
  model?: string;
  suggestedModel?: string;
}

export interface AskResult {
  text: string;
  source: "ai" | "cache" | "offline";
  provider?: string;
  cached: boolean;
  byokError?: string;
}

export interface WordExplanation {
  word: string;
  pos: "noun" | "verb" | "adjective" | "adverb" | "other";
  article: string;
  plural: string;
  meaning: string;
  conjugation: string;
  forms: string;
  example: string;
  exampleTranslation: string;
  source: "ai" | "cache" | "offline";
  cached: boolean;
  byokError?: string;
}

export async function apiTestKey(byok: ByokConfig): Promise<TestKeyResult> {
  const res = await call("/api/alphabet-world/test-key", { byok }, byok);
  if (!res.ok) return { ok: false, error: `test-failed:${res.status}` };
  return (await res.json()) as TestKeyResult;
}

export class RateLimitedError extends Error {
  constructor() {
    super("rate-limit");
    this.name = "RateLimitedError";
  }
}

async function call(
  url: string,
  body: Record<string, unknown>,
  byok?: ByokConfig | null
): Promise<Response> {
  // کلید شخصی فقط در بدنهٔ همین درخواست به سرور همین سایت می‌رود
  const payload = byok ? { ...body, byok } : body;
  const controller = new AbortController();
  // مدل‌های reasoning ممکن است ۴۵ ثانیه طول بکشند
  const timer = setTimeout(() => controller.abort(), 90_000);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function apiAsk(
  question: string,
  level: Level,
  uiLang: UiLang,
  byok?: ByokConfig | null
): Promise<AskResult> {
  const res = await call(
    "/api/alphabet-world/ask",
    { question, level, uiLang },
    byok
  );
  if (res.status === 429) throw new RateLimitedError();
  if (!res.ok) throw new Error(`ask-failed:${res.status}`);
  return (await res.json()) as AskResult;
}

export async function apiExplain(
  word: string,
  level: Level,
  uiLang: UiLang,
  byok?: ByokConfig | null
): Promise<WordExplanation> {
  const res = await call(
    "/api/alphabet-world/explain",
    { word, level, uiLang },
    byok
  );
  if (res.status === 429) throw new RateLimitedError();
  if (!res.ok) throw new Error(`explain-failed:${res.status}`);
  return (await res.json()) as WordExplanation;
}
