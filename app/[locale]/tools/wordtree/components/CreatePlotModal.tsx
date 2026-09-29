"use client";

/**
 * CreatePlotModal — مودال ساخت باغچه (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کاربر اسم باغچه رو وارد می‌کنه.
 * ۲. تم باغچه (برای مرحله‌ی ۶) فعلاً `default` هست.
 * ۳. بعد از ساخت، باغچه به لیست اضافه می‌شه.
 */

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CreatePlotModalProps {
  onClose: () => void;
  onCreate: (name: string) => { success: boolean; error?: string };
  labels: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    create: string;
    cancel: string;
    errorRequired: string;
  };
}

export function CreatePlotModal({
  onClose,
  onCreate,
  labels,
}: CreatePlotModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      setError(labels.errorRequired);
      return;
    }

    const result = onCreate(name.trim());
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "خطا در ساخت باغچه");
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full animate-panel-in border border-gold-300/30">
        {/* ─── هدر ─── */}
        <div className="mb-6 text-center">
          <div className="text-5xl mb-3">🌿</div>
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
        </div>

        {/* ─── فرم ─── */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-navy-900/70 mb-2">
            {labels.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder={labels.namePlaceholder}
            className="w-full px-4 py-3 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
        </div>

        {/* ─── خطا ─── */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ─── دکمه‌ها ─── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition"
          >
            {labels.cancel}
          </button>
          <Button variant="primary" size="md" onClick={handleCreate}>
            {labels.create}
          </Button>
        </div>
      </div>
    </div>
  );
}