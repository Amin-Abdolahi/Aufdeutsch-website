import { Metadata } from "next";
import { NotFoundContent } from "@/components/NotFoundContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "fa";
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, { title: string; description: string }> = {
    fa: { title: "صفحه یافت نشد — AUF Deutsch", description: "متأسفانه صفحه مورد نظر شما وجود ندارد" },
    de: { title: "Seite nicht gefunden — AUF Deutsch", description: "Die gesuchte Seite existiert nicht" },
    en: { title: "Page Not Found — AUF Deutsch", description: "Sorry, the page you are looking for does not exist" },
  };

  return {
    title: metadata[validLocale].title,
    description: metadata[validLocale].description,
  };
}

export default async function NotFoundPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? "fa";
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return <NotFoundContent locale={validLocale} />;
}