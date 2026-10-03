import { describe, it, expect, beforeEach } from "vitest";
import { buildWeek } from "@/lib/planner/templates";
import { load, addLanguage, addTask, toggleTask, weekStats, moveTask, resetWeek, resetStore } from "@/lib/planner/store";
import { WEEKDAYS } from "@/lib/planner/types";

describe("planner templates", () => {
  it("generates tasks for every active day", () => {
    const seeds = buildWeek(
      { language: "انگلیسی", level: "B1", goal: "مکالمه روزمره", dailyMinutes: 30, activeDays: WEEKDAYS },
      "lang1"
    );
    expect(seeds.length).toBeGreaterThan(0);
    const days = new Set(seeds.map((s) => s.day));
    expect(days.size).toBe(7);
  });

  it("respects daily minutes roughly", () => {
    const seeds = buildWeek(
      { language: "en", level: "A2", goal: "آموزون", dailyMinutes: 30, activeDays: ["sat", "sun"] },
      "lang1"
    );
    const perDay = new Map<string, number>();
    for (const s of seeds) perDay.set(s.day, (perDay.get(s.day) ?? 0) + s.duration);
    for (const total of perDay.values()) expect(total).toBeLessThanOrEqual(60);
  });

  it("picks exam template for exam goal", () => {
    const seeds = buildWeek(
      { language: "de", level: "B2", goal: "Prüfung", dailyMinutes: 45, activeDays: ["sat"] },
      "lang1"
    );
    expect(seeds.some((s) => s.category === "grammar" || s.category === "reading")).toBe(true);
  });
});

describe("planner store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("starts empty on server (no window)", () => {
    const state = load();
    expect(state.languages).toEqual([]);
    expect(state.activeLanguageId).toBeNull();
  });

  it("adds a language and tasks, then computes stats", () => {
    let state = load();
    state = addLanguage(state, {
      language: "انگلیسی",
      level: "B1",
      goal: "مکالمه",
      dailyMinutes: 30,
      weeklyTarget: 210,
      activeDays: WEEKDAYS,
    });
    const langId = state.activeLanguageId!;
    expect(state.languages).toHaveLength(1);

    state = addTask(state, { languageId: langId, day: "sat", category: "vocab", title: "مرور واژه", duration: 30 });
    state = addTask(state, { languageId: langId, day: "sun", category: "grammar", title: "گرامر", duration: 20 });

    const before = weekStats(state, langId);
    expect(before.totalTasks).toBe(2);
    expect(before.doneTasks).toBe(0);
    expect(before.percent).toBe(0);

    const taskId = state.tasks[0].id;
    state = toggleTask(state, taskId);
    const after = weekStats(state, langId);
    expect(after.doneTasks).toBe(1);
    expect(after.doneMinutes).toBe(30);
  });

  it("moves tasks between days and bank", () => {
    let state = load();
    state = addLanguage(state, { language: "de", level: "A1", goal: "x", dailyMinutes: 15, weeklyTarget: 30, activeDays: ["sat"] });
    const langId = state.activeLanguageId!;
    state = addTask(state, { languageId: langId, day: "sat", category: "vocab", title: "t", duration: 10 });
    const taskId = state.tasks[0].id;

    state = moveTask(state, taskId, "bank");
    expect(state.tasks[0].day).toBe("bank");

    state = moveTask(state, taskId, "mon");
    expect(state.tasks[0].day).toBe("mon");
  });

  it("resets week completion", () => {
    let state = load();
    state = addLanguage(state, { language: "de", level: "A1", goal: "x", dailyMinutes: 15, weeklyTarget: 30, activeDays: ["sat"] });
    const langId = state.activeLanguageId!;
    state = addTask(state, { languageId: langId, day: "sat", category: "vocab", title: "t", duration: 10 });
    state = toggleTask(state, state.tasks[0].id);
    expect(state.tasks[0].completed).toBe(true);

    state = resetWeek(state);
    expect(state.tasks[0].completed).toBe(false);
  });
});
