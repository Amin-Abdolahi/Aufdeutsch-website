"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  authorName: string;
  course: string;
  text: string;
  rating: number;
  locale: "fa" | "de" | "en";
  approved: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all testimonials (approved + pending)
  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch {
      alert("خطا در بارگذاری");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Approve or reject a testimonial
  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        // Remove from list or refresh
        await fetchTestimonials();
      } else {
        alert("خطا در انجام عملیات");
      }
    } catch {
      alert("خطای شبکه");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter pending testimonials
  const pending = testimonials.filter((t) => !t.approved);
  const approved = testimonials.filter((t) => t.approved);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <p className="text-navy-900">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-navy-900 mb-2">
          مدیریت نظرات
        </h1>
        <p className="text-navy-900/60 mb-8">
          نظرات جدید رو تایید یا رد کنید
        </p>

        {/* Pending testimonials */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            در انتظار تایید ({pending.length})
          </h2>

          {pending.length === 0 ? (
            <div className="bg-white p-6 rounded-sm border border-navy-900/10">
              <p className="text-navy-900/60">نظر جدیدی برای تایید نیست</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-sm border border-navy-900/10 shadow-sm"
                >
                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-bold text-navy-900">نام: </span>
                      <span className="text-navy-900/80">{t.authorName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-navy-900">دوره: </span>
                      <span className="text-navy-900/80">{t.course}</span>
                    </div>
                    <div>
                      <span className="font-bold text-navy-900">امتیاز: </span>
                      <span className="text-navy-900/80">
                        {t.rating}/5 {"★".repeat(t.rating)}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-navy-900">زبان: </span>
                      <span className="text-navy-900/80">{t.locale.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="mb-4">
                    <p className="font-bold text-navy-900 mb-2">متن نظر:</p>
                    <p className="text-navy-900/80 leading-relaxed bg-paper-50 p-4 rounded-sm">
                      {t.text}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(t.id, "approve")}
                      disabled={actionLoading === t.id}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-sm transition-colors disabled:opacity-50"
                    >
                      {actionLoading === t.id ? "..." : "✅ تایید و انتشار"}
                    </button>
                    <button
                      onClick={() => handleAction(t.id, "reject")}
                      disabled={actionLoading === t.id}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-sm transition-colors disabled:opacity-50"
                    >
                      {actionLoading === t.id ? "..." : "❌ رد و حذف"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved testimonials */}
        <section>
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            تایید شده ({approved.length})
          </h2>
          <div className="space-y-2">
            {approved.map((t) => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-sm border border-navy-900/10 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-navy-900">{t.authorName}</span>
                  <span className="text-navy-900/60 text-sm mr-3">
                    ({t.course})
                  </span>
                </div>
                <button
                  onClick={() => handleAction(t.id, "reject")}
                  disabled={actionLoading === t.id}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}