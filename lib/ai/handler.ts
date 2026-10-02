// ============================================================
//  Alphabet World — request handlers (shared)
//  هم برای App Router و هم Pages Router قابل استفاده است.
// ============================================================

import { askQuestion, explainWord } from "./chain";
import { normalizeByok, testByokKey, type ByokConfig } from "./byok";
import { RateLimitError, type Level, type UiLang } from "./types";

const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);
const LANGS = new Set(["fa", "de"]);

// کلید کاربر هرگز در پاسخ خطا یا لاگ قرار نمی‌گیرد
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function normalizeLevel(v: unknown): Level {
  const s = String(v ?? "").toUpperCase();
  return LEVELS.has(s) ? (s as Level) : "A1";
}
function normalizeLang(v: unknown): UiLang {
  const s = String(v ?? "").toLowerCase();
  return LANGS.has(s) ? (s as UiLang) : "fa";
}

// IP کاربر — ناشناس، فقط برای rate limiting
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------
export async function handleAsk(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method-not-allowed" }, 405);

  const body = await readBody(req);
  if (!body) return json({ error: "invalid-body" }, 400);

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) return json({ error: "empty-question" }, 400);

  try {
    const result = await askQuestion({
      question,
      level: normalizeLevel(body.level),
      uiLang: normalizeLang(body.uiLang),
      identity: clientIp(req),
      byok: body.byok as ByokConfig | undefined,
    });
    return json(result);
  } catch (e) {
    if (e instanceof RateLimitError) {
      return json({ error: "rate-limit", retryAfter: e.retryAfterSec }, 429);
    }
    return json({ error: "server-error" }, 500);
  }
}

// ----------------------------------------------------------
// تست زندهٔ کلید شخصی کاربر (از برگهٔ تنظیمات)
// ----------------------------------------------------------

// ----------------------------------------------------------
export async function handleExplain(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method-not-allowed" }, 405);

  const body = await readBody(req);
  if (!body) return json({ error: "invalid-body" }, 400);

  const word = typeof body.word === "string" ? body.word.trim() : "";
  if (!word) return json({ error: "empty-word" }, 400);

  try {
    const result = await explainWord({
      word,
      level: normalizeLevel(body.level),
      uiLang: normalizeLang(body.uiLang),
      identity: clientIp(req),
      byok: body.byok as ByokConfig | undefined,
    });
    return json(result);
  } catch (e) {
    if (e instanceof RateLimitError) {
      return json({ error: "rate-limit", retryAfter: e.retryAfterSec }, 429);
    }
    return json({ error: "server-error" }, 500);
  }
}

// ----------------------------------------------------------
// تست زندهٔ کلید شخصی کاربر (از برگهٔ تنظیمات)
// ----------------------------------------------------------
export async function handleTestKey(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method-not-allowed" }, 405);

  const body = await readBody(req);
  if (!body) return json({ error: "invalid-body" }, 400);

  const cfg = normalizeByok(body.byok);
  if (!cfg) return json({ ok: false, error: "invalid-key-format" });

  try {
    const res = await testByokKey(cfg);
    // اگر مدل دیگری کار کرد، آن را به کاربر می‌گوییم تا ذخیره کند
    if (res.ok && res.model && res.model !== cfg.model) {
      return json({ ...res, suggestedModel: res.model });
    }
    return json(res);
  } catch {
    return json({ ok: false, error: "server-error" });
  }
}
