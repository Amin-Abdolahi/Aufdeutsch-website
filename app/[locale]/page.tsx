import { Metadata } from "next";
import { HomeContent } from "@/components/HomeContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, Metadata> = {
    fa: {
      title: "AUF Deutsch — آموزش زبان آلمانی",
      description: "آموزش آنلاین زبان آلمانی با مدرسین مجرب",
    },
    de: {
      title: "AUF Deutsch — Deutsch lernen",
      description: "Online-Deutschunterricht mit erfahrenen Lehrern",
    },
    en: {
      title: "AUF Deutsch — Learn German",
      description: "Online German lessons with experienced teachers",
    },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa",
        de: "/de",
        en: "/en",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return <HomeContent locale={validLocale} />;
}