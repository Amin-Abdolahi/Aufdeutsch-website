/**
 * Word Tree — Constants (نسخه ۸.۰)
 *
 * ⚠️ تغییرات نسخه ۸.۰:
 * - اضافه شدن ثابت‌های میوه‌ی نقره‌ای
 * - اضافه شدن ثابت‌های تمرین
 * - اضافه شدن ثابت‌های آزمون
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
export const STATE_VERSION = 9;

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

/**
 * هر چند کلمه‌ی جدید، یه میوه‌ی نقره‌ای ظاهر بشه.
 *
 * ⚠️ مثال: اگه `SILVER_FRUIT_INTERVAL = 20` باشه،
 * هر ۲۰ کلمه که کاربر یاد گرفت، یه میوه‌ی نقره‌ای می‌گیره.
 */
export const SILVER_FRUIT_INTERVAL = 20;

/**
 * تعداد سوالات آزمون.
 */
export const QUIZ_QUESTIONS_COUNT = 5;

/**
 * حداقل تعداد جواب درست برای گرفتن جایزه.
 */
export const QUIZ_PASS_THRESHOLD = 4;

/**
 * جایزه‌ی سکه برای قبولی در آزمون.
 */
export const QUIZ_REWARD_COINS = 10;

/**
 * جایزه‌ی بذر برای قبولی در آزمون.
 */
export const QUIZ_REWARD_SEED = 1;

// ─────────────────────────────────────────────────────────────
// تمرین املا (Spelling)
// ─────────────────────────────────────────────────────────────

/**
 * تعداد حروفی که توی تمرین ساده حذف می‌شن.
 */
export const SPELLING_EASY_BLANK_COUNT = 1;

/**
 * تعداد حروفی که توی تمرین متوسط حذف می‌شن.
 */
export const SPELLING_MEDIUM_BLANK_COUNT = 2;

/**
 * حداکثر تعداد حروفی که توی تمرین سخت حذف می‌شن.
 */
export const SPELLING_HARD_BLANK_COUNT = 3;

/**
 * تعداد گزینه‌ها برای هر حرف گم‌شده.
 */
export const SPELLING_OPTIONS_PER_BLANK = 4;