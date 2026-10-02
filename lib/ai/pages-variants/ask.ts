// ============================================================
//  Alphabet World — Pages Router variant
//
//  اگر سایت شما از Pages Router استفاده می‌کند:
//   1. پوشه app/api/alphabet-world/ را کامل پاک کنید
//   2. این دو فایل را به این مسیرها کپی کنید:
//        ask.ts      → pages/api/alphabet-world/ask.ts
//        explain.ts  → pages/api/alphabet-world/explain.ts
//   3. در 두 فایل مسیر import را تصحیح کنید (احتمالاً "@/lib/ai/handler"
//      اگر پوشه lib در ریشه پروژه باشد درست کار می‌کند).
// ============================================================

import type { NextApiRequest, NextApiResponse } from "next";
import { handleAsk } from "@/lib/ai/handler";

function toRequest(req: NextApiRequest): Request {
  const url = `http://${req.headers.host || "localhost"}${req.url || "/"}`;
  return new Request(url, {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body: req.body ? JSON.stringify(req.body) : undefined,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await handleAsk(toRequest(req));
  const body = await response.text();
  res.status(response.status).setHeader("Content-Type", "application/json");
  res.send(body);
}
