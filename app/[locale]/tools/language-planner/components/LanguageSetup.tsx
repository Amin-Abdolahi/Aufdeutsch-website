"use client";

/**
 * LanguageSetup — ویزارد تعریف زبان هدف
 * زبان‌مستقل: کاربر هر زبانی را که می‌خواهد تعریف می‌کند.
 */

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { Weekday } from "@/lib/planner/types";
import { WEEKDAYS } from "@/lib/planner/types";

interface LanguageSetupProps {
  locale: Locale;
  onComplete: (profile: {
    language: string;
    level: string;
    goal: string;
    dailyMinutes: number;
    weeklyTarget: number;
    activeDays: Weekday[];
  }) => void;
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const GOAL_KEYS = [
  "goalConversation",
  "goalExam",
  "goalMigration",
  "goalWork",
  "goalGeneral",
] as const;
const DAILY_OPTIONS = [15, 30, 45, 60, 90];

export function LanguageSetup({ locale, onComplete }: LanguageSetupProps) {
  const t = getDictionary(locale).planner;
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("A1");
  const [goal, setGoal] = useState<string>("goalConversation");
  const [daily, setDaily] = useState(30);
  const [days, setDays] = useState<Weekday[]>([...WEEKDAYS]);

  const dayLabel = (d: Weekday): string =>
    ({
      sat: t.daySat,
      sun: t.daySun,
      mon: t.dayMon,
      tue: t.dayTue,
      wed: t.dayWed,
      thu: t.dayThu,
      fri: t.dayFri,
    }[d]);

  const toggleDay = (d: Weekday) => {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const canSubmit = language.trim().length > 0 && days.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onComplete({
      language: language.trim(),
      level,
      goal: t[goal as keyof typeof t] as string,
      dailyMinutes: daily,
      weeklyTarget: daily * days.length,
      activeDays: days,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-navy-900/10 bg-white p-8 shadow-md md:p-10">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-[-0.02em] text-navy-900">
            {t.setupTitle}
          </h2>
          <p className="leading-relaxed text-navy-900/60">{t.setupSubtitle}</p>
        </div>

        <div className="space-y-6">
          {/* زبان هدف — تایپ آزاد */}
          <div>
            <label className="mb-2 block text-sm font-bold text-navy-900">
              {t.setupLanguage}
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder={t.setupLanguagePlaceholder}
              className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-4 py-3 text-navy-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>

          {/* سطح */}
          <div>
            <label className="mb-2 block text-sm font-bold text-navy-900">
              {t.setupLevel}
            </label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => setLevel(lv)}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    level === lv
                      ? "border-navy-900 bg-navy-900 text-paper-100"
                      : "border-navy-900/15 bg-white text-navy-900/70 hover:border-navy-900/40"
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>

          {/* هدف */}
          <div>
            <label className="mb-2 block text-sm font-bold text-navy-900">
              {t.setupGoal}
            </label>
            <div className="flex flex-wrap gap-2">
              {GOAL_KEYS.map((gk) => (
                <button
                  key={gk}
                  type="button"
                  onClick={() => setGoal(gk)}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    goal === gk
                      ? "border-gold-400 bg-gold-300/30 text-navy-900"
                      : "border-navy-900/15 bg-white text-navy-900/70 hover:border-navy-900/40"
                  }`}
                >
                  {t[gk]}
                </button>
              ))}
            </div>
          </div>

          {/* زمان روزانه */}
          <div>
            <label className="mb-2 block text-sm font-bold text-navy-900">
              {t.setupDaily}
            </label>
            <div className="flex flex-wrap gap-2">
              {DAILY_OPTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDaily(m)}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    daily === m
                      ? "border-navy-900 bg-navy-900 text-paper-100"
                      : "border-navy-900/15 bg-white text-navy-900/70 hover:border-navy-900/40"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* روزهای فعال */}
          <div>
            <label className="mb-2 block text-sm font-bold text-navy-900">
              {t.setupDays}
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
                    days.includes(d)
                      ? "border-gold-400 bg-gold-300/30 text-navy-900"
                      : "border-navy-900/15 bg-white text-navy-900/40 hover:border-navy-900/40"
                  }`}
                >
                  {dayLabel(d)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="w-full rounded-lg bg-navy-900 px-6 py-4 text-base font-bold text-paper-100 shadow-lg transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.setupStart}
          </button>
        </div>
      </div>
    </div>
  );
}
