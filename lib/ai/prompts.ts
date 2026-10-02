// ============================================================
//  Alphabet World — level-adaptive prompts
//  زبان معنی‌ها بر اساس زبان UI کاربر (فارسی یا آلمانی) تنظیم
//  می‌شود تا با سایت دوزبانه هماهنگ باشد.
// ============================================================

import type { Level, UiLang } from "./types";

const LEVEL_GUIDE: Record<Level, string> = {
  A1: "absolute beginner. Use very short, simple German (present tense, common words).",
  A2: "elementary. Use simple German, short sentences, everyday vocabulary.",
  B1: "intermediate. Use clear German with some subordinate clauses.",
  B2: "upper-intermediate. Use natural German with richer vocabulary.",
  C1: "advanced. Use fluent, idiomatic German.",
};

const MEANING_LANG: Record<UiLang, string> = {
  fa: "Persian (فارسی)",
  de: "German",
};

export function askPrompt(question: string, level: Level): string {
  return [
    `You are the friendly voice of "Alphabet World", a German learning app for Persian speakers.`,
    `The user's level is ${level} (${LEVEL_GUIDE[level]}).`,
    `Answer this German-learning question in GERMAN with ONE clear, natural sentence`,
    `(max ~14 words) suitable for the level. No preamble, no quotes, no emojis.`,
    `Question: "${question}"`,
  ].join(" ");
}

export function explainPrompt(
  word: string,
  level: Level,
  uiLang: UiLang
): string {
  const ml = MEANING_LANG[uiLang];
  return [
    `Explain the German word "${word}" for a ${level} learner.`,
    `Return ONLY valid JSON (no markdown, no code fence) with exactly these keys:`,
    `{"word": string (correct German spelling, nouns capitalized),`,
    ` "pos": one of "noun","verb","adjective","adverb","other",`,
    ` "article": "der" or "die" or "das" or "" (only for nouns),`,
    ` "plural": string or "" (only for nouns),`,
    ` "meaning": short meaning in ${ml},`,
    ` "conjugation": for verbs, like "ich gehe, du gehst, er geht" else "",`,
    ` "forms": for adjectives, comparative/superlative else "",`,
    ` "example": one short German example sentence,`,
    ` "exampleTranslation": translation of the example into ${ml}}`,
  ].join(" ");
}
