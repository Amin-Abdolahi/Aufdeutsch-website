import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocaleProvider } from "@/components/LocaleProvider";
import { locales, languageMeta, type Locale } from "@/lib/i18n";
import { Vazirmatn } from "next/font/google";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

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
      keywords: ["آموزش آلمانی", "Deutsch lernen", "یادگیری آلمانی"],
    },
    de: {
      title: "AUF Deutsch — Deutsch lernen",
      description: "Online-Deutschunterricht mit erfahrenen Lehrern",
      keywords: ["Deutsch lernen", "Deutschunterricht", "Online-Kurse"],
    },
    en: {
      title: "AUF Deutsch — Learn German",
      description: "Online German lessons with experienced teachers",
      keywords: ["Learn German", "German lessons", "Online courses"],
    },
  };

  return {
    ...metadata[validLocale as Locale],
    alternates: {
      languages: {
        fa: "/fa",
        de: "/de",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";
  const meta = languageMeta[validLocale];

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`${vazirmatn.variable} antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <LocaleProvider initialLocale={validLocale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}