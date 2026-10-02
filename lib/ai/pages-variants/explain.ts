// ============================================================
//  Alphabet World — Pages Router variant
//  برای راهنمای کپی‌کردن به فایل ask.ts همین پوشه مراجعه کنید.
// ============================================================

import type { NextApiRequest, NextApiResponse } from "next";
import { handleExplain } from "@/lib/ai/handler";

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
  const response = await handleExplain(toRequest(req));
  const body = await response.text();
  res.status(response.status).setHeader("Content-Type", "application/json");
  res.send(body);
}
