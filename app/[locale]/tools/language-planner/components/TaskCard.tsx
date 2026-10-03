"use client";

/**
 * TaskCard — کارت تسک با چک‌باکس، درگ & دراپ HTML5
 */

import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/planner/types";
import type { PlannerTask } from "@/lib/planner/types";

interface TaskCardProps {
  task: PlannerTask;
  locale: Locale;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  compact?: boolean;
}

export function TaskCard({
  task,
  locale,
  onToggle,
  onDelete,
  onDragStart,
  compact = false,
}: TaskCardProps) {
  const t = getDictionary(locale).planner;
  const cat = CATEGORIES.find((c) => c.key === task.category) ?? CATEGORIES[0];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      className={`group relative cursor-grab rounded-lg border bg-white shadow-sm transition hover:shadow-md active:cursor-grabbing ${
        task.completed ? "border-emerald-300 bg-emerald-50/40" : "border-navy-900/10"
      } ${compact ? "p-2" : "p-3"}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition ${
            task.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-navy-900/25 hover:border-emerald-500"
          }`}
          aria-label={task.completed ? "done" : "todo"}
        >
          {task.completed && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6l3 3 5-6" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs" aria-hidden="true">{cat.icon}</span>
            <span
              className={`text-sm font-medium leading-tight text-navy-900 ${
                task.completed ? "line-through opacity-50" : ""
              }`}
            >
              {task.title}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-navy-900/45">
            <span className={`rounded px-1.5 py-0.5 font-bold ${cat.color} ${cat.text}`}>
              {t[`cat${task.category.charAt(0).toUpperCase()}${task.category.slice(1)}` as keyof typeof t]}
            </span>
            <span className="font-mono">{task.duration}′</span>
            {task.resource && <span className="truncate">· {task.resource}</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 rounded p-1 text-navy-900/30 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
          aria-label={t.taskDelete}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
