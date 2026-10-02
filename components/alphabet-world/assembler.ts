// ============================================================
//  Alphabet World — Response assembly animation
//  متن جواب → حروف لازم → پرواز به اسلات‌ها → مونتاژ کلمات.
//  همه‌چیز با textContent اجرا می‌شود (ضد XSS).
// ============================================================

import type { LetterProfile } from "./types";
import type { LetterAgent, World } from "./world";

const PUNCT = new Set([
  ".", ",", "!", "?", ";", ":", "…", "„", "“", "”", '"', "'", "-", "–", "(", ")",
]);

interface Slot {
  span: HTMLSpanElement;
  char: string;
}

export class Assembler {
  private world: World;
  private layer: HTMLDivElement;
  private profileMap: Map<string, LetterProfile>;
  onWordTap: ((word: string, el: HTMLSpanElement) => void) | null = null;

  card: HTMLDivElement | null = null;
  private flyers: { agent: LetterAgent; slot: Slot }[] = [];
  private timers: number[] = [];

  constructor(opts: {
    world: World;
    layer: HTMLDivElement;
    profileMap: Map<string, LetterProfile>;
    onWordTap?: (word: string, el: HTMLSpanElement) => void;
  }) {
    this.world = opts.world;
    this.layer = opts.layer;
    this.profileMap = opts.profileMap;
    this.onWordTap = opts.onWordTap ?? null;
  }

  clear() {
    for (const id of this.timers) window.clearTimeout(id);
    this.timers = [];
    for (const f of this.flyers) {
      f.agent.el.style.transition = "";
      f.agent.el.style.zIndex = "";
      f.agent.el.style.opacity = "";
      f.agent.release();
    }
    this.flyers = [];
    // حذف حروف موقتی که برای این پاسخ ساخته شده بودند
    this.world.despawnTemp();
    if (this.card) {
      this.card.remove();
      this.card = null;
    }
  }

  thinking(label: string) {
    this.clear();
    const card = document.createElement("div");
    card.className = "aw-response-card";
    const head = document.createElement("div");
    head.className = "aw-response-head";
    const tag = document.createElement("div");
    tag.className = "aw-response-tag";
    const dot = document.createElement("span");
    dot.className = "aw-dot";
    tag.append(dot, document.createTextNode(label));
    head.appendChild(tag);
    const think = document.createElement("div");
    think.className = "aw-thinking";
    const spinner = document.createElement("span");
    spinner.className = "aw-spinner";
    think.append(spinner, document.createTextNode(""));
    card.append(head, think);
    this.layer.appendChild(card);
    requestAnimationFrame(() => card.classList.add("aw-show"));
    this.card = card;
  }

  // ساخت کارت با حروف پنهان، سپس پرواز عامل‌ها به اسلات‌ها
  async assemble(
    text: string,
    opts: { tag: string; hint: string; closeLabel: string }
  ) {
    if (this.card) {
      this.card.remove();
      this.card = null;
    }

    const card = document.createElement("div");
    card.className = "aw-response-card";

    const head = document.createElement("div");
    head.className = "aw-response-head";
    const tag = document.createElement("div");
    tag.className = "aw-response-tag";
    const dot = document.createElement("span");
    dot.className = "aw-dot";
    tag.append(dot, document.createTextNode(opts.tag));
    const closeBtn = document.createElement("button");
    closeBtn.className = "aw-response-close";
    closeBtn.setAttribute("aria-label", opts.closeLabel);
    closeBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    closeBtn.onclick = () => this.clear();
    head.append(tag, closeBtn);

    const asm = document.createElement("div");
    asm.className = "aw-assembly";
    asm.dir = "ltr";

    const hint = document.createElement("div");
    hint.className = "aw-assembly-hint";
    hint.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>';
    hint.append(document.createTextNode(" " + opts.hint));

    card.append(head, asm, hint);
    this.layer.appendChild(card);
    this.card = card;

    const words = text.split(/(\s+)/);
    const slots: Slot[] = [];

    const makeChars = (str: string, container: HTMLElement) => {
      for (const ch of str) {
        if (PUNCT.has(ch) || ch === " ") {
          const p = document.createElement("span");
          p.className = "aw-a-punct";
          p.textContent = ch;
          container.appendChild(p);
        } else {
          const span = document.createElement("span");
          span.className = "aw-a-letter";
          span.textContent = ch;
          span.style.opacity = "0";
          const prof = this.profileMap.get(ch) ?? this.profileMap.get(ch.toUpperCase());
          span.style.color = prof ? prof.hue : "var(--aw-ink)";
          container.appendChild(span);
          slots.push({ span, char: ch });
        }
      }
    };

    for (const token of words) {
      if (/^\s+$/.test(token)) {
        asm.appendChild(document.createTextNode(" "));
        continue;
      }
      const wordSpan = document.createElement("span");
      wordSpan.className = "aw-a-wordspan";
      const m = token.match(/^([^\wäöüÄÖÜß]*)([\wäöüÄÖÜß'’-]*)([^\wäöüÄÖÜß]*)$/u);
      const lead = m ? m[1] : "";
      const core = m ? m[2] : token;
      const trail = m ? m[3] : "";

      if (lead) makeChars(lead, wordSpan);
      if (core) {
        const clickable = document.createElement("span");
        clickable.className = "aw-a-word";
        clickable.dataset.word = core;
        makeChars(core, clickable);
        clickable.onclick = () => this.onWordTap?.(core, clickable);
        wordSpan.appendChild(clickable);
      }
      if (trail) makeChars(trail, wordSpan);
      asm.appendChild(wordSpan);
    }

    requestAnimationFrame(() => card.classList.add("aw-show"));

    await new Promise((r) => {
      this.timers.push(window.setTimeout(r, 60));
    });
    await this.flyLetters(slots);
  }

  private async flyLetters(slots: Slot[]) {
    const worldRect = this.world.layer.getBoundingClientRect();
    let delay = 0;
    const step = Math.max(45, Math.min(120, 900 / Math.max(slots.length, 1)));

    for (const slot of slots) {
      const agent = this.world.acquire(slot.char, this.profileMap);
      const target = slot.span.getBoundingClientRect();
      if (!agent) {
        slot.span.style.opacity = "1";
        continue;
      }
      const tx = target.left - worldRect.left + target.width / 2 - 23;
      const ty = target.top - worldRect.top + target.height / 2 - 23;

      this.flyers.push({ agent, slot });

      ((a: LetterAgent, TX: number, TY: number, s: Slot, d: number) => {
        this.timers.push(
          window.setTimeout(() => {
            a.el.style.zIndex = "44";
            a.el.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)";
            a.el.style.transform = `translate3d(${TX}px,${TY}px,0) rotate(0deg) scale(.86)`;
            this.timers.push(
              window.setTimeout(() => {
                s.span.style.opacity = "1";
                s.span.animate(
                  [
                    { transform: "scale(.4)", opacity: 0 },
                    { transform: "scale(1.18)" },
                    { transform: "scale(1)", opacity: 1 },
                  ],
                  { duration: 340, easing: "cubic-bezier(.2,1.4,.4,1)" }
                );
                a.el.animate([{ opacity: 1 }, { opacity: 0 }], {
                  duration: 220,
                  fill: "forwards",
                });
                this.timers.push(
                  window.setTimeout(() => {
                    a.el.style.transition = "";
                    a.el.style.zIndex = "";
                    a.el.style.opacity = "";
                    // ادامه حرکت از نقطه مونتاژ (بدون پرش)
                    a.x = TX;
                    a.y = TY;
                    a.release();
                  }, 240)
                );
              }, 720)
            );
          }, d)
        );
      })(agent, tx, ty, slot, delay);

      delay += step;
    }

    await new Promise((r) => {
      this.timers.push(window.setTimeout(r, delay + 1100));
    });
  }
}
