import { Fruit, GameState, Plot, Tree, TreeLevel, TreeVariant, Word, WordEntry, QuizResult } from "./types";
import {
  COIN_PER_GOLDEN_FRUIT,
  DEFAULT_PLOT_THEME,
  DEFAULT_TARGET_LANGUAGE,
  DEFAULT_TREE_VARIANT,
  MAX_REVIEW_STAGE,
  QUIZ_REWARD_COINS,
  REVIEW_INTERVALS,
  SILVER_FRUIT_INTERVAL,
  STATE_VERSION,
  WATERING_COOLDOWN,
  WORDS_TO_ANCIENT,
  WORDS_TO_MATURE,
  WORDS_TO_YOUNG,
} from "./constants";

/**
 * آبیاری یه درخت.
 *
 * `newWords`: کلمات جدیدی که توی این آبیاری یاد گرفته می‌شن (سبز).
 * `reviewWords`: کلماتی که رسیده‌ی مرور هستن (رنگ بر اساس stage).
 */
export function waterTree(
  state: GameState,
  treeId: string,
  newWords: Word[],
  reviewWords: Word[] = []
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;
  if (newWords.length === 0 && reviewWords.length === 0) return state;

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

  // ─── میوه‌ی کلمه‌ی جدید (سبز) ───
  const newFruits: Fruit[] = newWords.map((word, index) => ({
    id: `fruit-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: "green",
    createdAt: Date.now(),
    isReady: true,
    isReviewFruit: false,
  }));

  // ─── میوه‌ی مرور (رنگ بر اساس stage کلمه) ───
  const reviewFruits: Fruit[] = reviewWords.map((word, index) => ({
    id: `fruit-review-${word.id}-${Date.now()}-${index}`,
    wordId: word.id,
    type: fruitTypeForStage(word.reviewStage),
    createdAt: Date.now(),
    isReady: true,
    isReviewFruit: true,
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
    fruits: [...tree.fruits, ...newFruits, ...reviewFruits],
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
 *
 * ⚠️ کلماتی که هنوز توی state نیستن، از `entries` ساخته می‌شن.
 * (اگه entry‌ای براشون نبود، سایلنت اسکیپ می‌شن.)
 */
export function addWordsToTree(
  state: GameState,
  treeId: string,
  wordIds: string[],
  entries: WordEntry[] = []
): GameState {
  const tree = getTreeById(state, treeId);
  if (!tree) return state;

  let updatedWords = [...state.words];
  let addedCount = 0;

  for (const wordId of wordIds) {
    const wordIndex = updatedWords.findIndex((w) => w.id === wordId);
    if (wordIndex < 0) {
      // ─── کلمه توی state نیست → از WordEntry بساز ───
      const entry = entries.find((e) => e.id === wordId);
      if (!entry) continue;
      updatedWords.push({ ...toRuntimeWord(entry), treeIds: [treeId] });
      addedCount++;
      continue;
    }
    if (updatedWords[wordIndex].treeIds.includes(treeId)) continue;

    updatedWords[wordIndex] = {
      ...updatedWords[wordIndex],
      treeIds: [...updatedWords[wordIndex].treeIds, treeId],
    };
    addedCount++;
  }

  if (addedCount === 0) return state;

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
 * تبدیل یه WordEntry به کلمه‌ی runtime (با متن واقعی).
 */
export function toRuntimeWord(entry: WordEntry): Word {
  return {
    id: entry.id,
    language: entry.language,
    german: entry.translations.de,
    translation: entry.translations.fa || entry.translations.de,
    status: "new",
    reviewCount: 0,
    reviewStage: 0,
    source: entry.source ?? "builtin",
    treeIds: [],
  };
}

/**
 * رنگ میوه بر اساس مرحله‌ی یادگیری کلمه:
 * - stage 0: سبز (جدید)
 * - stage 1-2: زرد (در حال یادگیری)
 * - stage 3+: طلایی (رسیده)
 */
export function fruitTypeForStage(stage: number): Fruit["type"] {
  if (stage >= 3) return "golden";
  if (stage >= 1) return "yellow";
  return "green";
}

/**
 * کلمات یه درخت که رسیده‌ی مرور هستن:
 * - داخل این درخت هستن،
 * - زمان مرورشون رسیده (nextReviewDay <= currentDay یا هیچ‌وقت مرور نشدن)،
 * - و فعلاً میوه‌ی چیدن‌نشده‌ای روشون ندارن.
 */
export function getDueReviewWords(state: GameState, treeId: string): Word[] {
  const tree = getTreeById(state, treeId);
  if (!tree) return [];

  const fruitWordIds = new Set(tree.fruits.map((f) => f.wordId));

  return state.words.filter(
    (w) =>
      w.treeIds.includes(treeId) &&
      !fruitWordIds.has(w.id) &&
      (w.nextReviewDay === undefined || w.nextReviewDay <= state.currentDay)
  );
}

/**
 * آیا استخر این درخت کلمه‌ی یادنگرفته‌شده داره؟
 */
export function hasNewPoolWords(state: GameState, treeId: string): boolean {
  const tree = getTreeById(state, treeId);
  if (!tree) return false;
  const treeWordIds = new Set(
    state.words.filter((w) => w.treeIds.includes(treeId)).map((w) => w.id)
  );
  return tree.poolWordIds.some((id) => !treeWordIds.has(id));
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
 * تعداد میوه‌های قابل چیدن (همه به جز نقره‌ای).
 */
export function countReadyFruits(state: GameState, treeId: string): number {
  const tree = getTreeById(state, treeId);
  if (!tree) return 0;
  return tree.fruits.filter((f) => f.type !== "silver").length;
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
export function createTree(
  name: string,
  variant: TreeVariant,
  poolWordIds: string[] = []
): Tree {
  return {
    id: `tree-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    variant,
    level: "seedling",
    totalWords: 0,
    poolWordIds,
    fruits: [],
    wateredToday: false,
    wordsLearnedToday: [],
    dayState: "watering",
    streak: 0,
    createdAt: Date.now(),
  };
}

/**
 * کاشتن درخت اول — اولین باغچه + درخت رو می‌سازه
 * و hasPlantedTree رو true می‌کنه.
 *
 * ⚠️ نسخه ۱۴.۰: کلمات دیگه attach نمی‌شن. کلمه‌ها فقط
 * به‌عنوان استخر (poolWordIds) ذخیره می‌شن و با آبیاری
 * یاد گرفته می‌شن.
 */
export function plantTree(
  state: GameState,
  treeName: string,
  variant: TreeVariant,
  poolWordIds: string[]
): GameState {
  const plot = createPlot("باغ من");
  const tree = createTree(treeName, variant, poolWordIds);

  return {
    ...state,
    hasPlantedTree: true,
    plots: [
      {
        ...plot,
        trees: [tree],
      },
    ],
    activePlotId: plot.id,
    activeTreeId: tree.id,
  };
}

/**
 * چیدن یه میوه:
 * ۱. وضعیت مرور کلمه رو آپدیت می‌کنه (spaced repetition).
 * ۲. اگه کلمه به مرحله‌ی طلایی رسید و یادش موند، سکه می‌ده.
 * ۳. میوه رو حذف می‌کنه. اگه میوه‌ای نموند، روز رو «تمام‌شده»
 *    می‌کنه تا دکمه‌ی «روز بعد» ظاهر بشه.
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

  // ─── آپدیت کلمه (SRS) ───
  const word = state.words.find((w) => w.id === fruit.wordId);
  let updatedWords = state.words;
  let coinsEarned = 0;

  if (word) {
    const newStage = remembered
      ? Math.min(word.reviewStage + 1, MAX_REVIEW_STAGE)
      : 0;
    const status: Word["status"] =
      newStage >= 3 ? "learned" : newStage > 0 ? "learning" : "new";

    updatedWords = state.words.map((w) =>
      w.id === fruit.wordId
        ? {
            ...w,
            reviewCount: w.reviewCount + 1,
            lastReviewed: Date.now(),
            reviewStage: newStage,
            nextReviewDay: state.currentDay + REVIEW_INTERVALS[newStage],
            status,
          }
        : w
    );

    // سکه فقط برای کلمه‌ی طلایی (۳ مرور موفق) وقتی یادش موند
    if (remembered && newStage >= 3) {
      coinsEarned = COIN_PER_GOLDEN_FRUIT;
    }
  }

  // ─── حذف میوه + تکمیل روز ───
  const remainingFruits = tree.fruits.filter((f) => f.id !== fruitId);
  const dayState = remainingFruits.length === 0 ? "completed" : tree.dayState;

  return {
    ...updateTree({ ...state, words: updatedWords }, treeId, {
      fruits: remainingFruits,
      dayState,
    }),
    coins: state.coins + coinsEarned,
  };
}

/**
 * شروع روز بعد — یک روز جلو، ریست wateredToday و wordsLearnedToday.
 */
export function startNextDay(state: GameState, treeId: string): GameState {
  return {
    ...updateTree(state, treeId, {
      wateredToday: false,
      wordsLearnedToday: [],
      dayState: "watering",
    }),
    currentDay: state.currentDay + 1,
  };
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

  const remainingFruits = tree.fruits.filter((f) => f.id !== fruitId);
  const dayState = remainingFruits.length === 0 ? "completed" : tree.dayState;

  return {
    ...updateTree(state, treeId, {
      fruits: remainingFruits,
      dayState,
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

