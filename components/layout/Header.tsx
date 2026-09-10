// Header Component - هدر سایت با ناوبری

"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/courses", label: "دورهها" },
  { href: "/pricing", label: "قیمت" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            {navLinks.map((link) => (
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

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-paper-100 px-5 py-2.5 rounded-sm font-bold text-sm transition-all hover:shadow-lg"
          >
            <span>رزرو جلسه</span>
            <span className="text-gold-500">→</span>
          </Link>

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
              {navLinks.map((link) => (
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
                <span>رزرو جلسه رایگان</span>
                <span>→</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}