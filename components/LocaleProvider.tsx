"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  type Locale,
  type Dictionary,
  dictionaries,
  isLocale,
  languageMeta,
} from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (isLocale(saved)) {
      setLocaleState(saved);
      document.documentElement.dir = languageMeta[saved].dir;
      document.documentElement.lang = languageMeta[saved].htmlLang;
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.dir = languageMeta[newLocale].dir;
    document.documentElement.lang = languageMeta[newLocale].htmlLang;
  };

  const value: LocaleContextType = {
    locale,
    setLocale,
    t: dictionaries[locale],
  };

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "fa", setLocale: () => {}, t: dictionaries.fa }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return {
      locale: "fa" as Locale,
      setLocale: () => {},
      t: dictionaries.fa,
    };
  }
  return context;
}
