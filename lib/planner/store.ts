// ============================================================
//  Language Planner — localStorage store
//  بدون Zustand؛ الگوی ساده‌ی SSR-safe.
// ============================================================

import type {
  LanguageProfile,
  PlannerState,
  PlannerTask,
  Weekday,
} from "./types";

export type { PlannerState };

const LS_KEY = "aufdeutsch.planner.v1";

const EMPTY: PlannerState = {
  languages: [],
  activeLanguageId: null,
  tasks: [],
  lastResetWeek: null,
};

let cache: PlannerState | null = null;

function read(): PlannerState {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as PlannerState;
    cache = { ...EMPTY, ...parsed };
    return cache;
  } catch {
    return EMPTY;
  }
}

function write(state: PlannerState) {
  cache = state;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

// --- helpers ---

export function uid(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function load(): PlannerState {
  return read();
}

export function save(state: PlannerState) {
  write(state);
}

/** پاک کردن کش — فقط برای تست و ریست کامل */
export function resetStore() {
  cache = null;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}

// --- mutations ---

export function addLanguage(
  state: PlannerState,
  profile: Omit<LanguageProfile, "id" | "createdAt">
): PlannerState {
  const lang: LanguageProfile = {
    ...profile,
    id: uid(),
    createdAt: Date.now(),
  };
  const next: PlannerState = {
    ...state,
    languages: [...state.languages, lang],
    // زبان جدید فعال می‌شود — کاربر همین زبان را تعریف کرده
    activeLanguageId: lang.id,
  };
  write(next);
  return next;
}

export function setActiveLanguage(
  state: PlannerState,
  languageId: string
): PlannerState {
  const next = { ...state, activeLanguageId: languageId };
  write(next);
  return next;
}

export function deleteLanguage(state: PlannerState, languageId: string): PlannerState {
  const next: PlannerState = {
    ...state,
    languages: state.languages.filter((l) => l.id !== languageId),
    tasks: state.tasks.filter((t) => t.languageId !== languageId),
    activeLanguageId:
      state.activeLanguageId === languageId
        ? state.languages.find((l) => l.id !== languageId)?.id ?? null
        : state.activeLanguageId,
  };
  write(next);
  return next;
}

export function addTask(
  state: PlannerState,
  task: Omit<PlannerTask, "id" | "completed">
): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: [
      ...state.tasks,
      { ...task, id: uid(), completed: false },
    ],
  };
  write(next);
  return next;
}

export function updateTask(
  state: PlannerState,
  taskId: string,
  patch: Partial<PlannerTask>
): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, ...patch } : t
    ),
  };
  write(next);
  return next;
}

export function removeTask(state: PlannerState, taskId: string): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: state.tasks.filter((t) => t.id !== taskId),
  };
  write(next);
  return next;
}

export function toggleTask(state: PlannerState, taskId: string): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? Date.now() : undefined,
          }
        : t
    ),
  };
  write(next);
  return next;
}

export function moveTask(
  state: PlannerState,
  taskId: string,
  newDay: Weekday | "bank"
): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, day: newDay } : t
    ),
  };
  write(next);
  return next;
}

export function resetWeek(state: PlannerState): PlannerState {
  const next: PlannerState = {
    ...state,
    tasks: state.tasks.map((t) => ({
      ...t,
      completed: false,
      completedAt: undefined,
    })),
    lastResetWeek: weekStartISO(),
  };
  write(next);
  return next;
}

// --- stats ---

/** شناسه‌ی ISO تاریخ شروع هفته (شنبه) */
export function weekStartISO(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay(); // 0=یکشنبه
  // شنبه = 6 در getDay
  const diff = day === 6 ? 0 : day + 1;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

export interface WeekStats {
  doneMinutes: number;
  totalMinutes: number;
  doneTasks: number;
  totalTasks: number;
  percent: number;
  streak: number;
}

export function weekStats(
  state: PlannerState,
  languageId: string | null
): WeekStats {
  const tasks = state.tasks.filter((t) => t.languageId === languageId);
  const doneMinutes = tasks
    .filter((t) => t.completed)
    .reduce((s, t) => s + t.duration, 0);
  const totalMinutes = tasks.reduce((s, t) => s + t.duration, 0);
  const doneTasks = tasks.filter((t) => t.completed).length;
  const percent =
    totalMinutes > 0 ? Math.min(100, Math.round((doneMinutes / totalMinutes) * 100)) : 0;

  return {
    doneMinutes,
    totalMinutes,
    doneTasks,
    totalTasks: tasks.length,
    percent,
    streak: calcStreak(tasks),
  };
}

/** طولانی‌ترین زنجیره‌ی پیوسته‌ی روزهایی که حداقل یک تسک انجام شده */
function calcStreak(tasks: PlannerTask[]): number {
  const days = new Set<string>();
  for (const t of tasks) {
    if (t.completed && t.completedAt) {
      days.add(new Date(t.completedAt).toISOString().slice(0, 10));
    }
  }
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      // اجازه می‌دهیم امروز هنوز انجام نشده باشد
      if (streak === 0 && key === new Date().toISOString().slice(0, 10)) {
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return streak;
}
