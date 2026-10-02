// ============================================================
//  Alphabet World — AI provider adapters
//  هر پروایدر یک رابط یکسان دارد تا چین fallback کار کند.
// ============================================================

import { env } from "./env";

export interface CompleteOpts {
  maxTokens: number;
  temperature: number;
}

export interface Provider {
  id: string;
  available(): boolean;
  complete(prompt: string, opts: CompleteOpts): Promise<string>;
}

export class ProviderError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

async function postJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ProviderError(res.status, body.slice(0, 200));
  }
  return res.json() as Promise<T>;
}

// ----------------------------------------------------------
// Google Gemini  (generativelanguage API)
// ----------------------------------------------------------
class GeminiProvider implements Provider {
  id = "gemini";
  private key = env.gemini;
  private model = env.geminiModel;

  available() {
    return !!this.key;
  }

  async complete(prompt: string, opts: CompleteOpts): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.key}`;
    const data = await postJson<any>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: opts.temperature,
          maxOutputTokens: opts.maxTokens,
        },
      }),
    });
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) throw new ProviderError(200, "empty-gemini");
    return parts.map((p: any) => (typeof p?.text === "string" ? p.text : "")).join("");
  }
}

// ----------------------------------------------------------
// OpenAI-compatible  (Groq + OpenRouter)
// ----------------------------------------------------------
export class OpenAICompatProvider implements Provider {
  id: string;
  private key: string;
  private baseUrl: string;
  private model: string;

  constructor(id: string, key: string, baseUrl: string, model: string) {
    this.id = id;
    this.key = key;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  available() {
    return !!this.key;
  }

  async complete(prompt: string, opts: CompleteOpts): Promise<string> {
    const data = await postJson<any>(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.key}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    });
    const msg = data?.choices?.[0]?.message;
    if (!msg) return "";
    // مدل‌های reasoning (مثل Atria-Dawn) فرآیند فکر را در reasoning_content
    // می‌گذارند و جواب نهایی در content. فقط content را برمی‌گردانیم.
    return msg.content || "";
  }
}

// ----------------------------------------------------------
// Provider chain — به ترتیب اولویت. هر کدام شکست خورد، بعدی.
// ----------------------------------------------------------
// ----------------------------------------------------------
// Anthropic Messages API  (مثل Atria / DeepSeek anthropic endpoint)
// ----------------------------------------------------------
export class AnthropicProvider implements Provider {
  id: string;
  private key: string;
  private baseUrl: string;
  private model: string;

  constructor(id: string, key: string, baseUrl: string, model: string) {
    this.id = id;
    this.key = key;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.model = model;
  }

  available() {
    return !!this.key;
  }

  async complete(prompt: string, opts: CompleteOpts): Promise<string> {
    const data = await postJson<any>(`${this.baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: opts.maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const blocks = data?.content;
    if (!Array.isArray(blocks)) return "";
    return blocks
      .map((b: any) => (typeof b?.text === "string" ? b.text : ""))
      .join("");
  }
}

export function getProviders(): Provider[] {
  const list: Provider[] = [];
  if (env.atria)
    list.push(
      new OpenAICompatProvider(
        "atria",
        env.atria,
        "https://api.atria-asi.ai/v1",
        env.atriaModel
      )
    );
  if (env.gemini) list.push(new GeminiProvider());
  if (env.groq)
    list.push(
      new OpenAICompatProvider(
        "groq",
        env.groq,
        "https://api.groq.com/openai/v1",
        env.groqModel
      )
    );
  if (env.openrouter)
    list.push(
      new OpenAICompatProvider(
        "openrouter",
        env.openrouter,
        "https://openrouter.ai/api/v1",
        env.openrouterModel
      )
    );
  return list;
}
