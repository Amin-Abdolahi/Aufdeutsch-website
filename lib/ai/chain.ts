// ============================================================
//  Alphabet World — AI orchestrator
//  cache → rate-limit → provider chain → offline fallback
//  این ماژول فقط سمت سرور اجرا می‌شود.
// ============================================================

import {
  getProviders,
  ProviderError,
  type CompleteOpts,
} from "./providers";
import {
  byokProvider,
  explainByokError,
  normalizeByok,
  testByokKey,
  type ByokConfig,
} from "./byok";
import {
  ASK_LIMITS,
  BYOK_ASK_LIMITS,
  BYOK_EXPLAIN_LIMITS,
  EXPLAIN_LIMITS,
  checkRateLimit,
} from "./ratelimit";
import { askPrompt, explainPrompt } from "./prompts";
import { getCached, setCached } from "./cache";
import { env } from "./env";

import {
  offlineExplanation,
  type AskResult,
  type Level,
  type RateLimitError,
  type UiLang,
  type WordExplanation,
} from "./types";

const CACHE_TTL = 30 * 86_400; // ۳۰ روز — معنی کلمات تغییر نمی‌کند

function extractJson(text: string): Record<string, unknown> {
  const m = String(text).match(/\{[\s\S]*\}/);
  if (!m) throw new Error("no-json");
  return JSON.parse(m[0]);
}

async function runChain(
  prompt: string,
  opts: CompleteOpts,
  user?: ByokConfig | null
): Promise<{ text: string; provider: string; byokError?: string }> {
  // مدل‌های reasoning (مثل Atria-Dawn) توکن زیادی مصرف می‌کنند
  const isReasoning = user?.provider === "atria";
  const budget = isReasoning ? 1600 : opts.maxTokens;

  // کلید شخصی کاربر اول — اگر شکست خورد، چین سرور امتحان می‌شود
  const userProvider = user ? byokProvider(user) : null;
  const providers = userProvider ? [userProvider, ...getProviders()] : getProviders();
  if (providers.length === 0) throw new Error("no-provider-configured");

  let lastErr: unknown = null;
  let byokError: string | undefined;

  for (const p of providers) {
    try {
      const text = await p.complete(prompt, {
        ...opts,
        maxTokens: p === userProvider ? budget : opts.maxTokens,
      });
      if (text && text.trim()) return { text: text.trim(), provider: p.id };
      throw new Error("empty-response");
    } catch (e) {
      // دلیل شکست کلید شخصی را برای کاربر نگه می‌داریم
      if (p === userProvider && e instanceof ProviderError && user) {
        byokError = explainByokError(e.status, e.message, "fa", user.provider);
      }
      // پروایدر بعدی را امتحان کن
      lastErr = e;
    }
  }
  const err = new Error("all-providers-failed") as Error & { byokError?: string };
  err.byokError = byokError;
  throw err;
}

// ----------------------------------------------------------
// پاسخ به سؤال کاربر
// ----------------------------------------------------------
const OFFLINE_REPLIES: { test: RegExp; text: string }[] = [
  { test: /fernweh/, text: "Fernweh ist die Sehnsucht nach fernen Orten." },
  { test: /\bhallo\b|\bhi\b/, text: "Hallo! Schön, dass du hier bist." },
  { test: /danke/, text: "Gern geschehen, immer wieder gern." },
  { test: /wie geht/, text: "Mir geht es gut, danke der Nachfrage." },
];

function offlineAnswer(q: string): string {
  const s = q.toLowerCase();
  for (const r of OFFLINE_REPLIES) if (r.test.test(s)) return r.text;
  return "Ich bin gerade offline, aber die Buchstaben leben weiter.";
}

export async function askQuestion(params: {
  question: string;
  level: Level;
  identity: string;
  uiLang?: UiLang;
  byok?: ByokConfig;
}): Promise<AskResult> {
  const question = params.question.trim().slice(0, 300);
  const level = params.level;
  const user = normalizeByok(params.byok);
  if (!question) throw new Error("empty-question");

  // ۱) کش — رایگان و بدون شمارش در محدودیت
  const cached = await getCached<AskResult>("ask", question, level);
  if (cached) return { ...cached, cached: true, source: "cache" };

  // ۲) rate limit — سهمیه جداگانه برای کلید شخصی
  await checkRateLimit(
    params.identity,
    user ? "ask-byok" : "ask",
    user ? BYOK_ASK_LIMITS : ASK_LIMITS
  );

  // ۳) چین پروایدرها
  try {
    // Atria-Dawn یک reasoning model است و توکن زیادی مصرف می‌کند
    const isAtria = user?.provider === "atria" || (!user && !!env.atria);
    const { text, provider } = await runChain(
      askPrompt(question, level),
      {
        maxTokens: isAtria ? 1200 : 300,
        temperature: 0.5,
      },
      user
    );
    let a = text.replace(/^["“]|["”]$/g, "").trim();
    if (a.length > 160) a = a.slice(0, 158).trim() + ".";
    if (!a) throw new Error("empty-answer");

    const result: AskResult = {
      text: a,
      source: "ai",
      provider,
      cached: false,
    };
    await setCached("ask", result, CACHE_TTL, question, level);
    return result;
  } catch (e) {
    // جواب آفلاین، ولی دلیل شکست کلید شخصی به کاربر گفته می‌شود
    const byokError =
      user && e && typeof e === "object" && "byokError" in e
        ? (e as { byokError?: string }).byokError
        : undefined;
    return {
      text: offlineAnswer(question),
      source: "offline",
      cached: false,
      byokError,
    };
  }
}

// ----------------------------------------------------------
// توضیح یک کلمه
// ----------------------------------------------------------
export async function explainWord(params: {
  word: string;
  level: Level;
  identity: string;
  uiLang?: UiLang;
  byok?: ByokConfig;
}): Promise<WordExplanation> {
  const word = params.word.trim().slice(0, 80);
  const level = params.level;
  const uiLang = params.uiLang ?? "fa";
  const user = normalizeByok(params.byok);
  if (!word) throw new Error("empty-word");

  const cached = await getCached<WordExplanation>("explain", word, level, uiLang);
  if (cached) return { ...cached, cached: true, source: "cache" };

  await checkRateLimit(
    params.identity,
    user ? "explain-byok" : "explain",
    user ? BYOK_EXPLAIN_LIMITS : EXPLAIN_LIMITS
  );

  try {
    const isAtria = user?.provider === "atria" || (!user && !!env.atria);
    const { text, provider } = await runChain(
      explainPrompt(word, level, uiLang),
      {
        maxTokens: isAtria ? 1500 : 450,
        temperature: 0.3,
      },
      user
    );
    const j = extractJson(text);

    const result: WordExplanation = {
      word: typeof j.word === "string" && j.word ? j.word : word,
      pos: (["noun", "verb", "adjective", "adverb", "other"].includes(j.pos as string)
        ? (j.pos as WordExplanation["pos"])
        : "other"),
      article: typeof j.article === "string" ? j.article.slice(0, 3) : "",
      plural: typeof j.plural === "string" ? j.plural : "",
      meaning: typeof j.meaning === "string" ? j.meaning : "",
      conjugation: typeof j.conjugation === "string" ? j.conjugation : "",
      forms: typeof j.forms === "string" ? j.forms : "",
      example: typeof j.example === "string" ? j.example : "",
      exampleTranslation:
        typeof j.exampleTranslation === "string" ? j.exampleTranslation : "",
      source: "ai",
      provider,
      cached: false,
    };
    await setCached("explain", result, CACHE_TTL, word, level, uiLang);
    return result;
  } catch (e) {
    const byokError =
      user && e && typeof e === "object" && "byokError" in e
        ? (e as { byokError?: string }).byokError
        : undefined;
    return { ...offlineExplanation(word), byokError };
  }
}

export type { RateLimitError };
