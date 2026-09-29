/**
 * Word Tree — Migrations (نسخه ۵.۰)
 *
 * ⚠️ تغییرات نسخه ۵.۰:
 * - اضافه شدن migration از v13 به v14 (poolWordIds)
 * - تعمیر کلماتی که با متن خالی ذخیره شده بودن
 *
 * ⚠️ تاریخچه‌ی نسخه‌ها:
 * - v1 تا v11: ...
 * - v12: ساختار باغچه‌ها
 * - v13: کلمات چند-درختی (treeIds)
 * - v14: استخر کلمات اختصاصی هر درخت (poolWordIds)
 */

import {
  GameState,
  Plot,
  Tree,
  TreeVariant,
  PlotTheme,
  Word,
} from "./types";
import {
  DEFAULT_TARGET_LANGUAGE,
  STATE_VERSION,
  DEFAULT_PLOT_NAME,
  DEFAULT_PLOT_THEME,
  DEFAULT_TREE_VARIANT,
} from "./constants";
import { WORDS_DE } from "@/data/wordtree/words-de";
import { loadCustomWords } from "./customWords";

// ─────────────────────────────────────────────────────────────
// Migrationها (قدیمی — خلاصه‌شده)
// ─────────────────────────────────────────────────────────────

function migrateV7toV8(state: any): any {
  return {
    ...state,
    targetLanguage: state.targetLanguage || DEFAULT_TARGET_LANGUAGE,
    words: (state.words || []).map((w: any) => ({
      ...w,
      language: w.language || DEFAULT_TARGET_LANGUAGE,
    })),
  };
}

function migrateV8toV9(state: any): any {
  return {
    ...state,
    totalWordsLearned:
      state.totalWordsLearned || state.words?.length || 0,
  };
}

function migrateV9toV10(state: any): any {
  return {
    ...state,
    hasSeenTutorial:
      state.hasSeenTutorial ?? (state.words?.length || 0) > 0,
  };
}

function migrateV10toV11(state: any): any {
  return {
    ...state,
    hasPlantedTree:
      state.hasPlantedTree ?? (state.words?.length || 0) > 0,
  };
}

function migrateV11toV12(state: any): any {
  const oldTree = state.tree;
  const oldWords: any[] = state.words || [];

  if (!oldTree || !state.hasPlantedTree) {
    return {
      plots: [],
      activePlotId: null,
      activeTreeId: null,
      words: oldWords,
      coins: state.coins || 0,
      lastPlayed: state.lastPlayed || Date.now(),
      version: STATE_VERSION,
      currentDay: state.currentDay || 1,
      targetLanguage: state.targetLanguage || DEFAULT_TARGET_LANGUAGE,
      totalWordsLearned: state.totalWordsLearned || oldWords.length,
      hasSeenTutorial: state.hasSeenTutorial || false,
      hasPlantedTree: state.hasPlantedTree || false,
      lastSilverFruitAt: state.lastSilverFruitAt,
      dailyRewardHistory: state.dailyRewardHistory,
    };
  }

  const newTree: Tree = {
    id: `tree-migrated-${Date.now()}`,
    name: "درخت اصلی",
    variant: DEFAULT_TREE_VARIANT as TreeVariant,
    level: oldTree.level || "seedling",
    totalWords: oldTree.totalWords || 0,
    fruits: oldTree.fruits || [],
    wordIds: oldWords.map((w) => w.id),
    lastWatered: oldTree.lastWatered,
    wateredToday: state.wateredToday || false,
    wordsLearnedToday: state.wordsLearnedToday || [],
    dayState: state.dayState || "watering",
    streak: oldTree.streak || 0,
    health: oldTree.health || 100,
    createdAt: Date.now(),
  } as any;

  const newPlot: Plot = {
    id: `plot-migrated-${Date.now()}`,
    name: DEFAULT_PLOT_NAME,
    theme: DEFAULT_PLOT_THEME as PlotTheme,
    trees: [newTree],
    createdAt: Date.now(),
  };

  return {
    plots: [newPlot],
    activePlotId: newPlot.id,
    activeTreeId: newTree.id,
    words: oldWords,
    coins: state.coins || 0,
    lastPlayed: state.lastPlayed || Date.now(),
    version: STATE_VERSION,
    currentDay: state.currentDay || 1,
    targetLanguage: state.targetLanguage || DEFAULT_TARGET_LANGUAGE,
    totalWordsLearned: state.totalWordsLearned || oldWords.length,
    hasSeenTutorial: state.hasSeenTutorial || false,
    hasPlantedTree: state.hasPlantedTree || true,
    lastSilverFruitAt: state.lastSilverFruitAt,
    dailyRewardHistory: state.dailyRewardHistory,
  };
}

/**
 * Migration از v12 به v13: treeIds.
 *
 * ⚠️ این migration:
 * ۱. از `Tree.wordIds`، `Word.treeIds` رو می‌سازه.
 * ۲. `wordIds` رو از Tree حذف می‌کنه.
 */
function migrateV12toV13(state: any): GameState {
  const plots: Plot[] = state.plots || [];

  // ─── نگاشت درخت → کلمات ───
  const treeToWords: Record<string, string[]> = {};
  for (const plot of plots) {
    for (const tree of plot.trees as any[]) {
      if (tree.wordIds && Array.isArray(tree.wordIds)) {
        treeToWords[tree.id] = tree.wordIds;
      } else {
        treeToWords[tree.id] = [];
      }
    }
  }

  // ─── ساخت words با treeIds ───
  const oldWords: any[] = state.words || [];
  const newWords: Word[] = oldWords.map((w: any) => {
    const treeIds: string[] = [];
    for (const [treeId, wordIds] of Object.entries(treeToWords)) {
      if (wordIds.includes(w.id)) {
        treeIds.push(treeId);
      }
    }
    return {
      ...w,
      treeIds,
    };
  });

  // ─── حذف wordIds از Tree ───
  const newPlots: Plot[] = plots.map((plot) => ({
    ...plot,
    trees: plot.trees.map((tree: any) => {
      const { wordIds, ...treeWithoutWordIds } = tree;
      return treeWithoutWordIds as Tree;
    }),
  }));

  return {
    ...state,
    plots: newPlots,
    words: newWords,
    version: STATE_VERSION,
  };
}

/**
 * Migration از v13 به v14: poolWordIds.
 *
 * ⚠️ این migration:
 * ۱. برای هر درخت، `poolWordIds` رو از روی کلمات attach شده می‌سازه.
 *    اگه درخت کلمه‌ای نداشت، از WORDS_DE استفاده می‌کنه.
 * ۲. کلماتی که با متن خالی ذخیره شده بودن (باگ v13) رو تعمیر می‌کنه.
 */
function migrateV13toV14(state: any): GameState {
  const words: any[] = state.words || [];
  const customById = new Map(loadCustomWords().map((w) => [w.id, w]));
  const builtinById = new Map(WORDS_DE.map((w) => [w.id, w]));

  // ─── تعمیر کلمات خالی ───
  const repairedWords = words.map((w: any) => {
    if (w.german && w.translation) return w;
    const entry = builtinById.get(w.id) || customById.get(w.id);
    if (!entry) return w;
    return {
      ...w,
      german: entry.translations.de,
      translation: entry.translations.fa || entry.translations.de,
    };
  });

  // ─── ساخت pool برای هر درخت ───
  const plots: Plot[] = (state.plots || []).map((plot: any) => {
    const trees = (plot.trees || []).map((tree: any) => {
      const attachedIds = repairedWords
        .filter((w: any) => Array.isArray(w.treeIds) && w.treeIds.includes(tree.id))
        .map((w: any) => w.id);
      const poolWordIds = attachedIds.length > 0 ? attachedIds : WORDS_DE.map((w) => w.id);
      return { ...tree, poolWordIds };
    });
    return { ...plot, trees };
  });

  return {
    ...state,
    plots,
    words: repairedWords,
    version: STATE_VERSION,
  };
}

// ─────────────────────────────────────────────────────────────
// اجرای migrationها
// ─────────────────────────────────────────────────────────────

export function runMigrations(state: any): GameState {
  let newState: any = { ...state };
  const oldVersion = state.version || 1;

  if (oldVersion < 8) newState = migrateV7toV8(newState);
  if (oldVersion < 9) newState = migrateV8toV9(newState);
  if (oldVersion < 10) newState = migrateV9toV10(newState);
  if (oldVersion < 11) newState = migrateV10toV11(newState);
  if (oldVersion < 12) {
    newState = migrateV11toV12(newState);
  }
  if (oldVersion < 13) {
    newState = migrateV12toV13(newState);
  }
  if (oldVersion < 14) {
    newState = migrateV13toV14(newState);
  }

  newState.version = STATE_VERSION;

  return newState as GameState;
}