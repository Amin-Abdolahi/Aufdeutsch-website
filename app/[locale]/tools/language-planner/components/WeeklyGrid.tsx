"use client";

/**
 * WeeklyGrid — گرید هفتگی ۷ ستونی + بانک تسک
 * drag & drop با HTML5 API (بدون وابستگی خارجی)
 */

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { WEEKDAYS } from "@/lib/planner/types";
import type { PlannerTask, Weekday } from "@/lib/planner/types";
import { TaskCard } from "./TaskCard";

interface WeeklyGridProps {
  locale: Locale;
  tasks: PlannerTask[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, day: Weekday | "bank") => void;
}

export function WeeklyGrid({
  locale,
  tasks,
  onToggle,
  onDelete,
  onMove,
}: WeeklyGridProps) {
  const t = getDictionary(locale).planner;
  const [dragId, setDragId] = useState<string | null>(null);

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

  const handleDrop = (e: React.DragEvent, target: Weekday | "bank") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    if (id) onMove(id, target);
    setDragId(null);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const bankTasks = tasks.filter((t) => t.day === "bank");

  return (
    <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
      {/* بانک تسک */}
      <div
        onDrop={(e) => handleDrop(e, "bank")}
        onDragOver={allowDrop}
        className="flex min-h-64 flex-col rounded-2xl border-2 border-dashed border-navy-900/15 bg-white/60 p-4 transition hover:border-gold-400/50"
      >
        <h3 className="mb-3 text-sm font-bold tracking-wide text-navy-900">
          📥 {t.bankTitle}
        </h3>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {bankTasks.length === 0 ? (
            <p className="text-xs leading-relaxed text-navy-900/40">{t.bankEmpty}</p>
          ) : (
            bankTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                locale={locale}
                onToggle={onToggle}
                onDelete={onDelete}
                onDragStart={setDragId}
                compact
              />
            ))
          )}
        </div>
      </div>

      {/* گرید روزها */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {WEEKDAYS.map((day) => {
          const dayTasks = tasks.filter((t) => t.day === day);
          const dayMinutes = dayTasks.reduce((s, t) => s + t.duration, 0);
          const done = dayTasks.filter((t) => t.completed).length;

          return (
            <div
              key={day}
              onDrop={(e) => handleDrop(e, day)}
              onDragOver={allowDrop}
              className="flex min-h-48 flex-col rounded-2xl border border-navy-900/10 bg-white p-3 transition hover:border-navy-900/25"
            >
              <div className="mb-2 flex items-baseline justify-between border-b border-navy-900/10 pb-2">
                <span className="text-sm font-bold text-navy-900">
                  {dayLabel(day)}
                </span>
                <span className="font-mono text-[10px] text-navy-900/45">
                  {dayTasks.length === 0
                    ? t.emptyDay
                    : `${done}/${dayTasks.length} · ${dayMinutes}′`}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {dayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    locale={locale}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onDragStart={setDragId}
                  />
                ))}
                {dayTasks.length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-navy-900/10 text-[11px] text-navy-900/30">
                    {t.emptyDay}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
