"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stamp } from "@/components/ui/Stamp";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  level: string;
  message: string;
}

interface ContactContentProps {
  locale: Locale;
}

export function ContactContent({ locale }: ContactContentProps) {
  const { t } = useLocale();
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    level: "A1",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) throw new Error("Failed to submit");
    } catch {
      // Silently handle error
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setFormState({ name: "", email: "", phone: "", level: "A1", message: "" });
      setIsSuccess(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "clock",
      title: t.contact.hoursTitle,
      description: t.contact.hoursDesc,
      time: t.contact.hoursTime,
    },
    {
      icon: "phone",
      title: t.contact.phoneTitle,
      description: t.contact.phoneDesc,
      phone: "+۹۸ ۹۹۱۱۰۴۵۹۴۷",
    },
    {
      icon: "email",
      title: t.contact.emailTitle,
      description: t.contact.emailDesc,
      email: "abdollahi.amin@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen">
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="red" className="mb-6">
            {t.contact.badge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">{t.contact.heroTitle}</h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">{t.contact.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="tel:+989911045947" size="lg">
              {t.contact.callNow}
            </Button>
            <Button href="mailto:abdollahi.amin@gmail.com" variant="outline" size="lg">
              {t.contact.sendEmail}
            </Button>
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-navy-900 p-8 rounded-sm shadow-xl relative">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-gold-500 rounded-sm flex items-center justify-center">
                  <Stamp size={64} />
                </div>

                <h2 className="text-2xl font-bold text-paper-100 mb-6">{t.contact.formTitle}</h2>
                <p className="text-paper-100/70 mb-8 text-sm">{t.contact.formIntro}</p>

                {isSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-sm text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-green-500 font-bold text-lg mb-2">{t.contact.successTitle}</h3>
                    <p className="text-green-600 text-sm">{t.contact.successDesc}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-paper-100 font-medium mb-2">
                        {t.contact.name}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder={t.contact.namePlaceholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-paper-100 font-medium mb-2">
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-paper-100 font-medium mb-2">
                        {t.contact.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder={t.contact.phonePlaceholder}
                      />
                    </div>

                    <div>
                      <label htmlFor="level" className="block text-paper-100 font-medium mb-2">
                        {t.contact.level}
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formState.level}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      >
                        <option value="A1">{t.contact.levelA1}</option>
                        <option value="A2">{t.contact.levelA2}</option>
                        <option value="B1">{t.contact.levelB1}</option>
                        <option value="B2">{t.contact.levelB2}</option>
                        <option value="C1">{t.contact.levelC1}</option>
                        <option value="test">{t.contact.levelTest}</option>
                        <option value="other">{t.contact.levelOther}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-paper-100 font-medium mb-2">
                        {t.contact.message}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formState.message}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                        placeholder={t.contact.messagePlaceholder}
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? t.contact.submitting : t.contact.submit}
                    </Button>

                    <p className="text-paper-100/50 text-xs text-center mt-4">{t.contact.privacyNote}</p>
                  </form>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-8">{t.contact.infoTitle}</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-navy-50 p-6 rounded-sm border border-navy-100 flex items-start gap-4 hover:bg-navy-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-paper-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {info.icon === "clock" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                        {info.icon === "phone" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        )}
                        {info.icon === "email" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        )}
                        {info.icon === "location" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 mb-1">{info.title}</h3>
                      <p className="text-navy-900/70 text-sm">{info.description}</p>
                      {info.time && <p className="text-gold-600 font-medium text-sm mt-1">{info.time}</p>}
                      {info.phone && <a href={`tel:${info.phone}`} className="text-gold-600 font-medium text-sm mt-1 block">{info.phone}</a>}
                      {info.email && <a href={`mailto:${info.email}`} className="text-gold-600 font-medium text-sm mt-1 block">{info.email}</a>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <h3 className="font-bold text-navy-900 mb-4">{t.contact.socialTitle}</h3>
                <div className="flex gap-3">
                  <a href="" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    {t.contact.instagram}
                  </a>
                  <a href="https://t.me/aminundfatane" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    {t.contact.telegram}
                  </a>
                  <a href="" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    {t.contact.youtube}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-navy-900 rounded-sm overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-navy-900/90 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-paper-100 max-w-xl mx-auto px-6">
                <div className="w-20 h-20 border-4 border-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">{t.contact.addressTitle}</h3>
                <p className="text-paper-100/80 mb-6"></p>
                <Button href="https://maps.google.com" variant="secondary" className="mx-auto">
                  {t.contact.viewMap}
                </Button>
              </div>
            </div>
            <div className="h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
      </Section>

      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">{t.contact.faqTitle}</h2>
            <p className="text-navy-900/60 text-lg">{t.contact.faqSubtitle}</p>
          </div>

          <div className="space-y-4">
            {[
              { q: t.contact.faq1q, a: t.contact.faq1a },
              { q: t.contact.faq2q, a: t.contact.faq2a },
              { q: t.contact.faq3q, a: t.contact.faq3a },
              { q: t.contact.faq4q, a: t.contact.faq4a },
            ].map((faq, index) => (
              <details key={index} className="bg-navy-50 rounded-sm p-6 hover:bg-navy-100 transition-colors group">
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
    </div>
  );
}