"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface CoursesContentProps {
  locale: Locale;
}

export function CoursesContent({ locale }: CoursesContentProps) {
  const { t } = useLocale();
  const numberLocale = locale === "de" ? "de-DE" : locale === "en" ? "en-US" : "fa-IR";

  const courses = [
    {
      level: "A1",
      title: t.courses.a1Title,
      description: t.courses.a1Desc,
      duration: t.courses.weeks8,
      price: 0,
      features: [t.courses.a1f1, t.courses.a1f2, t.courses.a1f3, t.courses.a1f4, t.courses.a1f5],
    },
    {
      level: "A2",
      title: t.courses.a2Title,
      description: t.courses.a2Desc,
      duration: t.courses.weeks10,
      price: 0,
      features: [t.courses.a2f1, t.courses.a2f2, t.courses.a2f3, t.courses.a2f4, t.courses.a2f5],
    },
    {
      level: "B1",
      title: t.courses.b1Title,
      description: t.courses.b1Desc,
      duration: t.courses.weeks12,
      price: 0,
      features: [t.courses.b1f1, t.courses.b1f2, t.courses.b1f3, t.courses.b1f4, t.courses.b1f5],
    },
    {
      level: "B2",
      title: t.courses.b2Title,
      description: t.courses.b2Desc,
      duration: t.courses.weeks14,
      price: 0,
      features: [t.courses.b2f1, t.courses.b2f2, t.courses.b2f3, t.courses.b2f4, t.courses.b2f5],
    },
    {
      level: "C1",
      title: t.courses.c1Title,
      description: t.courses.c1Desc,
      duration: t.courses.weeks16,
      price: 0,
      features: [t.courses.c1f1, t.courses.c1f2, t.courses.c1f3, t.courses.c1f4],
    },
    {
      level: "TEST",
      title: t.courses.testTitle,
      description: t.courses.testDesc,
      duration: t.courses.weeks8,
      price: 2000000,
      features: [t.courses.testf1, t.courses.testf2, t.courses.testf3, t.courses.testf4, t.courses.testf5],
    },
  ];

  const pricingPlans = [
    {
      title: t.courses.plan1Title,
      price: 0,
      period: t.courses.plan1Period,
      features: [t.courses.plan1f1, t.courses.plan1f2, t.courses.plan1f3],
      recommended: false,
    },
    {
      title: t.courses.plan2Title,
      price: 0,
      period: t.courses.plan2Period,
      features: [t.courses.plan2f1, t.courses.plan2f2, t.courses.plan2f3, t.courses.plan2f4],
      recommended: true,
    },
    {
      title: t.courses.plan3Title,
      price: 0,
      period: t.courses.plan3Period,
      features: [t.courses.plan3f1, t.courses.plan3f2, t.courses.plan3f3, t.courses.plan3f4, t.courses.plan3f5],
      recommended: false,
    },
  ];

  const whyItems = [
    { icon: "🎓", title: t.courses.why1Title, desc: t.courses.why1Desc },
    { icon: "💼", title: t.courses.why2Title, desc: t.courses.why2Desc },
    { icon: "🎭", title: t.courses.why3Title, desc: t.courses.why3Desc },
  ];

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden">
        <div className="notebook-band notebook-band-red notebook-band-courses-red" aria-hidden="true" />
        <div className="notebook-band notebook-band-gold notebook-band-courses-gold" aria-hidden="true" />
        <div className="max-w-6xl mx-auto">
          <Badge variant="gold" className="mb-6">
            {t.courses.badge}
          </Badge>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-[4.4rem] font-bold text-paper-100 leading-[1.08] tracking-[-0.04em] mb-6">{t.courses.heroTitle}</h1>
            <p className="text-paper-100/80 text-lg md:text-xl mb-10 leading-relaxed">{t.courses.heroSubtitle}</p>
          </div>
          <Button href={`/${locale}/contact`} variant="secondary" size="lg">
            {t.courses.heroCta}
          </Button>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 tracking-[-0.04em]">{t.courses.levelsTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.courses.levelsSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.level} className="h-full border-t-2 border-gold-500/60 hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="absolute -top-3 left-8 w-10 h-4 bg-gold-500/30 -rotate-5" />
                  <div className="absolute -bottom-3 right-8 w-10 h-4 bg-gold-500/30 -rotate-175" />

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gold-600 mb-2">{course.level}</div>
                    <h3 className="text-xl font-bold text-navy-900">{course.title}</h3>
                    <p className="text-navy-900/50 text-sm mt-1">{course.duration}</p>
                  </div>

                  <p className="text-navy-900/70 text-sm mb-6">{course.description}</p>

                  <div className="space-y-3 mb-6">
                    {course.features.slice(0, 3).map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-navy-900/80">{feature}</span>
                      </div>
                    ))}
                    {course.features.length > 3 && (
                      <div className="flex items-center gap-2 text-xs text-navy-900/60 mt-2">
                        <span>{t.common.and} {course.features.length - 3} {t.common.andMore}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-navy-900/10 flex justify-between items-center">
                    <span className="text-2xl font-bold text-gold-600">{course.price.toLocaleString(numberLocale)}</span>
                    <span className="text-navy-900/50 text-sm">{t.common.toman}</span>
                  </div>

                  <Button href={`/${locale}/contact`} className="w-full mt-6">
                    {t.courses.startCourse}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-4 tracking-[-0.04em]">{t.courses.whyTitle}</h2>
            <p className="text-paper-100/70">{t.courses.whySubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyItems.map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-paper-100 mb-2">{item.title}</h3>
                <p className="text-paper-100/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 tracking-[-0.04em]">{t.courses.plansTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.courses.plansSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.title}
                className={`relative bg-white rounded-sm shadow-lg p-8 ${
                  plan.recommended ? "border-4 border-gold-500 transform scale-105 z-10" : "border border-navy-900/10"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-gold-500 text-paper-100 px-4 py-1 rounded-sm font-bold">
                    {t.courses.recommended}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gold-600">{plan.price.toLocaleString(numberLocale)}</span>
                    <span className="text-navy-900/50">{t.common.toman}</span>
                  </div>
                  <div className="text-navy-900/60 text-sm mt-2">{plan.period}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-navy-900/80">
                      <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button href={`/${locale}/contact`} variant={plan.recommended ? "primary" : "outline"} className="w-full">
                  {t.courses.choosePlan}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-6 tracking-[-0.04em]">{t.courses.ctaTitle}</h2>
          <p className="text-paper-100/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">{t.courses.ctaSubtitle}</p>
          <Button href={`/${locale}/contact`} size="lg" className="text-lg px-10 py-4">
            {t.courses.ctaButton}
          </Button>
        </div>
      </Section>
    </div>
  );
}