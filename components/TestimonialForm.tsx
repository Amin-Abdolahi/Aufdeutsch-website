"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface TestimonialFormProps {
  locale: Locale;
}

export function TestimonialForm({ locale }: TestimonialFormProps) {
  const { t } = useLocale();
  const [formState, setFormState] = useState({
    authorName: "",
    course: "",
    text: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to submit");
      }

      setIsSuccess(true);
      setFormState({ authorName: "", course: "", text: "", rating: 5 });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      // Show server error message if available, otherwise use the translated fallback
      const serverMsg = err instanceof Error ? err.message : "";
      setErrorMessage(serverMsg && serverMsg !== "Failed to submit" ? serverMsg : t.contact.testimonialErrorDesc);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-sm text-center" role="alert">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-green-600 font-bold text-lg mb-2">{t.contact.testimonialSuccessTitle}</h3>
        <p className="text-green-700 text-sm">{t.contact.testimonialSuccessDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="authorName" className="block text-navy-900 font-medium mb-2">
          {t.contact.testimonialName}
        </label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          required
          value={formState.authorName}
          onChange={handleChange}
          className="w-full bg-white border border-navy-900/20 text-navy-900 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          placeholder={t.contact.testimonialNamePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="course" className="block text-navy-900 font-medium mb-2">
          {t.contact.testimonialCourse}
        </label>
        <input
          type="text"
          id="course"
          name="course"
          required
          value={formState.course}
          onChange={handleChange}
          className="w-full bg-white border border-navy-900/20 text-navy-900 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          placeholder={t.contact.testimonialCoursePlaceholder}
        />
      </div>

      <div>
        <label className="block text-navy-900 font-medium mb-2">
          {t.contact.testimonialRating}
        </label>
        <div className="flex gap-2" role="radiogroup" aria-label="Rating">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={formState.rating === star}
              aria-label={`${star} stars`}
              onClick={() => setFormState({ ...formState, rating: star })}
              className={`flex-1 py-3 rounded-sm font-bold transition-colors ${
                formState.rating >= star
                  ? "bg-gold-300 text-navy-900"
                  : "bg-navy-900/10 text-navy-900/50 hover:bg-navy-900/20"
              }`}
            >
              {star} ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="text" className="block text-navy-900 font-medium mb-2">
          {t.contact.testimonialText}
        </label>
        <textarea
          id="text"
          name="text"
          required
          rows={4}
          value={formState.text}
          onChange={handleChange}
          className="w-full bg-white border border-navy-900/20 text-navy-900 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
          placeholder={t.contact.testimonialTextPlaceholder}
        />
      </div>

      {errorMessage && (
        <p role="alert" aria-live="assertive" className="text-red-500 text-sm text-center">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t.contact.testimonialSubmitting : t.contact.testimonialSubmit}
      </Button>

      <p className="text-navy-900/50 text-xs text-center">
        {t.contact.privacyNote}
      </p>
    </form>
  );
}