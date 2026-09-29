import { Fruit, GameState, Plot, Tree, TreeLevel, TreeVariant, Word, QuizResult } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  DEFAULT_PLOT_THEME,
  DEFAULT_TARGET_LANGUAGE,
  DEFAULT_TREE_VARIANT,
  FRUIT_RIPEN_TIME,
  QUIZ_REWARD_COINS,
  SILVER_FRUIT_INTERVAL,
  STATE_VERSION,
  WATERING_COOLDOWN,
  WORDS_TO_ANCIENT,
  WORDS_TO_MATURE,
  WORDS_TO_YOUNG,
} from "./constants";

/**
 * آبیاری یه درخت.
 */
export function waterTree(
  state: GameState,
  treeId: string,
  newWords: Word[]
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;

  const totalWordsLearned = state.totalWordsLearned + newWords.length;

  // ─── پردازش کلمات جدید ───
  const updatedWords: Word[] = [...state.words];

  for (const newWord of newWords) {
    const existingIndex = updatedWords.findIndex((w) => w.id === newWord.id);

    if (existingIndex >= 0) {
      const existing = updatedWords[existingIndex];
      if (!existing.treeIds.includes(treeId)) {
        updatedWords[existingIndex] = {
          ...existing,
          treeIds: [...existing.treeIds, treeId],
        };
      }
    } else {
      updatedWords.push({
        ...newWord,
        treeIds: [treeId],
      });
    }
  }

  // ─── محاسبه‌ی totalWords از روی treeIds ───
  const treeWordsCount = updatedWords.filter((w) =>
    w.treeIds.includes(treeId)
  ).length;
  const newLevel = calculateTreeLevel(treeWordsCount);

  // ─── میوه‌های جدید ───
  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: false,
    isReviewFruit: false,
  }));

  let updatedState: GameState = {
    ...state,
    words: updatedWords,
    totalWordsLearned,
    lastPlayed: Date.now(),
  };

  updatedState = updateTree(updatedState, treeId, {
    totalWords: treeWordsCount,
    level: newLevel,
    lastWatered: Date.now(),
    wateredToday: true,
    wordsLearnedToday: [
      ...tree.wordsLearnedToday,
      ...newWords.map((w) => w.id),
    ],
    dayState: "harvesting",
    fruits: [...tree.fruits, ...newFruits],
  });

  if (shouldAwardSilverFruit(updatedState)) {
    const silverFruit = createSilverFruit(updatedState, treeId);
    const updatedTree = getTreeById(updatedState, treeId);
    if (updatedTree) {
      updatedState = updateTree(updatedState, treeId, {
        fruits: [...updatedTree.fruits, silverFruit],
      });
    }
    updatedState = {
      ...updatedState,
      lastSilverFruitAt: totalWordsLearned,
    };
  }

  return updatedState;
}

/**
 * اضافه کردن چند کلمه به یه درخت.
 */
export function addWordsToTree(
  state: GameState,
  treeId: string,
  wordIds: string[]
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;

  let updatedWords = [...state.words];
  let addedCount = 0;

  for (const wordId of wordIds) {
    const wordIndex = updatedWords.findIndex((w) => w.id === wordId);
    if (wordIndex < 0) continue;
    if (updatedWords[wordIndex].treeIds.includes(treeId)) continue;

    updatedWords[wordIndex] = {
      ...updatedWords[wordIndex],
      treeIds: [...updatedWords[wordIndex].treeIds, treeId],
    };
    addedCount++;
  }

  // ─── محاسبه‌ی totalWords از روی treeIds ───
  const treeWordsCount = updatedWords.filter((w) =>
    w.treeIds.includes(treeId)
  ).length;
  const newLevel = calculateTreeLevel(treeWordsCount);

  return updateTree(
    { ...state, words: updatedWords },
    treeId,
    {
      totalWords: treeWordsCount,
      level: newLevel,
    }
  );
}

/**
 * حذف یه کلمه از یه درخت.
 */
export function removeWordFromTree(
  state: GameState,
  treeId: string,
  wordId: string
): GameState {
  const word = state.words.find((w) => w.id === wordId);
  if (!word || !word.treeIds.includes(treeId)) return state;

  const updatedWords = state.words.map((w) =>
    w.id === wordId
      ? { ...w, treeIds: w.treeIds.filter((id) => id !== treeId) }
      : w
  );

  const treeWordsCount = updatedWords.filter((w) =>
    w.treeIds.includes(treeId)
  ).length;
  const newLevel = calculateTreeLevel(treeWordsCount);

  return updateTree(
    { ...state, words: updatedWords },
    treeId,
    {
      totalWords: treeWordsCount,
      level: newLevel,
    }
  );
}

// ─────────────────────────────────────────────────────────────
// توابع کمکی
// ─────────────────────────────────────────────────────────────

/**
 * سطح درخت رو از روی تعداد کلمات محاسبه می‌کنه.
 */
function calculateTreeLevel(treeWordsCount: number): TreeLevel {
  if (treeWordsCount >= WORDS_TO_ANCIENT) return "ancient";
  if (treeWordsCount >= WORDS_TO_MATURE) return "mature";
  if (treeWordsCount >= WORDS_TO_YOUNG) return "young";
  return "seedling";
}

/**
 * یه درخت رو با آیدی پیدا می‌کنه. از بین همه‌ی باغچه‌ها می‌گرده.
 */
export function getTreeById(state: GameState, treeId: string): Tree | undefined {
  for (const plot of state.plots) {
    const tree = plot.trees.find((t) => t.id === treeId);
    if (tree) return tree;
  }
  return undefined;
}

/** فیلدهای قابل آپدیت توسط updateTree */
type TreeUpdateFields = Partial<
  Pick<
    Tree,
    | "totalWords"
    | "level"
    | "lastWatered"
    | "wateredToday"
    | "wordsLearnedToday"
    | "dayState"
    | "fruits"
    | "health"
    | "streak"
  >
>;

/**
 * یه درخت رو آپدیت می‌کنه و یه GameState جدید برمی‌گردونه.
 */
function updateTree(
  state: GameState,
  treeId: string,
  fields: TreeUpdateFields
): GameState {
  return {
    ...state,
    plots: state.plots.map((plot) => ({
      ...plot,
      trees: plot.trees.map((tree) =>
        tree.id === treeId ? { ...tree, ...fields } : tree
      ),
    })),
  };
}

/**
 * آیا باید میوه‌ی نقره‌ای داده بشه؟
 * هر SILVER_FRUIT_INTERVAL کلمه‌ی جدید یه میوه‌ی نقره‌ای.
 */
function shouldAwardSilverFruit(state: GameState): boolean {
  const last = state.lastSilverFruitAt ?? 0;
  return state.totalWordsLearned - last >= SILVER_FRUIT_INTERVAL;
}

/**
 * یه میوه‌ی نقره‌ای (آزمون) می‌سازه.
 */
function createSilverFruit(state: GameState, treeId: string): Fruit {
  return {
    id: `fruit-silver-${treeId}-${Date.now()}`,
    wordId: "",
    type: "silver",
    createdAt: Date.now(),
    isReady: true,
    isReviewFruit: true,
  };
}

// ─────────────────────────────────────────────────────────────
// توابع query / getter — خواندن state
// ─────────────────────────────────────────────────────────────

/**
 * یه باغچه رو با آیدی پیدا می‌کنه.
 */
export function getPlotById(state: GameState, plotId: string): Plot | undefined {
  return state.plots.find((p) => p.id === plotId);
}

/**
 * کلمات یه درخت رو برمی‌گردونه (از روی Word.treeIds).
 */
export function getTreeWords(state: GameState, treeId: string): Word[] {
  return state.words.filter((w) => w.treeIds.includes(treeId));
}

/**
 * کلماتی که هنوز به این درخت اضافه نشدن ولی توی state هستن.
 */
export function getAvailableWordsForTree(
  state: GameState,
  treeId: string
): Word[] {
  return state.words.filter((w) => !w.treeIds.includes(treeId));
}

/**
 * تعداد کلمات لازم تا سطح بعدی درخت.
 */
export function getWordsToNextLevel(
  totalWords: number,
  level: TreeLevel
): number {
  switch (level) {
    case "seedling":
      return Math.max(0, WORDS_TO_YOUNG - totalWords);
    case "young":
      return Math.max(0, WORDS_TO_MATURE - totalWords);
    case "mature":
      return Math.max(0, WORDS_TO_ANCIENT - totalWords);
    default:
      return 0;
  }
}

/**
 * آیا امروز می‌شه این درخت رو آبیاری کرد؟
 */
export function canWaterToday(state: GameState, treeId: string): boolean {
  const tree = getTreeById(state, treeId);
  if (!tree) return false;
  if (tree.wateredToday) return false;
  if (tree.lastWatered) {
    return Date.now() - tree.lastWatered >= WATERING_COOLDOWN;
  }
  return true;
}

/**
 * تعداد میوه‌های آماده‌ی چیدن.
 */
export function countReadyFruits(state: GameState, treeId: string): number {
  const tree = getTreeById(state, treeId);
  if (!tree) return 0;
  return tree.fruits.filter(
    (f) => f.isReady || Date.now() - f.createdAt >= FRUIT_RIPEN_TIME
  ).length;
}

// ─────────────────────────────────────────────────────────────
// توابع اکشن — تغییر state
// ─────────────────────────────────────────────────────────────

/**
 * یه باغچه‌ی جدید می‌سازه (بدون اضافه کردن به state).
 */
export function createPlot(name: string): Plot {
  return {
    id: `plot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    theme: DEFAULT_PLOT_THEME,
    trees: [],
    createdAt: Date.now(),
  };
}

/**
 * یه درخت جدید می‌سازه (بدون اضافه کردن به state).
 */
export function createTree(name: string, variant: TreeVariant): Tree {
  return {
    id: `tree-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    variant,
    level: "seedling",
    totalWords: 0,
    fruits: [],
    wateredToday: false,
    wordsLearnedToday: [],
    dayState: "watering",
    streak: 0,
    createdAt: Date.now(),
  };
}

/**
 * کاشتن درخت اول — اولین باغچه + درخت + کلمات رو می‌سازه
 * و hasPlantedTree رو true می‌کنه.
 */
export function plantTree(
  state: GameState,
  treeName: string,
  variant: TreeVariant,
  wordIds: string[]
): GameState {
  const plot = createPlot("باغ من");
  const tree = createTree(treeName, variant);

  let updatedState: GameState = {
    ...state,
    hasPlantedTree: true,
    plots: [plot],
    activePlotId: plot.id,
    activeTreeId: tree.id,
  };

  // درخت رو به باغچه اضافه کن
  updatedState = updateTree(updatedState, tree.id, {});
  // در واقع باید خود درخت رو به plot.trees اضافه کنیم
  updatedState = {
    ...updatedState,
    plots: updatedState.plots.map((p) =>
      p.id === plot.id ? { ...p, trees: [tree] } : p
    ),
  };

  // کلمات اولیه رو به درخت اضافه کن
  if (wordIds.length > 0) {
    const newWords: Word[] = wordIds.map((id) => ({
      id,
      language: state.targetLanguage,
      german: "",
      translation: "",
      status: "new",
      reviewCount: 0,
      reviewStage: 0,
      treeIds: [tree.id],
    }));
    updatedState = waterTree(updatedState, tree.id, newWords);
  }

  return updatedState;
}

/**
 * چیدن یه میوه — اگه یادآوری موفق بود سکه می‌ده.
 */
export function harvestFruit(
  state: GameState,
  treeId: string,
  fruitId: string,
  remembered: boolean
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;

  const fruit = tree.fruits.find((f) => f.id === fruitId);
  if (!fruit) return state;

  let coinsEarned = 0;
  if (remembered && (fruit.type === "golden" || fruit.type === "orange")) {
    coinsEarned = COIN_PER_GOLDEN_FRUIT;
  }

  return {
    ...updateTree(state, treeId, {
      fruits: tree.fruits.filter((f) => f.id !== fruitId),
    }),
    coins: state.coins + coinsEarned,
  };
}

/**
 * شروع روز بعد — ریست wateredToday و wordsLearnedToday.
 */
export function startNextDay(state: GameState, treeId: string): GameState {
  return updateTree(state, treeId, {
    wateredToday: false,
    wordsLearnedToday: [],
    dayState: "watering",
  });
}

/**
 * تکمیل آزمون — میوه‌ی نقره‌ای رو حذف و سکه می‌ده.
 */
export function completeQuiz(
  state: GameState,
  treeId: string,
  fruitId: string,
  result: QuizResult
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;

  return {
    ...updateTree(state, treeId, {
      fruits: tree.fruits.filter((f) => f.id !== fruitId),
    }),
    coins: state.coins + result.coinsEarned,
  };
}

/**
 * ساخت state اولیه‌ی بازی.
 */
export function createInitialState(): GameState {
  return {
    plots: [],
    activePlotId: null,
    activeTreeId: null,
    words: [],
    coins: 0,
    lastPlayed: Date.now(),
    version: STATE_VERSION,
    currentDay: 0,
    targetLanguage: DEFAULT_TARGET_LANGUAGE,
    totalWordsLearned: 0,
    hasSeenTutorial: false,
    hasPlantedTree: false,
  };
}

