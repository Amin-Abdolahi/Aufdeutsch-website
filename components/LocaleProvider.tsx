"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";   // ← اضافه کن
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

interface LocaleProviderProps {
  children: ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();    // ← اضافه کن
  const router = useRouter();        // ← اضافه کن

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (isLocale(saved) && saved !== locale) {
      setLocaleState(saved);
      document.documentElement.dir = languageMeta[saved].dir;
      document.documentElement.lang = languageMeta[saved].htmlLang;
    }
    setMounted(true);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.dir = languageMeta[newLocale].dir;
    document.documentElement.lang = languageMeta[newLocale].htmlLang;

    // Update cookie via API call
    fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: newLocale }),
    }).catch(() => {});

    // ✅ URL رو هم عوض کن
    if (pathname) {
      const segments = pathname.split("/");
      // segments[0] = "" (چون pathname با / شروع می‌شه)
      // segments[1] = locale فعلی (fa, de, en)
      segments[1] = newLocale;
      const newPath = segments.join("/") || "/";
      router.push(newPath);
    }
  };

  const value: LocaleContextType = {
    locale,
    setLocale,
    t: dictionaries[locale],
  };

  if (!mounted) {
    return (
      <LocaleContext.Provider
        value={{
          locale: initialLocale,
          setLocale: () => {},
          t: dictionaries[initialLocale],
        }}
      >
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