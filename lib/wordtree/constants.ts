/**
 * Word Tree — Constants (نسخه ۱۲.۰)
 *
 * ⚠️ تغییرات نسخه ۱۲.۰:
 * - STATE_VERSION به 13 آپدیت شد (treeIds)
 */

// ─────────────────────────────────────────────────────────────
// تنظیمات اصلی بازی
// ─────────────────────────────────────────────────────────────

export const DAILY_WORDS = 5;
export const MAX_DAILY_WORDS = 15;

// ─────────────────────────────────────────────────────────────
// زبان
// ─────────────────────────────────────────────────────────────

export const DEFAULT_TARGET_LANGUAGE = "de";
export const SUPPORTED_LANGUAGES = ["de"];

// ─────────────────────────────────────────────────────────────
// آستانه‌های سطح درخت
// ─────────────────────────────────────────────────────────────

export const WORDS_TO_YOUNG = 50;
export const WORDS_TO_MATURE = 150;
export const WORDS_TO_ANCIENT = 400;

// ─────────────────────────────────────────────────────────────
// اقتصاد بازی
// ─────────────────────────────────────────────────────────────

export const COIN_PER_GOLDEN_FRUIT = 1;
export const COIN_PER_SPECIAL_FRUIT = 3;

// ─────────────────────────────────────────────────────────────
// جوایز افزودن کلمه
// ─────────────────────────────────────────────────────────────

export const REWARD_CUSTOM_WORD = 5;
export const REWARD_COMMUNITY_WORD = 15;
export const REWARD_COMMUNITY_SEED = 1;
export const MAX_DAILY_REWARD = 50;
export const MAX_CUSTOM_WORDS = 500;

// ─────────────────────────────────────────────────────────────
// Spaced Repetition
// ─────────────────────────────────────────────────────────────

export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30];
export const MAX_REVIEW_STAGE = REVIEW_INTERVALS.length - 1;

// ─────────────────────────────────────────────────────────────
// تنظیمات ذخیره‌سازی
// ─────────────────────────────────────────────────────────────

export const STORAGE_KEY = "wordtree_game_state_v1";
export const CUSTOM_WORDS_STORAGE_KEY = "wordtree_custom_words_v1";
export const USER_STATS_STORAGE_KEY = "wordtree_user_stats_v1";
export const STATE_VERSION = 13;

// ─────────────────────────────────────────────────────────────
// زمان‌ها
// ─────────────────────────────────────────────────────────────

export const WATERING_COOLDOWN = 24 * 60 * 60 * 1000;
export const FRUIT_RIPEN_TIME = 24 * 60 * 60 * 1000;
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// ایمپورت گروهی
// ─────────────────────────────────────────────────────────────

export const MAX_IMPORT_WORDS = 500;
export const REWARD_IMPORTED_WORD = 3;
export const MAX_DAILY_IMPORT_REWARD = 100;
export const IMPORT_FILE_VERSION = "1.0";

// ─────────────────────────────────────────────────────────────
// میوه‌ی نقره‌ای (آزمون)
// ─────────────────────────────────────────────────────────────

export const SILVER_FRUIT_INTERVAL = 20;
export const QUIZ_QUESTIONS_COUNT = 5;
export const QUIZ_PASS_THRESHOLD = 4;
export const QUIZ_REWARD_COINS = 10;
export const QUIZ_REWARD_SEED = 1;

// ─────────────────────────────────────────────────────────────
// تمرین املا (Spelling)
// ─────────────────────────────────────────────────────────────

export const SPELLING_EASY_BLANK_COUNT = 1;
export const SPELLING_MEDIUM_BLANK_COUNT = 2;
export const SPELLING_HARD_BLANK_COUNT = 3;
export const SPELLING_OPTIONS_PER_BLANK = 4;

// ─────────────────────────────────────────────────────────────
// کاشت درخت
// ─────────────────────────────────────────────────────────────

export const TREE_TYPES = [
  {
    id: "default-de",
    icon: "🇩🇪",
    nameKey: "treeTypeDefault",
    descKey: "treeTypeDefaultDesc",
    wordCount: 50,
    isCustom: false,
  },
  {
    id: "custom",
    icon: "➕",
    nameKey: "treeTypeCustom",
    descKey: "treeTypeCustomDesc",
    wordCount: 0,
    isCustom: true,
  },
] as const;

export const DEFAULT_TREE_TYPE = "default-de";
export const CUSTOM_TREE_TYPE = "custom";

// ─────────────────────────────────────────────────────────────
// باغچه (Plot)
// ─────────────────────────────────────────────────────────────

export const DEFAULT_PLOT_NAME = "باغ من";
export const MAX_TREES_PER_PLOT = 50;
export const MAX_PLOTS = 20;

// ─────────────────────────────────────────────────────────────
// تم باغچه و شکل درخت
// ─────────────────────────────────────────────────────────────

export const PLOT_THEMES = [
  { id: "default", icon: "🌿", nameKey: "plotThemeDefault" },
] as const;

export const DEFAULT_PLOT_THEME = "default";

export const TREE_VARIANTS = [
  { id: "oak", icon: "🌳", nameKey: "treeVariantOak" },
] as const;

export const DEFAULT_TREE_VARIANT = "oak";

// ─────────────────────────────────────────────────────────────
// Snapshot
// ─────────────────────────────────────────────────────────────

export const MAX_SNAPSHOTS = 5;
export const SNAPSHOT_INTERVAL_MS = 24 * 60 * 60 * 1000;