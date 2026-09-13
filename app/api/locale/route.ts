import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { locale } = await request.json();

  const validLocales = ["fa", "de", "en"] as const;
  const validLocale = validLocales.includes(locale as any) ? locale : "fa";

  const response = NextResponse.json({ success: true });
  response.cookies.set("locale", validLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}