"use client";

/**
 * AlertBanner — بنر هشدار (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این بنر بالای صفحه‌ی بازی نشون داده می‌شه.
 * ۲. کاربر می‌تونه ببندش، ولی ۲۴ ساعت بعد دوباره ظاهر می‌شه.
 * ۳. کلید localStorage: `wordtree_alert_dismissed_v1`
 * ۴. برای حذف کامل بنر (بعد از پایان توسعه)، فقط این کامپوننت رو
 *    از `page.tsx` حذف کن.
 */

import { useState, useEffect } from "react";

interface AlertBannerProps {
  onBackupClick: () => void;
  labels: {
    message: string;
    backupButton: string;
    dismiss: string;
  };
}

const ALERT_DISMISSED_KEY = "wordtree_alert_dismissed_v1";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // ۲۴ ساعت

export function AlertBanner({
  onBackupClick,
  labels,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // ─── چک کن آیا کاربر بنر رو بسته ───
    const dismissedAt = localStorage.getItem(ALERT_DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) {
        return; // هنوز ۲۴ ساعت نشده
      }
    }

    // ─── نمایش بنر ───
    setIsVisible(true);
  }, []);

  // ─── بستن بنر ───
  const handleDismiss = () => {
    localStorage.setItem(ALERT_DISMISSED_KEY, Date.now().toString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-4 bg-amber-50 border border-amber-300 rounded-lg p-3 md:p-4 animate-panel-in">
      <div className="flex items-start gap-3">
        {/* ─── آیکون ─── */}
        <span className="text-2xl flex-shrink-0">⚠️</span>

        {/* ─── متن + دکمه ─── */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-900 leading-relaxed mb-2">
            {labels.message}
          </p>
          <button
            onClick={onBackupClick}
            className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-sm transition"
          >
            💾 {labels.backupButton}
          </button>
        </div>

        {/* ─── دکمه‌ی بستن ─── */}
        <button
          onClick={handleDismiss}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-amber-200 transition text-amber-900 flex-shrink-0"
          aria-label={labels.dismiss}
          title={labels.dismiss}
        >
          ✕
        </button>
      </div>
    </div>
  );
}