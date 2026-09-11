// Header Component - هدر سایت با ناوبری و سوئیچر زبان

"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

const locales = ["fa", "de"] as const;
type Locale = typeof locales[number];

const labels: Record<Locale, string> = {
  fa: "فارسی",
  de: "Deutsch",
};

const flags: Record<Locale, string> = {
  fa: "🇮🇷",
  de: "🇩🇪",
};

export function Header() {
  const { locale, setLocale } = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navLinks: Record<Locale, Array<{ href: string; label: string }>> = {
    fa: [
      { href: "/", label: "خانه" },
      { href: "/courses", label: "دوره ها" },
      { href: "/pricing", label: "قیمت" },
      { href: "/about", label: "درباره ما" },
      { href: "/contact", label: "تماس" },
    ],
    de: [
      { href: "/", label: "Startseite" },
      { href: "/courses", label: "Kurse" },
      { href: "/pricing", label: "Preise" },
      { href: "/about", label: "Über uns" },
      { href: "/contact", label: "Kontakt" },
    ],
  };

  const currentLabels = navLinks[locale];

  const handleLanguageChange = (newLocale: Locale) => {
    setIsLangOpen(false);
    setLocale(newLocale);
  };

  return (
    <header className="sticky top-0 z-50 bg-paper-100/95 backdrop-blur-sm border-b border-navy-900/10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-gold-500 flex items-center justify-center bg-navy-900">
              <span className="text-gold-500 font-bold text-lg font-mono">A♦F</span>
            </div>
            <span className="text-xl font-bold text-navy-900 hidden sm:block group-hover:text-navy-800 transition-colors">
              AUF Deutsch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {currentLabels.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy-900/70 hover:text-navy-900 font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA Button + Language Switcher */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-paper-100 px-5 py-2.5 rounded-sm font-bold text-sm transition-all hover:shadow-lg"
            >
              <span>{locale === "fa" ? "رزرو جلسه" : "Sitzung buchen"}</span>
              <span className="text-gold-500">→</span>
            </Link>

            {/* Language Switcher */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-sm border border-navy-900/20 hover:bg-navy-900/5 transition-colors"
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span>{flags[locale]}</span>
                <span className="text-sm font-medium text-navy-900">{labels[locale]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white rounded-sm shadow-lg border border-navy-900/10 py-2">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLanguageChange(l)}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-navy-900/5 transition-colors ${
                        locale === l ? "text-gold-600 font-medium" : "text-navy-900"
                      }`}
                    >
                      <span>{flags[l]}</span>
                      <span>{labels[l]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-navy-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-navy-900/10 pt-4">
            <div className="flex flex-col gap-4">
              {currentLabels.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-navy-900/70 hover:text-navy-900 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-navy-900 text-paper-100 px-5 py-3 rounded-sm font-bold mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{locale === "fa" ? "رزرو جلسه رایگان" : "Kostenlose Sitzung"}</span>
                <span>→</span>
              </Link>

              {/* Mobile Language Switcher */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-navy-900/10">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      handleLanguageChange(l);
                      setIsMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm border ${
                      locale === l
                        ? "border-gold-500 bg-gold-500/10 text-gold-600"
                        : "border-navy-900/20 text-navy-900"
                    }`}
                  >
                    <span>{flags[l]}</span>
                    <span className="text-sm">{labels[l]}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}