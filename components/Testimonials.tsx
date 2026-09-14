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

  useEffect(() => {
    fetch(`/api/testimonials?locale=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  if (loading) {
    return (
      <div className={className}>
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
      <div className={className}>
        <p className="text-navy-900/60 text-center py-8">
          {locale === "fa" 
            ? "هنوز نظر تاییدشده‌ای وجود ندارد." 
            : locale === "de"
            ? "Noch keine genehmigten Bewertungen."
            : "No approved reviews yet."}
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