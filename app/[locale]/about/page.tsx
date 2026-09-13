import { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, Metadata> = {
    fa: {
      title: "درباره ما — AUF Deutsch",
      description: "دو مدرس زبان آلمانی با تجربه. امین و فتانه همراه شما تا رسیدن به سطح B1 در ۶ ماه.",
    },
    de: {
      title: "Über uns — AUF Deutsch",
      description: "Zwei erfahrene Deutschlehrer. Amin und Fataneh begleiten Sie bis zum B1-Niveau in 6 Monaten.",
    },
    en: {
      title: "About Us — AUF Deutsch",
      description: "Two experienced German teachers. Amin and Fataneh guide you to B1 level in 6 months.",
    },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa/about",
        de: "/de/about",
        en: "/en/about",
      },
    },
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return <AboutContent locale={validLocale} />;
}