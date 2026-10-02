// ============================================================
//  Alphabet World — Animation engine (client-side)
//  حروف زنده‌ای که راه می‌روند، می‌پرند، می‌خوابند…
//  کاملاً مستقل از AI — روی requestAnimationFrame اجرا می‌شود.
// ============================================================

import type { LetterProfile } from "./types";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T>(arr: T[]): T => arr[(Math.random() * arr.length) | 0];
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Mode =
  | "idle"
  | "move"
  | "jump"
  | "sleep"
  | "spin"
  | "wiggle"
  | "play"
  | "ponder"
  | "reserved"
  | "held" // توسط بازی «کلمه بساز» در tray/سیلو نگه داشته — زنده ولی سر جایش
  | "drag"
  | "attract" // جذب شدن به آبنبات (موس)
  | "repel"; // فرار از چوب بدبو

export class LetterAgent {
  id: number;
  profile: LetterProfile;
  char: string;
  world: World;
  el: HTMLDivElement;
  glyph!: HTMLDivElement;

  // physical state
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  rot = 0;
  vrot = 0;
  scale = 1;
  jumpPhase = 0;

  // behaviour state
  mode: Mode = "idle";
  timer: number;
  target: { x: number; y: number } | null = null;
  blinkT: number;
  jumpVel = 140;
  hopT = 0;
  wigT = 0;
  repeatJump = false;

  reserved = false;
  temp = false; // توسط بازی/assembly موقتاً ساخته شده — در cleanup حذف می‌شود

  constructor(profile: LetterProfile, world: World) {
    this.id = ++World.uid;
    this.profile = profile;
    this.char = profile.char;
    this.world = world;
    this.x = rand(30, Math.max(60, world.w - 70));
    this.y = rand(30, Math.max(60, world.h - 70));
    this.timer = rand(0.5, 3);
    this.blinkT = rand(2, 6);
    this.el = this.buildEl();
    this.applyTransform();
  }

  private buildEl(): HTMLDivElement {
    const el = document.createElement("div");
    el.className = "aw-letter";
    el.dataset.char = this.char;
    const glyph = document.createElement("div");
    glyph.className = "aw-glyph";
    glyph.style.background = this.profile.hue;
    glyph.textContent = this.char;
    const eyes = document.createElement("div");
    eyes.className = "aw-eyes";
    const e1 = document.createElement("span");
    e1.className = "aw-eye";
    const e2 = document.createElement("span");
    e2.className = "aw-eye";
    eyes.append(e1, e2);
    glyph.appendChild(eyes);
    el.appendChild(glyph);
    this.glyph = glyph;
    this.world.layer.appendChild(el);
    return el;
  }

  applyTransform() {
    const y = this.y - (this.jumpPhase || 0);
    this.el.style.transform = `translate3d(${this.x}px,${y}px,0) rotate(${this.rot}deg) scale(${this.scale})`;
  }

  // انتخاب رفتار جدید بر اساس شخصیت
  chooseBehaviour() {
    if (this.reserved) return;
    const set = this.profile.idle.length ? this.profile.idle : ["walk"];
    const b = pick(set);
    this.el.classList.remove("aw-zzz");
    switch (b) {
      case "sleep":
        this.mode = "sleep";
        this.timer = rand(3, 7);
        this.el.classList.add("aw-zzz");
        break;
      case "jump":
        this.mode = "jump";
        this.timer = rand(0.6, 1.2);
        this.jumpVel = rand(120, 200);
        break;
      case "spin":
        this.mode = "spin";
        this.timer = rand(1.2, 2.4);
        this.vrot = pick([-180, 180, 240]);
        break;
      case "bounce":
        this.mode = "jump";
        this.timer = rand(1.4, 2.2);
        this.jumpVel = rand(80, 130);
        this.repeatJump = true;
        break;
      case "wiggle":
        this.mode = "wiggle";
        this.timer = rand(1, 1.8);
        this.wigT = 0;
        break;
      case "play":
        this.mode = "play";
        this.timer = rand(1.6, 2.6);
        this.wigT = 0;
        break;
      case "ponder":
        this.mode = "ponder";
        this.timer = rand(1.5, 3);
        break;
      case "wander":
      case "walk":
      default: {
        this.mode = "move";
        this.timer = rand(2, 4.5);
        this.target = {
          x: clamp(this.x + rand(-140, 140), 10, Math.max(20, this.world.w - 60)),
          y: clamp(this.y + rand(-120, 120), 10, Math.max(20, this.world.h - 60)),
        };
      }
    }
  }

  update(dt: number) {
    // پلک زدن — در همه حالت‌ها
    this.blinkT -= dt;
    if (this.blinkT <= 0) {
      this.el.classList.add("aw-blink");
      window.setTimeout(() => this.el.classList.remove("aw-blink"), 130);
      this.blinkT = rand(2.5, 6.5);
    }

    if (this.reserved && this.mode !== "held") {
      this.applyTransform();
      return;
    }

    // نگه‌داشته‌شده توسط بازی: سر جایش می‌ماند ولی نفس می‌کشد
    if (this.mode === "held") {
      const t = performance.now() / 1000;
      this.jumpPhase = Math.sin(t * 2.2 + this.id) * 3;
      this.rot = Math.sin(t * 1.3 + this.id * 0.7) * 3;
      this.applyTransform();
      return;
    }

    // ابزار موس فعال است و cursor روی world است — اگر حرف از حالت
    // تعاملی خارج شده (مثلاً بعد از sleep)، دوباره آن را فعال کن
    const tool = this.world.cursorTool;
    if (
      this.world.cursor &&
      (tool === "lollipop" || tool === "smelly") &&
      this.mode !== "attract" &&
      this.mode !== "repel" &&
      this.mode !== "drag"
    ) {
      this.mode = tool === "lollipop" ? "attract" : "repel";
      this.el.classList.remove("aw-zzz");
    }

    // --- حالت‌های تعاملی بازی «کلمه بساز» ---

    // درگ: حرف دست کاربر است — موقعیت از pointer گرفته می‌شود
    if (this.mode === "drag") {
      this.jumpPhase = Math.abs(Math.sin(performance.now() / 120)) * 4;
      this.applyTransform();
      return;
    }

    // جذب به موس (آبنبات)
    if (this.mode === "attract") {
      if (!this.world.cursor) {
        // موس روی world نیست — به رفتار عادی برگرد
        this.mode = "idle";
        this.timer = rand(0.2, 1);
        this.rot = 0;
      } else {
        const dx = this.world.cursor.x - this.x;
        const dy = this.world.cursor.y - this.y;
        const d = Math.hypot(dx, dy);
        if (d > 26) {
          const sp = 150 * dt;
          this.x += (dx / d) * Math.min(sp, d);
          this.y += (dy / d) * Math.min(sp, d);
          this.rot = Math.atan2(dy, dx) * (180 / Math.PI) * 0.12;
          this.jumpPhase = Math.abs(Math.sin(performance.now() / 110)) * 5;
        } else {
          // رسیدن — می‌چرخه و می‌پره
          this.rot += 220 * dt;
          this.jumpPhase = Math.abs(Math.sin(performance.now() / 90)) * 7;
        }
        this.applyTransform();
        return;
      }
    }

    // فرار از موس (چوب بدبو)
    if (this.mode === "repel") {
      if (!this.world.cursor) {
        // موس روی world نیست — به رفتار عادی برگرد
        this.mode = "idle";
        this.timer = rand(0.2, 1);
        this.rot = 0;
      } else {
        const dx = this.x - this.world.cursor.x;
        const dy = this.y - this.world.cursor.y;
        const d = Math.hypot(dx, dy);
        if (d < 220) {
          const force = (220 - d) / 220; // هرچه نزدیک‌تر، سریع‌تر فرار
          const sp = 260 * force * dt;
          const nx = d > 0.1 ? dx / d : rand(-1, 1);
          const ny = d > 0.1 ? dy / d : rand(-1, 1);
          this.x += nx * Math.min(sp, 90 * force);
          this.y += ny * Math.min(sp, 90 * force);
          // لرزش ترس
          this.rot = Math.sin(performance.now() / 60) * 10 * force;
          this.jumpPhase = Math.abs(Math.sin(performance.now() / 70)) * 9 * force;
        } else {
          this.rot *= 0.9;
          this.jumpPhase *= 0.9;
        }
        this.applyTransform();
        return;
      }
    }

    this.timer -= dt;

    switch (this.mode) {
      case "move": {
        if (!this.target) {
          // target گم شده — به idle برگرد تا رفتار جدید انتخاب کند
          this.mode = "idle";
          this.timer = rand(0.2, 0.8);
          break;
        }
        {
          const dx = this.target.x - this.x;
          const dy = this.target.y - this.y;
          const d = Math.hypot(dx, dy);
          if (d < 4 || this.timer <= 0) {
            this.mode = "idle";
            this.timer = rand(0.3, 1.2);
          } else {
            const sp = 26 * dt;
            this.x += (dx / d) * Math.min(sp, d);
            this.y += (dy / d) * Math.min(sp, d);
            this.jumpPhase = Math.abs(Math.sin(performance.now() / 140)) * 3;
          }
        }
        break;
      }
      case "jump": {
        this.hopT += dt;
        const g = 520;
        this.jumpPhase = Math.max(
          0,
          this.jumpVel * this.hopT - 0.5 * g * this.hopT * this.hopT
        );
        if (this.jumpPhase <= 0 && this.hopT > 0.05) {
          this.hopT = 0;
          if (!this.repeatJump || this.timer <= 0) {
            this.jumpPhase = 0;
            this.mode = "idle";
            this.repeatJump = false;
            this.timer = rand(0.4, 1.2);
          }
        }
        break;
      }
      case "spin": {
        this.rot += this.vrot * dt;
        if (this.timer <= 0) {
          this.mode = "idle";
          this.vrot = 0;
          this.timer = rand(0.4, 1.2);
        }
        break;
      }
      case "wiggle":
      case "play": {
        this.wigT += dt;
        this.rot = Math.sin(this.wigT * 7) * (this.mode === "play" ? 16 : 9);
        if (this.mode === "play")
          this.jumpPhase = Math.abs(Math.sin(this.wigT * 6)) * 8;
        if (this.timer <= 0) {
          this.rot = 0;
          this.jumpPhase = 0;
          this.mode = "idle";
          this.timer = rand(0.4, 1.2);
        }
        break;
      }
      case "sleep": {
        // تنفس آرام + تکان خواب‌آلود ملایم
        const t = performance.now() / 1000;
        this.scale = 1 + Math.sin(t * 1.5 + this.id) * 0.045;
        this.jumpPhase = Math.sin(t * 0.9 + this.id * 0.7) * 1.2;
        this.rot = Math.sin(t * 0.6 + this.id) * 1.5;
        if (this.timer <= 0) {
          this.scale = 1;
          this.rot = 0;
          this.el.classList.remove("aw-zzz");
          this.mode = "idle";
          this.timer = rand(0.5, 1.5);
        }
        break;
      }
      case "ponder": {
        // فکر کردن با تکان ملایمِ بدن
        const pt = performance.now() / 1000;
        this.jumpPhase = Math.sin(pt * 2 + this.id) * 2.5;
        this.rot = Math.sin(pt * 1.4 + this.id * 0.5) * 2;
        if (this.timer <= 0) {
          this.rot = 0;
          this.mode = "idle";
          this.timer = rand(0.4, 1);
        }
        break;
      }
      default: // idle
        this.jumpPhase = Math.sin(performance.now() / 900 + this.id) * 1.5;
        if (this.timer <= 0) this.chooseBehaviour();
    }

    // مرزهای نرم
    this.x = clamp(this.x, -6, Math.max(6, this.world.w - 46));
    this.y = clamp(this.y, -6, Math.max(6, this.world.h - 46));

    this.applyTransform();
  }

  // --- رزرو برای مونتاژ جواب ---
  reserve() {
    this.reserved = true;
    this.mode = "reserved";
    this.el.classList.remove("aw-zzz");
    this.rot = 0;
    this.jumpPhase = 0;
  }
  release() {
    this.reserved = false;
    this.mode = "idle";
    this.timer = rand(0.3, 1.5);
  }
}

export class World {
  static uid = 0;

  layer: HTMLDivElement;
  agents: LetterAgent[] = [];
  byChar = new Map<string, LetterAgent[]>();
  running = false;
  w = 0;
  h = 0;
  // موقعیت موس روی صفحهٔ بازی (برای جاذبه/دفع)
  cursor: { x: number; y: number } | null = null;
  // ابزار فعال: "normal" | "lollipop" | "smelly"
  cursorTool: "normal" | "lollipop" | "smelly" = "normal";
  private last = 0;
  private rafId = 0;

  constructor(layer: HTMLDivElement) {
    this.layer = layer;
    this.resize();
    window.addEventListener("resize", this.resize);
  }

  private resize = () => {
    const r = this.layer.getBoundingClientRect();
    this.w = r.width;
    this.h = r.height;
  };

  populate(letters: LetterProfile[]) {
    for (const p of letters) this.spawn(p, false);
  }

  spawn(profile: LetterProfile, temp = false): LetterAgent {
    const a = new LetterAgent(profile, this);
    a.temp = temp;
    a.el.classList.add("aw-pop");
    window.setTimeout(() => a.el.classList.remove("aw-pop"), 400);
    this.agents.push(a);
    const list = this.byChar.get(a.char) ?? [];
    list.push(a);
    this.byChar.set(a.char, list);
    return a;
  }

  // پیدا کردن یک عامل آزاد برای یک حرف، یا ساخت کپی موقت
  acquire(char: string, profileMap: Map<string, LetterProfile>): LetterAgent | null {
    const key = profileMap.has(char) ? char : char.toUpperCase();
    const list = this.byChar.get(key) || [];
    const free = list.find((a) => !a.reserved);
    let agent: LetterAgent | null = free ?? null;
    if (!agent) {
      const prof = profileMap.get(key);
      if (!prof) return null;
      agent = this.spawn(prof, true); // موقت — در cleanup حذف می‌شود
    }
    agent.reserve();
    return agent;
  }

  // حذف همه عامل‌های موقت (بعد از پایان بازی یا assembly)
  despawnTemp() {
    const keep: LetterAgent[] = [];
    for (const a of this.agents) {
      if (a.temp) {
        a.el.remove();
        const list = this.byChar.get(a.char);
        if (list) {
          const i = list.indexOf(a);
          if (i >= 0) list.splice(i, 1);
        }
      } else keep.push(a);
    }
    this.agents = keep;
  }

  /** ریست کردن موقعیت همه agent‌های غیر‌reserved به نقطه تصادفی داخل canvas */
  private repositionAll() {
    for (const a of this.agents) {
      if (a.reserved) continue;
      a.x = rand(30, Math.max(60, this.w - 70));
      a.y = rand(30, Math.max(60, this.h - 70));
      a.target = null;
      a.mode = "idle";
      a.timer = rand(0.3, 2.5);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;

    // اگه dimensions هنوز صفر یا خیلی کوچیک هستن، صبر می‌کنیم تا layout کامل بشه
    const ensureDimensions = (attempt: number) => {
      this.resize();
      if ((this.w < 100 || this.h < 100) && attempt < 8) {
        requestAnimationFrame(() => ensureDimensions(attempt + 1));
        return;
      }
      // dimensions معتبر — همه حروف رو در کل canvas پخش کن
      this.repositionAll();
      startLoop();
    };

    const startLoop = () => {
      this.last = performance.now();
      const loop = (t: number) => {
        if (!this.running) return;
        let dt = (t - this.last) / 1000;
        this.last = t;
        dt = Math.min(dt, 0.05); // clamp برای پایداری / تعویض تب
        for (const a of this.agents) a.update(dt);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    };

    ensureDimensions(0);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.resize);
  }

  // --- حالت‌های تعاملی موس ---

  // همهٔ حروف به موس جذب می‌شوند (آبنبات)
  attractAll() {
    this.cursorTool = "lollipop";
    for (const a of this.agents) {
      if (!a.reserved) {
        a.mode = "attract";
        a.el.classList.remove("aw-zzz");
      }
    }
  }

  // همه از موس فرار می‌کنند (چوب بدبو)
  repelAll() {
    this.cursorTool = "smelly";
    for (const a of this.agents) {
      if (!a.reserved) {
        a.mode = "repel";
        a.el.classList.remove("aw-zzz");
      }
    }
  }

  // برگشت به رفتار عادی
  releaseAll() {
    this.cursorTool = "normal";
    for (const a of this.agents) {
      if (!a.reserved && (a.mode === "attract" || a.mode === "repel")) {
        a.mode = "idle";
        a.rot = 0;
        a.jumpPhase = 0;
        a.timer = rand(0.2, 1);
      }
    }
  }
}
