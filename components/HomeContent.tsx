"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { Testimonials } from "@/components/Testimonials";
import { HeroSection } from "@/components/HeroSection";

interface HomeContentProps {
  locale: Locale;
}

export function HomeContent({ locale }: HomeContentProps) {
  const { t } = useLocale();

  const coursePreview = [
    { level: "A1", title: t.home.courseA1Title, desc: t.home.courseA1Desc },
    { level: "A2", title: t.home.courseA2Title, desc: t.home.courseA2Desc },
    { level: "B1", title: t.home.courseB1Title, desc: t.home.courseB1Desc },
    { level: "B2", title: t.home.courseB2Title, desc: t.home.courseB2Desc },
    { level: "C1", title: t.home.courseC1Title, desc: t.home.courseC1Desc },
    { level: "TEST", title: t.home.courseTestTitle, desc: t.home.courseTestDesc },
  ];

  return (
    <div className="min-h-screen">
      {/* ============ HERO ============ */}
      <HeroSection key={locale} locale={locale} />

      {/* ============ چرا AUF Deutsch ============ */}
      <Section className="relative">
        <div className="absolute inset-0 bg-paper-50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 tracking-[-0.04em]">
              {t.home.statsTitle}
            </h2>
            <p className="text-navy-900/60 text-lg leading-relaxed">
              {t.home.statsSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card rotate="left" className="border-t-2 border-red-600/70">
              <CardTitle>{t.home.reason1Title}</CardTitle>
              <CardDescription>{t.home.reason1Desc}</CardDescription>
            </Card>
            <Card rotate="none" className="border-t-2 border-gold-500/70">
              <CardTitle>{t.home.reason2Title}</CardTitle>
              <CardDescription>{t.home.reason2Desc}</CardDescription>
            </Card>
            <Card rotate="right" className="border-t-2 border-navy-700">
              <CardTitle>{t.home.reason3Title}</CardTitle>
              <CardDescription>{t.home.reason3Desc}</CardDescription>
            </Card>
          </div>
        </div>
      </Section>

      {/* ============ دوره‌ها ============ */}
      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-4">
                {t.home.coursesBadge}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-6 tracking-[-0.04em]">
                {t.home.coursesTitle}
              </h2>
              <p className="text-paper-100/80 text-lg leading-relaxed mb-8 max-w-[34rem]">
                {t.home.coursesDesc}
              </p>
              <Button href={`/${locale}/courses`} variant="secondary" size="lg">
                {t.home.coursesAll}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {coursePreview.map((course, index) => (
                <div
                  key={course.level}
                  className={`p-6 rounded-sm border transition-all duration-200 hover:-translate-y-0.5 group ${
                    index % 3 === 0
                      ? "bg-red-600/20 border-red-400/30 hover:bg-red-600/30"
                      : index % 3 === 1
                      ? "bg-gold-500/20 border-gold-300/30 hover:bg-gold-500/30"
                      : "bg-navy-800 border-navy-700 hover:bg-navy-700"
                  }`}
                >
                  <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:text-gold-400 transition-colors tracking-[-0.04em]">
                    {course.level}
                  </div>
                  <div className="text-paper-100 font-bold mb-1 text-base md:text-lg leading-snug">
                    {course.title}
                  </div>
                  <div className="text-paper-100/60 text-sm leading-relaxed">
                    {course.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ============ نظرات با تخته ============ */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z' fill='%231B2A44' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-[-0.04em] inline-block relative">
              {t.home.testimonialsTitle}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gold-500/70 rounded-full" />
            </h2>
          </div>

          <div
            id="testimonials-board"
            className="relative rounded-lg shadow-2xl p-6 md:p-10 border-[6px] md:border-8"

            style={{
              background:
                "linear-gradient(135deg, #3a4a5a 0%, #2b3a4a 55%, #1f2b38 100%)",
              borderColor: "#141c26",
              boxShadow:
                "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="absolute inset-0 rounded opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 38px, #000 38px, #000 39px)",
              }}
            />

            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gold-500/40 shadow-inner" />

            <div className="relative z-10">
              <Testimonials locale={locale} />
            </div>
          </div>
        </div>
      </Section>

      {/* ============ CTA نهایی ============ */}
      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-6 tracking-[-0.04em]">
            {t.home.ctaTitle}
          </h2>
          <p className="text-paper-100/80 text-lg md:text-xl mb-10 max-w-[32rem] mx-auto leading-relaxed">
            {t.home.ctaSubtitle}
          </p>
          <Button
            href={`/${locale}/contact`}
            size="lg"
            className="text-base md:text-lg px-10 py-4 tracking-[0.08em]"
          >
            {t.home.ctaButton}
          </Button>
        </div>
      </Section>
    </div>
  );
}