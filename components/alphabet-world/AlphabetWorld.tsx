"use client";

// ============================================================
//  Alphabet World — main React component
//  موتور انیمیشن امپراتیو است، UI کاملاً React (ضد XSS).
// ============================================================

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Assembler } from "./assembler";
import { Store } from "./store";
import { loadByok, type ByokConfig } from "./byok";
import { SettingsSheet } from "./SettingsSheet";
import { buildProfileMap } from "./personalities";
import { World } from "./world";
import { BuildGame } from "./buildgame";
import { lookupWord, pickBuildableWord } from "./words";
import { t } from "./i18n";
import type { LetterProfile, Level, SheetKind, UiLang, VocabEntry } from "./types";
import {
  apiAsk,
  apiExplain,
  RateLimitedError,
  type WordExplanation,
} from "./api";
import "./styles.css";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const FIND_POOL = ["Ä", "E", "N", "S", "R", "Ö", "Ü", "T"];

type CursorMode = "normal" | "lollipop" | "smelly";

interface GameState {
  target: string;
  remaining: number;
  total: number;
}

interface RaceState {
  word: string;          // کلمه هدف (حروف بزرگ)
  letters: string[];     // حروف کلمه به ترتیب
  current: number;       // ایندکس حرف فعلی که باید زده بشه
  agentIds: number[];    // id‌های agent های spawn شده
}

interface MissingState {
  word: string;          // کلمه کامل
  hiddenIdx: number;     // ایندکس حرف مخفی
  options: string[];     // ۴ گزینه حرف
  agentIds: string[];    // کاراکترهای گزینه‌ها
}

interface WordState {
  word: string;
  loading: boolean;
  data: WordExplanation | null;
  error: boolean;
}

export default function AlphabetWorld() {
  const [lang, setLang] = useState<UiLang>("fa");
  const [level, setLevel] = useState<Level>("A1");
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [build, setBuild] = useState<string | null>(null);
  const [race, setRace] = useState<RaceState | null>(null);
  const [missing, setMissing] = useState<MissingState | null>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>("normal");
  const [onboarded, setOnboarded] = useState(false);
  const [input, setInput] = useState("");

  // نمایش به‌روز UI
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [vocab, setVocab] = useState<VocabEntry[]>([]);
  const [word, setWord] = useState<WordState | null>(null);
const [byok, setByok] = useState<ByokConfig | null>(() => loadByok());

  // toast
  const [toast, setToast] = useState<{ msg: string; good: boolean } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // refs امپراتیو
  const worldLayerRef = useRef<HTMLDivElement | null>(null);
  const responseLayerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<World | null>(null);
  const asmRef = useRef<Assembler | null>(null);
  const profileMapRef = useRef<Map<string, LetterProfile>>(new Map());
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);
  const gameRef = useRef<GameState | null>(null);
  const buildRef = useRef<BuildGame | null>(null);
  const buildTargetRef = useRef<string | null>(null);
  const raceRef = useRef<RaceState | null>(null);
  const missingRef = useRef<MissingState | null>(null);
  const cursorModeRef = useRef<CursorMode>(cursorMode);
  const cursorIconRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<UiLang>(lang);
  gameRef.current = game;
  raceRef.current = race;
  missingRef.current = missing;
  cursorModeRef.current = cursorMode;
  langRef.current = lang;

  const s = t(lang);

  // ---------- boot ----------
  useEffect(() => {
    Store.load();
    profileMapRef.current = buildProfileMap();

    const storedLang = (localStorage.getItem("aw.lang") as UiLang | null) ?? "fa";
    setLang(storedLang === "de" ? "de" : "fa");
    setLevel(Store.data.level);
    setXp(Store.data.xp);
    setStreak(Store.data.streak);
    setVocab(Store.data.vocab);
    setOnboarded(Store.data.onboarded);

    const layer = worldLayerRef.current;
    if (!layer) return;

    const world = new World(layer);
    world.populate([...profileMapRef.current.values()]);
    world.start();
    worldRef.current = world;

    asmRef.current = new Assembler({
      world,
      layer: responseLayerRef.current!,
      profileMap: profileMapRef.current,
      onWordTap: (w) => openWordDetail(w),
    });

    const bg = new BuildGame(world, layer, profileMapRef.current);
    bg.onScore = (w, m) => {
      Store.incGamesWon();
      Store.addXP(20);
      setXp(Store.data.xp);
      showToast(t(langRef.current).game.built(w, m), true, 3400);
      // بعد از جشن، ابزار موس را دوباره فعال کن تا حروف جذب/فرار کنند
      window.setTimeout(() => {
        const w2 = worldRef.current;
        if (!w2 || cursorModeRef.current === "normal") return;
        if (cursorModeRef.current === "lollipop") w2.attractAll();
        else w2.repelAll();
      }, 2800);
    };
    bg.onWrong = (a) => {
      showToast(t(langRef.current).game.notWord(a), false, 1800);
    };
    buildRef.current = bg;

    return () => {
      bg.stop();
      world.stop();
      asmRef.current?.clear();
      worldRef.current = null;
      asmRef.current = null;
      buildRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- cursor mode (lollipop / smelly stick) ----------
  useEffect(() => {
    const world = worldRef.current;
    if (world) {
      if (cursorMode === "lollipop") world.attractAll();
      else if (cursorMode === "smelly") world.repelAll();
      else {
        world.releaseAll();
        world.cursor = null;
      }
    }
    const root = rootRef.current;
    if (root) {
      if (cursorMode === "normal") root.removeAttribute("data-aw-cursor");
      else root.setAttribute("data-aw-cursor", cursorMode);
    }
  }, [cursorMode]);

  // وقتی cursor روی world نیست، cursor world را null می‌کنیم تا حروف
  // در وسط صفحه جمع نشوند
  useEffect(() => {
    const layer = worldLayerRef.current;
    if (!layer) return;
    const onLeave = () => {
      const world = worldRef.current;
      if (world && cursorModeRef.current !== "normal") world.cursor = null;
    };
    layer.addEventListener("pointerleave", onLeave);
    return () => layer.removeEventListener("pointerleave", onLeave);
  }, []);

  // ردیابی موس روی دنیا — موقعیت cursor و آیکون
  useEffect(() => {
    const layer = worldLayerRef.current;
    const world = worldRef.current;
    if (!layer || !world) return;

    const onMove = (e: PointerEvent) => {
      if (cursorModeRef.current === "normal") return;
      const r = layer.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      world.cursor = { x, y };
      const icon = cursorIconRef.current;
      if (icon) {
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        icon.style.opacity = "1";
      }
    };    const onLeave = () => {
      world.cursor = null;
    };

    layer.addEventListener("pointermove", onMove);
    layer.addEventListener("pointerleave", onLeave);
    return () => {
      layer.removeEventListener("pointermove", onMove);
      layer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // ---------- toast ----------
  const showToast = useCallback((msg: string, good = false, ms = 2400) => {
    setToast({ msg, good });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), ms);
  }, []);

  // ---------- language ----------
  const toggleLang = () => {
    const next: UiLang = lang === "fa" ? "de" : "fa";
    setLang(next);
    try {
      localStorage.setItem("aw.lang", next);
    } catch {
      /* ignore */
    }
  };

  // ---------- ask ----------
  const ask = useCallback(
    async (qRaw: string) => {
      const q = qRaw.trim();
      if (!q || busy) return;
      setBusy(true);
      asmRef.current?.thinking(s.thinking);
      try {
        const res = await apiAsk(q, level, lang, byok);
        if (!res.text) throw new Error("empty-answer");
        await asmRef.current?.assemble(res.text, {
          tag: res.source === "offline" ? s.offlineTag : s.aiTag,
          hint: s.hint,
          closeLabel: "close",
        });
        Store.addXP(3);
        setXp(Store.data.xp);
        // کلید شخصی کاربر رد شده — دلیل را می‌گوییم و تنظیمات را باز می‌کنیم
        if (res.byokError) {
          showToast(res.byokError, false, 7000);
          setSheet("settings");
        }
      } catch (e) {
        if (e instanceof RateLimitedError) showToast(s.toast.tooMany);
        else showToast(s.toast.error);
        asmRef.current?.clear();
      } finally {
        setBusy(false);
        setInput("");
      }
    },
    [busy, level, lang, s, showToast, byok]
  );

  // ---------- personality bubble ----------
  const showBubble = useCallback((el: HTMLElement, prof: LetterProfile) => {
    if (bubbleRef.current) bubbleRef.current.remove();
    window.clearTimeout(bubbleTimer.current);

    const world = worldLayerRef.current;
    if (!world) return;

    const r = el.getBoundingClientRect();
    const wr = world.getBoundingClientRect();
    const b = document.createElement("div");
    b.className = "aw-bubble";

    const head = document.createElement("b");
    head.textContent = `${prof.char} · ${prof.trait.replace(/-/g, " ")}`;
    const body = document.createElement("span");
    body.textContent = prof.personality[lang];
    b.append(head, body);
    world.appendChild(b);
    bubbleRef.current = b;

    let left = r.left - wr.left + r.width / 2;
    left = Math.max(110, Math.min(wr.width - 110, left));
    b.style.left = `${left}px`;
    b.style.top = `${r.top - wr.top - 8}px`;

    bubbleTimer.current = window.setTimeout(() => {
      b.remove();
      if (bubbleRef.current === b) bubbleRef.current = null;
    }, 3600);
  }, [lang]);

  // stable ref-based tap dispatchers (set after useCallback definitions below)
  const tapDispatchRef = useRef<{
    race: ((el: HTMLElement) => void) | null;
    missing: ((el: HTMLElement) => void) | null;
  }>({ race: null, missing: null });

  // توقف بازی‌های race/missing از داخل توابعی که زودتر تعریف شده‌اند
  const stopExtraGamesRef = useRef<(() => void) | null>(null);

  // ---------- world clicks: game or bubble ----------
  useEffect(() => {
    const layer = worldLayerRef.current;
    if (!layer) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest(".aw-letter") as HTMLElement | null;
      if (!el) return;
      if (gameRef.current) {
        onGameLetterTap(el);
        return;
      }
      if (raceRef.current) {
        tapDispatchRef.current.race?.(el);
        return;
      }
      if (missingRef.current) {
        tapDispatchRef.current.missing?.(el);
        return;
      }
      // بازی «کلمه بساز» خودش کلیک‌ها را مدیریت می‌کند
      if (buildRef.current?.active) return;
      const char = el.dataset.char;
      const prof = profileMapRef.current.get(char ?? "");
      if (!prof) return;
      showBubble(el, prof);
      el.classList.add("aw-pop");
      window.setTimeout(() => el.classList.remove("aw-pop"), 400);
    };

    layer.addEventListener("click", handler);
    return () => layer.removeEventListener("click", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBubble]);

  // ---------- build a word game ----------
  const pickTarget = useCallback((): string | null => {
    const chars = Array.from(profileMapRef.current.keys());
    // جلوگیری از تکرار کلمهٔ قبلی
    let target = pickBuildableWord(chars, 3, 6);
    let tries = 0;
    while (target && target === buildTargetRef.current && tries < 6) {
      target = pickBuildableWord(chars, 3, 6);
      tries++;
    }
    return target;
  }, []);

  const endBuildGame = useCallback(() => {
    buildRef.current?.stop();
    buildTargetRef.current = null;
    setBuild(null);
    // ابزار موس هنوز فعال است — حالت جذب/دفع را دوباره اعمال کن
    const world = worldRef.current;
    if (world && cursorModeRef.current !== "normal") {
      if (cursorModeRef.current === "lollipop") world.attractAll();
      else world.repelAll();
    }
  }, []);

  const nextBuildWord = useCallback(() => {
    const bg = buildRef.current;
    if (!bg) return;
    const target = pickTarget();
    if (!target) {
      endBuildGame();
      return;
    }
    buildTargetRef.current = target;
    bg.start(target);
    setBuild(target);
  }, [pickTarget, endBuildGame]);

  // ---------- find the letter game ----------
  const endFindGame = useCallback(
    (won: boolean) => {
      setGame(null);
      // پاکسازی کلاس‌های بازی از همه حروف
      const layer = worldLayerRef.current;
      if (layer) {
        layer.querySelectorAll(".aw-letter").forEach((e) => {
          e.classList.remove("aw-found", "aw-find-target");
        });
      }
      worldRef.current?.despawnTemp();
      // ابزار موس هنوز فعال است — حالت جذب/دفع را دوباره اعمال کن
      const w = worldRef.current;
      if (w) {
        if (cursorModeRef.current === "lollipop") w.attractAll();
        else if (cursorModeRef.current === "smelly") w.repelAll();
      }
      if (won) {
        Store.incGamesWon();
        Store.addXP(15);
        setXp(Store.data.xp);
        showToast(s.toast.win, true);
      }
    },
    [s.toast.win, showToast]
  );

  const startBuildGame = useCallback(() => {
    const bg = buildRef.current;
    if (!bg) return;
    const target = pickTarget();
    if (!target) return;
    buildTargetRef.current = target;
    setSheet(null);
    setCursorMode("normal");
    stopExtraGamesRef.current?.();
    if (game) endFindGame(false);
    bg.start(target);
    setBuild(target);
  }, [game, pickTarget, endFindGame]);

  const onGameLetterTap = useCallback(
    (el: HTMLElement) => {
      const g = gameRef.current;
      const world = worldRef.current;
      if (!g || !world) return;
      const agent = world.agents.find((a) => a.el === el);
      if (!agent) return;
      if (agent.char !== g.target || el.classList.contains("aw-found")) {
        showToast(s.game.wrong(g.target));
        return;
      }
      el.classList.add("aw-found", "aw-pop");
      el.classList.remove("aw-find-target");
      window.setTimeout(() => el.classList.remove("aw-pop"), 400);
      const remaining = g.remaining - 1;
      setGame({ ...g, remaining });
      if (remaining <= 0) endFindGame(true);
    },
    [endFindGame, s.game, showToast]
  );

  const startFindGame = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const target = FIND_POOL[(Math.random() * FIND_POOL.length) | 0];
    const prof = profileMapRef.current.get(target);
    if (!prof) return;

    // بازی‌های دیگر باید تمام شوند
    if (buildRef.current?.active) endBuildGame();
    stopExtraGamesRef.current?.();

    const existing = (world.byChar.get(target) || []).filter((a) => !a.reserved);
    const agents = [...existing];
    // حداقل ۴ نمونه از حرف هدف — چالش بیشتر
    while (agents.length < 4) agents.push(world.spawn(prof, true));

    // پخش تصادفی حروف target در سراسر canvas
    // (حروف غیر-target از قبل پراکنده‌اند)
    const safeTop = 130;
    const safeBottom = world.h - 110;
    const safeLeft = 30;
    const safeRight = world.w - 80;
    agents.forEach((a, i) => {
      const angle = (i / agents.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const rx = (safeRight - safeLeft) / 2;
      const ry = (safeBottom - safeTop) / 2;
      const cx = safeLeft + rx;
      const cy = safeTop + ry;
      a.x = cx + Math.cos(angle) * rx * (0.5 + Math.random() * 0.45) - 26;
      a.y = cy + Math.sin(angle) * ry * (0.5 + Math.random() * 0.45) - 26;
      a.x = Math.max(safeLeft, Math.min(safeRight, a.x));
      a.y = Math.max(safeTop, Math.min(safeBottom, a.y));
      a.applyTransform();
      // انیمیشن پاپ تا کاربر بفهمه کدوم حروف جدید هستند
      a.el.classList.add("aw-find-target");
    });

    setGame({ target, remaining: agents.length, total: agents.length });
    setSheet(null);
  }, [endBuildGame]);

  // ---------- race game ----------
  const endRaceGame = useCallback((won: boolean) => {
    const world = worldRef.current;
    const r = raceRef.current;
    if (world && r) {
      // پاکسازی highlight
      world.agents.forEach((a) => a.el.classList.remove("aw-race-current", "aw-race-done"));
      // حذف agent های موقت
      world.despawnTemp();
      // ابزار موس هنوز فعال است — حالت جذب/دفع را دوباره اعمال کن
      if (cursorModeRef.current === "lollipop") world.attractAll();
      else if (cursorModeRef.current === "smelly") world.repelAll();
    }
    setRace(null);
    if (won) {
      Store.incGamesWon();
      Store.addXP(20);
      setXp(Store.data.xp);
      showToast(t(langRef.current).game.raceWin, true, 3000);
    }
  }, [showToast]);

  const startRaceGame = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    if (buildRef.current?.active) endBuildGame();
    if (gameRef.current) endFindGame(false);
    setCursorMode("normal");

    // انتخاب کلمه ۳-۵ حرفی از دیکشنری
    const chars = Array.from(profileMapRef.current.keys());
    const word = pickBuildableWord(chars, 3, 5);
    if (!word) return;
    const upper = word.toUpperCase();
    const letters = upper.split("");
    // همه حروف کلمه باید شخصیت‌پذیر باشند، وگرنه بازی گیر می‌کند
    if (!letters.every((ch) => profileMapRef.current.has(ch))) return;

    // spawn یه agent برای هر حرف کلمه (موقت)
    const agentIds: number[] = [];
    const safeTop = 130;
    const safeBottom = world.h - 110;
    const safeLeft = 40;
    const safeRight = world.w - 80;

    letters.forEach((ch, i) => {
      const prof = profileMapRef.current.get(ch);
      if (!prof) return;
      const a = world.spawn(prof, true);
      // پراکنده کردن تصادفی
      const angle = (i / letters.length) * Math.PI * 2 + Math.random() * 0.6;
      const rx = (safeRight - safeLeft) / 2 * 0.8;
      const ry = (safeBottom - safeTop) / 2 * 0.8;
      const cx = safeLeft + (safeRight - safeLeft) / 2;
      const cy = safeTop + (safeBottom - safeTop) / 2;
      a.x = Math.max(safeLeft, Math.min(safeRight, cx + Math.cos(angle) * rx - 26));
      a.y = Math.max(safeTop, Math.min(safeBottom, cy + Math.sin(angle) * ry - 26));
      a.applyTransform();
      a.el.dataset.raceIdx = String(i);
      agentIds.push(a.id);
    });

    // highlight اولین حرف
    const first = world.agents.find(
      (a) => a.el.dataset.raceIdx === "0" && !a.reserved
    );
    first?.el.classList.add("aw-race-current");

    const state: RaceState = { word: upper, letters, current: 0, agentIds };
    setRace(state);
    setSheet(null);
    showToast(t(langRef.current).game.raceTarget(upper), true, 3000);
  }, [endBuildGame, endFindGame, showToast]);

  const onRaceLetterTap = useCallback((el: HTMLElement) => {
    const r = raceRef.current;
    const world = worldRef.current;
    if (!r || !world) return;
    // حروفی که part بازی نیستند (پس‌زمینه عادی) نباید کاربر را جریمه کنند
    const raw = el.dataset.raceIdx;
    if (raw === undefined) return;
    const idx = Number(raw);
    if (isNaN(idx) || idx < 0) return;
    if (idx !== r.current) {
      showToast(t(langRef.current).game.raceWrong, false, 1500);
      world.agents.forEach((a) => {
        a.el.classList.remove("aw-race-done", "aw-race-current");
        if (a.el.dataset.raceIdx === "0") a.el.classList.add("aw-race-current");
      });
      setRace({ ...r, current: 0 });
      return;
    }
    // حرف درست
    el.classList.remove("aw-race-current");
    el.classList.add("aw-race-done");
    const next = r.current + 1;
    if (next >= r.letters.length) {
      endRaceGame(true);
      return;
    }
    showToast(t(langRef.current).game.raceTap(r.letters[idx]), true, 900);
    // highlight بعدی
    world.agents.forEach((a) => {
      if (a.el.dataset.raceIdx === String(next)) a.el.classList.add("aw-race-current");
    });
    setRace({ ...r, current: next });
  }, [endRaceGame, showToast]);

  // ---------- missing game ----------
  const endMissingGame = useCallback((won: boolean) => {
    const world = worldRef.current;
    if (world) {
      world.agents.forEach((a) =>
        a.el.classList.remove("aw-missing-opt", "aw-shake")
      );
      world.despawnTemp();
      if (cursorModeRef.current === "lollipop") world.attractAll();
      else if (cursorModeRef.current === "smelly") world.repelAll();
    }
    setMissing(null);
    if (won) {
      Store.incGamesWon();
      Store.addXP(15);
      setXp(Store.data.xp);
      showToast(t(langRef.current).game.missingWin, true, 3000);
    }
  }, [showToast]);

  const startMissingGame = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    if (buildRef.current?.active) endBuildGame();
    if (gameRef.current) endFindGame(false);
    if (raceRef.current) endRaceGame(false);
    setCursorMode("normal");

    // انتخاب کلمه ۴-۷ حرفی
    const chars = Array.from(profileMapRef.current.keys());
    const word = pickBuildableWord(chars, 4, 7);
    if (!word) return;
    const upper = word.toUpperCase();

    // انتخاب تصادفی یه حرف برای مخفی کردن
    const hiddenIdx = Math.floor(Math.random() * upper.length);
    const hiddenChar = upper[hiddenIdx];

    // ۳ گزینه اشتباه تصادفی
    const allChars = Array.from(profileMapRef.current.keys());
    const wrongs = allChars
      .filter((c) => c !== hiddenChar)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrongs, hiddenChar].sort(() => Math.random() - 0.5);

    // spawn agent برای هر گزینه
    const safeTop = 130;
    const safeBottom = world.h - 110;
    const safeLeft = 40;
    const safeRight = world.w - 80;
    const agentIds: string[] = [];
    options.forEach((ch, i) => {
      const prof = profileMapRef.current.get(ch);
      if (!prof) return;
      const a = world.spawn(prof, true);
      // چیدمان در یه ردیف پایین‌تر با فاصله
      const total = options.length;
      const slotW = (safeRight - safeLeft) / total;
      a.x = safeLeft + slotW * i + slotW / 2 - 26 + (Math.random() - 0.5) * 30;
      a.y = safeTop + (safeBottom - safeTop) * (0.3 + Math.random() * 0.4);
      a.x = Math.max(safeLeft, Math.min(safeRight, a.x));
      a.y = Math.max(safeTop, Math.min(safeBottom, a.y));
      a.applyTransform();
      a.el.dataset.missingChar = ch;
      a.el.classList.add("aw-missing-opt");
      agentIds.push(ch);
    });

    const displayWord = upper.split("").map((c, i) => i === hiddenIdx ? "_" : c).join("");
    setMissing({ word: upper, hiddenIdx, options, agentIds });
    setSheet(null);
    showToast(t(langRef.current).game.missingPrompt(displayWord), true, 4000);
  }, [endBuildGame, endFindGame, endRaceGame, showToast]);

  const onMissingLetterTap = useCallback((el: HTMLElement) => {
    const m = missingRef.current;
    if (!m) return;
    const ch = el.dataset.missingChar;
    if (!ch) return;
    const correct = m.word[m.hiddenIdx];
    if (ch === correct) {
      endMissingGame(true);
    } else {
      showToast(t(langRef.current).game.missingWrong, false, 1500);
      el.classList.add("aw-shake");
      window.setTimeout(() => el.classList.remove("aw-shake"), 500);
    }
  }, [endMissingGame, showToast]);

  // نگه‌داشتن اشاره‌گر پایدار به توابع tap برای استفاده در event listener قدیمی‌تر
  tapDispatchRef.current.race = onRaceLetterTap;
  tapDispatchRef.current.missing = onMissingLetterTap;
  // توقف بازی‌های race/missing هنگام شروع بازی‌های قدیمی‌تر (find/build)
  stopExtraGamesRef.current = () => {
    if (raceRef.current) endRaceGame(false);
    if (missingRef.current) endMissingGame(false);
  };

  // ---------- word detail ----------
  const openWordDetail = useCallback(
    async (w: string) => {
      setSheet("word");
      setWord({ word: w, loading: true, data: null, error: false });
      try {
        const data = await apiExplain(w, level, lang, byok);
        setWord({ word: w, loading: false, data, error: false });
        if (data.byokError) {
          showToast(data.byokError, false, 7000);
          setSheet("settings");
        }
      } catch (e) {
        if (e instanceof RateLimitedError) showToast(s.toast.tooMany);
        setWord({ word: w, loading: false, data: null, error: true });
      }
    },
    [level, lang, s.toast.tooMany, showToast, byok]
  );

  const saveWord = () => {
    if (!word?.data) return;
    const ok = Store.addWord({
      word: word.data.word || word.word,
      article: word.data.article,
      plural: word.data.plural,
      pos: word.data.pos,
      meaning: word.data.meaning,
      example: word.data.example,
    });
    if (ok) {
      setVocab([...Store.data.vocab]);
      setXp(Store.data.xp);
      showToast(s.toast.saved, true);
    }
  };

  const speak = (text: string) => {
    try {
      if (!("speechSynthesis" in window)) {
        showToast(s.toast.audio);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "de-DE";
      u.rate = 0.9;
      const v = speechSynthesis.getVoices().find((x) => x.lang.startsWith("de"));
      if (v) u.voice = v;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {
      showToast(s.toast.audio);
    }
  };

  // ---------- sheets ----------
  const closeSheet = () => {
    setSheet(null);
    setWord(null);
  };

  const chooseLevel = (l: Level) => {
    Store.setLevel(l);
    setLevel(l);
    showToast(s.toast.levelChosen(l), true);
  };

  const deleteWord = (id: string) => {
    Store.removeWord(id);
    setVocab([...Store.data.vocab]);
  };

  // ---------- render ----------
  return (
    <div
      className="aw-root"
      dir={s.dir}
      data-aw-lang={lang}
      data-aw-game={game ? "find" : race ? "race" : missing ? "missing" : build ? "build" : undefined}
      ref={rootRef}
    >
      <div className="aw-app">
        {/* top bar */}
        <header className="aw-topbar">
          <div className="aw-brand">
            <div className="aw-brand-mark">A</div>
            <div>
              <div className="aw-brand-name">{s.brandName}</div>
              <div className="aw-brand-sub">{s.brandSub}</div>
            </div>
          </div>
          <div className="aw-top-actions">
            <button className="aw-chip aw-chip-lang" onClick={toggleLang}>
              {s.langToggle}
            </button>
            <button
              className="aw-chip"
              onClick={() => setSheet("levels")}
              title={s.levelLabel}
            >
              {s.levelLabel}: <b className="aw-lvl">{level}</b>
            </button>
            <button
              className="aw-chip aw-icon"
              onClick={() => setSheet("vocab")}
              title={s.vocabBtn}
              aria-label={s.vocabBtn}
            >
              {s.vocabBtn}
            </button>
            <button
              className="aw-chip aw-icon"
              onClick={() => setSheet("games")}
              title={s.gamesBtn}
              aria-label={s.gamesBtn}
            >
              {s.gamesBtn}
            </button>
            <button
              className="aw-chip aw-icon aw-set-btn"
              onClick={() => setSheet("settings")}
              title={s.settingsBtn}
              aria-label={s.settingsBtn}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              {byok ? <span className="aw-set-on" aria-hidden="true" /> : null}
            </button>
          </div>
        </header>

        {/* world */}
        <div className="aw-world" ref={worldLayerRef}>
          {/* آیکون موس برای ابزارها */}
          {cursorMode !== "normal" && (
            <div
              ref={cursorIconRef}
              className={`aw-cursor-icon ${
                cursorMode === "lollipop" ? "spin" : ""
              }`}
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              {cursorMode === "lollipop" ? "🍭" : "🦨"}
            </div>
          )}

          {/* نوار ابزار: آبنبات / چوب بدبو */}
          <div className="aw-toolbar" role="group" aria-label={s.tools.label}>
            <button
              className={`aw-tool ${cursorMode === "normal" ? "active" : ""}`}
              onClick={() => setCursorMode("normal")}
              title={s.tools.normal}
              aria-label={s.tools.normal}
            >
              ✋
            </button>
            <button
              className={`aw-tool ${
                cursorMode === "lollipop" ? "active" : ""
              }`}
              onClick={() =>
                setCursorMode(cursorMode === "lollipop" ? "normal" : "lollipop")
              }
              title={s.tools.lollipopHint}
              aria-label={s.tools.lollipop}
            >
              🍭
            </button>
            <button
              className={`aw-tool ${cursorMode === "smelly" ? "active" : ""}`}
              onClick={() =>
                setCursorMode(cursorMode === "smelly" ? "normal" : "smelly")
              }
              title={s.tools.smellyHint}
              aria-label={s.tools.smelly}
            >
              🦨
            </button>
          </div>

          {/* نوار بازی «کلمه بساز» */}
          {build && (
            <div className="aw-build-bar">
              <div className="aw-build-hint">
                <span>{s.game.buildHint} </span>
                <b className="aw-build-clue">
                  {lookupWord(build)?.fa ?? s.game.buildBanner}
                </b>
              </div>
              <button
                className="aw-build-btn aw-build-btn-hint"
                onClick={() => buildRef.current?.showHint()}
                title={s.game.buildHintBtn}
                aria-label={s.game.buildHintBtn}
              >
                💡
              </button>
              <button
                className="aw-build-btn primary"
                onClick={nextBuildWord}
              >
                {s.game.buildNext}
              </button>
              <button className="aw-build-btn" onClick={endBuildGame}>
                {s.game.buildStop}
              </button>
            </div>
          )}
        </div>

        {/* game banner */}
        {game && (
          <div className="aw-game-banner">
            <div className="aw-gb-target">{game.target}</div>
            <div className="aw-gb-txt">
              <div className="aw-gb-title">{s.game.bannerTitle(game.target)}</div>
              <div className="aw-gb-sub">{s.game.bannerSub(game.remaining)}</div>
            </div>
            <button
              className="aw-gb-x"
              onClick={() => endFindGame(false)}
              aria-label="close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* race banner */}
        {race && (
          <div className="aw-game-banner aw-race-banner">
            <div className="aw-gb-target">{race.word[race.current]}</div>
            <div className="aw-gb-txt">
              <div className="aw-gb-title">
                {race.letters.map((ch, i) => (
                  <span
                    key={i}
                    className={
                      i < race.current
                        ? "aw-race-letter done"
                        : i === race.current
                        ? "aw-race-letter current"
                        : "aw-race-letter"
                    }
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div className="aw-gb-sub">{s.game.raceTarget(race.word)}</div>
            </div>
            <button className="aw-gb-x" onClick={() => endRaceGame(false)} aria-label="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* missing banner */}
        {missing && (
          <div className="aw-game-banner aw-missing-banner">
            <div className="aw-gb-target">?</div>
            <div className="aw-gb-txt">
              <div className="aw-gb-title aw-missing-word" dir="ltr">
                {missing.word.split("").map((ch, i) => (
                  <span key={i} className={i === missing.hiddenIdx ? "aw-missing-blank" : ""}>
                    {i === missing.hiddenIdx ? "_" : ch}
                  </span>
                ))}
              </div>
              <div className="aw-gb-sub">{s.game.missingPrompt(
                missing.word.split("").map((c, i) => i === missing.hiddenIdx ? "_" : c).join("")
              )}</div>
            </div>
            <button className="aw-gb-x" onClick={() => endMissingGame(false)} aria-label="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* response layer */}
        <div className="aw-response-layer" ref={responseLayerRef} />

        {/* composer */}
        <div className="aw-composer">
          <div className="aw-suggestions">
            {s.suggestions.map((sg) => (
              <button
                key={sg}
                className="aw-sugg"
                dir="auto"
                onClick={() => {
                  setInput(sg);
                  ask(sg);
                }}
              >
                {sg}
              </button>
            ))}
          </div>
          <div className="aw-composer-inner">
            <input
              className="aw-input"
              dir="auto"
              type="text"
              inputMode="text"
              autoComplete="off"
              value={input}
              placeholder={s.composerPlaceholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  ask(input);
                }
              }}
            />
            <button
              className="aw-send-btn"
              onClick={() => ask(input)}
              disabled={busy || !input.trim()}
              aria-label={s.send}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* sheet + scrim */}
      {sheet && <div className="aw-scrim show" onClick={closeSheet} />}
      <div className={`aw-sheet ${sheet ? "show" : ""}`}>
        <div className="aw-sheet-grip" />
        {sheet === "levels" && (
          <LevelsSheet
            s={s}
            level={level}
            xp={xp}
            streak={streak}
            vocabCount={vocab.length}
            onChoose={chooseLevel}
          />
        )}
        {sheet === "vocab" && (
          <VocabSheet s={s} vocab={vocab} onDelete={deleteWord} />
        )}
        {sheet === "games" && (
          <GamesSheet
            s={s}
            onStart={startFindGame}
            onStartBuild={startBuildGame}
            onStartRace={startRaceGame}
            onStartMissing={startMissingGame}
          />
        )}
        {sheet === "settings" && (
          <SettingsSheet
            s={s}
            current={byok}
            onSave={(cfg) => {
              setByok(cfg);
              showToast(s.settings.saved, true);
              setSheet(null);
            }}
            onClear={() => {
              setByok(null);
              showToast(s.settings.cleared, true);
            }}
          />
        )}
        {sheet === "word" && word && (
          <WordSheet
            s={s}
            state={word}
            lang={lang}
            onSave={saveWord}
            onSpeak={speak}
            alreadySaved={word.data ? Store.hasWord(word.data.word || word.word) : false}
          />
        )}
      </div>

      {/* toast */}
      {toast && (
        <div className={`aw-toast show ${toast.good ? "good" : ""}`}>
          {toast.msg}
        </div>
      )}

      {/* onboarding */}
      {!onboarded && (
        <div className="aw-intro">
          <div className="aw-demo">
            <span style={{ background: "#E8825A" }}>H</span>
            <span style={{ background: "#E0A458" }}>A</span>
            <span style={{ background: "#6B9080" }}>L</span>
            <span style={{ background: "#5C9EAD" }}>L</span>
            <span style={{ background: "#9D7BB0" }}>O</span>
          </div>
          <h1>{s.intro.title}</h1>
          <p>{s.intro.body}</p>
          <button
            className="aw-btn aw-btn-primary aw-intro-btn"
            onClick={() => {
              Store.markOnboarded();
              setOnboarded(true);
            }}
          >
            {s.intro.start}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  Sheets
// ============================================================

type Dict = ReturnType<typeof t>;

function LevelsSheet({
  s,
  level,
  xp,
  streak,
  vocabCount,
  onChoose,
}: {
  s: Dict;
  level: Level;
  xp: number;
  streak: number;
  vocabCount: number;
  onChoose: (l: Level) => void;
}) {
  return (
    <>
      <h2>{s.levels.title}</h2>
      <p className="aw-sub">{s.levels.sub}</p>
      <div className="aw-stat-row">
        <div className="aw-stat">
          <div className="aw-num">{xp}</div>
          <div className="aw-lab">{s.stats.xp}</div>
        </div>
        <div className="aw-stat">
          <div className="aw-num">{vocabCount}</div>
          <div className="aw-lab">{s.stats.words}</div>
        </div>
        <div className="aw-stat">
          <div className="aw-num">{streak}</div>
          <div className="aw-lab">{s.stats.streak}</div>
        </div>
      </div>
      <div className="aw-level-grid">
        {LEVELS.map((l) => (
          <div
            key={l}
            className={`aw-level-row ${l === level ? "active" : ""}`}
            onClick={() => onChoose(l)}
          >
            <div className="aw-level-badge">{l}</div>
            <div>
              <div className="aw-level-name">{s.levels.names[l]}</div>
              <div className="aw-level-desc">{s.levels.descs[l]}</div>
            </div>
            <div className="aw-level-check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function VocabSheet({
  s,
  vocab,
  onDelete,
}: {
  s: Dict;
  vocab: VocabEntry[];
  onDelete: (id: string) => void;
}) {
  return (
    <>
      <h2>{s.vocabTitle}</h2>
      <p className="aw-sub">{s.vocab.sub(vocab.length)}</p>
      {vocab.length === 0 ? (
        <div className="aw-empty">{s.vocab.empty}</div>
      ) : (
        <div className="aw-vocab-list">
          {vocab.map((v) => (
            <div className="aw-vocab-item" key={v.id}>
              <div>
                <div className="aw-vocab-word aw-de" dir="ltr">
                  {v.article ? <span className="aw-art">{v.article} </span> : null}
                  {v.word}
                  {v.plural ? (
                    <span className="aw-vocab-plural"> · pl. {v.plural}</span>
                  ) : null}
                </div>
                {v.meaning ? (
                  <div className="aw-vocab-mean">{v.meaning}</div>
                ) : null}
                {v.example ? (
                  <div className="aw-vocab-ex aw-de" dir="ltr">„{v.example}"</div>
                ) : null}
              </div>
              <button
                className="aw-vocab-del"
                onClick={() => onDelete(v.id)}
                aria-label={s.vocab.delete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function GamesSheet({
  s,
  onStart,
  onStartBuild,
  onStartRace,
  onStartMissing,
}: {
  s: Dict;
  onStart: () => void;
  onStartBuild: () => void;
  onStartRace: () => void;
  onStartMissing: () => void;
}) {
  const games: {
    id: string;
    title: string;
    desc: string;
    locked: boolean;
    run: () => void;
  }[] = [
    {
      id: "find",
      title: s.game.titles.find,
      desc: s.game.descs.find,
      locked: false,
      run: onStart,
    },
    {
      id: "build",
      title: s.game.titles.build,
      desc: s.game.descs.build,
      locked: false,
      run: onStartBuild,
    },
    {
      id: "race",
      title: s.game.titles.race,
      desc: s.game.descs.race,
      locked: false,
      run: onStartRace,
    },
    {
      id: "missing",
      title: s.game.titles.missing,
      desc: s.game.descs.missing,
      locked: false,
      run: onStartMissing,
    },
  ];
  return (
    <>
      <h2>{s.game.sheetTitle}</h2>
      <p className="aw-sub">{s.game.sheetSub}</p>
      {games.map((g) => (
        <div
          key={g.id}
          className={`aw-game-card ${g.locked ? "locked" : ""}`}
          onClick={g.locked ? undefined : g.run}
        >
          <div className="aw-game-ico">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {g.id === "find" && (
                <>
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </>
              )}
              {g.id === "build" && (
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
              )}
              {g.id === "race" && <path d="M4 20 20 4M14 4h6v6" />}
              {g.id === "missing" && (
                <>
                  <path d="M3 12h4M17 12h4" />
                  <rect x="7" y="8" width="10" height="8" rx="1.5" />
                </>
              )}
            </svg>
          </div>
          <div>
            <div className="aw-game-t">{g.title}</div>
            <div className="aw-game-d">{g.desc}</div>
          </div>
          {g.locked ? (
            <span className="aw-lock-tag">{s.game.soon}</span>
          ) : (
            <span className="aw-game-go">›</span>
          )}
        </div>
      ))}
    </>
  );
}

function WordSheet({
  s,
  state,
  lang,
  onSave,
  onSpeak,
  alreadySaved,
}: {
  s: Dict;
  state: WordState;
  lang: UiLang;
  onSave: () => void;
  onSpeak: (text: string) => void;
  alreadySaved: boolean;
}) {
  if (state.loading) {
    return (
      <>
        <div className="aw-wd-head">
          <div className="aw-wd-glyph">{state.word[0]?.toUpperCase() ?? "?"}</div>
          <div>
            <div className="aw-wd-word aw-de" dir="ltr">{state.word}</div>
            <div className="aw-wd-pos">{s.word.analyzing}</div>
          </div>
        </div>
        <div className="aw-thinking aw-wd-loading">
          <span className="aw-spinner" /> {s.word.thinking}
        </div>
      </>
    );
  }

  if (state.error || !state.data) {
    return (
      <>
        <div className="aw-wd-head">
          <div className="aw-wd-glyph">{state.word[0]?.toUpperCase() ?? "?"}</div>
          <div>
            <div className="aw-wd-word aw-de" dir="ltr">{state.word}</div>
          </div>
        </div>
        <div className="aw-empty">{s.word.offlineMeaning}</div>
      </>
    );
  }

  const d = state.data;
  const block = (label: string, val: string, extra?: ReactNode, de = false) =>
    val ? (
      <div className="aw-wd-block">
        <div className="aw-wd-label">{label}</div>
        <div className={de ? "aw-wd-val aw-de" : "aw-wd-val"} dir={de ? "ltr" : undefined}>
          {val}
        </div>
        {extra}
      </div>
    ) : null;

  return (
    <>
      <div className="aw-wd-head">
        <div className="aw-wd-glyph">{state.word[0]?.toUpperCase() ?? "?"}</div>
        <div>
          <div className="aw-wd-word aw-de" dir="ltr">{d.word || state.word}</div>
          <div className="aw-wd-pos">{s.word.pos[d.pos]}</div>
        </div>
      </div>
      {block(s.word.article, d.article, null, true)}
      {block(s.word.plural, d.plural, null, true)}
      {block(s.word.meaning, d.meaning || s.word.offlineMeaning, null, lang === "de")}
      {block(s.word.conjugation, d.conjugation, null, true)}
      {block(s.word.forms, d.forms, null, true)}
      {block(
        s.word.example,
        d.example ? `„${d.example}"` : "",
        d.exampleTranslation ? (
          <div className={lang === "de" ? "aw-wd-val it aw-de" : "aw-wd-val it"} dir={lang === "de" ? "ltr" : undefined}>
            {d.exampleTranslation}
          </div>
        ) : null,
        true
      )}
      <div className="aw-wd-actions">
        <button
          className="aw-btn aw-btn-ghost"
          onClick={() => onSpeak(d.word || state.word)}
        >
          {s.word.listen}
        </button>
        <button
          className={`aw-btn ${alreadySaved ? "aw-done" : "aw-btn-primary"}`}
          disabled={alreadySaved}
          onClick={onSave}
        >
          {alreadySaved ? s.word.saved : s.word.save}
        </button>
      </div>
    </>
  );
}
