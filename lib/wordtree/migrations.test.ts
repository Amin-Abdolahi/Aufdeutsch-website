import { describe, it, expect } from "vitest";
import { runMigrations } from "./migrations";

// ─── یه state شبیه v13 که با کلمات خالی ذخیره شده (باگ v13) ───
function v13State() {
  return {
    version: 13,
    currentDay: 3,
    hasPlantedTree: true,
    plots: [
      {
        id: "p1",
        name: "باغ من",
        theme: "default",
        createdAt: 1,
        trees: [
          {
            id: "t1",
            name: "درخت",
            variant: "oak",
            level: "young",
            totalWords: 2,
            fruits: [],
            lastWatered: 1,
            wateredToday: false,
            wordsLearnedToday: [],
            dayState: "watering",
            streak: 0,
            createdAt: 1,
          },
        ],
      },
    ],
    words: [
      // کلمه‌ی بدون متن (باگ v13)
      {
        id: "w1",
        language: "de",
        german: "",
        translation: "",
        status: "learning",
        reviewCount: 0,
        reviewStage: 0,
        treeIds: ["t1"],
      },
      {
        id: "w2",
        language: "de",
        german: "der Mann",
        translation: "مرد",
        status: "learning",
        reviewCount: 1,
        reviewStage: 1,
        nextReviewDay: 2,
        treeIds: ["t1"],
      },
    ],
    coins: 0,
  };
}

describe("migration v13 → v14", () => {
  it("repairs empty word text and builds per-tree pools", () => {
    const s = runMigrations(v13State()) as any;

    expect(s.version).toBe(14);

    const tree = s.plots[0].trees[0];
    // pool از کلمات attach شده ساخته می‌شه
    expect(tree.poolWordIds).toEqual(["w1", "w2"]);

    // متن خالی تعمیر شده
    expect(s.words[0].german).toBe("der Mann");
    expect(s.words[0].translation.length).toBeGreaterThan(0);

    // فیلدهای خود کلمه‌ها حفظ شدن
    expect(s.words[1].reviewStage).toBe(1);
    expect(s.currentDay).toBe(3);
  });

  it("falls back to the builtin pool for empty trees", () => {
    const v13 = v13State();
    v13.words = [];
    v13.plots[0].trees[0].totalWords = 0;

    const s = runMigrations(v13) as any;
    const tree = s.plots[0].trees[0];
    expect(tree.poolWordIds).toHaveLength(50);
  });

  it("keeps trees attached to multiple words distinct", () => {
    const v13 = v13State();
    // یه درخت دیگه با فقط w2
    v13.plots[0].trees.push({ ...v13.plots[0].trees[0], id: "t2", name: "درخت ۲" });
    v13.words[1].treeIds = ["t1", "t2"];

    const s = runMigrations(v13) as any;
    expect(s.plots[0].trees[0].poolWordIds).toEqual(["w1", "w2"]);
    expect(s.plots[0].trees[1].poolWordIds).toEqual(["w2"]);
  });
});
