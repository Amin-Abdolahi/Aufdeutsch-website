// ============================================================
//  Alphabet World — environment access (server-only)
//  کلیدها فقط از اینجا خوانده می‌شوند و هرگز به کلاینت نمی‌روند.
// ============================================================

function read(name: string): string {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

export const env = {
  gemini: read("GEMINI_API_KEY"),
  // کلید اختیاری Atria (سمت سرور) — در صورت تنظیم، در چین می‌آید
  atria: read("ATRIA_API_KEY"),
  atriaModel: read("ATRIA_MODEL") || "Atria-Dawn-Preview",
  geminiModel: read("GEMINI_MODEL") || "gemini-2.0-flash",
  groq: read("GROQ_API_KEY"),
  groqModel: read("GROQ_MODEL") || "llama-3.3-70b-versatile",
  openrouter: read("OPENROUTER_API_KEY"),
  openrouterModel:
    read("OPENROUTER_MODEL") || "google/gemini-2.0-flash-exp:free",
  // Upstash (optional — falls back to in-memory)
  upstashUrl: read("UPSTASH_REDIS_REST_URL"),
  upstashToken: read("UPSTASH_REDIS_REST_TOKEN"),
};

export const hasUpstash = !!(env.upstashUrl && env.upstashToken);
export const configuredProviders = ["gemini", "groq", "openrouter", "atria"].filter(
  (k) => env[k as keyof typeof env]
);
