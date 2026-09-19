"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface AboutContentProps {
  locale: Locale;
}

export function AboutContent({ locale }: AboutContentProps) {
  const { t } = useLocale();

  const teachers = [
    {
      id: "amin",
      name: t.about.aminName,
      title: t.about.aminTitle,
      description: t.about.aminDesc,
      expertise: [t.about.aminExp1, t.about.aminExp2, t.about.aminExp3],
      years: 6,
      students: 120,
      accent: "Northern German",
    },
    {
      id: "fataneh",
      name: t.about.fatanehName,
      title: t.about.fatanehTitle,
      description: t.about.fatanehDesc,
      expertise: [t.about.fatanehExp1, t.about.fatanehExp2, t.about.fatanehExp3],
      years: 5,
      students: 95,
      accent: "Standard German",
    },
  ];

  const milestones = [
    { year: 2021, title: t.about.m2021Title, description: t.about.m2021Desc },
    { year: 2022, title: t.about.m2022Title, description: t.about.m2022Desc },
    { year: 2023, title: t.about.m2023Title, description: t.about.m2023Desc },
    { year: 2024, title: t.about.m2024Title, description: t.about.m2024Desc },
    { year: 2025, title: t.about.m2025Title, description: t.about.m2025Desc },
    { year: 2026, title: t.about.m2026Title, description: t.about.m2026Desc },
  ];

  const values = [
    { title: t.about.v1Title, description: t.about.v1Desc },
    { title: t.about.v2Title, description: t.about.v2Desc },
    { title: t.about.v3Title, description: t.about.v3Desc },
    { title: t.about.v4Title, description: t.about.v4Desc },
  ];

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden">
        <div className="notebook-band notebook-band-red notebook-band-about-red" aria-hidden="true" />
        <div className="notebook-band notebook-band-gold notebook-band-about-gold" aria-hidden="true" />
        <div className="max-w-6xl mx-auto">
          <Badge variant="red" className="mb-6">
            {t.about.badge}
          </Badge>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-[4.4rem] font-bold text-paper-100 leading-[1.08] tracking-[-0.04em] mb-6">{t.about.heroTitle}</h1>
            <p className="text-paper-100/80 text-lg md:text-xl mb-10 leading-relaxed">{t.about.heroSubtitle}</p>
          </div>
          <Button href={`/${locale}/contact`} variant="secondary" size="lg">
            {t.about.heroCta}
          </Button>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 tracking-[-0.04em]">{t.about.teachersTitle}</h2>
            <p className="text-navy-900/60 text-lg leading-relaxed">{t.about.teachersSubtitle}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {teachers.map((teacher) => (
              <Card key={teacher.id} rotate={teacher.id === "amin" ? "left" : "right"} className={`h-full border-t-2 ${teacher.id === "amin" ? "border-red-600/70" : "border-gold-500/70"}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-gold-500/20 mb-6 flex items-center justify-center bg-gradient-to-br from-gold-500/5 to-transparent">
                    <span className="text-4xl font-bold text-navy-900">{teacher.name.charAt(0)}</span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-2">{teacher.name}</h3>
                    <p className="text-red-600 font-medium mb-3">{teacher.title}</p>
                    <p className="text-navy-900/70 text-sm leading-relaxed max-w-sm">{teacher.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs">
                    <div className="bg-navy-900/5 p-4 rounded-sm text-center">
                      <div className="text-2xl font-bold text-gold-600">{teacher.years}+</div>
                      <div className="text-navy-900/60 text-sm">{t.common.yearsExperience}</div>
                    </div>
                    <div className="bg-navy-900/5 p-4 rounded-sm text-center">
                      <div className="text-2xl font-bold text-gold-600">{teacher.students}+</div>
                      <div className="text-navy-900/60 text-sm">{t.common.students}</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-navy-900 mb-3">{t.common.expertise}</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {teacher.expertise.map((item) => (
                        <span key={item} className="bg-gold-500/10 text-gold-700 px-3 py-1 text-sm rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-navy-900/50 text-sm font-mono">
                      {t.common.pronunciation}: {teacher.accent}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <Badge variant="gold" className="mb-4">
              {t.about.storyBadge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-4 tracking-[-0.04em]">{t.about.storyTitle}</h2>
            <p className="text-paper-100/80 text-lg leading-relaxed">{t.about.storySubtitle}</p>
          </div>

          <div className="relative">
            <div className="absolute right-1/2 translate-x-1/2 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-0.5 bg-gold-500/30 hidden md:block" />

            <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"} md:w-1/2 ${index % 2 === 0 ? "md:ml-auto" : ""}`}
                >
                  <div className="bg-navy-800 p-6 rounded-sm relative group hover:bg-navy-700 transition-all">
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gold-500 border-4 border-navy-900 group-hover:scale-110 transition-transform" />
                    <div className="text-gold-400 text-2xl font-bold mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-paper-100 mb-2">{milestone.title}</h3>
                    <p className="text-paper-100/70 text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 tracking-[-0.04em]">{t.about.valuesTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.about.valuesSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} rotate={index % 2 === 0 ? "left" : "right"}>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-red-600">{index + 1}</span>
                  </div>
                  <CardTitle className="text-center mb-3">{value.title}</CardTitle>
                  <CardDescription className="text-center">{value.description}</CardDescription>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <Badge variant="red" className="mb-4">
              {t.about.whyBadge}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-6 tracking-[-0.04em]">{t.about.whyTitle}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">۲×۱</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">{t.about.why1Title}</h3>
              <p className="text-paper-100/70">{t.about.why1Desc}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">۱۰۰٪</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">{t.about.why2Title}</h3>
              <p className="text-paper-100/70">{t.about.why2Desc}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">∞</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">{t.about.why3Title}</h3>
              <p className="text-paper-100/70">{t.about.why3Desc}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6 tracking-[-0.04em]">{t.about.ctaTitle}</h2>
          <p className="text-navy-900/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">{t.about.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/${locale}/contact`} size="lg">
              {t.about.ctaContact}
            </Button>
            <Button href={`/${locale}/courses`} variant="outline" size="lg">
              {t.about.ctaCourses}
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}