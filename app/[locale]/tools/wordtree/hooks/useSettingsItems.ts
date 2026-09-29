"use client";

/**
 * useSettingsItems — ساخت آیتم‌های پنل تنظیمات
 *
 * ⚠️ وظیفه: فقط ساخت آرایه‌ی settingsItems
 */

import { SettingsItem } from "../components/SettingsPanel";

interface UseSettingsItemsProps {
  t: any;
  onQuiz: () => void;
  onMyWords: () => void;
  onAddWord: () => void;
  onImport: () => void;
  onBackup: () => void;
  onSnapshots: () => void;
  onHelp: () => void;
}

export function useSettingsItems({
  t,
  onQuiz,
  onMyWords,
  onAddWord,
  onImport,
  onBackup,
  onSnapshots,
  onHelp,
}: UseSettingsItemsProps): SettingsItem[] {
  return [
    {
      icon: "🎯",
      label: t.quizMenu || "آزمون‌ها",
      onClick: onQuiz,
      variant: "highlight",
    },
    {
      icon: "📖",
      label: t.myWords || "کلمات من",
      onClick: onMyWords,
      variant: "highlight",
    },
    {
      icon: "➕",
      label: t.addWord,
      onClick: onAddWord,
    },
    {
      icon: "📥",
      label: t.importWords,
      onClick: onImport,
    },
    {
      icon: "💾",
      label: t.backup || "پشتیبان‌گیری",
      onClick: onBackup,
      variant: "help",
    },
    {
      icon: "📂",
      label: t.snapshots || "نسخه‌های قبلی",
      onClick: onSnapshots,
      variant: "help",
    },
    {
      icon: "📚",
      label: t.help || "راهنما",
      onClick: onHelp,
      variant: "help",
    },
  ];
}