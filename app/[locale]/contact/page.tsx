import { Metadata } from "next";
import { ContactContent } from "@/components/ContactContent";
import { Testimonials } from "@/components/Testimonials";
import { TestimonialForm } from "@/components/TestimonialForm";
import { locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  const metadata: Record<Locale, Metadata> = {
    fa: {
      title: "تماس با ما — AUF Deutsch",
      description: "جلسه مشاوره رایگان رزرو کنید. آموزش آنلاین زبان آلمانی با مدرسین مجرب.",
    },
    de: {
      title: "Kontakt — AUF Deutsch",
      description: "Kostenlose Beratung buchen. Online-Deutschunterricht mit erfahrenen Lehrern.",
    },
    en: {
      title: "Contact Us — AUF Deutsch",
      description: "Book a free consultation. Online German lessons with experienced teachers.",
    },
  };

  return {
    ...metadata[validLocale],
    alternates: {
      languages: {
        fa: "/fa/contact",
        de: "/de/contact",
        en: "/en/contact",
      },
    },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : "fa";

  return (
    <>
      <ContactContent locale={validLocale} />
      <Testimonials locale={validLocale} className="py-16" />
      <TestimonialForm locale={validLocale} />
    </>
  );
}