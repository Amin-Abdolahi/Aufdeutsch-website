# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4 — App Router, Turbopack, Vercel deploy, Resend email.

## Users

**Primary:** Iranian professionals aged 25–40 planning to study or work in Germany. They need structured, credible German instruction (A1–C1 + exam prep) that fits a busy schedule and gets them to B1 fast enough for visa/university deadlines.

**Secondary:** Spouses of German residents needing family-reunion language proof; hobbyists wanting cultural access.

## Product Purpose

AUF Deutsch delivers private, live online German lessons with two named teachers (Amin & Fataneh) who split the curriculum by specialization. The product exists because generic apps and group classes leave Persian speakers stuck at A2 — no speaking practice, no exam strategy, no cultural context.

**Success metric:** Monthly recurring revenue from session packages.

## Positioning

**Two teachers, two specializations.** Amin owns exam prep (Goethe / TestDaF / ÖSD / DTZ / Telc), advanced grammar, and business German. Fataneh owns everyday conversation, beginner onboarding, and German culture. A competitor with one teacher or a faceless platform cannot truthfully claim this split.

The "zero to B1 in 6 months" promise is the measurable outcome of that split.

## Operating Context

**Enrollment flow:**
1. Free 15-min consultation (Calendly/phone/Telegram)
2. Level assessment & goal setting
3. Package selection (single / 8-week A1 / 16-week complete / 20-session exam prep / small group)
4. Payment (Sheba / card-to-card / online gateway)
5. Weekly 60-min live sessions (Zoom/Google Meet/Skype) + homework with personal feedback
6. Ongoing support until exam pass

**Rituals:** Weekly session, homework review, monthly progress check, mock exams before real test.

**Environment:** Learner at home/office on laptop/phone; teacher on desktop with shared screen & digital whiteboard. Materials: PDF books (Starten wir, Menschen), custom exercise sheets, Anki decks, mock exams.

## Capabilities and Constraints

| Capability | Status |
|---|---|
| Trilingual UI (fa RTL, de LTR, en LTR) | ✅ Built |
| Locale-prefixed routes (`/fa`, `/de`, `/en` + subpages) | ✅ Built |
| Proxy-based locale redirect (Next.js 16 `proxy.ts`) | ✅ Built |
| Contact form → Resend email to owner | ✅ Built |
| Testimonial submission + admin approval flow | ✅ Built |
| SEO: sitemap.xml, robots.txt, hreflang, JSON-LD schema | ✅ Built |
| RTL layout, Vazirmatn font, Navy/Paper/Gold/Red palette | ✅ Built |
| Static generation for all locale pages (`generateStaticParams`) | ✅ Built |
| New site capability/page (owner-reported) | ⏳ Pending — details to be supplied by owner; do not implement until confirmed |

**Hard constraints (must preserve):**
- Trilingual with correct `dir`/`lang` per locale
- Vazirmatn for Persian, Space Mono for English display
- Navy (`#1B2A44`), Paper (`#F3ECDD`), Gold (`#B08D3E`), Red (`#B23A2E`) palette
- Named teachers: Amin & Fataneh (real people, not personas)
- Notebook / passport / travel visual metaphor
- Existing pricing tiers & package names
- Resend email integration (contact + testimonial notifications)
- Vercel deployment (static + dynamic routes)

**Technical constraints:**
- No database — testimonials stored in `data/testimonials.json` (file-based, works on Vercel)
- No auth — admin approval via signed email links
- All content in `lib/i18n.ts` dictionaries (no CMS)

## Brand Commitments

- **Name:** AUF Deutsch (fixed)
- **Voice:** Warm, expert, structured — "like a journey, step by step"
- **Visual world:** Notebook paper texture, passport stamps, gold foil accents, handwritten feel
- **Teachers:** Real photos, real names, real credentials (Amin: exam/grammar/business; Fataneh: conversation/beginners/culture)
- **Social proof:** HiTalki profile (104 reviews, 5★, 2,139 classes) — linked transparently, not copied

## Evidence on Hand

- **HiTalki profile (Fataneh):** 104 reviews, 5★, 2,139 classes — `https://hitalki.org/profile/5794`
- **Teaching track record:** 6+ years (Amin), 5+ years (Fataneh)
- **Student count:** 100+ active learners across A1–C1
- **Exam prep:** Goethe, TestDaF, ÖSD, DTZ, Telc — structured mock exams + time-management coaching
- **Materials:** Custom PDF books, exercise sheets, Anki decks, all provided free
- **Testimonials:** 6 seeded (2 per locale) + new submissions via `/contact`
- **Updated statistics (owner-reported):** ⏳ Pending — new figures exist but exact values not yet supplied; do not publish or extrapolate until confirmed

**Absences (must not fabricate):**
- No video testimonials yet
- No public case studies with names/outcomes
- No press mentions
- No partner logos

## Product Principles

1. **Specialization over breadth** — Two teachers, each world-class in their lane, beat one generalist.
2. **Outcome-driven** — Every feature (mock exam, homework feedback, scheduling flexibility) serves the "pass the exam / hit B1" goal.
3. **Persian-first, not Persian-only** — RTL, Vazirmatn, cultural nuance lead; German/English parity follows.
4. **Trust through transparency** — Real names, real reviews, real prices, real teachers. No dark patterns.
5. **Low friction, high touch** — Free consult, flexible scheduling, personal feedback — the product is the relationship.

## Accessibility & Inclusion

- RTL layout + correct `dir`/`lang` for Persian (fa)
- LTR for German (de) and English (en)
- Semantic HTML, focus states, ARIA labels on interactive elements
- Color contrast meets WCAG AA (Navy/Paper/Gold/Red palette verified)
- Scalable text (rem units), no fixed px fonts
- Trilingual content parity — no locale treated as second-class
- Standard web accessibility baseline; no product-specific requirements beyond RTL/trilingual established