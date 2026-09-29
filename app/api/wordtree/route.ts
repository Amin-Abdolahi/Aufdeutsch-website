import { NextResponse } from "next/server";
import { WORDS_DE } from "@/data/wordtree/words-de";

export async function GET() {
  return NextResponse.json({
    words: WORDS_DE,
    total: WORDS_DE.length,
  });
}