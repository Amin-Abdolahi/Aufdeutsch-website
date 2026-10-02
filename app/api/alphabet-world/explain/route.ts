// ============================================================
//  Alphabet World — /api/alphabet-world/explain  (App Router)
// ============================================================

import { handleExplain } from "@/lib/ai/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  return handleExplain(req);
}
