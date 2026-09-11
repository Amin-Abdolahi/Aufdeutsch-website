"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Locale = "fa" | "de";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  fa: {
    "nav.home": "خانه",
    "nav.courses": "دورهها",
    "nav.pricing": "قیمت",
    "nav.about": "درباره ما",
    "nav.contact": "تماس",
    "nav.bookSession": "رزرو جلسه",
    "hero.tagline": "یادگیری زبان آلمانی",
    "hero.title": "آلمانی را",
    "hero.highlight": "درست",
    "hero.subtitle": "آموزش خصوصی آنلاین با مدرسین مجرب — از صفر تا آزمونهای بین المللی.",
    "hero.cta": "رزرو جلسه رایگان ←",
    "hero.viewCourses": "مشاهده دورهها",
    "stats.title": "چرا AUF Deutsch؟",
    "stats.subtitle": "سه دلیل ساده",
    "stats.reason1_title": "شخصی سازی شده",
    "stats.reason2_title": "دو مدرس، دو تخصص",
    "stats.reason3_title": "کاملاً آنلاین",
    "cta.title": "همین امروز اولین قدم رو بردارید",
    "cta.subtitle": "جلسهی مشاوره رایگان با مدرسین ما رزرو کنید.",
    "cta.button": "رزرو جلسه مشاوره ←",
  },
  de: {
    "nav.home": "Startseite",
    "nav.courses": "Kurse",
    "nav.pricing": "Preise",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.bookSession": "Sitzung buchen",
    "hero.tagline": "Deutsch lernen",
    "hero.title": "Deutsch",
    "hero.highlight": "richtig",
    "hero.subtitle": "Online-Privatunterricht mit erfahrenen Lehrern.",
    "hero.cta": "Kostenlose Sitzung buchen →",
    "hero.viewCourses": "Kurse ansehen",
    "stats.title": "Warum AUF Deutsch?",
    "stats.subtitle": "Drei einfache Gründe",
    "stats.reason1_title": "Personalisiert",
    "stats.reason2_title": "Zwei Lehrer",
    "stats.reason3_title": "Vollständig online",
    "cta.title": "Nehmen Sie heute den ersten Schritt",
    "cta.subtitle": "Buchen Sie eine kostenlose Beratungssitzung.",
    "cta.button": "Beratungssitzung buchen →",
  },
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && (saved === "fa" || saved === "de")) {
      setLocaleState(saved);
      document.documentElement.dir = saved === "fa" ? "rtl" : "ltr";
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.dir = newLocale === "fa" ? "rtl" : "ltr";
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  if (!mounted) return <>{children}</>;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return { locale: "fa" as Locale, setLocale: () => {}, t: (key: string) => key };
  }
  return context;
}