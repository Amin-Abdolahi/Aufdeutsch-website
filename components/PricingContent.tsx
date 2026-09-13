"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface PricingContentProps {
  locale: Locale;
}

export function PricingContent({ locale }: PricingContentProps) {
  const { t } = useLocale();
  const numberLocale = locale === "de" ? "de-DE" : locale === "en" ? "en-US" : "fa-IR";

  const pricingTiers = [
    {
      title: t.pricing.t1Title,
      price: 0,
      period: t.pricing.t1Period,
      description: t.pricing.t1Desc,
      features: [t.pricing.t1f1, t.pricing.t1f2, t.pricing.t1f3, t.pricing.t1f4],
      recommended: false,
      popular: false,
    },
    {
      title: t.pricing.t2Title,
      price: 0,
      period: t.pricing.t2Period,
      description: t.pricing.t2Desc,
      features: [t.pricing.t2f1, t.pricing.t2f2, t.pricing.t2f3, t.pricing.t2f4, t.pricing.t2f5],
      recommended: true,
      popular: true,
    },
    {
      title: t.pricing.t3Title,
      price: 0,
      period: t.pricing.t3Period,
      description: t.pricing.t3Desc,
      features: [t.pricing.t3f1, t.pricing.t3f2, t.pricing.t3f3, t.pricing.t3f4, t.pricing.t3f5, t.pricing.t3f6, t.pricing.t3f7],
      recommended: false,
      popular: false,
    },
    {
      title: t.pricing.t4Title,
      price: 0,
      period: t.pricing.t4Period,
      description: t.pricing.t4Desc,
      features: [t.pricing.t4f1, t.pricing.t4f2, t.pricing.t4f3, t.pricing.t4f4, t.pricing.t4f5, t.pricing.t4f6, t.pricing.t4f7, t.pricing.t4f8],
      recommended: false,
      popular: false,
    },
    {
      title: t.pricing.t5Title,
      price: 0,
      period: t.pricing.t5Period,
      description: t.pricing.t5Desc,
      features: [t.pricing.t5f1, t.pricing.t5f2, t.pricing.t5f3, t.pricing.t5f4, t.pricing.t5f5, t.pricing.t5f6, t.pricing.t5f7, t.pricing.t5f8],
      recommended: true,
      popular: false,
    },
    {
      title: t.pricing.t6Title,
      price: 0,
      period: t.pricing.t6Period,
      description: t.pricing.t6Desc,
      features: [t.pricing.t6f1, t.pricing.t6f2, t.pricing.t6f3, t.pricing.t6f4, t.pricing.t6f5, t.pricing.t6f6],
      recommended: false,
      popular: true,
    },
  ];

  const paymentMethods = [
    { name: t.pricing.paySheba, icon: "bank", details: t.pricing.payShebaDetails },
    { name: t.pricing.payCard, icon: "card", details: t.pricing.payCardDetails },
    { name: t.pricing.payOnline, icon: "online", details: t.pricing.payOnlineDetails },
    { name: t.pricing.payGateway, icon: "bank-card", details: t.pricing.payGatewayDetails },
  ];

  const FAQ = [
    { q: t.pricing.faq1q, a: t.pricing.faq1a },
    { q: t.pricing.faq2q, a: t.pricing.faq2a },
    { q: t.pricing.faq3q, a: t.pricing.faq3a },
    { q: t.pricing.faq4q, a: t.pricing.faq4a },
    { q: t.pricing.faq5q, a: t.pricing.faq5a },
  ];

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="red" className="mb-6">
            {t.pricing.badge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">{t.pricing.heroTitle}</h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">{t.pricing.heroSubtitle}</p>
          <Button href={`/${locale}/contact`} variant="secondary" size="lg">
            {t.pricing.heroCta}
          </Button>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">{t.pricing.chooseTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.pricing.chooseSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.title}
                className={`relative bg-white rounded-sm shadow-lg p-8 transition-all hover:shadow-xl ${
                  tier.recommended
                    ? "border-2 border-gold-500 transform scale-105 z-10"
                    : tier.popular
                    ? "border-2 border-navy-900"
                    : "border border-navy-900/10"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-gold-500 text-paper-100 px-4 py-1 rounded-sm font-bold text-sm">
                    {t.pricing.bestChoice}
                  </div>
                )}

                {tier.popular && !tier.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-navy-900 text-paper-100 px-4 py-1 rounded-sm font-bold text-sm">
                    {t.pricing.bestseller}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{tier.title}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gold-600">{tier.price.toLocaleString(numberLocale)}</span>
                    <span className="text-navy-900/50">{t.common.toman}</span>
                  </div>
                  <div className="text-navy-900/60 text-sm mt-2">{tier.period}</div>
                </div>

                <p className="text-navy-900/70 text-sm mb-6 text-center">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-navy-900/80">
                      <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button href={`/${locale}/contact`} variant={tier.recommended ? "primary" : "outline"} className="w-full">
                  {t.pricing.startCourse}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-paper-100 mb-4">{t.pricing.payTitle}</h2>
            <p className="text-paper-100/70">{t.pricing.paySubtitle}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.name} className="text-center p-6 bg-navy-800 rounded-sm hover:bg-navy-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {method.icon === "bank" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    )}
                    {method.icon === "card" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    )}
                    {method.icon === "online" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                    {method.icon === "bank-card" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
                <h3 className="font-bold text-paper-100 mb-2">{method.name}</h3>
                <p className="text-paper-100/70 text-xs">{method.details}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">{t.pricing.faqTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.pricing.faqSubtitle}</p>
          </div>

          <div className="space-y-4">
            {FAQ.map((faq, index) => (
              <details key={faq.q} className="bg-navy-50 rounded-sm p-6 hover:bg-navy-100 transition-colors group">
                <summary className="cursor-pointer font-bold text-navy-900 text-lg flex items-center gap-3 list-none">
                  <span className="w-8 h-8 rounded-full bg-gold-500 text-paper-100 flex items-center justify-center flex-shrink-0 group-open:bg-gold-600 transition-colors">
                    {index + 1}
                  </span>
                  {faq.q}
                </summary>
                <p className="text-navy-900/70 mt-4 pl-11">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-paper-100 mb-6">{t.pricing.ctaTitle}</h2>
          <p className="text-paper-100/80 text-xl mb-10 max-w-2xl mx-auto">{t.pricing.ctaSubtitle}</p>
          <Button href={`/${locale}/contact`} size="lg" className="text-lg px-10 py-4">
            {t.pricing.ctaButton}
          </Button>
        </div>
      </Section>
    </div>
  );
}