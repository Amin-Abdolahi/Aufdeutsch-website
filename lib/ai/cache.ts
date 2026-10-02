// ============================================================
//  Alphabet World — response cache
//  سؤالات پرتکرار و توضیح کلمات مشترک بین همه کاربران کش
//  می‌شوند → صدا زدن AI تا ۸۰٪ کاهش می‌یابد.
// ============================================================

import { getKv } from "./kv";

const PREFIX = "aw:cache:";

// djb2 — سریع و برای کلیدهای کش کافی است
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

export async function getCached<T>(
  bucket: string,
  ...parts: string[]
): Promise<T | null> {
  try {
    return await getKv().get<T>(`${PREFIX}${bucket}:${hash(parts.join("|"))}`);
  } catch {
    return null;
  }
}

export async function setCached<T>(
  bucket: string,
  value: T,
  ttlSec: number,
  ...parts: string[]
): Promise<void> {
  try {
    await getKv().set<T>(`${PREFIX}${bucket}:${hash(parts.join("|"))}`, value, ttlSec);
  } catch {
    // کش کار نکرد — مشکلی نیست، درخواست همچنان جواب داده شد
  }
}
