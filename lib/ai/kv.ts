// ============================================================
//  Alphabet World — Key/Value storage
//  اگر Upstash Redis تنظیم شده باشد از آن استفاده می‌شود
//  (بین همه نمونه‌های serverless مشترک است)؛ در غیر این حالت
//  یک کش in-memory (برای توسعه / تک‌نمونه).
// ============================================================

import { env, hasUpstash } from "./env";

export interface Kv {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSec: number): Promise<void>;
  incr(key: string, ttlSec: number): Promise<number>;
}

// ----------------------------------------------------------
// In-memory (dev fallback)
// ----------------------------------------------------------
class MemoryKv implements Kv {
  private store = new Map<string, { v: unknown; exp: number }>();

  private clean(key: string) {
    const e = this.store.get(key);
    if (e && e.exp < Date.now()) this.store.delete(key);
  }

  async get<T>(key: string): Promise<T | null> {
    this.clean(key);
    const e = this.store.get(key);
    return e ? (e.v as T) : null;
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    this.store.set(key, { v: value, exp: Date.now() + ttlSec * 1000 });
  }

  async incr(key: string, ttlSec: number): Promise<number> {
    this.clean(key);
    const e = this.store.get(key);
    const n = (typeof e?.v === "number" ? e.v : 0) + 1;
    this.store.set(key, { v: n, exp: Date.now() + ttlSec * 1000 });
    return n;
  }
}

// ----------------------------------------------------------
// Upstash Redis
// ----------------------------------------------------------
class UpstashKv implements Kv {
  private url: string;
  private token: string;

  constructor() {
    this.url = env.upstashUrl.replace(/\/$/, "");
    this.token = env.upstashToken;
  }

  private async cmd<T>(args: string[]): Promise<T> {
    const res = await fetch(`${this.url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`upstash-${res.status}`);
    const body = await res.json();
    return body?.result as T;
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.cmd<string | null>(["GET", key]);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSec: number): Promise<void> {
    await this.cmd(["SET", key, JSON.stringify(value), "EX", String(ttlSec)]);
  }

  async incr(key: string, ttlSec: number): Promise<number> {
    // atomic increment + expiry refresh
    const n = await this.cmd<number>(["INCR", key]);
    await this.cmd(["EXPIRE", key, String(ttlSec)]);
    return n;
  }
}

let _kv: Kv | null = null;

export function getKv(): Kv {
  if (!_kv) {
    _kv = hasUpstash ? new UpstashKv() : new MemoryKv();
  }
  return _kv;
}
