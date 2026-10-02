// ============================================================
//  Alphabet World — bring-your-own-key (BYOK)
//  کاربر می‌تواند کلید شخصی خودش (مثلاً DeepSeek رایگان)
//  را بدهد. کلید فقط برای همان یک درخواست استفاده می‌شود،
//  هرگز لاگ نمی‌شود و هرگز در کلید کش قرار نمی‌گیرد.
// ============================================================

import {
  AnthropicProvider,
  OpenAICompatProvider,
  type Provider,
} from "./providers";

export type ByokProviderId = "atria" | "deepseek" | "groq" | "openrouter" | "custom";

export type ApiFormat = "openai" | "anthropic";

export interface ByokConfig {
  provider: ByokProviderId;
  apiKey: string;
  model?: string;
  // فقط برای provider="custom" — آدرس پایهٔ سرور
  baseUrl?: string;
  // فرمت API: پیش‌فرض openai. Anthropic برای سرورهای Atria/DeepSeek-style.
  format?: ApiFormat;
}

// فقط این پروایدرها مجازند (baseUrl ثابت) — جلوگیری از SSRF
export const BYOK_PRESETS: Record<
  ByokProviderId,
  {
    baseUrl: string;
    defaultModel: string;
    keyUrl: string;
    // مدل‌های پیشنهادی اگر مدل پیش‌فرض در دسترس نبود
    fallbackModels: string[];
  }
> = {
  deepseek: {
    baseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    keyUrl: "https://platform.deepseek.com/api_keys",
    fallbackModels: ["deepseek-chat", "deepseek-reasoner"],
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    keyUrl: "https://console.groq.com/keys",
    fallbackModels: [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "llama-3.3-70b-specdec",
      "gemma2-9b-it",
    ],
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "google/gemini-2.0-flash-exp:free",
    keyUrl: "https://openrouter.ai/keys",
    fallbackModels: [
      "google/gemini-2.0-flash-exp:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "deepseek/deepseek-chat:free",
    ],
  },
  atria: {
    baseUrl: "https://api.atria-asi.ai/v1",
    defaultModel: "Atria-Dawn-Preview",
    keyUrl: "https://atria-asi.ai",
    fallbackModels: ["Atria-Dawn-Preview"],
  },
  custom: {
    // کاربر خودش آدرس را می‌دهد
    baseUrl: "",
    defaultModel: "",
    keyUrl: "",
    fallbackModels: [],
  },
};

// آدرس پایهٔ مجاز برای پروایدر سفارشی — جلوگیری از SSRF
function safeBaseUrl(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  // فقط https مجاز است
  if (!/^https:\/\//i.test(s)) return null;
  try {
    const u = new URL(s);
    const host = u.hostname.toLowerCase();
    // آدرس‌های داخلی/لوکال ممنوع
    const blocked = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "[::1]",
      "169.254.169.254",
    ];
    if (blocked.includes(host)) return null;
    if (/^10\./.test(host)) return null;
    if (/^192\.168\./.test(host)) return null;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return null;
    if (/^169\.254\./.test(host)) return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

const MODEL_RE = /^[A-Za-z0-9._:/-]{1,80}$/;

export function normalizeByok(input: unknown): ByokConfig | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  const provider = o.provider;
  if (typeof provider !== "string" || !(provider in BYOK_PRESETS)) return null;

  const apiKey = typeof o.apiKey === "string" ? o.apiKey.trim() : "";
  // کلید نباید خالی، بسیار طولانی یا دارای فاصله/خط‌جدید باشد
  if (!apiKey || apiKey.length > 200 || /[\s]/.test(apiKey)) return null;

  const preset = BYOK_PRESETS[provider as ByokProviderId];
  let model = preset.defaultModel;
  if (typeof o.model === "string" && o.model.trim()) {
    const m = o.model.trim();
    if (!MODEL_RE.test(m)) return null;
    model = m;
  }

  // پروایدر سفارشی: آدرس پایه لازم است و باید امن باشد
  let baseUrl: string | undefined;
  if (provider === "custom") {
    const url = typeof o.baseUrl === "string" ? safeBaseUrl(o.baseUrl) : null;
    if (!url) return null;
    baseUrl = url;
    // مدل اختیاری؛ اگر نداد، یک پیش‌فرض بر اساس فرمت استفاده می‌کنیم
    if (!model) {
      const fmt =
        typeof o.format === "string" && o.format === "anthropic"
          ? "anthropic"
          : "openai";
      model = fmt === "anthropic" ? "atria-1" : "gpt-4o-mini";
    }
  }

  // فرمت API: فقط openai یا anthropic
  const format: ApiFormat =
    typeof o.format === "string" && o.format === "anthropic" ? "anthropic" : "openai";

  return { provider: provider as ByokProviderId, apiKey, model, baseUrl, format };
}

// تبدیل خطای HTTP پروایدر به پیام خوانا برای کاربر
export function explainByokError(
  status: number,
  raw: string,
  uiLang: "fa" | "de",
  provider?: ByokProviderId
): string {
  const fa = uiLang !== "de";
  const low = raw.toLowerCase();

  // آدرس درست صفحهٔ کلید هر پروایدر
  const host =
    provider === "groq"
      ? "console.groq.com/keys"
      : provider === "openrouter"
        ? "openrouter.ai/keys"
        : "platform.deepseek.com";

  const M = fa
    ? {
        auth: `کلید API نامعتبر است. کلید را در ${host} بررسی کن.`,
        balance: "موجودی حساب کافی نیست. ابتدا حساب را شارژ کن.",
        quota: "سهمیه این کلید تمام شده. فردا دوباره یا از کلید دیگری استفاده کن.",
        rate: "درخواست‌ها بیش از حد سریع بود. چند ثانیه صبر کن.",
        model: "این مدل در دسترس نیست. فیلد مدل را خالی کن یا نام دیگری امتحان کن.",
        net: "اتصال به سرور ناموفق بود. اینترنت را بررسی کن.",
        unknown: "خطای ناشناخته (کد {s}). کلید را بررسی و دوباره امتحان کن.",
      }
    : {
        auth: `Der API-Schlüssel ist ungültig. Prüfe ihn auf ${host}.`,
        balance: "Nicht genug Guthaben. Bitte aufladen.",
        quota: "Kontingent aufgebraucht. Morgen oder mit anderem Schlüssel.",
        rate: "Zu viele Anfragen. Warte einen Moment.",
        model: "Modell nicht verfügbar. Feld leer lassen oder anderes Modell.",
        net: "Verbindung fehlgeschlagen. Internet prüfen.",
        unknown: "Unbekannter Fehler (Code {s}). Schlüssel prüfen und erneut.",
      };

  const pick = (k: keyof typeof M) => M[k].replace("{s}", String(status));

  if (status === 401 || status === 403) return pick("auth");
  if (status === 402) return pick("balance");
  if (status === 404 || /model/.test(low)) return pick("model");
  if (status === 429) return pick("quota");
  if (status >= 500) return pick("net");
  if (/insufficient balance/.test(low) || /no enough balance/.test(low)) return pick("balance");
  if (/quota/.test(low) || /rate limit/.test(low)) return pick("quota");
  if (/invalid api key|unauthorized|forbidden/.test(low)) return pick("auth");
  return pick("unknown");
}

// گرفتن لیست مدل‌های قابل دسترس از سرور (اگر کلید معتبر باشد)
async function listModels(cfg: ByokConfig): Promise<string[] | null> {
  const preset = BYOK_PRESETS[cfg.provider];
  const baseUrl =
    cfg.provider === "custom" ? cfg.baseUrl ?? "" : preset.baseUrl;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${cfg.apiKey}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const ids: unknown = data?.data;
    if (!Array.isArray(ids)) return null;
    return ids
      .map((m: any) => (typeof m?.id === "string" ? m.id : ""))
      .filter(Boolean);
  } catch {
    return null;
  }
}

// تست زندهٔ کلید: یک درخواست کوچک، بدون کش و بدون rate limit.
// اگر مدل مشخص‌شده نامعتبر باشد، مدل‌های پیشنهادی هم امتحان می‌شوند.
export async function testByokKey(
  cfg: ByokConfig
): Promise<{ ok: boolean; error?: string; model?: string }> {
  const preset = BYOK_PRESETS[cfg.provider];
  // پروایدر سفارشی مدل ثابت ندارد — فقط همان یک مدل تست می‌شود
  const candidates =
    cfg.provider === "custom"
      ? [cfg.model ?? ""].filter(Boolean)
      : [
          ...(cfg.model && cfg.model !== preset.defaultModel ? [cfg.model] : []),
          preset.defaultModel,
          ...preset.fallbackModels.filter((m) => m !== preset.defaultModel),
        ];

  const tested = new Set<string>();

  const tryModel = async (model: string): Promise<boolean> => {
    if (tested.has(model)) return false;
    tested.add(model);
    const provider = byokProvider({ ...cfg, model });
    try {
      // مدل‌های reasoning (مثل Atria) توکن زیادی مصرف می‌کنند
      const text = await provider.complete(
        "Antworte mit genau einem Wort: Hallo. Keine Erklärung.",
        { maxTokens: 512, temperature: 0 }
      );
      if (!text.trim()) throw new Error("empty-response");
      return true;
    } catch (e) {
      lastErr = e;
      // خطای احراز هویت/موجودی یعنی کلید مشکل دارد — مدل بعدی کمکی نمی‌کند
      const errObj = e as { status?: unknown } | null;
      const status = typeof errObj?.status === "number" ? errObj.status : 0;
      if (status === 401 || status === 402 || status === 403) throw e;
      return false;
    }
  };

  let lastErr: unknown = null;
  try {
    for (const model of candidates) {
      if (await tryModel(model)) return { ok: true, model };
    }
  } catch (e) {
    lastErr = e;
  }

  // مرحلهٔ نهایی: لیست زندهٔ مدل‌های سرور را بگیر و امتحان کن
  const live = await listModels(cfg);
  if (live && live.length) {
    const preferred = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "gemma2-9b-it",
      "llama-3.2-3b-preview",
    ];
    const ordered = [
      ...preferred.filter((m) => live.includes(m)),
      ...live.filter((m) => !preferred.includes(m)),
    ];
    try {
      for (const model of ordered) {
        if (await tryModel(model)) return { ok: true, model };
      }
    } catch (e) {
      lastErr = e;
    }
  }

  const e = (lastErr as unknown as { status?: unknown; message?: string } | null) ?? {};
  const status = typeof e.status === "number" ? e.status : 0;
  return {
    ok: false,
    error: explainByokError(status, String(e.message ?? ""), "fa", cfg.provider),
  };
}

export function byokProvider(cfg: ByokConfig): Provider {
  const preset = BYOK_PRESETS[cfg.provider];
  const baseUrl = cfg.provider === "custom" ? cfg.baseUrl ?? "" : preset.baseUrl;
  const id = `byok:${cfg.provider}`;
  const model = cfg.model ?? preset.defaultModel;

  // فرمت Anthropic برای سرورهای Atria/DeepSeek-style
  if (cfg.format === "anthropic") {
    return new AnthropicProvider(id, cfg.apiKey, baseUrl, model);
  }
  return new OpenAICompatProvider(id, cfg.apiKey, baseUrl, model);
}