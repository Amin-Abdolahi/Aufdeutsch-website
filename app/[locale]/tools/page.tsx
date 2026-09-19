import type { Metadata } from "next";
import { LearningToolsContent } from "@/components/LearningToolsContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";
  const metadata: Record<Locale, Metadata> = {
    fa: { title: "ابزارهای یادگیری — AUF Deutsch", description: "دیکشنری، پلنر، بازی و منابعی برای تمرین بهتر زبان آلمانی." },
    de: { title: "Lernwerkzeuge — AUF Deutsch", description: "Wörterbuch, Lernplaner, Spiele und Materialien zum Deutschlernen." },
    en: { title: "Learning Tools — AUF Deutsch", description: "A dictionary, planner, games, and resources for learning German." },
  };

  return {
    ...metadata[validLocale],
    alternates: { languages: { fa: "/fa/tools", de: "/de/tools", en: "/en/tools" } },
  };
}

export default async function ToolsPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";
  return <LearningToolsContent locale={validLocale} />;
}
