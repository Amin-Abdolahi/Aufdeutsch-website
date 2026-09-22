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
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      const serverMsg = err instanceof Error ? err.message : "";
      setErrorMessage(
        serverMsg && serverMsg !== "Failed to submit"
          ? serverMsg
          : t.contact.testimonialErrorDesc
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* پس‌زمینه‌ی نقطه‌چین ملایم */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1B2A44 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* ============ پیام موفقیت ============ */}
        {isSuccess ? (
          <div
            className="relative p-8 md:p-10 rounded-sm text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{
              background: "linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)",
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 6px), 96% 100%, 92% calc(100% - 4px), 88% 100%, 84% calc(100% - 6px), 80% 100%, 76% calc(100% - 3px), 72% 100%, 68% calc(100% - 5px), 64% 100%, 60% calc(100% - 4px), 56% 100%, 52% calc(100% - 6px), 48% 100%, 44% calc(100% - 3px), 40% 100%, 36% calc(100% - 6px), 32% 100%, 28% calc(100% - 4px), 24% 100%, 20% calc(100% - 5px), 16% 100%, 12% calc(100% - 3px), 8% 100%, 4% calc(100% - 6px), 0 100%)",
              filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.15))",
            }}
            role="alert"
          >
            {/* نوار چسب */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 rotate-[-3deg] bg-yellow-100/70 z-20" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-navy-900 font-bold text-xl mb-2">
                {t.contact.testimonialSuccessTitle}
              </h3>
              <p className="text-navy-900/70 text-sm leading-relaxed">
                {t.contact.testimonialSuccessDesc}
              </p>
            </div>
          </div>
        ) : (
          /* ============ فرم اصلی ============ */
          <div className="relative">
            {/* نوار چسب بالای کارت */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 rotate-[-2deg] bg-yellow-100/70 z-20 shadow-sm">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.8) 3px, rgba(255,255,255,0.8) 4px)",
                }}
              />
            </div>
            <div className="absolute -top-2 right-16 w-20 h-5 rotate-[4deg] bg-blue-100/60 z-20 shadow-sm" />

            {/* کارت کاغذی */}
            <div
              className="relative p-8 md:p-12"
              style={{
                background: "linear-gradient(180deg, #fefcf6 0%, #faf5e8 100%)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 8px), 97% 100%, 94% calc(100% - 5px), 90% 100%, 86% calc(100% - 7px), 82% 100%, 78% calc(100% - 4px), 74% 100%, 70% calc(100% - 6px), 66% 100%, 62% calc(100% - 3px), 58% 100%, 54% calc(100% - 6px), 50% 100%, 46% calc(100% - 4px), 42% 100%, 38% calc(100% - 7px), 34% 100%, 30% calc(100% - 5px), 26% 100%, 22% calc(100% - 6px), 18% 100%, 14% calc(100% - 3px), 10% 100%, 6% calc(100% - 5px), 3% 100%, 0 calc(100% - 7px))",
                filter:
                  "drop-shadow(0 15px 25px rgba(0,0,0,0.2)) drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              }}
            >
              {/* تیتر */}
              <div className="text-center mb-10 relative">
                <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-[-0.02em] inline-block relative">
                  {t.contact.testimonialWrite}
                  <svg
                    className="absolute -bottom-3 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,5 Q50,1 100,4 T200,5"
                      stroke="#D4AF37"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </h2>
                <p className="text-navy-900/60 text-sm mt-6 leading-relaxed">
                  {t.contact.testimonialSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7" noValidate>
                {/* ============ نام ============ */}
                <div>
                  <label
                    htmlFor="authorName"
                    className="block text-navy-900/80 font-medium mb-2 text-sm"
                  >
                    {t.contact.testimonialName}
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    required
                    value={formState.authorName}
                    onChange={handleChange}
                    className="w-full bg-white/70 border-0 border-b-2 border-navy-900/20 text-navy-900 px-2 py-3 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-navy-900/30"
                    placeholder={t.contact.testimonialNamePlaceholder}
                  />
                </div>

                {/* ============ دوره ============ */}
                <div>
                  <label
                    htmlFor="course"
                    className="block text-navy-900/80 font-medium mb-2 text-sm"
                  >
                    {t.contact.testimonialCourse}
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    required
                    value={formState.course}
                    onChange={handleChange}
                    className="w-full bg-white/70 border-0 border-b-2 border-navy-900/20 text-navy-900 px-2 py-3 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-navy-900/30"
                    placeholder={t.contact.testimonialCoursePlaceholder}
                  />
                </div>

                {/* ============ امتیاز ============ */}
                <div>
                  <label className="block text-navy-900/80 font-medium mb-3 text-sm">
                    {t.contact.testimonialRating}
                  </label>
                  <div
                    className="flex gap-2 justify-center md:justify-start"
                    role="radiogroup"
                    aria-label="Rating"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive =
                        hoverRating > 0
                          ? star <= hoverRating
                          : star <= formState.rating;
                      return (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={formState.rating === star}
                          aria-label={`${star} stars`}
                          onClick={() =>
                            setFormState({ ...formState, rating: star })
                          }
                          onMouseEnter={() => setHoverRating(star)}
                          className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                        >
                          <svg
                            className={`w-9 h-9 md:w-10 md:h-10 transition-colors duration-200 ${
                              isActive
                                ? "text-gold-500 fill-current drop-shadow-md"
                                : "text-navy-900/20 fill-current"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ============ متن نظر ============ */}
                <div>
                  <label
                    htmlFor="text"
                    className="block text-navy-900/80 font-medium mb-2 text-sm"
                  >
                    {t.contact.testimonialText}
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    required
                    rows={5}
                    value={formState.text}
                    onChange={handleChange}
                    className="w-full bg-white/70 border-0 border-b-2 border-navy-900/20 text-navy-900 px-2 py-3 focus:outline-none focus:border-gold-500 transition-colors resize-none placeholder:text-navy-900/30 leading-relaxed"
                    placeholder={t.contact.testimonialTextPlaceholder}
                  />
                </div>

                {/* ============ پیام خطا ============ */}
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="bg-red-50 border-r-4 border-red-500 px-4 py-3 rounded-sm"
                  >
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* ============ دکمه ارسال ============ */}
                <div className="pt-4 flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="min-w-[220px] font-mono tracking-[0.08em]"
                  >
                    {isSubmitting
                      ? t.contact.testimonialSubmitting
                      : t.contact.testimonialSubmit}
                  </Button>
                </div>

                {/* ============ نکته حریم خصوصی ============ */}
                <p className="text-navy-900/40 text-xs text-center leading-relaxed pt-2">
                  🔒 {t.contact.privacyNote}
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}