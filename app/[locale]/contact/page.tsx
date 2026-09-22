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

      {/* ========== بخش نظرات با تخته ========== */}
      <section className="relative overflow-hidden py-16 md:py-20">
        {/* پس‌زمینه‌ی نقطه‌چین ملایم */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, #1B2A44 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* تیتر مستقل */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-[-0.04em] inline-block relative">
              {validLocale === "fa"
                ? "نظرات شاگردان"
                : validLocale === "de"
                ? "Stimmen unserer Schüler"
                : "Student Reviews"}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gold-500/70 rounded-full" />
            </h2>
          </div>

          {/* تخته تیره */}
          <div
            className="relative rounded-lg shadow-2xl p-6 md:p-10 border-[6px] md:border-8"
            style={{
              background:
                "linear-gradient(135deg, #3a4a5a 0%, #2b3a4a 55%, #1f2b38 100%)",
              borderColor: "#141c26",
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* بافت چوب */}
            <div
              className="absolute inset-0 rounded opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 38px, #000 38px, #000 39px)",
              }}
            />

            {/* میخ‌های تزئینی گوشه تخته */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />

            <div className="relative z-10">
              <Testimonials locale={validLocale} />
            </div>
          </div>
        </div>
      </section>

      <TestimonialForm locale={validLocale} />
    </>
  );
}