# Product

## Register

product

## Users

A single, local-first reader using Feed on their own machine — no auth, no cloud. For this concept track, the persona is reframed away from the polish-baseline's keyboard-driven power user toward a **calm, editorial reader**: someone catching up on a curated set of feeds the way they'd read a saved magazine, not someone triaging an overflowing inbox at speed. Reading sessions are intentional rather than constant. Comfort, focus, and continuity matter more than density or throughput.

## Product Purpose

Feed stores RSS/Atom subscriptions and full article content locally in SQLite, then surfaces them in a reader optimized for actual long-form reading — with highlights, stars, mark-read, search, OPML, and feed-health awareness. The polished baseline (`lab-polish-v1`) ships a competent three-pane RSS-reader UI. This concept track exists to test a different question: *if reading itself were the success metric, what would the interface look like?* Success on this concept = the reader feels meaningfully calmer than the baseline without losing any underlying capability.

## Brand Personality

**Warm. Paper-like. Intimate.** The interface should feel closer to a well-printed magazine read by lamplight than to a productivity tool. Restraint is the loudest signal. Type carries the identity; chrome stays out of the way. The voice is literary and deliberate — never enthusiastic, never gamified, never urgent.

## Anti-references

- **Generic SaaS dashboard.** No icon-rail sidebar with stacked navigation pills. No hero-metric cards. No AI-flavored repeated-card grids. No "stat tile" treatments of unread counts. No bright accent calls-to-action competing with article content.
- Implicit corollary: avoid the AI-slop reflexes the impeccable shared design laws ban — gradient text, glassmorphism as default, side-stripe borders as accent, modal-as-first-thought, identical card grids.

## Design Principles

1. **Reading is the product.** Every chrome decision is judged by whether it makes the article body easier to settle into. If a UI element doesn't help reading or directly enable it, it gets demoted, hidden, or removed.
2. **Type carries the identity.** Hierarchy, rhythm, and warmth come from typography first — not from color, surfaces, or motion. Color is restrained; type is committed.
3. **Quiet over efficient.** Where the polish baseline optimized for power-user density, this concept optimizes for calm. Slower transitions, more whitespace, fewer simultaneous affordances on screen.
4. **Continuous, not modular.** Sidebar, list, and reader should feel like one editorial surface with shifting emphasis, not three independent tools wired together. Resizable panes are an anti-pattern for this register.
5. **Hold the floor, don't regress it.** Accessibility, sanitization, persistence, and every behavior shipped in `lab-polish-v1` stay intact. Calmness is added on top of correctness — never instead of it.

## Accessibility & Inclusion

Hold the floor established by `design/09-a11y-pass` and `design/08-motion-pass`:

- WCAG AA contrast targets across the redesigned palette.
- `prefers-reduced-motion: reduce` honored globally; every transition collapses to ~0ms when the user opts out.
- Focus-visible rings on every interactive surface; visible "Skip to articles" link as the first focusable element.
- Real landmarks (`<nav>`, `<main>`, `<section>`, `role="region"` on the reader) preserved.
- Toggle state exposed via `aria-pressed` (star, reader-mode, and any new toggles introduced).
- Icon-only controls keep `aria-label`s.

No new accessibility commitments above the baseline floor for this concept. Stricter contrast, AAA targets, or a dedicated high-contrast theme are explicitly deferred to a future concept or polish pass.
