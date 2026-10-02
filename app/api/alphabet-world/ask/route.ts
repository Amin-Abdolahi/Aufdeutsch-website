// ============================================================
//  Alphabet World — /api/alphabet-world/ask  (App Router)
//  در سایت Pages Router: این پوشه را پاک کنید و فایل‌های
//  lib/ai/pages-variants/ را به pages/api/ منتقل کنید.
// ============================================================

import { handleAsk } from "@/lib/ai/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// مدل‌های reasoning کند هستند
export const maxDuration = 120;

export async function POST(req: Request) {
  return handleAsk(req);
}
