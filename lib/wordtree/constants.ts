/**
 * Word Tree — Constants (نسخه ۷.۰)
 */

// ─────────────────────────────────────────────────────────────
// تنظیمات اصلی بازی
// ─────────────────────────────────────────────────────────────

export const DAILY_WORDS = 5;
export const MAX_DAILY_WORDS = 15;

// ─────────────────────────────────────────────────────────────
// زبان (نسخه ۷.۰ — چندزبانه)
// ─────────────────────────────────────────────────────────────

/**
 * زبان هدف پیش‌فرض.
 *
 * ⚠️ برای MVP، فقط "de" (آلمانی) داریم.
 * برای فاز ۲، کاربر می‌تونه زبانش رو انتخاب کنه.
 */
export const DEFAULT_TARGET_LANGUAGE = "de";

/**
 * لیست زبان‌های پشتیبانی‌شده (کلمات داخلی).
 */
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
export const STATE_VERSION = 8;

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