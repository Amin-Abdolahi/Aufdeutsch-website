import { NextResponse } from "next/server";
import { getApprovedTestimonials } from "@/lib/testimonials";
import { locales } from "@/lib/i18n";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");

  const validLocale = locale && locales.includes(locale as any) ? locale : "fa";

  const testimonials = await getApprovedTestimonials(validLocale as "fa" | "de" | "en");

  return NextResponse.json({ testimonials });
}