import { type NextRequest } from "next/server";
import { handleTestKey } from "@/lib/ai/handler";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  return handleTestKey(req);
}