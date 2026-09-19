"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";

interface Testimonial {
  id: string;
  authorName: string;
  authorInitial: string;
  course: string;
  text: string;
  rating: number;
  locale: "fa" | "de" | "en";
  approved: boolean;
  createdAt: string;
}

interface TestimonialsProps {
  locale: Locale;
  className?: string;
}

export function Testimonials({ locale, className = "" }: TestimonialsProps) {
  const { t } = useLocale();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(false);
    fetch(`/api/testimonials?locale=${locale}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load testimonials");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch((fetchError: unknown) => {
        if (!active || (fetchError instanceof DOMException && fetchError.name === "AbortError")) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [locale]);

  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-live="polite">
        <div className="animate-pulse space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-navy-900/10 pb-8 last:border-0 last:pb-0">
              <div className="h-6 bg-navy-900/10 rounded w-3/4 mb-4" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-navy-900/10" />
                <div className="space-y-1">
                  <div className="h-4 bg-navy-900/10 rounded w-32" />
                  <div className="h-3 bg-navy-900/10 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className={className} aria-live="polite">
        <p className="text-navy-900/60 text-center py-8" role={error ? "alert" : undefined}>
          {locale === "fa" 
            ? error ? "نمایش نظرات ممکن نشد. لطفاً صفحه را دوباره بارگذاری کنید." : "هنوز نظر تاییدشده‌ای وجود ندارد." 
            : locale === "de"
            ? error ? "Bewertungen konnten nicht geladen werden. Bitte laden Sie die Seite neu." : "Noch keine genehmigten Bewertungen."
            : error ? "Reviews could not be loaded. Please reload the page." : "No approved reviews yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={className} itemScope itemType="https://schema.org/ItemList">
      {testimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="border-b border-navy-900/10 pb-8 last:border-0 last:pb-0" itemProp="itemListElement" itemScope itemType="https://schema.org/Review">
          <meta itemProp="position" content={(index + 1).toString()} />
          <meta itemProp="author" content={testimonial.authorName} />
          <meta itemProp="reviewRating" content={testimonial.rating.toString()} />
          <meta itemProp="datePublished" content={testimonial.createdAt} />
          <p itemProp="reviewBody" className="text-navy-900/80 text-lg mb-4 leading-relaxed">"{testimonial.text}"</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
              <span className="text-gold-600 font-bold text-lg">{testimonial.authorInitial}</span>
            </div>
            <div>
              <div itemProp="author" className="font-bold text-navy-900">{testimonial.authorName}</div>
              <div className="text-navy-900/60 text-sm">{testimonial.course}</div>
              <div className="flex gap-1 mt-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? "text-gold-500 fill-current" : "text-navy-900/20"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}