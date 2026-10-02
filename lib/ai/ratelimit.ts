// ============================================================
//  Alphabet World — per-user rate limiting
//  جلوی اسپم و سوءاستفاده از سهمیه رایگان را می‌گیرد.
//  کش hitها شامل محدودیت نمی‌شوند (تشویق به سؤالات رایج).
// ============================================================

import { getKv } from "./kv";
import { RateLimitError } from "./types";

export interface Limits {
  perMinute: number;
  perDay: number;
}

// سطح سبک (تا ۵۰ کاربر هم‌زمان) — قابل تنظیم
export const ASK_LIMITS: Limits = { perMinute: 12, perDay: 120 };
export const EXPLAIN_LIMITS: Limits = { perMinute: 20, perDay: 200 };

// کاربرانی که کلید شخصی خودشان را می‌دهند: سهمیه خودشان است،
// پس محدودیت بالاتر است (هنوز جلوی سوءاستفاده گرفته می‌شود).
export const BYOK_ASK_LIMITS: Limits = { perMinute: 60, perDay: 1000 };
export const BYOK_EXPLAIN_LIMITS: Limits = { perMinute: 90, perDay: 1500 };

export async function checkRateLimit(
  identity: string,
  bucket: string,
  limits: Limits
): Promise<void> {
  const kv = getKv();
  const now = Date.now();
  const minute = Math.floor(now / 60_000);
  const day = Math.floor(now / 86_400_000);

  const [m, d] = await Promise.all([
    kv.incr(`aw:rl:${bucket}:${identity}:m${minute}`, 125),
    kv.incr(`aw:rl:${bucket}:${identity}:d${day}`, 90_000),
  ]);

  if (m > limits.perMinute) throw new RateLimitError(60);
  if (d > limits.perDay) throw new RateLimitError(86400);
}
