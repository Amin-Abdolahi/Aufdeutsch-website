"use client";

/**
 * AddTaskForm — فرم افزودن تسک جدید به روز دلخواه
 */

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { CATEGORIES, WEEKDAYS } from "@/lib/planner/types";
import type { TaskCategory, Weekday } from "@/lib/planner/types";

interface AddTaskFormProps {
  locale: Locale;
  defaultDay?: Weekday | "bank";
  onAdd: (task: {
    day: Weekday | "bank";
    category: TaskCategory;
    title: string;
    duration: number;
    resource?: string;
  }) => void;
}

export function AddTaskForm({ locale, defaultDay = "bank", onAdd }: AddTaskFormProps) {
  const t = getDictionary(locale).planner;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState<Weekday | "bank">(defaultDay);
  const [category, setCategory] = useState<TaskCategory>("vocab");
  const [duration, setDuration] = useState(20);
  const [resource, setResource] = useState("");

  const dayLabel = (d: Weekday | "bank"): string =>
    d === "bank"
      ? t.bankTitle
      : ({
          sat: t.daySat,
          sun: t.daySun,
          mon: t.dayMon,
          tue: t.dayTue,
          wed: t.dayWed,
          thu: t.dayThu,
          fri: t.dayFri,
        }[d]);

  const reset = () => {
    setTitle("");
    setResource("");
    setDuration(20);
    setCategory("vocab");
    setDay(defaultDay);
  };

  const submit = () => {
    if (!title.trim()) return;
    onAdd({
      day,
      category,
      title: title.trim(),
      duration,
      resource: resource.trim() || undefined,
    });
    reset();
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-navy-900/20 bg-white px-4 py-2.5 text-sm font-bold text-navy-900/60 transition hover:border-gold-400 hover:text-navy-900"
      >
        + {t.addTask}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-md">
      <h3 className="mb-4 text-base font-bold text-navy-900">{t.addTask}</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-navy-900/70">
            {t.taskTitle}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            placeholder="…"
            className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-navy-900/70">
              {t.taskCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-gold-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.icon}{" "}
                  {t[`cat${c.key.charAt(0).toUpperCase()}${c.key.slice(1)}` as keyof typeof t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-navy-900/70">
              {t.taskDuration}
            </label>
            <input
              type="number"
              min={5}
              max={240}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 20)}
              className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-gold-400"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-navy-900/70">
              {t.weekTitle}
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as Weekday | "bank")}
              className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-gold-400"
            >
              <option value="bank">📥 {t.bankTitle}</option>
              {WEEKDAYS.map((d) => (
                <option key={d} value={d}>
                  {dayLabel(d)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-navy-900/70">
              {t.taskResource}
            </label>
            <input
              type="text"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="…"
              className="w-full rounded-lg border border-navy-900/15 bg-paper-50 px-3 py-2 text-sm text-navy-900 outline-none transition focus:border-gold-400"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={!title.trim()}
            className="flex-1 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-bold text-paper-100 transition hover:bg-navy-800 disabled:opacity-40"
          >
            {t.taskSave}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setOpen(false);
            }}
            className="rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm font-bold text-navy-900/60 transition hover:border-navy-900/40"
          >
            {t.taskCancel}
          </button>
        </div>
      </div>
    </div>
  );
}
