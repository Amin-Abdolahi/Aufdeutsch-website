"use client";

/**
 * SettingsPanel — پنل تنظیمات (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این پنل از سمت راست (توی RTL) باز می‌شه.
 * ۲. گزینه‌ها به صورت لیست عمودی نمایش داده می‌شن.
 * ۳. برای اضافه کردن گزینه‌ی جدید، به آرایه‌ی `items` اضافه کن.
 */

import { useEffect } from "react";

interface SettingsItem {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: SettingsItem[];
  title: string;
}

export function SettingsPanel({
  isOpen,
  onClose,
  items,
  title,
}: SettingsPanelProps) {
  // ─── بستن پنل با دکمه‌ی Escape ───
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* ─── Backdrop ─── */}
      <div
        className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-40 animate-panel-in"
        onClick={onClose}
      />

      {/* ─── پنل ─── */}
      <div className="fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-paper-100 shadow-2xl z-50 animate-slide-in-right border-l border-gold-300/30">
        {/* هدر */}
        <div className="flex items-center justify-between p-4 border-b border-navy-900/10">
          <h2 className="text-lg font-bold text-navy-900 font-mono">
            ⚙️ {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-navy-900/10 transition text-navy-900"
            aria-label="بستن"
          >
            ✕
          </button>
        </div>

        {/* گزینه‌ها */}
        <div className="p-3 space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition text-right ${
                item.variant === "danger"
                  ? "bg-red-50 hover:bg-red-100 text-red-700"
                  : "bg-white hover:bg-gold-300/20 text-navy-900 border border-navy-900/10"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}