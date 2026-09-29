import { describe, it, expect } from "vitest";
import {
  createInitialState,
  plantTree,
  createTree,
  waterTree,
  harvestFruit,
  startNextDay,
  addWordsToTree,
  getTreeWords,
  getDueReviewWords,
  getWateringsToday,
  getWateringsLeft,
  deleteTree,
  startReview,
} from "./gameLogic";
import { Word, WordEntry } from "./types";
import { WORDS_DE } from "@/data/wordtree/words-de";
import { DAILY_WORDS, MAX_WATERINGS_PER_DAY } from "./constants";

const POOL = WORDS_DE.map((w) => w.id);
const TREE_NAME = "درخت اصلی";

function plant() {
  const state = plantTree(createInitialState(), TREE_NAME, "oak", POOL);
  return { state, treeId: state.plots[0].trees[0].id };
}

function newRuntimeWords(entries: WordEntry[]): Word[] {
  return entries.map((e) => ({
    id: e.id,
    language: e.language,
    german: e.translations.de,
    translation: e.translations.fa,
    status: "new",
    reviewCount: 0,
    reviewStage: 0,
    treeIds: [],
  }));
}

describe("game loop", () => {
  it("plants an empty tree with a word pool, ready to water", () => {
    const { state } = plant();
    const tree = state.plots[0].trees[0];

    expect(state.hasPlantedTree).toBe(true);
    expect(tree.totalWords).toBe(0);
    expect(tree.fruits).toHaveLength(0);
    expect(tree.wateredToday).toBe(false);
    expect(tree.dayState).toBe("watering");
    expect(tree.poolWordIds).toHaveLength(50);
    // کلمه‌ای نباید attach شده باشه
    expect(state.words).toHaveLength(0);
  });

  it("watering attaches words with real text and grows green fruits", () => {
    const { state, treeId } = plant();
    const daily = newRuntimeWords(WORDS_DE.slice(0, 5));

    const s = waterTree(state, treeId, daily);
    const tree = s.plots[0].trees[0];

    expect(tree.wateredToday).toBe(true);
    expect(tree.dayState).toBe("harvesting");
    expect(tree.totalWords).toBe(5);
    expect(tree.fruits).toHaveLength(5);
    expect(tree.fruits.every((f) => f.type === "green" && f.wordId !== "")).toBe(true);
    // باگ قدیمی: کلمات نباید خالی باشن
    expect(getTreeWords(s, treeId).every((w) => w.german.length > 0)).toBe(true);
  });

  it("harvest applies spaced repetition and completes the day", () => {
    const { state, treeId } = plant();
    const daily = newRuntimeWords(WORDS_DE.slice(0, 5));
    let s = waterTree(state, treeId, daily);

    const tree = () => s.plots[0].trees[0];
    const fruitWordId = tree().fruits[0].wordId;
    const firstFruitId = tree().fruits[0].id;

    // ─── اولین چیدن: stage 1، بدون سکه ───
    s = harvestFruit(s, treeId, firstFruitId, true);
    const word = s.words.find((w) => w.id === fruitWordId)!;
    expect(word.reviewCount).toBe(1);
    expect(word.reviewStage).toBe(1);
    expect(word.status).toBe("learning");
    expect(word.nextReviewDay).toBe(s.currentDay + 1);
    expect(s.coins).toBe(0);

    // ─── چیدن بقیه → روز تموم می‌شه ───
    for (const fruit of [...tree().fruits]) {
      s = harvestFruit(s, treeId, fruit.id, true);
    }
    expect(tree().fruits).toHaveLength(0);
    expect(tree().dayState).toBe("completed");
  });

  it("golden stage (3+ reviews) awards a coin", () => {
    const { state, treeId } = plant();
    const entry = WORDS_DE[0];
    const s1 = addWordsToTree(state, treeId, [entry.id], WORDS_DE);
    let s = s1;
    const treeWords = () => s.words.find((w) => w.id === entry.id)!;

    // ─── ۳ بار مرور موفق (هر بار یه میوه‌ی جدید بر اساس stage) ───
    for (let review = 1; review <= 3; review++) {
      s = waterTree(s, treeId, [], [treeWords()]);
      const fruit = s.plots[0].trees[0].fruits[0];
      // رنگ میوه بر اساس stage فعلی کلمه
      expect(fruit.type).toBe(review === 1 ? "green" : "yellow");
      s = harvestFruit(s, treeId, fruit.id, true);
    }

    expect(treeWords().reviewStage).toBe(3);
    expect(treeWords().status).toBe("learned");
    expect(s.coins).toBe(1);
  });

  it("forgotten words reset to stage 0", () => {
    const { state, treeId } = plant();
    const entry = WORDS_DE[0];
    const s1 = addWordsToTree(state, treeId, [entry.id], WORDS_DE);
    const treeWords = (s: ReturnType<typeof addWordsToTree>) =>
      s.words.find((w) => w.id === entry.id)!;

    let s = s1;
    // ۲ مرور موفق → stage 2
    for (let i = 0; i < 2; i++) {
      s = waterTree(s, treeId, [], [treeWords(s)]);
      s = harvestFruit(s, treeId, s.plots[0].trees[0].fruits[0].id, true);
    }
    expect(treeWords(s).reviewStage).toBe(2);

    // فراموش →.stage 0
    s = waterTree(s, treeId, [], [treeWords(s)]);
    s = harvestFruit(s, treeId, s.plots[0].trees[0].fruits[0].id, false);
    expect(treeWords(s).reviewStage).toBe(0);
    expect(treeWords(s).status).toBe("new");
    expect(s.coins).toBe(0);
  });

  it("next day resets watering and schedules reviews", () => {
    const { state, treeId } = plant();
    const daily = newRuntimeWords(WORDS_DE.slice(0, 5));
    let s = waterTree(state, treeId, daily);
    for (const fruit of [...s.plots[0].trees[0].fruits]) {
      s = harvestFruit(s, treeId, fruit.id, true);
    }

    const day0 = s.currentDay;
    s = startNextDay(s, treeId);
    const tree = s.plots[0].trees[0];
    expect(s.currentDay).toBe(day0 + 1);
    expect(tree.wateredToday).toBe(false);
    expect(tree.dayState).toBe("watering");

    // کلمات دیروز رسیده‌ی مرور هستن
    const due = getDueReviewWords(s, treeId);
    expect(due).toHaveLength(5);

    // آبیاری: ۵ کلمه‌ی جدید + ۵ میوه‌ی مرور زرد
    const nextDaily = newRuntimeWords(WORDS_DE.slice(5, 10));
    s = waterTree(s, treeId, nextDaily, due);
    const fruits = s.plots[0].trees[0].fruits;
    expect(fruits).toHaveLength(10);
    expect(fruits.filter((f) => f.type === "green")).toHaveLength(5);
    expect(fruits.filter((f) => f.type === "yellow")).toHaveLength(5);
    expect(getTreeWords(s, treeId)).toHaveLength(10);
  });

  it("addWordsToTree creates unlearned words from entries", () => {
    const { state, treeId } = plant();
    const entry = WORDS_DE[10];

    const s = addWordsToTree(state, treeId, [entry.id], WORDS_DE);
    const treeWords = getTreeWords(s, treeId);
    // باگ قدیمی: سایلنت اسکیپ نمی‌شه، کلمه ساخته می‌شه
    expect(treeWords).toHaveLength(1);
    expect(treeWords[0].german).toBe(entry.translations.de);
    expect(treeWords[0].german.length).toBeGreaterThan(0);
    expect(s.plots[0].trees[0].totalWords).toBe(1);
  });

  it("addWordsToTree without entry skips silently", () => {
    const { state, treeId } = plant();
    const s = addWordsToTree(state, treeId, ["does-not-exist"], WORDS_DE);
    expect(getTreeWords(s, treeId)).toHaveLength(0);
  });

  // ───────────────────────────────────────────────────────────
  // آبیاری چندباره در روز (حداکثر ۲۰ کلمه)
  // ───────────────────────────────────────────────────────────

  it("counts waterings from words learned today", () => {
    const { state, treeId } = plant();
    expect(getWateringsToday(state.plots[0].trees[0])).toBe(0);
    expect(getWateringsLeft(state.plots[0].trees[0])).toBe(
      MAX_WATERINGS_PER_DAY
    );

    let s = waterTree(state, treeId, newRuntimeWords(WORDS_DE.slice(0, 5)));
    expect(getWateringsToday(s.plots[0].trees[0])).toBe(1);
    expect(getWateringsLeft(s.plots[0].trees[0])).toBe(
      MAX_WATERINGS_PER_DAY - 1
    );
  });

  it("allows up to 4 waterings (20 words) per day, then caps", () => {
    const { state, treeId } = plant();
    let s = state;
    let totalWordsLearned = 0;

    for (let w = 0; w < MAX_WATERINGS_PER_DAY; w++) {
      const daily = newRuntimeWords(
        WORDS_DE.slice(totalWordsLearned, totalWordsLearned + DAILY_WORDS)
      );
      s = waterTree(s, treeId, daily);
      totalWordsLearned += DAILY_WORDS;
      // میوه‌ها رو جمع می‌کنیم تا روز قفل نشه
      for (const fruit of [...s.plots[0].trees[0].fruits]) {
        s = harvestFruit(s, treeId, fruit.id, true);
      }
    }

    const tree = s.plots[0].trees[0];
    expect(tree.totalWords).toBe(MAX_WATERINGS_PER_DAY * DAILY_WORDS);
    expect(getWateringsToday(tree)).toBe(MAX_WATERINGS_PER_DAY);
    expect(getWateringsLeft(tree)).toBe(0);

    // آبیاری ۵ُم نباید کلمه‌ی جدید اضافه کنه
    const extra = newRuntimeWords(
      WORDS_DE.slice(totalWordsLearned, totalWordsLearned + DAILY_WORDS)
    );
    const before = tree.totalWords;
    s = waterTree(s, treeId, extra);
    expect(s.plots[0].trees[0].totalWords).toBe(before);
  });

  it("reviews are unlimited and do not consume waterings", () => {
    const { state, treeId } = plant();
    // یه کلمه یاد گرفته و مرحله ۱
    let s = waterTree(state, treeId, newRuntimeWords(WORDS_DE.slice(0, 5)));
    for (const fruit of [...s.plots[0].trees[0].fruits]) {
      s = harvestFruit(s, treeId, fruit.id, true);
    }

    const wateringsBefore = getWateringsToday(s.plots[0].trees[0]);

    // مرور آزاد — نباید آبیاری رو مصرف کنه
    s = startReview(s, treeId);
    expect(getWateringsToday(s.plots[0].trees[0])).toBe(wateringsBefore);
    // یه میوه‌ی نقره‌ای (آزمون) ساخته می‌شه
    expect(s.plots[0].trees[0].fruits.some((f) => f.type === "silver")).toBe(
      true
    );

    // دوباره صدا زدن نباید میوه‌ی تکراری بسازه
    const fruitCount = s.plots[0].trees[0].fruits.length;
    s = startReview(s, treeId);
    expect(s.plots[0].trees[0].fruits.length).toBe(fruitCount);
  });

  // ───────────────────────────────────────────────────────────
  // حذف درخت
  // ───────────────────────────────────────────────────────────

  it("deleteTree removes the tree and its exclusive words", () => {
    const { state, treeId } = plant();
    let s = waterTree(state, treeId, newRuntimeWords(WORDS_DE.slice(0, 5)));
    expect(s.plots[0].trees).toHaveLength(1);
    expect(s.words).toHaveLength(5);

    s = deleteTree(s, treeId);

    expect(s.plots[0].trees).toHaveLength(0);
    // کلماتی که فقط متعلق به این درخت بودن حذف می‌شن
    expect(s.words).toHaveLength(0);
    expect(s.activeTreeId).toBe(null);
  });

  it("deleteTree keeps words shared with other trees", () => {
    const state0 = plantTree(createInitialState(), "درخت ۱", "oak", POOL);
    const tree1Id = state0.plots[0].trees[0].id;
    const entry = WORDS_DE[0];

    // یه کلمه به درخت ۱ اضافه کن
    let s = addWordsToTree(state0, tree1Id, [entry.id], WORDS_DE);

    // درخت ۲ توی همون باغچه با همون استخر
    const tree2 = createTree("درخت ۲", "oak", [entry.id]);
    s = {
      ...s,
      plots: s.plots.map((p) => ({
        ...p,
        trees: [...p.trees, tree2],
      })),
    };
    s = addWordsToTree(s, tree2.id, [entry.id], WORDS_DE);

    const sharedWord = s.words.find((w) => w.id === entry.id)!;
    expect(sharedWord.treeIds).toHaveLength(2);

    // حذف درخت ۱: کلمه باید بمونه (چون درخت ۲ هم داره)
    s = deleteTree(s, tree1Id);
    const remaining = s.words.find((w) => w.id === entry.id);
    expect(remaining).toBeDefined();
    expect(remaining!.treeIds).toHaveLength(1);
    // و درخت ۲ هنوز سر جاشه
    expect(s.plots[0].trees).toHaveLength(1);
    expect(s.plots[0].trees[0].id).toBe(tree2.id);
  });
});
