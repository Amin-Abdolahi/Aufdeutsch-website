---
name: AUF Deutsch
description: German language academy — private online lessons for Persian speakers, from zero to B1 in 6 months.
colors:
  navy-900: "#1B2A44"
  navy-800: "#243758"
  navy-700: "#2D426C"
  paper-100: "#F3ECDD"
  paper-50: "#F9F5EC"
  gold-500: "#B08D3E"
  gold-400: "#C8A65C"
  gold-300: "#D9BE7A"
  red-600: "#B23A2E"
  red-500: "#D14336"
  red-400: "#E25C52"
typography:
  display:
    fontFamily: "Vazirmatn, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Vazirmatn, Arial, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Vazirmatn, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Vazirmatn, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "\"Space Mono\", monospace"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  sm: "2px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.navy-900}"
    textColor: "{colors.paper-100}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.navy-800}"
    textColor: "{colors.paper-100}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.red-600}"
    textColor: "{colors.paper-100}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy-900}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.navy-900}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  badge-default:
    backgroundColor: "{colors.navy-900}"
    textColor: "{colors.paper-100}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  badge-gold:
    backgroundColor: "{colors.gold-500}"
    textColor: "{colors.gold-500}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  badge-red:
    backgroundColor: "{colors.red-600}"
    textColor: "{colors.red-600}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  card:
    backgroundColor: "#ffffff"
    textColor: "{colors.navy-900}"
    rounded: "{rounded.sm}"
    padding: "32px"
  section-navy:
    backgroundColor: "{colors.navy-900}"
    textColor: "{colors.paper-100}"
    padding: "96px 24px"
  section-paper:
    backgroundColor: "{colors.paper-100}"
    textColor: "{colors.navy-900}"
    padding: "80px 24px"
---

# Design System: AUF Deutsch

## Overview

**Creative North Star: "The Travel Notebook"**

AUF Deutsch feels like opening a well-kept travel notebook — the kind a language student carries from Tehran to Berlin and back. Paper-cream grounds, navy-ink headings, gold foil stamps that catch the light, and red-ink corrections that say "we're paying attention." Every surface implies a journey: passport diamonds, washi-tape accents, gently rotated cards as if thumb-tacked to a desk, dot-grid patterns that whisper graph paper.

The voice is warm but precise. Persian leads (RTL, Vazirmatn, measured line-height 1.7), German and English follow in the same bones. Joy comes from tactility — rotation, shadow lift, stamp embossing — not from gradients or neon. Density is generous: large sections (80–96px vertical), 6-column cards, breathing room between testimonial quotes. Motion is restrained: 200ms transitions, subtle hover lifts, no scroll hijacking.

**Key Characteristics:**
- Paper-cream field with navy-ink authority; gold and red only as deliberate accents
- Notebook/passport metaphors: stamps, diamonds, washi tape, dot grids, rotated cards
- RTL-first with true trilingual parity (fa RTL, de/en LTR)
- Generous negative space; typographic rhythm over decorative density
- Tactile, slightly imperfect — rotations, shadows, hand-stamped emblems

## Colors

The palette reads like ink and paper with wax-seal accents.

### Primary

- **Midnight Ink** (#1B2A44): The authority. Header, footer, hero background, primary buttons, section navy, card headings. Must dominate ~60% of any dark section.
- **Ink Lift** (#243758): Hover state for Midnight Ink (button-primary-hover, header hover). Never used as a standalone field.
- **Ink Wash** (#2D426C): Input focus border tie (focus:border-navy-700) and subtle dividers.

### Secondary

- **Stamp Gold** (#B08D3E): Passport stamp, hero highlight scribble, accent underline on nav links, gold card borders. Used at ≤10% of any screen; its rarity is the point.
- **Gold Spark** (#C8A65C): Highlight text in hero ("درست"/"richtig"/"the right way"), interactive gold arrows. Same hue, lifted for legibility on navy.
- **Gold Dust** (#D9BE7A): Lightest shimmer; tape accents, subtle fills on badge-gold.

### Tertiary

- **Correction Red** (#B23A2E): The teacher's pen — error states, secondary CTA, testimonial badge, card accent line. Small doses; never a background field.
- **Red Ember** (#D14336): Hover for Correction Red.
- **Red Coral** (#E25C52): Lightest red, rare — use only where red-600 is too heavy on cream.

### Neutral

- **Notebook Paper** (#F3ECDD): The world. Body background, section default/paper, testimonial shell. Every screen breathes on this.
- **Paper Lift** (#F9F5EC): Slight lift for subtle layering (hover card lift). Near-white but warmer than #fff.
- **Pure White** (#FFFFFF): Card surfaces only — to create lift from paper. Never the page background.
- **Navy at 60% / 40% / 20% / 10% / 5%** (via `/60`, `/40`, etc.): Text muted states, borders, dividers. Never introduce a new gray — these opacities are the gray system.
- **Paper at 60% / 40% with opacity**: Footer muted text (`text-paper-100/60`), hero subtitle (`text-paper-100/80`).

### Named Rules

**The Wax Seal Rule.** Stamp Gold appears on ≤10% of any viewport. If the user sees more than one gold surface per section, you've over-stamped.

**The No Gray Rule.** There is no #6B7280. Muted text and borders use navy or paper with opacity (e.g., `text-navy-900/60`, `border-navy-900/10`). A literal gray token does not exist.

## Typography

**Display/Headline/Title/Body Font:** Vazirmatn (variable, with Arial fallback) — the only body typeface. Its proportional rhythm carries Persian, German, and English alike.
**Label/Mono Font:** Space Mono — monospaced UI spine for buttons, badges, small caps, and the A♦F mark. Not for long reading.

**Character:** Vazirmatn's even color and generous descenders suit RTL at line-height 1.7; Space Mono adds typewriter precision to CTAs and metadata, a nod to the notebook's marginalia. No third family.

### Hierarchy

- **Display** (bold 700, clamp 2.25rem→4.5rem, 1.1, letter-spacing −0.02em): Hero headline only (`text-4xl md:text-6xl lg:text-7xl`). No other element may reach this size.
- **Headline** (bold 700, clamp 1.75rem→3rem, 1.3): Section headings (`text-3xl md:text-4xl`). Used in about, pricing, courses hero.
- **Title** (bold 700, 1.25rem/20px, 1.4): Card titles, teacher names. `text-xl` in code.
- **Body** (400, 1rem, 1.7): Paragraphs. Persian passages inherit this loose leading; keep line length ≤75ch in prose sections. Muted body uses `text-navy-900/70`.
- **Label** (bold 700, 0.875rem, monospace, 0.04em): Buttons (`font-mono`), badges (`text-xs`), metadata, the "EST. 2026" on the stamp. Always Space Mono, always bold. If the label is Persian, Vazirmatn takes over but retains the tighter letter-spacing.
- **Small** (400, 0.875rem/14px, muted): Subtitles, helper text (`text-sm`), footer descriptions. Always muted (`/60` or `/50`).

### Named Rules

**The One Typeface Rule.** Display/Body never leaves Vazirmatn. If a line looks like it needs a different family, change its weight or size instead.

**The Mono Is Not Body Rule.** Space Mono appears only on labels, buttons, badges, and microcopy ≤14px. A paragraph in monospace is a bug.

## Layout

**Grid:** Centered container `max-w-6xl` (1152px) with `px-6` gutters. Inner content uses 12-column grid only where cards demand it; most pages use `flex-col lg:flex-row` or `grid lg:grid-cols-2/3`. The hero uses two-column flex (copy left, paper card right) that stacks at `lg` (1024px).

**Breakpoints:** `md: 768px` (nav switch, section heading scale, grid reflow), `lg: 1024px` (hero column, teacher cards, testimonial card rotation). No `xl` breakpoint in use.

**Spacing rhythm:** Sections use large vertical padding — `py-20` (80px) for default, `py-24` (96px) for navy/paper variants. Between sections there is no divider; navy → paper → navy alternation carries the rhythm. Intra-section gaps use `gap-8` (32px) for card grids, `gap-4` (16px) for inline groups, `gap-16` (64px) between hero halves. Never invent a 12px gap — use `gap-4` or `gap-6`.

**Container behavior:** Header is `sticky top-0` with `backdrop-blur-sm` on cream (95% opacity) and `border-b border-navy-900/10`. Footer is full-bleed navy. Body is `min-h-screen flex flex-col` with `main.flex-1` so footer anchors to the viewport floor.

**Density:** Comfortable to generous. Buttons have large hit targets (`px-6 py-3` default, `px-8 py-4` large). Form fields use `px-4 py-3` with generous labels. Never crowd a card: `p-8` (32px) internal padding, `p-10 md:p-14` for the testimonial paper sheet.

**RTL note:** Persian pages use `dir="rtl"` on `<html>`; layout switches via logical properties where possible. Visual balance flips (hero copy/card order, badge placement) but spacing values do not change.

## Elevation & Depth

The system is **flat by default with lifted surfaces**. Depth is conveyed by shadow lift and tonal separation, not by stacking.

- The page field (paper) is flat.
- Header floats with `backdrop-blur-sm` (glass) and a hairline border, never a shadow.
- Cards and the hero paper card lift with shadows; hover transitions deepen them.

### Shadow Vocabulary

- **Card Rest** (`shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`): Default card state. Subtle lift off paper.
- **Card Float** (`shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25)`): Hero paper card, modal testimonial sheet. The only shadow large enough to feel like a sheet on a desk.
- **Button Glow** (`shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)`): Primary button at rest. Deepens to `shadow-xl hover:shadow-xl` on hover — a micro-lift, not a bloom.
- **Dropdown** (`shadow-lg + border border-navy-900/10`): Language picker. Shadow plus hairline border defines the edge.

### Named Rules

**The Desk Rule.** Paper is flat; white cards lift slightly; only one element per section may use `shadow-2xl`. If two shadows compete, demote the lesser to `shadow-md`.

## Shapes

**Radius:** The world is **soft-rectangular**. Every component uses `rounded-sm` (2px) — buttons, cards, badges, inputs, sections via `rounded-sm` on inner sheets. Circular forms appear only for emblems: the passport stamp (`rounded-full border-2 border-gold-500`), avatar initials (`rounded-full bg-gold-500/10`), social icons (`rounded-full`). No `rounded-full` on buttons or cards — that's reserved for stamps and persons.

**Borders:** Hairline `border-navy-900/10` defines most edges. Cards use `border-2 border-gold-500/20` only when rotated as a notebook sheet; standard cards rely on shadow alone. Badge-gold adds `border border-gold-500/30`. No thick borders except the stamp's double circle (1px outer, 2px inner).

**Rotation:** The notebook signature. Cards accept `rotate: left (-rotate-1)` or `right (rotate-1)` — applied only to testimonial/curriculum cards, never to header/footer/nav. Rotation implies a thumb-tacked sheet.

**Washi & Tape:** Decorative accents use absolute positioned rectangles: `-top-3 left-10 w-14 h-6 bg-gold-500/30 rotate-[-4deg]` and variants at ±3–12°. Tape never overlaps readable text; it's a corner anchor only.

**Clip:** The passport stamp SVG is the only clipped form (double circle, curved text path). No other clipping or masking.

## Components

### Buttons

**Character:** Precise, ink-monospaced, confident. Always Space Mono bold.

- **Shape:** Soft rectangle (`rounded-sm`, 2px).
- **Primary** (`bg-navy-900 text-paper-100 shadow-lg`): The workhorse CTA (hero, pricing, contact). Padding `px-6 py-3` (md), `px-8 py-4` (lg). Hover `bg-navy-800 hover:shadow-xl`, 200ms transition. Disabled `opacity-50 cursor-not-allowed`.
- **Hover / Focus:** `transition-all duration-200`, background shift + shadow lift. Focus via native outline (Tailwind default); no custom ring yet — rely on browser default and ensure visible contrast against navy.
- **Secondary** (`bg-red-600 hover:bg-red-700 text-paper-100`): Exam/test CTAs, accent action. Same shape/sizing as primary.
- **Outline** (`border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-paper-100`): Secondary hierarchy on paper backgrounds.
- **Ghost** (`text-navy-900 hover:bg-navy-900/5`): Text-button, minimal emphasis. Used sparingly in nav contexts.
- **Link mode:** When `href` is present, the component renders `<a>` with identical classes — same visual, no tag switch in style.

### Badges

- **Default** (`bg-navy-900 text-paper-100`): Rare, dark label.
- **Gold** (`bg-gold-500/20 text-gold-600 border border-gold-500/30`): Premium callout.
- **Red** (`bg-red-600/10 text-red-700`): Exam/accent tag.
- **Shape:** `px-3 py-1 text-xs font-bold rounded-sm`. Always small caps / mono-adjacent feel.

### Cards / Containers

- **Corner Style:** `rounded-sm` (2px) with optional `rotate-1 / -rotate-1`.
- **Background:** `#fff` on paper field; `bg-navy-50 / bg-navy-100` on tinted sections.
- **Shadow Strategy:** `shadow-md` default; `shadow-2xl` only for the single desk-sheet hero (see Elevation).
- **Border:** None by default; rotated variant adds `border-2 border-gold-500/20` for paper-edge feel.
- **Internal Padding:** `p-8` (cards), `p-10 md:p-14` (testimonial sheet), `p-12` (hero paper card inner). Never `p-4` on a card.

### Inputs / Fields

- **Style:** `bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm` on dark sections; `bg-white border border-navy-900/20 text-navy-900 px-4 py-3 rounded-sm` on paper sections. Context determines background.
- **Focus:** `focus:border-gold-500 focus:ring-1 focus:ring-gold-500 focus:outline-none`, 200ms transition. Gold focus ties to the stamp accent.
- **Error / Disabled:** Not yet formalized — placeholder sets "لطفاً نام کامل خود را وارد کنید" per spec. Disabled uses `disabled:opacity-50`. Avoid red outlines on error; use helper text in muted red instead.

### Sections

- **Shape:** Full-bleed horizontal band.
- **Variant `navy`** (`bg-navy-900 py-24 px-6`): Hero, CTA, stats. Text always `text-paper-100` with muted at `/80`, `/70`, `/60`.
- **Variant `paper` / `default`** (`bg-paper-100 py-20 or py-24 px-6`): Course grid, values, FAQ. Text `text-navy-900` with muted at `/70`, `/60`.
- **Behavior:** Navy/paper alternation replaces dividers. Max content width `max-w-6xl mx-auto`; narrower prose uses `max-w-3xl` or `max-w-4xl` centered.

### Navigation (Header)

- **Style:** `sticky top-0 bg-paper-100/95 backdrop-blur-sm border-b border-navy-900/10`.
- **Typography:** Nav links `text-navy-900/70 hover:text-navy-900 font-medium`, with a gold underline on hover (`absolute -bottom-1 right-0 w-0 h-0.5 bg-gold-500 group-hover:w-full`). Logo `text-navy-900 text-xl font-bold`.
- **Active:** Not yet wired — same typography, underline always visible.
- **Mobile:** Hamburger `p-2 md:hidden`, slide-down drawer `border-t border-navy-900/10 pt-4`, language grid `grid-cols-3`.

### Footer

- **Field:** `bg-navy-900 pt-16 pb-8`, `text-paper-100` with muted `/60`, `/40`.
- **Layout:** `grid lg:grid-cols-4` (brand + 3 link columns), `border-t border-navy-800` before the bottom bar.
- **Links:** `text-paper-100/60 hover:text-paper-100 text-sm`, section headers `font-bold text-gold-500`.
- **Social:** `w-10 h-10 rounded-full bg-navy-800 hover:bg-navy-700 flex items-center`, SVG fill `currentColor`.

### Stamp (Passport Emblem)

- **Form:** SVG 200×200, `rotate(-30deg)`, double circle (`r=78 @1px`, `r=92 @2px`) in `text-gold-500` (currentColor), curved top text "A-U-F DEUTSCH" via `textPath`, curved bottom "★ SPRACHSCHULE ★", center "A♦F" (bold 32px) and "EST. 2026" (10px, letter-spacing 2).
- **Usage:** Hero card center (`size=192`), about hero decoration, 404 background watermark (`opacity-30`, `size=128`). Always `currentColor` so parent tint controls gold.

## Do's and Don'ts

### Do:

- **Do** respect the Wax Seal and No Gray rules — gold sparingly, opacity-derived grays only.
- **Do** keep `rounded-sm` (2px) as the universal corner; reserve `rounded-full` for stamps, avatars, and social icons only.
- **Do** alternate navy/paper sections for rhythm; avoid visible dividers between sections.
- **Do** use Vazirmatn for all reading text and Space Mono bold only for buttons, badges, and microcopy.
- **Do** rotate at most one card per section (`-rotate-1` or `rotate-1`) and never rotate navigation or footer elements.
- **Do** apply hover lifts with `transition-all duration-200` and deepen `shadow-md→shadow-xl`, never jump to a new color on hover except navy-900→navy-800.

### Don't:

- **Don't** render a page background other than `bg-paper-100` (`#F3ECDD`) — white pages break the notebook illusion.
- **Don't** introduce a new accent color or gradient. The palette is exactly navy, paper, gold, red (plus opacity mixes).
- **Don't** use `rounded-full` or `rounded-lg` on cards, buttons, or inputs — the soft 2px corner is the form language.
- **Don't** place Space Mono on paragraphs, card descriptions, or any text longer than ~10 words.
- **Don't** use a literal gray hex for muted text — use `text-navy-900/60` or `text-paper-100/60` instead.
- **Don't** stack more than one `shadow-2xl` per viewport — demote competing cards to `shadow-md`.
- **Don't** over-stamp: if gold appears more than twice in a section, remove one instance.
