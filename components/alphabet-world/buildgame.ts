// ============================================================
//  Alphabet World — "Build a Word" game
//  حروف پراکنده روی صفحه‌اند؛ کاربر آن‌ها را به drop zone
//  وسط صفحه می‌کشد. دکمهٔ 💡 یک حرف صحیح را نمایش می‌دهد.
// ============================================================

import { lookupWord } from "./words";
import type { LetterAgent, World } from "./world";
import type { LetterProfile } from "./types";

export class BuildGame {
  private world: World;
  private layer: HTMLDivElement;
  private profileMap: Map<string, LetterProfile>;
  private bannerEl: HTMLDivElement | null = null;
  private dropZoneEl: HTMLDivElement | null = null;
  private cleanupFns: Array<() => void> = [];

  active = false;
  target = "";

  // موقعیت پایهٔ هر حرف (برای بازگشت وقتی رها می‌شود خارج از zone)
  private tray: { agent: LetterAgent; baseX: number; baseY: number }[] = [];
  // حروفی که کاربر داخل drop zone گذاشته
  placed: { agent: LetterAgent; char: string }[] = [];
  // همهٔ حروفی که بازی قفل کرده (برای آزادسازی در stop)
  private used: LetterAgent[] = [];
  // در حال درگ
  private dragging: LetterAgent | null = null;
  private dragOff = { x: 0, y: 0 };
  // اندازهٔ drop zone
  private zoneR = 0;
  private zoneCX = 0;
  private zoneCY = 0;

  onScore: ((word: string, meaning: string) => void) | null = null;
  onWrong: ((attempt: string) => void) | null = null;

  constructor(
    world: World,
    layer: HTMLDivElement,
    profileMap: Map<string, LetterProfile>
  ) {
    this.world = world;
    this.layer = layer;
    this.profileMap = profileMap;
  }

  // ============================================================
  //  شروع دور
  // ============================================================
  start(targetWord: string) {
    this.stop();
    this.active = true;
    this.target = targetWord;

    const chars = targetWord.toUpperCase().split("");

    this.tray = [];
    this.used = [];
    const usedSet = new Set<LetterAgent>();

    // حروف کلمه
    for (const ch of chars) {
      const agent = this.acquire(ch);
      if (!agent) continue;
      usedSet.add(agent);
      this.used.push(agent);
      agent.el.classList.add("aw-draggable");
    }

    // حروف فریب‌دهنده
    const extraCount = Math.min(4, Math.max(2, 8 - chars.length));
    const allChars = Array.from(this.profileMap.keys());
    for (let i = 0; i < extraCount && allChars.length; i++) {
      const ch = allChars[(Math.random() * allChars.length) | 0];
      if (chars.includes(ch)) continue;
      const agent = this.acquire(ch);
      if (!agent || usedSet.has(agent)) continue;
      usedSet.add(agent);
      this.used.push(agent);
      agent.el.classList.add("aw-draggable");
    }

    // shuffle کامل
    for (let i = this.used.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [this.used[i], this.used[j]] = [this.used[j], this.used[i]];
    }

    // drop zone: دایرهٔ بزرگ وسط canvas
    this.zoneCX = this.world.w / 2;
    this.zoneCY = this.world.h / 2 + 10;
    this.zoneR = Math.min(this.world.w, this.world.h) * 0.22;
    this.renderDropZone();

    // پخش تصادفی حروف در حلقه‌ای دور drop zone
    // از zone فاصله بگیر تا روی هم نیفتند
    const n = this.used.length;
    const ringR = this.zoneR + 80;  // شعاع حلقه
    this.used.forEach((a, i) => {
      // زاویه‌های یکنواخت + کمی جیتر
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4 - 0.2;
      const r = ringR + Math.random() * 55;
      a.x = this.zoneCX + Math.cos(angle) * r - 26;
      a.y = this.zoneCY + Math.sin(angle) * r - 26;
      // مرزبندی
      a.x = Math.max(10, Math.min(this.world.w - 60, a.x));
      a.y = Math.max(120, Math.min(this.world.h - 110, a.y));
      a.applyTransform();
      this.tray.push({ agent: a, baseX: a.x, baseY: a.y });
    });

    this.attachListeners();
  }

  // ============================================================
  //  drop zone را رندر می‌کند
  // ============================================================
  private renderDropZone() {
    if (this.dropZoneEl) this.dropZoneEl.remove();
    const el = document.createElement("div");
    el.className = "aw-drop-zone";
    el.style.left = `${this.zoneCX - this.zoneR}px`;
    el.style.top = `${this.zoneCY - this.zoneR}px`;
    el.style.width = `${this.zoneR * 2}px`;
    el.style.height = `${this.zoneR * 2}px`;
    this.layer.appendChild(el);
    this.dropZoneEl = el;
  }

  // ============================================================
  //  راهنما: یک حرف صحیح که هنوز placed نشده را flash می‌کند
  // ============================================================
  showHint() {
    // حروف کلمه که هنوز placed نشده‌اند
    const placedChars = this.placed.map((p) => p.char);
    const targetChars = this.target.toUpperCase().split("");
    // ساخت کپی قابل ویرایش و حذف حروف placed
    const remaining = [...targetChars];
    for (const c of placedChars) {
      const idx = remaining.indexOf(c);
      if (idx >= 0) remaining.splice(idx, 1);
    }
    if (remaining.length === 0) return;
    // یکی از حروف باقی‌مانده را پیدا کن
    const hintChar = remaining[0];
    const candidate = this.tray.find(
      (t) => t.agent.char === hintChar && !this.placed.find((p) => p.agent === t.agent)
    );
    if (!candidate) return;
    // flash با کلاس CSS
    candidate.agent.el.classList.add("aw-hint-flash");
    window.setTimeout(() => candidate.agent.el.classList.remove("aw-hint-flash"), 1200);
  }

  // ============================================================
  //  گرفتن حرف از world
  // ============================================================
  private acquire(ch: string): LetterAgent | null {
    const list = this.world.byChar.get(ch) || [];
    const free = list.find((a) => !a.reserved);
    let agent: LetterAgent | null = free ?? null;
    if (!agent) {
      const prof = this.profileMap.get(ch);
      if (!prof) return null;
      agent = this.world.spawn(prof, true);
    }
    agent.reserved = true;
    agent.mode = "held";
    agent.rot = 0;
    agent.jumpPhase = 0;
    agent.el.classList.remove("aw-zzz");
    return agent;
  }

  // ============================================================
  //  رویدادهای pointer
  // ============================================================
  private attachListeners() {
    const layer = this.layer;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const letterEl = target.closest(".aw-letter") as HTMLElement | null;
      if (!letterEl) return;
      const agent = this.world.agents.find((a) => a.el === letterEl);
      if (!agent || !agent.el.classList.contains("aw-draggable")) return;
      e.preventDefault();
      e.stopPropagation();
      this.dragging = agent;
      agent.mode = "drag";
      const r = layer.getBoundingClientRect();
      this.dragOff = {
        x: e.clientX - r.left - agent.x,
        y: e.clientY - r.top - agent.y,
      };
      agent.el.classList.add("aw-dragging");
      try { agent.el.setPointerCapture(e.pointerId); } catch { /* noop */ }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.dragging) return;
      const r = layer.getBoundingClientRect();
      this.dragging.x = e.clientX - r.left - this.dragOff.x;
      this.dragging.y = e.clientY - r.top - this.dragOff.y;
      this.dragging.applyTransform();

      // نمایش بصری: آیا داخل zone هستیم؟
      const cx = this.dragging.x + 26;
      const cy = this.dragging.y + 26;
      const inZone = Math.hypot(cx - this.zoneCX, cy - this.zoneCY) < this.zoneR;
      this.dropZoneEl?.classList.toggle("aw-drop-zone-hover", inZone);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!this.dragging) return;
      const agent = this.dragging;
      this.dragging = null;
      agent.el.classList.remove("aw-dragging");
      this.dropZoneEl?.classList.remove("aw-drop-zone-hover");
      try { agent.el.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      agent.reserved = true;
      agent.mode = "held";

      // آیا مرکز حرف داخل drop zone افتاده؟
      const cx = agent.x + 26;
      const cy = agent.y + 26;
      const inZone = Math.hypot(cx - this.zoneCX, cy - this.zoneCY) < this.zoneR;

      if (inZone) {
        const existing = this.placed.findIndex((p) => p.agent === agent);
        if (existing < 0) {
          this.placed.push({ agent, char: agent.char });
        }
        this.snapPlaced();
        this.checkWord();
      } else {
        // خارج از zone: برگشت به موقعیت پایه یا خروج از placed
        const wasPlaced = this.placed.findIndex((p) => p.agent === agent);
        if (wasPlaced >= 0) {
          this.placed.splice(wasPlaced, 1);
          this.snapPlaced();
        }
        const trayItem = this.tray.find((t) => t.agent === agent);
        if (trayItem) {
          agent.x = trayItem.baseX;
          agent.y = trayItem.baseY;
          agent.applyTransform();
        }
      }
    };

    layer.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    this.cleanupFns.push(
      () => layer.removeEventListener("pointerdown", onPointerDown),
      () => window.removeEventListener("pointermove", onPointerMove),
      () => window.removeEventListener("pointerup", onPointerUp)
    );
  }

  // ============================================================
  //  snap حروف placed در داخل drop zone (یک ردیف افقی وسط)
  // ============================================================
  private snapPlaced() {
    const spacing = 56;
    const total = this.placed.length;
    const startX = this.zoneCX - (spacing * (total - 1)) / 2 - 26;
    const snapY = this.zoneCY - 26;
    this.placed.forEach((p, i) => {
      p.agent.x = startX + i * spacing;
      p.agent.y = snapY;
      p.agent.applyTransform();
    });
  }

  // ============================================================
  //  بررسی کلمه
  // ============================================================
  private checkWord() {
    if (this.placed.length < 2) return;
    const attempt = this.placed.map((p) => p.char).join("");
    const found = lookupWord(attempt);
    if (found) {
      this.celebrate(found.de, found.fa);
    } else if (attempt.length >= 3) {
      this.onWrong?.(attempt);
    }
  }

  // ============================================================
  //  جشن
  // ============================================================
  private celebrate(word: string, meaning: string) {
    if (this.dropZoneEl) { this.dropZoneEl.remove(); this.dropZoneEl = null; }

    for (const a of this.used) {
      a.el.classList.add("aw-celebrate");
      a.jumpVel = 260;
      a.reserved = false;
      a.mode = "jump";
      a.hopT = 0;
      a.timer = 2.5;
    }
    this.used = [];
    this.placed = [];
    this.tray = [];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "aw-confetti";
      p.textContent = ["♥", "★", "✦", "◆"][i % 4];
      p.style.left = `${10 + Math.random() * 80}%`;
      p.style.top = "20%";
      p.style.animationDelay = `${Math.random() * 0.5}s`;
      p.style.color = ["#e8825a", "#f2b544", "#2f9e6b", "#7b6cf6"][i % 4];
      this.layer.appendChild(p);
      window.setTimeout(() => p.remove(), 2200);
    }

    const banner = document.createElement("div");
    banner.className = "aw-build-win";
    banner.dir = "rtl";
    banner.innerHTML = `<div class="aw-build-word" dir="ltr">${word}</div><div class="aw-build-mean">${meaning}</div>`;
    this.layer.appendChild(banner);
    this.bannerEl = banner;
    requestAnimationFrame(() => banner.classList.add("aw-show"));

    this.onScore?.(word, meaning);

    window.setTimeout(() => {
      banner.classList.remove("aw-show");
      window.setTimeout(() => banner.remove(), 400);
    }, 2600);
  }

  // ============================================================
  //  توقف
  // ============================================================
  stop() {
    for (const fn of this.cleanupFns) fn();
    this.cleanupFns = [];

    for (const a of this.used) {
      a.el.classList.remove("aw-draggable", "aw-dragging", "aw-celebrate", "aw-hint-flash");
      if (!a.temp) a.release();
    }
    this.used = [];

    for (const a of this.world.agents) {
      a.el.classList.remove("aw-draggable", "aw-dragging", "aw-celebrate", "aw-hint-flash");
    }

    this.world.despawnTemp();
    this.world.releaseAll();

    if (this.dropZoneEl) { this.dropZoneEl.remove(); this.dropZoneEl = null; }
    if (this.bannerEl) { this.bannerEl.remove(); this.bannerEl = null; }

    this.placed = [];
    this.tray = [];
    this.dragging = null;
    this.active = false;
    this.target = "";
  }
}