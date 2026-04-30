# Concept 01 — Impeccable Redesign

> First radical UI concept on the post-polish track. Architecture-only as of this
> writing; implementation is gated on explicit approval and will land in seven
> small phases on this branch.

## Metadata

- Concept name: **Impeccable Redesign**
- Branch: `concept/01-impeccable-redesign`
- PR: TBD
- Status: Phase 1 complete (design-system foundations); Phase 2 not started
- Created: 2026-05-01
- Last updated from main: `b7a2f5f` — *Merge concept documentation template*
- Baseline: `lab-polish-v1` (tag on `main`)
- Skills/tools explicitly used: Impeccable (project-local at `.claude/skills/impeccable/` — `teach`, `document`, `shape` flows), Claude Code, polish-track design-skill audit
- Screenshot directory: `docs/design-lab/screenshots/concepts/01-impeccable-redesign/`

## Summary

A reimagining of Feed as a **warm, paper-like reading surface** designed for a single calm reader catching up on a curated set of feeds the way they would read a saved magazine — not for a power user triaging an inbox at speed. The concept inverts several baseline decisions: the cool indigo dark theme becomes a **warm-tinted dark "dim reading lamp"** mode, the resizable three-pane shell collapses toward a **reader-first single-surface layout** with progressive disclosure, and chrome density is cut to make room for type and whitespace. It explicitly rejects the generic SaaS-dashboard reflex and the standard RSS-reader three-pane reflex. Architecture and behavior of the underlying Feed app (data model, server actions, Prisma schema, API routes, sanitization, persistence) are preserved exactly.

## Product Metaphor

**The Reading Lamp.** A single warm light pooled around the article body, with the rest of the room soft and dim. Sidebar and list are present but recessed — visible at the edge of the lamp's circle, not center stage. The reader is the lit page; everything else is the room. This contrasts deliberately with the polished baseline, which is closer to a "calm reading room" — a balanced cool space — rather than a pooled light around a single article.

## Design Intent

- **Who this concept is for.** A single, local-first reader who treats reading as a deliberate evening activity, not a stream to triage. They subscribe to ~10–30 feeds, read a few articles per session, value coming back to long-form pieces over scanning many short ones.
- **What feeling it should create.** Calm, warmth, intimacy. Closer to lamplight on paper than to a cool screen. The interface should feel inviting at the start of a reading session and quiet during it.
- **What problem it is trying to solve.** The polished baseline ships a competent RSS reader, but the chrome still claims attention — three resizable panes, dense sidebar, list always visible, cool indigo accent. For a calm reader, that's noise. The concept tests whether removing/hiding chrome and warming the palette materially improves reading.
- **What it intentionally challenges from the current UI.**
  - The three-pane resizable shell as the entire identity.
  - Dark = cool. The baseline's dark mode is cool indigo at hue 250; the concept's dark mode is warm at ~hue 65–80 (sepia/amber territory).
  - Sidebar density. The polish-track footer rail and folder tree both stay, but visually recede — they are not the headline of every screen.
  - Article rows as text-heavy two-line list items. The concept treats list rows as part of the surface, not as a separate component register.
  - Cool, technical typography hierarchy. Geist Sans stays single-family per the impeccable single-family rule, but the size/leading scale grows to magazine-grade rhythm and the reader pane gains a wider scale ratio.

## What Changes

### Layout

- **From:** Three resizable panes (sidebar | list | reader) on `react-resizable-panels`, all visible simultaneously on desktop.
- **To:** A **reader-first canvas** with an attached, non-resizable **rail** on the leading edge that holds sidebar and list collapsed into a single navigation column. Default state: rail visible at ~280px, reader fills the rest. Pressing a single key (`\`) toggles the rail away entirely so the reader becomes the full canvas. List rows and folder/feed tree share that rail — no second pane, no resize handle, no list pane on its own.
- The rail's content shifts based on context: by default it shows the article list for the active feed, with feeds + folders accessible behind a small "Feeds" affordance at the top. (Closer to Linear's left sidebar than to Reeder's three-pane.)

### Sidebar / Navigation

- **From:** A persistent feed/folder tree with section headings, "All Articles", "Starred", a footer rail of Health/Stats/Settings, and an action toolbar.
- **To:** Two stacked surfaces inside the rail — **Feeds (collapsed by default)** and **Articles (the active list)**. Feeds-and-folders mode is reached via a typographic toggle ("Feeds" label that flips to a back arrow), not via a separate pane. Health/Stats/Settings move into the command palette as commands rather than visible footer affordances. The "+" feed actions live in the same overflow as Health/Stats/Settings.

### Article List

- **From:** A scrollable column of bordered article-row buttons with title, eyebrow, and metadata; date-range picker and search field above it.
- **To:** A continuous **typographic list** — no card chrome, no row borders, no per-row hover-elevated background. Articles separated by 1.5em of vertical rhythm and a hairline only between days. Title is the primary mark; a small uppercase eyebrow above it carries feed name; metadata (author / time / read state) lives in a single quiet line below. Selection is signaled by warming the row background by ~3% and shifting the title weight from 500 → 600. No 2px indicator bar.
- Search collapses into the command palette by default (`/` opens it pre-scoped to the active list). Date range remains, but as a small "Today / This week / All" segmented control rather than an open picker.

### Reader Pane

- **From:** Full-bleed reader inside its own pane with `ArticleHeader` action buttons across the top (Reader mode, Star, Open original) at h-8.
- **To:** A **deliberately narrower reader column** (max-width 660–720px depending on viewport) centered inside the canvas with generous outside whitespace that itself is part of the design — the lamplight pool. Header actions move to a **floating right-edge rail** that fades in on cursor proximity (and is always visible on touch and on focus). Reader mode toggle becomes the default for any article that has full content; the explicit "Reader mode / Exit reader mode" button stays for the few cases where the user wants the original feed-supplied HTML, but it's no longer the headline action.
- Highlights remain pencil + trash icon-only, but move into the same right-edge rail as a hover-revealed inline tool, not into the reader content body.
- Empty state ("Nothing selected") becomes a single line of warm-foreground type centered in the canvas, no skeleton-shaped placeholder.

### App Chrome

- **From:** A persistent header bar on mobile, a 56px top bar with the active title and a back chevron; on desktop, no top chrome.
- **To:** No persistent header on either platform. The article title is the only identifying element on the surface — there is no second "you are reading X" label.

### Typography

- Single family stays Geist Sans (impeccable single-family rule preserved). What changes:
  - Reader-pane scale ratio widens from ~1.18 to ~1.25 between steps. h1 reaches 2.0–2.25rem; body climbs from 17px to 18px default with line-height 1.75.
  - Body sets `text-wrap: balance` on the first paragraph and `text-wrap: pretty` on subsequent paragraphs.
  - Rail uses uppercase **0.7rem** labels with widened tracking (0.06em) for sectioning — much smaller than baseline labels, in service of recession.
  - Eyebrow above article titles in the list grows to small-caps via `font-feature-settings: "smcp"` if Geist Sans supports it; falls back to uppercase + tracking.

### Color / Material Direction

- **Strategy: Restrained.** Tinted neutrals + one accent ≤10% of surface, per impeccable's commitment axis.
- **Theme: dark-first, warm dim reading lamp.**
  - Background: warm dark, around `oklch(0.155 0.01 70)` (sepia-charcoal).
  - Foreground: warm cream, `oklch(0.92 0.02 80)`.
  - Surface tonal layering preserved (rail / canvas / popover four-step ladder), but every step shifts hue from baseline 250 → ~70.
  - One accent: a deep red-brown ink, around `oklch(0.55 0.13 30)` — used only for the unread mark and the focus ring. Not on buttons.
  - Star / highlight retain warm amber but shift slightly hotter to differentiate from the new background hue.
  - Light mode supported but secondary, warmed toward off-white paper (`oklch(0.97 0.01 80)`).

### Motion

- Reuse existing motion tokens (`--motion-fast/base/slow`, `--ease-out-quint`, `--ease-spring`); extend with `--motion-canvas: 480ms` for the rail collapse transition.
- New motion: rail collapse/expand uses transform-only animation (no width animation — translate the rail behind a clip). Reader column does not animate on article switch; only the body cross-fades (already in baseline).
- `prefers-reduced-motion: reduce` floor unchanged: every transition collapses to ~0ms.

### Component System

- Keep the shadcn primitives that earn their place: `Button`, `Dialog`, `AlertDialog`, `Input`, `Popover`, `ScrollArea`, `Separator`. Drop `Resizable` (no resizable panes) and `Menu` if it is only used in a place the new chrome no longer has.
- New components: `Rail` (the leading column), `Canvas` (the centered reader surface), `EdgeRail` (the floating reader-action rail), `Eyebrow` (typographic small-caps label), `DayDivider` (hairline between list days).
- `CommandPalette` gains expanded scope: search-articles, jump-to-feed, navigate-to-page (Health/Stats/Settings), toggle-rail.

### Mobile Behavior

- **From:** Stacked single-pane (sidebar → list → reader) with a 56px top bar and back chevron.
- **To:** Same stacked pattern, re-derived from the new chrome — not patched on top. Rail becomes the entire screen at sidebar-and-list level. Reader is the entire screen at article level. Top bar gains an article-progress dot (a thin warm line tracking scroll progress) and drops the bordered chevron; back is gesture-or-tap on the leading 24px.
- Safe-area insets (`env(safe-area-inset-top/bottom)`) preserved; `viewportFit: cover` preserved.
- The reader's right-edge action rail collapses into a single bottom-anchored bar on mobile (Star, Reader mode, Open original).

## What Must Stay Stable

Inherited from canonical Feed via `upstream`, locked for this concept:

- Data model.
- Server actions (`src/actions/`).
- Prisma schema and generated client.
- API routes (`src/app/api/`).
- Persistence model (SQLite, local-first, single-user).
- Core RSS/Atom behavior.
- OPML import/export behavior.
- Article fetching and sanitization pipeline (`lib/safe-fetch.ts`, DOMPurify).
- Reader / highlights / star / mark-read / folder / search / settings / stats / health behavior.
- Accessibility floor from `design/09-a11y-pass`: skip link, real landmarks, `aria-pressed`, focus-visible across every interactive surface.
- Reduced-motion floor from `design/08-motion-pass`.

## Affected Files / Surfaces

| Area | Expected files | Risk level | Notes |
| ---- | -------------- | ---------- | ----- |
| Tokens / theme | `src/app/globals.css` | Low | Same token names; warm-hue values; new `--motion-canvas`. |
| App shell | `src/components/layout/AppShell.tsx`, `src/app/layout.tsx` | High | Replaces three-pane resizable layout with rail + canvas; mobile chrome rederived. |
| Sidebar / Rail | `src/components/sidebar/Sidebar.tsx`, `FeedItem.tsx`, `OpmlActions.tsx` | High | Rewires into rail with collapsible Feeds surface. |
| Article list | `src/components/articles/ArticleList.tsx`, `ArticleRow.tsx` | High | Continuous typographic list; row chrome removed; selection signaled by weight + warmth shift. |
| Reader | `src/components/reader/ReadingPane.tsx`, `ArticleHeader.tsx`, `TypographySettings.tsx` | High | Centered narrower column, floating edge-rail for actions, defaulting to reader mode on full content. |
| Command palette | `src/components/CommandPalette.tsx` | Medium | Absorbs Health/Stats/Settings nav, search-by-default, rail-toggle command. |
| Dialogs | `src/components/sidebar/AddFeedDialog.tsx`, `FeedSettingsDialog.tsx`, `src/components/ui/{dialog,alert-dialog}.tsx` | Medium | Restyle to warm-paper register; behavior unchanged. |
| Empty / loading | `ReadingPane` empty state, `ArticleList` empty/no-results states, skeletons | Medium | Replaced with typographic single-line copy and rhythm-preserving skeletons. |
| Mobile shell | parts of `AppShell.tsx`, `src/app/layout.tsx` | Medium | Rederived from new chrome; safe-area + `viewportFit: cover` preserved. |
| Component primitives | `src/components/ui/*` | Low | Existing primitives mostly kept; new `Rail`, `Canvas`, `EdgeRail`, `Eyebrow`, `DayDivider` added. |
| Stats / Health / Settings pages | `src/app/{stats,health,settings}/page.tsx` | Low | Light restyle to match warm palette and typography; structure unchanged. |
| Server actions / API / Prisma / lib | (everything under `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`) | None — locked | Hard constraint: not modified in any phase. |

## Screenshots

| View                     | Screenshot | Notes |
| ------------------------ | ---------- | ----- |
| Desktop overview         | TBD        | Rail visible, no article selected. |
| Desktop article selected | TBD        | Rail + reader, 1440×900. |
| Reader view (rail hidden) | TBD       | Full canvas with floating edge-rail, single article. |
| Mobile list              | TBD        | Rail-only mobile state. |
| Mobile reader            | TBD        | Reader with bottom-bar actions. |
| Empty / loading state    | TBD        | "Nothing selected" + rhythm-preserving skeleton. |

Screenshots will be captured in Phase 7 of implementation, into `docs/design-lab/screenshots/concepts/01-impeccable-redesign/`.

## Local Run Instructions

```bash
git checkout concept/01-impeccable-redesign
npm run setup
npm run dev
```

## Validation Checklist

To be completed at the end of Phase 7:

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm audit`
- [ ] Desktop screenshot captured
- [ ] Mobile screenshot captured
- [ ] Reader view checked
- [ ] Article list checked
- [ ] Sidebar/navigation checked
- [ ] Empty/loading states checked
- [ ] Keyboard navigation checked
- [ ] No data/API/schema changes (`git diff main -- src/actions src/lib src/app/api prisma` is empty)

## Skills Usage Notes

- **Impeccable / `teach`** ran first. Two interview rounds with the user established register (`product`), persona (calm/editorial reader), success outcome (reading feels calmer), 3-word personality (warm, paper-like, intimate), anchor references (Are.na, NYT print, Readwise Reader), anti-references (generic SaaS dashboard), and the accessibility floor. Output: `PRODUCT.md` at the repo root.
- **Impeccable / `document`** ran in scan mode against the polished baseline. Tokens were extracted directly from `src/app/globals.css`; descriptive language was chosen interactively (Creative North Star = "The Calm Reading Room", primary = "Quiet Indigo", elevation = "Tonal layering, no shadows"). Output: `DESIGN.md` at the repo root. The `DESIGN.json` Stitch sidecar was deliberately skipped — it is a tooling artifact for the live panel and not load-bearing for this concept's planning.
- **Impeccable / `shape`** ran adapted to this concept's discovery: most data/content questions were already answered by the polished baseline, so discovery focused on direction. Three direction inputs were settled with the user: theme (dark-first, warm dim reading lamp), color strategy (Restrained), carry-over scope (reimagine layout/chrome/type; preserve token-name scaffold).
- **Visual direction probes (shape Phase 1.5)** were *skipped*. Reason: this harness does not have a built-in image-generation tool; the impeccable spec explicitly says not to ask the user to install external API tooling for probes.
- **Polish-track audit** at `docs/design-lab/initial-design-skill-audit.md` was used as the read-only audit against `lab-polish-v1`. No changes proposed here regress its accessibility, motion, or empty-state floors.

## Comparison Against Polished Baseline

- **What is meaningfully different from `lab-polish-v1`.**
  - Theme hue inverts from cool indigo (250) to warm sepia/amber (~70).
  - Three-pane resizable shell collapses to rail + canvas.
  - Article list loses its row chrome and becomes a continuous typographic surface.
  - Reader column narrows and centers; reader actions become a floating edge rail rather than a horizontal header bar.
  - Health / Stats / Settings move out of a visible footer rail into the command palette.
- **What this concept aims to improve.** Calmer reading sessions, less chrome contention with the article body, a stronger single visual identity ("warm reading lamp" instead of "competent shadcn descendant"). A more deliberate departure from the category-reflex aesthetic.
- **What might get worse.**
  - Power users who relied on visible-at-a-glance feed lists may feel slower to navigate; the rail-collapsed-Feeds pattern is a real cost.
  - Resizable panes are loved by some readers; removing them is opinionated.
  - Warm dark mode in OLED-class displays may feel less crisp than the cool baseline; needs in-browser verification.
  - Floating edge-rail on hover is a fragile affordance; touch users default to always-visible bottom bar (acceptable), but mouse users new to the app will hunt.
- **What is still unresolved.**
  - Does the small-caps eyebrow rely on Geist Sans's OpenType features? If Geist Sans does not ship `smcp`, fall back gracefully.
  - Is `\` a good rail-toggle key? Check for collisions with `CommandPalette` and the typography settings popover.
  - Whether the warm-amber star color reads correctly against the new warm background or needs to shift cooler.

## Risks and Tradeoffs

- **UX risks.** Rail-collapsed-feeds adds a click for users who navigate by-feed often. Floating right-edge action rail relies on cursor proximity on desktop. Reader column narrowing limits multi-column code samples; need to verify with real article content.
- **Maintenance risks.** Larger surface area than any polish-track branch. Re-deriving mobile layout from scratch (vs. patching the existing one) is the right call but doubles the work.
- **Accessibility risks.** Floating edge-rail must remain keyboard-reachable (`Tab` should expose it without requiring hover). Must keep skip-link, landmarks, `aria-pressed` on every toggle. Warm dark mode contrast must still hit WCAG AA — verify with a contrast checker per surface, not by eye.
- **Mobile risks.** Bottom-anchored reader actions need to clear the iOS home indicator (`env(safe-area-inset-bottom)`). Article-progress dot in the top bar must not drift behind the notch.
- **Implementation risks.** Removing `react-resizable-panels` is a real subtraction; existing tests that target the resizable layout must be reviewed (none expected — tests focus on data, not layout, but verify before removing the dep). New components must integrate cleanly with the existing shadcn primitives without forking them. Scope-creep risk: it would be easy to slide into rewriting `Stats` / `Health` charts; do not.

## Decision

To be filled in at the end of implementation. Choose one:

- [ ] Keep exploring
- [ ] Mine for parts
- [ ] Candidate finalist
- [ ] Discard
- [ ] Upstream selected pieces to canonical Feed

Decision notes: TBD.

## Implementation Phases

Each phase requires its own go-ahead before any file edits in `src/`. Status:

1. **Phase 1 — Design-system foundations. ✅ Complete.** See "Phase 1 Implementation Notes" below.
2. **Phase 2 — App shell + navigation.** New `AppShell.tsx`, new `Rail` and `Canvas` components, retire `react-resizable-panels` usage, command-palette absorbs nav, `\` toggle.
3. **Phase 3 — Article list and feed browsing.** `ArticleList.tsx` and `ArticleRow.tsx` rewrite to continuous typographic list; new `DayDivider`, `Eyebrow`. Search-into-palette wiring.
4. **Phase 4 — Reader pane.** `ReadingPane.tsx`, `ArticleHeader.tsx`, `TypographySettings.tsx` rewire; new `EdgeRail`; reader-mode default-on for full-content articles; highlight rail.
5. **Phase 5 — Mobile layout.** Re-derive from the new chrome rather than patching `design/11`. Bottom-bar actions, scroll-progress dot, safe-area insets.
6. **Phase 6 — Dialogs, empty / loading states, final polish.** Restyle `Dialog` / `AlertDialog` / `AddFeedDialog` / `FeedSettingsDialog` / `CommandPalette`. Replace skeletons with rhythm-preserving variants.
7. **Phase 7 — Screenshots and concept-doc closure.** Capture six required screenshots into `docs/design-lab/screenshots/concepts/01-impeccable-redesign/`, fill the Screenshots and Validation tables, write the Decision and Follow-up sections.

## Phase 1 Implementation Notes

### What changed

Token-only pass against `src/app/globals.css`. Token names preserved exactly — no component, layout, or behavior code touched. `react-resizable-panels` retained per revision to the approved architecture; the rail-and-canvas restructure stays in Phase 2 and will visually de-emphasize pane chrome rather than retire the dependency.

#### Dark mode (`.dark`) — primary experience

Hue rotated from cool indigo (250) to warm sepia/amber (~65 for neutrals, 75–80 for warm states, 30 for the ember accent). Lightness ladder preserved at the same ~0.025 deltas so background → sidebar → card → popover still read as four distinct planes.

| Token | Before | After |
| ----- | ------ | ----- |
| `--background` | `oklch(0.135 0.005 250)` | `oklch(0.145 0.012 65)` |
| `--foreground` | `oklch(0.94 0.003 250)` | `oklch(0.92 0.02 80)` |
| `--card` | `oklch(0.175 0.006 250)` | `oklch(0.185 0.014 65)` |
| `--popover` | `oklch(0.215 0.007 250)` | `oklch(0.225 0.016 65)` |
| `--sidebar` | `oklch(0.16 0.006 250)` | `oklch(0.17 0.013 65)` |
| `--muted` / `--secondary` | `oklch(0.21 0.006 250)` | `oklch(0.22 0.014 65)` |
| `--accent` (selected-row plane) | `oklch(0.235 0.008 250)` | `oklch(0.245 0.018 65)` |
| `--muted-foreground` | `oklch(0.58 0.008 250)` | `oklch(0.65 0.018 75)` |
| `--primary` / `--ring` | `oklch(0.68 0.10 250)` (Quiet Indigo) | `oklch(0.62 0.13 30)` (deep ember) |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.98 0.012 80)` |
| `--destructive` | `oklch(0.65 0.18 25)` | `oklch(0.62 0.18 28)` |
| `--star` | `oklch(0.78 0.13 85)` | `oklch(0.80 0.14 75)` |
| `--border` | `oklch(1 0 0 / 7%)` | `oklch(1 0.02 80 / 8%)` |
| `--input` | `oklch(1 0 0 / 9%)` | `oklch(1 0.02 80 / 10%)` |
| Sidebar mirror tokens | (cool indigo set) | matched warm set |
| Chart colors | hue spread around 250/25/85/150/300 | hue spread around 30/28/75/130/350 |

#### Light mode (`:root`) — secondary experience

Warmed to "warm paper": background `oklch(0.975 0.012 80)` (faint cream), foreground `oklch(0.18 0.02 50)` (warm dark ink), primary deeper-ember `oklch(0.48 0.14 30)`. Border / input neutrals tinted to hue 80 at low chroma. Token names again preserved.

#### Article-content typography

Single value-only change: the highlight wash shifted from `oklch(0.75 0.15 85 / 30%)` to `oklch(0.78 0.16 75 / 30%)` to keep the warm-amber glow distinguishable from the new background hue. All other `.article-content` rules (heading scale, balance/pretty wrap, hyphenation, blockquote, code, table, figure) preserved exactly.

#### Motion tokens

Existing tokens preserved: `--motion-fast: 120ms`, `--motion-base: 200ms`, `--motion-slow: 360ms`, `--ease-out-quint`, `--ease-in-out-quint`, `--ease-spring`. **New token added:** `--motion-canvas: 480ms` reserved for the Phase 2 rail collapse / canvas-level transition. Not yet referenced anywhere — purely a definition.

#### Radius scale

Unchanged. `--radius: 0.625rem` and the derived `sm/md/lg/xl/2xl/3xl/4xl` ratios in `@theme inline` are intact.

#### Reduced-motion guard

The `@media (prefers-reduced-motion: reduce)` block from `design/08-motion-pass` is unchanged. Floor preserved.

### What was preserved exactly

- Every existing CSS custom property *name* in `:root` and `.dark`.
- Token aliases inside `@theme inline` (the Tailwind v4 mapping).
- `react-resizable-panels` mechanics (per revision to architecture).
- All component code under `src/components/**`.
- All `.article-content` typography rules other than the highlight color.
- `prefers-reduced-motion: reduce` floor.
- Radius scale, spacing scale, font tokens (`--font-sans`, `--font-mono`, `--font-heading`).
- Data layer, server actions, API routes, Prisma, lib/, tests.

### Validation results

- **`npm run lint`** — clean for the project (`npx eslint src/` returns no output). The default lint command surfaces 96 pre-existing warnings inside the untracked `.claude/skills/impeccable/scripts/*` skill tooling (third-party files, not project code, not introduced by Phase 1).
- **`npm run test`** — 175/175 passing, 1 skipped (unchanged from baseline).
- **`npm run build`** — 0 errors, 0 warnings.
- **`npm audit`** — 0 vulnerabilities.

### Browser observations (headless Chromium 1217 at 1440×900 and 390×844 mobile)

Headed Chrome was not available in this environment; used headless. Three reference screenshots saved into the concept's screenshot directory:

- `phase1-desktop.png` (1440×900) — desktop overview, warm sepia background visible, sidebar/list/canvas tonal layering preserved, "Nothing selected" empty state in the reader. The Next.js dev indicator in the bottom-right shows the new ember accent.
- `phase1-reader.png` (1440×900) — article selected with reader mode active. Body content (cream foreground on warm dark) is highly legible; the "Exit reader mode" pill, "Starred" button, and "Open original" link all read clearly with the new ember/amber accents. The cargo-terminal hero image renders normally; the article body remains scrollable inside the Radix `ScrollArea`.
- `phase1-mobile.png` (390×844) — single-pane mobile shell, article list visible, top-bar `viewportFit: cover` padding intact. Star icon and selected-row treatment carry the new warm-amber/ember pair.

Visual notes vs. `lab-polish-v1`:
- **Identity shift is visible at a glance.** The cool indigo "Calm Reading Room" reads now as a warm "dim reading lamp"; the difference is unmistakable and lives entirely in the palette, not the chrome.
- **Tonal layering still holds.** Sidebar / list-pane / reader pane / popover surfaces remain four distinct planes; no surface collapsed visually because the lightness ladder was preserved.
- **Ember accent (`--primary`) is currently used both for the focus ring and for primary-button surfaces.** This is acceptable for Phase 1 — the architecture's "ember-as-ring-only, ghost-by-default for chrome buttons" rewiring belongs to Phase 2.
- **Star color reads well against the new background.** The slight hue shift from 85 → 75 was the right call; the older 85 would have looked olive against hue-65 surfaces.
- **Contrast is acceptable on inspection.** Body text (`oklch(0.92 0.02 80)` on `oklch(0.145 0.012 65)`) is high-contrast (~14:1 estimated); muted-foreground on background sits comfortably above WCAG AA. The ember primary on dark background reads strongly. A formal per-surface AA audit is deferred to Phase 6 polish.
- **App is scrollable** — confirmed by automating reader-pane scroll-to-position-0 via the existing screenshot harness.

### Deviations from the approved architecture

- **`react-resizable-panels` retained**, per revision to the architecture issued before Phase 1. The Phase 2 plan in this doc still describes "rail + canvas" as a *visual* pattern; the resize mechanics will stay until/unless a later phase explicitly retires them.
- **Primary-button and accent-button surfaces still use `--primary`** (the new ember). The architecture targets ember-as-ring-only with ghost-by-default chrome buttons; that rewiring is intentionally deferred to Phase 2 component work, not Phase 1 token work.
- **Light-mode chart 4 / 5 hues** were warmed to 130 / 350 (vs. baseline 150 / 300) for hue-coherence with the warm system. Stats / Health pages were not visited in this round; if the warmer chart spread reads as too monochromatic against the warm cream, it can be re-balanced in Phase 6.

## Follow-up Tasks

- [ ] Phase 2 — App shell + navigation work (rail visual treatment, command-palette absorbs nav). Will revisit `--primary` usage in chrome buttons.
- [ ] Phase 6 — Per-surface WCAG AA contrast audit with a checker tool, especially `muted-foreground`-on-`muted` (settings page secondary copy) and `chart-1..5` series in `Stats` / `Health`.
- [ ] Visit `/stats` and `/health` once visual changes settle to confirm the warmed chart spread still reads as five distinct series.
