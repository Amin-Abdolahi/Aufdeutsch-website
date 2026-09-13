import { Metadata } from "next";
import { CoursesContent } from "@/components/CoursesContent";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, Metadata> = {
    fa: {
      title: "دورههای تخصصی آلمانی — AUF Deutsch",
      description: "دورههای آلمانی از A1 تا C1 و آمادگی آزمونهای بین المللی. آموزش آنلاین با مدرسین مجرب.",
    },
    de: {
      title: "Deutschkurse — AUF Deutsch",
      description: "Deutschkurse von A1 bis C1 und Prüfungsvorbereitung. Online-Unterricht mit erfahrenen Lehrern.",
    },
    en: {
      title: "German Courses — AUF Deutsch",
      description: "German courses from A1 to C1 and international exam preparation. Online lessons with experienced teachers.",
    },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa/courses",
        de: "/de/courses",
        en: "/en/courses",
      },
    },
  };
}

export default async function CoursesPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return <CoursesContent locale={validLocale} />;
}