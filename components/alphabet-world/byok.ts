// ============================================================
//  Alphabet World — user's own API key (client side)
//  کلید فقط در همین مرورگر ذخیره می‌شود، هیچ‌وقت به جایی
//  خارج از API routeهای همین سایت ارسال نمی‌شود و در صورت
//  پاک کردن مرورگر از بین می‌رود.
// ============================================================

export type ByokProviderId = "atria" | "deepseek" | "groq" | "openrouter" | "custom";
export type ApiFormat = "openai" | "anthropic";

export interface ByokConfig {
  provider: ByokProviderId;
  apiKey: string;
  model?: string;
  baseUrl?: string;
  format?: ApiFormat;
}

const LS_KEY = "alphabetworld.byok.v1";

export const BYOK_PRESETS: Record<
  ByokProviderId,
  { label: string; baseUrl: string; defaultModel: string; keyUrl: string; free: string }
> = {
  deepseek: {
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    keyUrl: "https://platform.deepseek.com/api_keys",
    free: "اعتبار خوش‌آمدگویی + قیمت بسیار پایین",
  },
  groq: {
    label: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    keyUrl: "https://console.groq.com/keys",
    free: "رایگان (سهمیه روزانه)",
  },
  openrouter: {
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "google/gemini-2.0-flash-exp:free",
    keyUrl: "https://openrouter.ai/keys",
    free: "چند مدل رایگان",
  },
  atria: {
    label: "Atria",
    baseUrl: "https://api.atria-asi.ai/v1",
    defaultModel: "Atria-Dawn-Preview",
    keyUrl: "https://atria-asi.ai",
    free: "مدل Atria-Dawn-Preview",
  },
  custom: {
    label: "سفارشی",
    baseUrl: "",
    defaultModel: "",
    keyUrl: "",
    free: "هر سرور OpenAI-سازگار",
  },
};

export function loadByok(): ByokConfig | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<ByokConfig>;
    if (!p || typeof p.provider !== "string" || typeof p.apiKey !== "string") return null;
    if (!(p.provider in BYOK_PRESETS)) return null;
    if (!p.apiKey.trim()) return null;
    return {
      provider: p.provider as ByokProviderId,
      apiKey: p.apiKey.trim(),
      model: typeof p.model === "string" ? p.model.trim() : undefined,
      baseUrl: typeof p.baseUrl === "string" ? p.baseUrl.trim() : undefined,
      format:
        typeof p.format === "string" && p.format === "anthropic"
          ? "anthropic"
          : "openai",
    };
  } catch {
    return null;
  }
}

export function saveByok(cfg: ByokConfig | null): void {
  try {
    if (!cfg) localStorage.removeItem(LS_KEY);
    else localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  } catch {
    // storage مسدود یا پر است
  }
}

export function hasByok(): boolean {
  return !!loadByok();
}