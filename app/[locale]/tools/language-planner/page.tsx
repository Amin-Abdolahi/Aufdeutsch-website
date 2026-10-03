"use client";

/**
 * Language Planner — صفحه اصلی
 * پلنر «زبان‌مستقل»: کاربر زبان هدفش را تعریف می‌کند و
 * کل برنامه هفتگی بر اساس آن شخصی‌سازی می‌شود.
 * داده‌ها در localStorage ذخیره می‌شوند (بدون نیاز به بک‌اند).
 */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import type {
  LanguageProfile,
  PlannerTask,
  Weekday,
} from "@/lib/planner/types";
import {
  addLanguage,
  addTask,
  deleteLanguage,
  load,
  moveTask,
  removeTask,
  resetWeek,
  setActiveLanguage,
  toggleTask,
  weekStats,
  type PlannerState,
} from "@/lib/planner/store";
import { buildWeek } from "@/lib/planner/templates";
import { LanguageSetup } from "./components/LanguageSetup";
import { WeeklyGrid } from "./components/WeeklyGrid";
import { AddTaskForm } from "./components/AddTaskForm";
import { ProgressPanel } from "./components/ProgressPanel";

export default function LanguagePlannerPage() {
  const params = useParams();
  const locale: Locale = isLocale((params?.locale as string) || "fa")
    ? (params!.locale as Locale)
    : "fa";
  const t = getDictionary(locale).planner;

  const [data, setData] = useState<PlannerState | null>(null);

  // بارگذاری فقط سمت کلاینت (SSR-safe)
  useEffect(() => {
    setData(load());
  }, []);

  // هنوز لود نشده — جلوگیری از hydration mismatch
  if (!data) {
    return (
      <main className="min-h-screen bg-paper-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-navy-900/10" />
          <div className="mt-6 h-32 animate-pulse rounded-2xl bg-navy-900/5" />
        </div>
      </main>
    );
  }

  const activeLang =
    data.languages.find((l) => l.id === data.activeLanguageId) ??
    data.languages[0] ??
    null;

  // --- ویزارد راه‌اندازی وقتی هنوز زبانی تعریف نشده ---
  if (!activeLang) {
    return (
      <main className="min-h-screen bg-paper-100">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold tracking-[-0.04em] text-navy-900 md:text-5xl">
              {t.title}
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-navy-900/60">
              {t.subtitle}
            </p>
          </div>
          <LanguageSetup
            locale={locale}
            onComplete={(profile) => {
              setData((prev) => {
                const base = prev ?? load();
                return addLanguage(base, profile);
              });
            }}
          />
        </div>
      </main>
    );
  }

  const langTasks = data.tasks.filter((t) => t.languageId === activeLang.id);
  const stats = weekStats(data, activeLang.id);

  const handleApplyTemplate = () => {
    const seeds = buildWeek(
      {
        language: activeLang.language,
        level: activeLang.level,
        goal: activeLang.goal,
        dailyMinutes: activeLang.dailyMinutes,
        activeDays: activeLang.activeDays,
      },
      activeLang.id
    );
    let next = data;
    for (const seed of seeds) {
      next = addTask(next, seed);
    }
    setData(next);
  };

  const handleResetWeek = () => {
    if (window.confirm(t.resetWeekConfirm)) {
      setData(resetWeek(data));
    }
  };

  const handleDeleteLanguage = () => {
    if (window.confirm(t.deleteLanguageConfirm)) {
      setData(deleteLanguage(data, activeLang.id));
    }
  };

  return (
    <main className="min-h-screen bg-paper-100">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* هدر */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-[-0.04em] text-navy-900 md:text-4xl">
              {t.title}
            </h1>
            <p className="text-navy-900/60">
              {activeLang.language} · {activeLang.level} · {activeLang.goal}
            </p>
          </div>

          {/* سوییچر زبان‌ها */}
          {data.languages.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {data.languages.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setData(setActiveLanguage(data, lang.id))}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition ${
                    lang.id === activeLang.id
                      ? "border-navy-900 bg-navy-900 text-paper-100"
                      : "border-navy-900/15 bg-white text-navy-900/70 hover:border-navy-900/40"
                  }`}
                >
                  {lang.language}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  // برگشت به ویزارد برای افزودن زبان جدید
                  setData({ ...data, activeLanguageId: null, languages: data.languages });
                }}
                className="rounded-lg border border-dashed border-navy-900/20 px-3 py-1.5 text-sm font-bold text-navy-900/50 transition hover:border-gold-400 hover:text-navy-900"
              >
                + {t.setupAnother}
              </button>
            </div>
          )}
        </div>

        {/* پیشرفت */}
        <div className="mb-8">
          <ProgressPanel locale={locale} profile={activeLang} stats={stats} />
        </div>

        {/* اکشن‌ها */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleApplyTemplate}
            className="rounded-lg bg-gold-300 px-4 py-2 text-sm font-bold text-navy-900 shadow-sm transition hover:bg-gold-400"
          >
            ✨ {t.applyTemplate}
          </button>
          <button
            type="button"
            onClick={handleResetWeek}
            className="rounded-lg border border-navy-900/15 bg-white px-4 py-2 text-sm font-bold text-navy-900/60 transition hover:border-navy-900/40 hover:text-navy-900"
          >
            ↺ {t.resetWeek}
          </button>
          <button
            type="button"
            onClick={handleDeleteLanguage}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500/70 transition hover:border-red-400 hover:text-red-500"
          >
            {t.deleteLanguage}
          </button>
        </div>

        {/* گرید هفتگی */}
        {langTasks.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-navy-900/15 bg-white/60 p-12 text-center">
            <p className="mb-4 text-navy-900/50">{t.noTasks}</p>
            <button
              type="button"
              onClick={handleApplyTemplate}
              className="rounded-lg bg-navy-900 px-6 py-3 text-sm font-bold text-paper-100 transition hover:bg-navy-800"
            >
              ✨ {t.applyTemplate}
            </button>
          </div>
        ) : (
          <WeeklyGrid
            locale={locale}
            tasks={langTasks}
            onToggle={(id) => setData(toggleTask(data, id))}
            onDelete={(id) => setData(removeTask(data, id))}
            onMove={(id, day) => setData(moveTask(data, id, day))}
          />
        )}

        {/* افزودن تسک */}
        <div className="mt-6">
          <AddTaskForm
            locale={locale}
            onAdd={(task) =>
              setData(
                addTask(data, {
                  languageId: activeLang.id,
                  ...task,
                })
              )
            }
          />
        </div>
      </div>
    </main>
  );
}
