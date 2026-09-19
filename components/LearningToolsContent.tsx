"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface LearningToolsContentProps {
  locale: Locale;
}

function ToolIcon({ type }: { type: "book" | "calendar" | "game" | "library" }) {
  const paths = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5v15A2.5 2.5 0 0 1 6.5 18H20" /><path d="M8 7h8M8 11h6" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
    game: <><path d="M6 8h12a4 4 0 0 1 3.7 5.5l-1.2 3A3.8 3.8 0 0 1 17 19l-3.2-3H10l-3.2 3a3.8 3.8 0 0 1-3.5-2.5l-1.2-3A4 4 0 0 1 6 8Z" /><path d="M7 11v4M5 13h4M16 12h.01M19 14h.01" /></>,
    library: <><path d="M4 20V6M9 20V4M14 20V7M19 20V3" /><path d="M2 20h19M3 6l3-2 3 2M12 7l3-2 3 2" /></>,
  };

  return <svg aria-hidden="true" className="h-8 w-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">{paths[type]}</svg>;
}

export function LearningToolsContent({ locale }: LearningToolsContentProps) {
  const { t } = useLocale();
  const tools = [
    { type: "book" as const, title: t.tools.dictionaryTitle, description: t.tools.dictionaryDesc, status: t.tools.comingSoon, tone: "gold" as const },
    { type: "calendar" as const, title: t.tools.plannerTitle, description: t.tools.plannerDesc, status: t.tools.comingSoon, tone: "red" as const },
    { type: "game" as const, title: t.tools.gamesTitle, description: t.tools.gamesDesc, status: t.tools.comingSoon, tone: "navy" as const },
    { type: "library" as const, title: t.tools.resourcesTitle, description: t.tools.resourcesDesc, status: t.tools.availableSoon, tone: "paper" as const },
  ];

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden">
        <div className="notebook-band notebook-band-red notebook-band-tools-red" aria-hidden="true" />
        <div className="notebook-band notebook-band-gold notebook-band-tools-gold" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
          <Badge variant="gold" className="mb-6">{t.tools.badge}</Badge>
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-paper-100 md:text-6xl lg:text-[4.4rem]">{t.tools.heroTitle}</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-paper-100/80 md:text-xl">{t.tools.heroSubtitle}</p>
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-[-0.04em] text-navy-900 md:text-4xl">{t.tools.collectionTitle}</h2>
            <p className="text-lg leading-relaxed text-navy-900/60">{t.tools.collectionSubtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <article key={tool.title} className="group relative flex min-h-64 flex-col justify-between border border-navy-900/10 bg-white p-8 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div>
                  <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-sm ${tool.tone === "gold" ? "bg-gold-300 text-navy-900" : tool.tone === "red" ? "bg-red-600/10 text-red-600" : tool.tone === "navy" ? "bg-navy-900 text-paper-100" : "bg-paper-100 text-navy-900"}`}>
                    <ToolIcon type={tool.type} />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold tracking-[-0.02em] text-navy-900">{tool.title}</h3>
                  <p className="max-w-xl leading-relaxed text-navy-900/70">{tool.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-navy-900/10 pt-5">
                  <span className="text-sm font-bold text-navy-900/60">{tool.status}</span>
                  <span className="font-mono text-sm text-navy-900/40" aria-hidden="true">{locale === "fa" ? "در مسیر" : locale === "de" ? "In Arbeit" : "In progress"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold tracking-[-0.04em] text-paper-100 md:text-4xl">{t.tools.ideaTitle}</h2>
            <p className="text-lg leading-relaxed text-paper-100/75">{t.tools.ideaSubtitle}</p>
          </div>
          <Button href={`/${locale}/contact`} variant="secondary" size="lg">{t.tools.ideaCta}</Button>
        </div>
      </Section>
    </div>
  );
}
