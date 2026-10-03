"use client";

/**
 * ProgressPanel — نوار پیشرفت هفتگی + استریک + آمار
 */

import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { LanguageProfile } from "@/lib/planner/types";
import type { WeekStats } from "@/lib/planner/store";

interface ProgressPanelProps {
  locale: Locale;
  profile: LanguageProfile;
  stats: WeekStats;
}

export function ProgressPanel({ locale, profile, stats }: ProgressPanelProps) {
  const t = getDictionary(locale).planner;
  const weeklyGoal = profile.weeklyTarget || profile.dailyMinutes * profile.activeDays.length;
  const goalPercent = Math.min(100, Math.round((stats.doneMinutes / Math.max(1, weeklyGoal)) * 100));

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* پیشرفت هفته */}
      <div className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm sm:col-span-2">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-bold text-navy-900">{t.progress}</span>
          <span className="font-mono text-xs text-navy-900/50">
            {stats.doneMinutes} / {weeklyGoal} {t.minutes}
          </span>
        </div>
        <div className="mb-1.5 h-3 overflow-hidden rounded-full bg-navy-900/10">
          <div
            className="h-full rounded-full bg-gradient-to-l from-gold-400 to-gold-300 transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-navy-900/45">
          <span>{stats.doneTasks} {t.doneTasks}</span>
          <span className="font-mono">{goalPercent}%</span>
        </div>
      </div>

      {/* استریک */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-navy-900/10 bg-navy-900 p-5 text-center shadow-sm">
        <div className="text-3xl" aria-hidden="true">🔥</div>
        <div className="mt-1 text-3xl font-bold text-paper-100">{stats.streak}</div>
        <div className="text-xs font-bold text-paper-100/70">{t.streak}</div>
        {stats.streak === 0 && (
          <div className="mt-1 text-[10px] text-paper-100/40">{t.streakZero}</div>
        )}
      </div>
    </div>
  );
}
