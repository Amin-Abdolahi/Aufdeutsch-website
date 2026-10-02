// ============================================================
//  Alphabet World — local progress store
//  بدون سرور و بدون اکانت؛ پیشرفت در مرورگر کاربر ذخیره
//  می‌شود. لایه را طوری نوشته‌ام که بعداً اضافه کردن سینک
//  ابری فقط یک متد saveToCloud اضافه کند.
// ============================================================

import type { Progress, VocabEntry } from "./types";

const LS_KEY = "alphabetworld.v2";

const DEFAULT: Progress = {
  level: "A1",
  xp: 0,
  streak: 0,
  lastActive: null,
  vocab: [],
  gamesWon: 0,
  onboarded: false,
};

function clone<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}

class StoreClass {
  data: Progress = clone(DEFAULT);

  load(): Progress {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Progress>;
        this.data = { ...clone(DEFAULT), ...parsed, vocab: parsed.vocab ?? [] };
      }
    } catch {
      // داده خراب — با پیش‌فرض شروع کن
    }
    this.touchStreak();
    return this.data;
  }

  save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this.data));
    } catch {
      // storage پر است یا مسدود
    }
  }

  private touchStreak() {
    const today = new Date().toDateString();
    if (this.data.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86_400_000).toDateString();
      this.data.streak = this.data.lastActive === yesterday ? this.data.streak + 1 : 1;
      this.data.lastActive = today;
      this.save();
    }
  }

  // ---- mutations ----
  setLevel(level: Progress["level"]) {
    this.data.level = level;
    this.save();
  }
  addXP(n: number) {
    this.data.xp += n;
    this.save();
  }
  markOnboarded() {
    this.data.onboarded = true;
    this.save();
  }
  incGamesWon() {
    this.data.gamesWon += 1;
    this.save();
  }

  hasWord(word: string): boolean {
    return this.data.vocab.some((v) => v.word.toLowerCase() === word.toLowerCase());
  }
  addWord(entry: Omit<VocabEntry, "id" | "addedAt">): boolean {
    if (this.hasWord(entry.word)) return false;
    this.data.vocab.unshift({
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      addedAt: Date.now(),
    });
    this.addXP(5);
    return true;
  }
  removeWord(id: string) {
    this.data.vocab = this.data.vocab.filter((v) => v.id !== id);
    this.save();
  }
}

export const Store = new StoreClass();
