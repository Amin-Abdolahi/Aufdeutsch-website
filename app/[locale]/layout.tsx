import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import { locales, languageMeta, type Locale } from "@/lib/i18n";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? locale : "fa";

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

  return metadata[validLocale as Locale];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return (
    <LocaleProvider initialLocale={validLocale}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </LocaleProvider>
  );
}