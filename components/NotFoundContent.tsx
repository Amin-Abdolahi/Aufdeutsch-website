"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface NotFoundContentProps {
  locale: Locale;
}

export function NotFoundContent({ locale }: NotFoundContentProps) {
  const { t } = useLocale();

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23F3ECDD' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 opacity-30">
              <Stamp size={128} />
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-gold-500 leading-none opacity-20 select-none">
              ۴۰۴
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold text-paper-100 -mt-20 md:-mt-28 relative z-10">
              {t.notFound.heading}
            </h1>
          </div>

          <div className="bg-paper-100 p-8 md:p-12 rounded-sm shadow-2xl max-w-2xl mx-auto relative -rotate-1">
            <div className="absolute -top-3 left-10 w-14 h-6 bg-gold-500/30 rotate-[-4deg]" />
            <div className="absolute -top-3 right-10 w-14 h-6 bg-gold-500/30 rotate-3" />

            <h2 className="text-2xl font-bold text-navy-900 mb-4">{t.notFound.title}</h2>
            <p className="text-navy-900/70 mb-8 leading-relaxed">{t.notFound.message}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href={`/${locale}`} size="lg">
                {t.notFound.home}
              </Button>
              <Button href={`/${locale}/contact`} variant="outline" size="lg">
                {t.notFound.contact}
              </Button>
            </div>
          </div>

          <p className="text-paper-100/60 mt-8 text-sm">{t.notFound.help}</p>
        </div>
      </Section>
    </div>
  );
}