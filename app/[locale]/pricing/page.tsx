import { Metadata } from "next";
import { PricingContent } from "@/components/PricingContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, Metadata> = {
    fa: {
      title: "قیمتگذاری — AUF Deutsch",
      description: "قیمت مناسب برای یادگیری زبان آلمانی. پلن‌های مختلف با کیفیت بالا.",
    },
    de: {
      title: "Preise — AUF Deutsch",
      description: "Faire Preise fürs Deutschlernen. Verschiedene Pakete mit hoher Qualität.",
    },
    en: {
      title: "Pricing — AUF Deutsch",
      description: "Fair prices for learning German. Various plans with high quality.",
    },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa/pricing",
        de: "/de/pricing",
        en: "/en/pricing",
      },
    },
  };
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return <PricingContent locale={validLocale} />;
}