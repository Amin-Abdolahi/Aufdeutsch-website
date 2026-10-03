import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";
  const metadata: Record<Locale, Metadata> = {
    fa: { title: "پلنر زبان — AUF Deutsch", description: "هر زبانی، هر هدفی — برنامه هفتگی یادگیری زبان خود را بسازید." },
    de: { title: "Sprachplaner — AUF Deutsch", description: "Jede Sprache, jedes Ziel — gestalte deine Wochenplanung." },
    en: { title: "Language Planner — AUF Deutsch", description: "Any language, any goal — build your own weekly language learning plan." },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa/tools/language-planner",
        de: "/de/tools/language-planner",
        en: "/en/tools/language-planner",
      },
    },
  };
}

export default function LanguagePlannerLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
