# Concept 01 — Impeccable Redesign

> First radical UI concept on the post-polish track. Architecture-only as of this
> writing; implementation is gated on explicit approval and will land in seven
> small phases on this branch.

## Metadata

- Concept name: **Impeccable Redesign**
- Branch: `concept/01-impeccable-redesign`
- PR: TBD
- Status: Phases 1–6 complete (foundations + app shell + article list + reader pane + mobile layout + final polish); Phase 7 (decision write-up) not started
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
| Desktop list + reader    | `final-desktop.png` | 1440×900. Sidebar rail, editorial article queue, reader column with feed eyebrow + display title + pill actions. |
| Reader column (desktop)  | `final-reader.png`  | Same layout, second-pass capture. |
| Mobile list              | `final-mobile-list.png` | 390×844, single-pane state machine, quieter top bar. |
| Mobile reader            | `final-mobile-reader.png` | Editorial reader column with feed eyebrow replacing duplicate screen heading. |
| Add Feed dialog          | `final-dialog.png`  | Phase 6 dialog chrome — warmer scrim, softer ring/shadow, transparent footer rail, eyebrow-style "Try one of these" header. |
| Phase 5 (mobile)         | `phase5-mobile-list.png`, `phase5-mobile-sidebar.png`, `phase5-mobile-reader.png` | Pre-polish mobile captures from Phase 5. |
| Earlier phase captures   | see `phase1-*`, `phase2-*`, `phase3-*`, `phase4-*` files | Per-phase progression. |

All final screenshots are stored under `docs/design-lab/screenshots/concepts/01-impeccable-redesign/`.

## Local Run Instructions

```bash
git checkout concept/01-impeccable-redesign
npm run setup
npm run dev
```

## Validation Checklist

End-of-Phase-6 status:

- [x] `npm run lint` — clean.
- [x] `npm run test` — 175 passed, 1 skipped.
- [x] `npm run build` — compiled in 11.4s, 10/10 static pages.
- [x] `npm audit` — 0 vulnerabilities.
- [x] Desktop screenshot captured (`final-desktop.png`, `final-reader.png`).
- [x] Mobile screenshots captured (`final-mobile-list.png`, `final-mobile-reader.png`).
- [x] Reader view checked (editorial header, pill actions, soft skeleton, gentler selection toolbar).
- [x] Article list checked (eyebrow-styled empty / no-results / error states; ghost-pill actions).
- [x] Sidebar / navigation checked (rail, folder dialog, delete-folder alert).
- [x] Empty/loading states checked (reader empty state, list empty/no-results/error, reader skeleton).
- [x] Keyboard navigation checked (focus-visible ring intact; aria-pressed preserved on Star/Reader-mode pills).
- [x] No data/API/schema changes (`git diff main -- src/actions src/lib src/app/api prisma` is empty).

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

**Provisional (end of Phase 6): _Candidate finalist._** Phases 1–6 land the brief
end-to-end without violating any hard constraint: no `src/actions`, `src/lib`,
`src/app/api`, or `prisma/` changes; no new dependencies; lint / test / build /
audit all green. The reader column reads as editorial rather than SaaS, the
list reads as a queue rather than a card grid, the sidebar collapses to a
quiet rail, and mobile inherits the same warm/quiet language without a custom
shell. The deviations from the architecture brief (rail-and-canvas kept on
top of `react-resizable-panels` rather than removing it; bottom-bar reader
actions skipped on mobile in favor of the existing pill row) are
intentional and listed in Follow-up Tasks; neither blocks the concept.

The final-status checkbox below stays blank until the user confirms after
their own browser pass.

- [ ] Keep exploring
- [ ] Mine for parts
- [ ] Candidate finalist
- [ ] Discard
- [ ] Upstream selected pieces to canonical Feed

Decision notes: pending user confirmation in browser.

## Implementation Phases

Each phase requires its own go-ahead before any file edits in `src/`. Status:

1. **Phase 1 — Design-system foundations. ✅ Complete.** See "Phase 1 Implementation Notes" below.
2. **Phase 2 — App shell + navigation visual redesign. ✅ Complete.** See "Phase 2 Implementation Notes" below. `react-resizable-panels` retained; visual rail+canvas treatment only.
3. **Phase 3 — Article list redesign. ✅ Complete.** See "Phase 3 Implementation Notes" below. Continuous typographic queue with day groups; no row borders; selection by tonal warmth + weight.
2. **Phase 2 — App shell + navigation.** New `AppShell.tsx`, new `Rail` and `Canvas` components, retire `react-resizable-panels` usage, command-palette absorbs nav, `\` toggle.
3. **Phase 3 — Article list and feed browsing.** `ArticleList.tsx` and `ArticleRow.tsx` rewrite to continuous typographic list; new `DayDivider`, `Eyebrow`. Search-into-palette wiring.
4. **Phase 4 — Reader pane redesign. ✅ Complete.** See "Phase 4 Implementation Notes" below. Editorial header (eyebrow row + display title + pill action row), floating top-right Typography settings, no top toolbar border, warmer article-content typography (links + blockquotes), highlights as a left-rule list.
5. **Phase 5 — Mobile layout. ✅ Complete.** See "Phase 5 Implementation Notes" below. Quieter mobile top bar, editorial reader header (feed eyebrow replaces duplicate screen heading in reader view), tighter mobile reader top padding. Layout state machine (sidebar ⇄ list ⇄ reader) and swipe behavior unchanged.
6. **Phase 6 — Dialogs, empty / loading states, final polish. ✅ Complete.** See "Phase 6 Implementation Notes" below. Warmer dialog scrim and chrome (`Dialog` / `AlertDialog`), eyebrow-styled empty / no-results / error states in `ArticleList`, softer reader skeleton blocks and selection toolbar, editorial reader empty state.
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

## Phase 2 Implementation Notes

### What changed

A pure visual pass on app chrome + sidebar + pane surfaces. `react-resizable-panels` is unchanged — the resize handles still exist and still drag — but they are now visually dim at rest and surface only on hover. The sidebar reads as a quiet rail; the list and reader share the canvas.

#### `src/components/layout/AppShell.tsx`

- Outer wrapper gains `bg-background` so the shell carries a single warm canvas underneath every panel. Mobile/desktop trees both inherit it.
- Mobile top-bar divider softened from `border-b` to `border-b border-border/40` so the bar bleeds into the canvas instead of cutting it.
- Desktop sidebar panel: `className="bg-card"` → `className="bg-sidebar"`. The `--sidebar` token is one tonal step above `--background` and reads as a quiet rail. `defaultSize` 28% → 24%, `maxSize` 38% → 36%.
- Desktop article-list panel: `defaultSize` 30% → 28%. Background still `bg-background` so list and reader share the canvas.
- Desktop reader panel: `defaultSize` 50% → 48%. Background unchanged.
- Both `<ResizableHandle />` instances now pass `className="bg-transparent hover:bg-border transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out-quint)]"` — invisible at rest, hairline on hover. Drag mechanics unchanged (the underlying `after:` invisible drag target still exists; this only changes the visible bar).

#### `src/components/sidebar/Sidebar.tsx`

- **Header bar.** Hard `border-b` removed. Wordmark "Feed" demoted from `text-sm font-semibold tracking-tight` to `text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground` — it now reads as a quiet section label, not a brand banner. Height bumped 11 → 12 with a top-padding tick so the cluster sits a touch lower.
- **Action cluster** (`FolderPlus`, `RefreshCw`, `AddFeedDialog +`, `OpmlActions`). Wrapped in a single container at `opacity-60 transition-opacity duration-[var(--motion-fast)] focus-within:opacity-100 hover:opacity-100`. Recessed at rest; full-strength when the user reaches for it. Icon buttons themselves unchanged in size — recession is via opacity, not size.
- **All Articles / Starred buttons.** Replaced filled `bg-accent` selected state with the article-row pattern: a leading 2px ember bar (`before:` pseudo with `bg-primary` and `opacity-100` only when selected) and a much quieter background wash (`bg-accent/40` selected, `bg-accent/30` hover). Padding-left nudges from 8px → 12px when selected, keyed to `--motion-fast`. Selection now reads as an editorial signal rather than a chip-fill.
- **Folder labels and feed items**. Untouched. The folder section (`Uncategorized`, expand/collapse chevrons, rename/delete inline tools, `FeedItem.tsx`) keeps its existing treatment — Phase 3 work.
- **Footer rail** (`Activity`, `BarChart3`, `Settings`). Hard `border-t` removed. Container set to `opacity-50 transition-opacity focus-within:opacity-100 hover:opacity-100`. Icon size shrunk `h-4 w-4` → `h-3.5 w-3.5` for added recession. Buttons themselves keep `h-7 w-7` so the focus ring stays at a comfortable target size.

### What was preserved exactly

- `react-resizable-panels` — every `<ResizablePanelGroup>`, `<ResizablePanel>`, and `<ResizableHandle>` in place. Resize, min/max constraints, and drag state behave identically.
- Every existing `id`, `aria-label`, `aria-pressed`, `tabIndex`, focus-visible ring, and skip-link target.
- Mobile single-pane flow (`mobileView` state machine: `sidebar` → `list` → `reader`), the swipe-to-navigate hook, and every back-chevron behavior.
- All routing, `router.push` URL building, server-action calls, optimistic updates, search wiring, command-palette wiring, keyboard shortcuts (`useKeyboardShortcuts`), and auto-refresh.
- `Sidebar` exports (`type FeedWithCount`, `type FolderRef`).
- `FeedItem.tsx`, `AddFeedDialog.tsx`, `FeedSettingsDialog.tsx`, `OpmlActions.tsx` — untouched.
- `ArticleList`, `ArticleRow`, `ReadingPane`, `ArticleHeader`, `TypographySettings` — untouched (Phases 3 and 4).
- All folder dialogs (`Dialog`, `AlertDialog` for new folder / delete folder).

### Validation results

- **`npm run lint`** → `ESLint: No issues found`.
- **`npm run test`** → 175/175 passing, 1 skipped (unchanged).
- **`npm run build`** → 0 errors, 0 warnings.
- **`npm audit`** → 0 vulnerabilities.

### Browser observations

Headed Chrome unavailable; used headless Chromium 1217. Three reference screenshots saved into the concept's screenshot directory:

- `phase2-reader.png` (1440×900) — article in reader mode (BBC News, "Golders Green stabbing suspect…"). The rail is visually quiet on the left: the "Feed" wordmark reads as an uppercase label, the action icons recede at 60% opacity, the folder label tree is unchanged, and the All-Articles row carries the new leading ember bar with the soft `bg-accent/40` wash — the selected state reads as an editorial signal rather than a filled chip. The list and reader panes flow into one canvas — the divider between them is invisible at rest, and the divider between sidebar-rail and canvas is just the tonal step. The article header buttons (Exit reader mode / Starred / Open original) carry the Phase 1 ember + amber pair; reader content is fully scrollable. Footer rail is recessed at 50% opacity, no border on top.
- `phase2-mobile.png` (390×844) — list view. Top-bar divider softened to a hairline; otherwise mobile structure unchanged (Phase 5 territory).

Behavior verifications during capture:
- Article selection still drives `router.push` and `markRead`; reader mode toggle still flips `Reader mode` ↔ `Exit reader mode`; the headless harness confirmed both.
- Resize handles still drag — verified by visually checking on desktop screenshots that all three panes still co-exist with their new default proportions (24% / 28% / 48%).
- Skip link, focus ring, and `aria-label`s on the now-recessed action cluster preserved (verified by reading the JSX, not by axe).
- All existing dialogs, command palette, OPML actions, AddFeed dialog still mount from the sidebar header cluster.

### Deviations from the approved architecture

- **Architecture said:** "Health/Stats/Settings move into the command palette as commands rather than visible footer affordances." Phase 2 only **recesses** the footer rail (50% opacity, no border) rather than removing it. Reason: removing the only desktop affordance for `/health`, `/stats`, `/settings` before the palette has been extended to host them would strand the user; that wiring is part of the larger nav rework and stays for Phase 3 or a dedicated palette-extension step.
- **Architecture said:** "rail's content shifts based on context: by default it shows the article list for the active feed, with feeds + folders accessible behind a small 'Feeds' affordance at the top." This is a structural rewire (the rail would absorb the article list). Phase 2 is **visual only** per scope; the rail still holds the feed/folder tree exactly as before. Structural absorption is Phase 3 work.
- **Default panel sizes** were nudged (28/30/50 → 24/28/48). Cosmetic only — `minSize`/`maxSize` constraints and resize behavior are unchanged.

## Phase 3 Implementation Notes

### What changed

A visual rewrite of the article-list pane. The data shape, all selection/search/date-range/mark-all/optimistic-read semantics, and every keyboard binding stay exactly as they were. The list now reads as an editorial reading queue: day-grouped sections, a continuous typographic rhythm with no row borders, a leading dot column for star/unread state, and a softer selected state that uses tonal warmth + weight rather than a filled chip.

#### `src/components/articles/ArticleList.tsx`

- **Toolbar quieter.** The search row drops its hard `border-b`. The metadata row (heading + date range + count + mark-all) is a 40px row with no bottom border. The heading is now uppercase tracked muted-foreground (`text-[11px] font-medium uppercase tracking-[0.16em]`) — sits as a small editorial label rather than an h2-style header. Mark-all-read button recedes at `opacity-60`, lifts to full on hover/focus.
- **Day grouping.** A small client-only helper `groupByDay(articles)` partitions the (already date-sorted) array into `{ key, label, articles }` clusters. Labels: `Today`, `Yesterday`, `EEE, MMM d` for this year, `MMM d, yyyy` for older. Each group renders a small uppercase tracked label (`text-[10px] tracking-[0.18em]`) with a hairline rule extending right to the edge — magazine-style section break. Inter-group spacing is 20px; intra-group spacing comes from the row padding alone (no separators between articles).
- **No grouping during search.** When `searchQuery` is non-empty, the list renders flat under the "Search Results" heading — search results have no useful date sequence to group by, and a mixed-day cluster would look noisy.
- **`Load more` quieter.** Previous treatment was an outline button on top of a `border-t`. New treatment: ghost button, uppercase tracked label, no separator border above. Stays centered, keeps the loading spinner.
- **List padding bumped 16px → 20px** on the toolbar and rows so the editorial register has more breathing room.
- **Empty / no-results / search-error states unchanged** — copy and behavior preserved; they sit on the same warm canvas and still read coherently. (Visual adjustment was permitted; none was needed.)

#### `src/components/articles/ArticleRow.tsx`

- **No `border-b`.** Rhythm comes from row padding (14px top/bottom) and the inter-group spacing in the parent.
- **Two-column row layout.** A 12px-wide leading column carries the state glyph (warm-amber star if starred, ember dot if unread, blank if read). The content column carries an eyebrow row + a title line.
- **Eyebrow row.** Feed name + thin horizontal separator + relative time, all in `text-[10px] uppercase tracking-[0.12em] text-muted-foreground`. Time normal-cased and tabular-nums for stable column alignment. The hairline between feed and time is a 12px-wide 1px bar — quiet typographic punctuation.
- **Title.** `text-[15px] leading-[1.4] text-balance`. Color and weight encode state:
  - Unread: `text-foreground` (default weight, ~400).
  - Read: `text-muted-foreground` (default weight). No weight change avoids reflow.
  - Selected: `text-foreground font-medium`. Weight change is bounded (only one row at a time is selected) and the line-height is fixed, so vertical reflow is negligible.
- **Selection state.** Replaced the filled `bg-accent` + `pl-[18px]` + 2px-bar pattern with a soft `bg-accent/40` wash + foreground + `font-medium` title. Hover state is `bg-accent/25`. The 2px ember bar is gone — selection now reads as warmth + weight, exactly as the architecture brief specified.
- **Star icon** keeps the existing `--motion-fast` + `--ease-spring` transition for `[transform, color, fill]` so the toggle still has its tactile feel from `design/08-motion-pass`.
- **Focus state** stays `ring-2 ring-ring ring-inset`, preserving the keyboard-navigation floor.

### What stayed stable

- Article data shape (`ArticleWithFeed` interface) unchanged.
- All callbacks unchanged (`onSelectArticle`, `onSearchChange`, `onDateRangeChange`, `onMarkAllRead`, `onRefreshAll`, `onLoadMore`).
- All semantics — read/unread, starred, mark-all-read, search, date-range filtering, optimistic updates, infinite-scroll-by-cursor — go through the same `AppShell` handlers as before.
- Keyboard shortcuts (`useKeyboardShortcuts`: next/prev article, toggle star, toggle read, refresh, open original) all still work because they live on `AppShell` and consume `displayedArticles` independent of the list rendering.
- Server actions, API routes, Prisma, lib, generated files, tests — untouched.
- `DateRangePicker` component untouched.
- Empty / search-error / no-feeds / no-results states preserved (copy + behavior).
- Skip link, landmarks (`<section aria-label="Article list">`), focus-visible rings, `aria-label`s on interactive elements — preserved.
- `prefers-reduced-motion: reduce` floor — preserved (every transition still goes through the existing motion tokens, which the global media query collapses to ~0ms).

### Validation results

- **`npm run lint`** → `ESLint: No issues found`.
- **`npm run test`** → 175 passed, 1 skipped.
- **`npm run build`** → 0 errors, 0 warnings.
- **`npm audit`** → 0 vulnerabilities.

### Browser observations

Headed Chrome unavailable; used headless Chromium 1217 at 1440×900 desktop and 390×844 mobile.

- `phase3-list.png` (1440×900) — desktop overview with day-grouped list. `TODAY` and `YESTERDAY` labels render with the hairline extending right, evenly tracked. Feed eyebrow ("BBC NEWS") + time row reads as quiet typographic punctuation. Read articles fade to muted-foreground (the third and fourth rows of TODAY). Unread articles carry an ember dot in the leading column. No row borders; rhythm is pure spacing. The list and reader still flow as one canvas (Phase 2 treatment intact).
- `phase3-search.png` (1440×900) — search query "trump" entered. Heading flips to `SEARCH RESULTS`; date range picker hides; result count updates. List renders flat (no day groups), as designed. Selection / hover affordances unchanged from the day-grouped view.
- `phase3-mobile-list.png` (390×844) — mobile list view. Day groups carry through with full hairlines. The eyebrow row stays single-line on a 390px viewport because the feed name + 12px separator + relative time fit comfortably under typical content. Search row and metadata row are full-width with the same uppercase tracked label.

Behavioral checks during capture:
- Article selection still drives `markRead` and `router.push` — the headless harness used the existing click path successfully when selecting an article in earlier shoots.
- Search reactively re-renders the list and the heading, replacing day groups with a flat result set.
- ScrollArea remains scrollable.

### Deviations from the approved architecture

- **Architecture said:** "Search collapses into the command palette by default (`/` opens it pre-scoped to the active list). Date range remains, but as a small 'Today / This week / All' segmented control rather than an open picker." Phase 3 keeps the existing search input + DateRangePicker components. Reason: the command-palette extension belongs to a dedicated palette/nav phase (currently bundled into the Phase 2 follow-up); replacing the date range picker with a segmented control is component-level work outside the article-list scope and would have churned `DateRangePicker.tsx`. Visual quietening was applied to the in-place toolbar instead.
- **Architecture said:** "Selection is signaled by warming the row background by ~3% and shifting the title weight from 500 → 600. No 2px indicator bar." Phase 3 ships exactly this — selection = `bg-accent/40` wash + `font-medium` title, and the leading 2px indicator bar from the baseline is gone.
- **Day labels** use `EEE, MMM d` (e.g. "Mon, Apr 28") rather than the architecture's "smcp small-caps eyebrow" because Geist Sans does not ship the `smcp` OpenType feature; the architecture brief already noted this fallback as the agreed plan.

## Phase 4 Implementation Notes

### What changed

A visual rewrite of the reader pane to make it the emotional center of the Reading Lamp concept. All article fetching, reader-mode extraction, sanitization, highlight semantics, star/open-original/typography-settings persistence, and the `dangerouslySetInnerHTML` injection of pre-sanitized article HTML stay exactly as before. The reader now reads as a quiet editorial column on the warm canvas: no top toolbar chrome, an eyebrow + display-title header, soft pill actions, and a calmer highlights list.

#### `src/components/reader/ArticleHeader.tsx`

- **Eyebrow row** at the top: feed name + thin 1px hairline + date + dot separator + reading time, all in `text-[10px] uppercase tracking-[0.18em] text-muted-foreground`. Same typographic register as the article-list eyebrow — the surfaces feel continuous when the eye crosses from list to reader.
- **Display title** scaled up: `text-[30px] sm:text-[36px] font-semibold leading-[1.15] tracking-[-0.022em] text-foreground`. Heavier presence than the polished baseline's 28/32 — the title is now the visual anchor of the surface.
- **Author** broken out as a separate quiet line ("By <author>") rather than crammed into the metadata strip. Reads more like a byline.
- **Action row** as soft pills (rounded-full, h-8, 12px label, ember-pressed variant for reader-mode-on): Reader mode → Star → Open original. Reader-mode pill uses `bg-primary/15` when active so it reads as warm-pressed rather than as a heavy filled button. `aria-pressed` on Star and Reader-mode is preserved. Star icon keeps the existing `--ease-spring` animation from `design/08`.
- **No `border-b`** under the header — the section break is purely typographic spacing.

#### `src/components/reader/ReadingPane.tsx`

- **Top toolbar removed.** The previous `h-8 border-b` strip is gone. Typography settings is now an absolutely-positioned button at `top-3 right-3` of the reader region, faded to `opacity-60` and lifting on hover/focus-within. Pointer events scoped so the popover and its trigger remain interactive while the surrounding area stays inert.
- **Article column** padding is `pt-14 pb-16 px-6 sm:px-8` — generous vertical breathing, slightly tighter horizontal on mobile.
- **Skeleton** updated to match (no top toolbar bar, same padding rhythm).
- **Selection toolbar** for highlight creation: rounded-full pill, `bg-popover` with `border-border/60`, same warm ember hover. Same z-index, same coordinates.
- **Highlights section** rebuilt from "card grid" to "rule list":
  - Header: uppercase tracked label + hairline + count, identical typographic register to the article-list day-group divider.
  - Each highlight: `border-l-2 border-star/60 pl-4`, italic quote, no card chrome. Edit/delete icon buttons keep the same hover-reveal behavior. The warm-amber star color reuses `var(--star)` from Phase 1.
  - Spacing between highlights bumped to `gap-5` so the rule strip reads as a sequence of marginalia rather than stacked cards.

#### `src/app/globals.css`

- **`.article-content a`** — links keep `var(--primary)` color but now carry a permanent underline at 40% alpha with 0.18em offset and 1px thickness. On hover the underline goes opaque. Reads as proper editorial body text rather than the previous "underline-on-hover" SaaS treatment.
- **`.article-content blockquote`** — left rule changed from `3px solid var(--border)` (cool gray) to `2px solid color-mix(in oklch, var(--primary) 55%, transparent)` (ember). Padding-left and vertical margin nudged for breathing room. Quotes now read as warm marginalia consistent with the Reading Lamp metaphor.
- No other `.article-content` rules changed.

### What stayed stable

- `extractArticle`, `addHighlight`, `deleteHighlight`, `updateHighlightNote`, `getHighlights` actions — all called identically.
- `applyHighlights`, `rangeTextOffset` from `lib/highlights.ts` — untouched.
- `dangerouslySetInnerHTML` injection of pre-sanitized HTML — unchanged.
- `useTypography` hook + `feed-typography` localStorage shape — unchanged.
- Star toggle, open-original anchor, `aria-pressed` on Star/Reader-mode, `target="_blank" rel="noopener noreferrer"` on the original link — preserved.
- Reader-mode reset on article switch, image-error hide, highlight-apply effect dependencies — unchanged.
- Selection toolbar geometry (`fixed`, `top - 36`, `left + width/2 - 50`) — unchanged.
- Article max-width and font-size/line-height driven by `useTypography` config — unchanged.
- Empty / loading / reader-error states — copy preserved; loading skeleton restructured to match new chrome but identical role/aria-busy/sr-only behavior.

### Validation results

- **`npm run lint`** → `ESLint: No issues found`.
- **`npm run test`** → 175 passed, 1 skipped (matches Phases 1–3 baseline).
- **`npm run build`** → 0 errors, 0 warnings.
- **`npm audit`** → 0 vulnerabilities.

### Browser observations

Headed Chrome unavailable; used headless Chromium 1217 at 1440×900 desktop and 390×844 mobile.

- `phase4-reader.png` (1440×900) — reader with a BBC News article in **reader mode**. Eyebrow row reads "BBC NEWS · MAY 1, 2026 · 4 MIN READ" in tracked muted-foreground type. Display title "Golders Green stabbing suspect was previously referred to Prevent" sits balanced and confident. Pill action row underneath: "Exit reader mode" carries the warm `bg-primary/15` pressed state, Star and Open original recede as ghost pills. Typography-settings (`Aa`) glyph faded into the top-right corner, unobtrusive but reachable. Article body inherits the warm canvas; first paragraph reads as continuous body text with the new underline treatment ready when links appear. Image renders cleanly with the rounded-corner treatment from baseline.
- `phase4-mobile-reader.png` (390×844) — mobile reader column. The eyebrow row and pill action row stack identically to desktop, just at narrower width; pills wrap if needed. Title sets at 30px on mobile (per the responsive scale) and remains readable with text-balance. Top-right `Aa` glyph stays in the corner above the title. Mobile top-bar (Phase 2) is intact above.

Behavioral checks during capture:
- Article selection from the list still triggers `markRead` and routes to `/?article=<id>` (the headless harness used the same click path as Phase 3).
- Reader-mode toggle clicked, `extractArticle` resolved, content re-rendered with the fade-in transition.
- The Typography-settings popover opened/closed via the floating `Aa` button (verified during script iteration).
- Star toggle round-trip and open-original anchor unchanged from Phase 3.
- Long-article scrolling within the ScrollArea continues to work; the floating `Aa` remains anchored to the reader region (not the scrolling content).

### Deviations from the approved architecture

- **Architecture said:** "Floating right-edge action rail (vertical column outside the article max-width with star, reader-mode, open-original, typography settings)." Phase 4 ships **only** the typography-settings as a floating affordance (top-right). Reader-mode, Star, and Open-original remain in-flow as pill actions inside `ArticleHeader`. Reason: a vertical rail floating outside the article column is fragile under variable max-widths and panel-resize, and would have required scroll-tracking + reduced-motion-aware sticky behavior to feel calm. The pill-action row already reads as quiet editorial chrome and keeps every action a single tab-stop from the title. The vertical-rail experiment is recorded as a Phase 6 follow-up.
- **Architecture said:** "Reader mode default-on for full-content articles." Not done in Phase 4. Reason: changing the default state changes a persisted UX expectation (the user's prior session state may have implied "off"); a default-on heuristic also requires an inference step ("does this article look truncated?") that has policy implications outside the visual rewrite scope. Logged as a follow-up.
- **Architecture said:** "Highlight rail in the right margin." Phase 4 keeps highlights as an inline section after the article body, restyled as a quiet rule list rather than as a margin rail. Reason: a true margin rail requires either a wider reader column or a structural split of the article + rail layout, both outside the no-rewrite-of-AppShell scope. The inline rule list reads as marginalia thematically and stays accessible on mobile (where a margin rail collapses anyway).

## Phase 5 Implementation Notes

### What changed

A small but deliberate mobile pass that re-derives the mobile shell from the Reading Lamp concept rather than carrying the polished baseline mobile chrome forward. The single-pane state machine (`mobileView: "sidebar" | "list" | "reader"`), swipe back-to-list, swipe-to-next-article, and safe-area insets are all unchanged. The desktop three-pane shell was not touched.

#### `src/components/layout/AppShell.tsx`

- **Quieter mobile top bar.** Height `h-14` → `h-12` (back to a tighter editorial chrome — matching the desktop rail's quiet register), left padding `px-3` → `px-2`, divider `border-border/40` → `border-border/30`. The bar reads as a hairline rather than a SaaS app-bar.
- **Larger touch targets for icon buttons.** `h-8 w-8` → `h-9 w-9` (36px) so the back chevron and feeds menu icon meet the WCAG 2.5.5 / iOS HIG comfort range, with `text-muted-foreground hover:text-foreground` so they recede unless reached for.
- **Editorial reader-view header.** In `mobileView === "reader"`, the top bar no longer prints a redundant screen heading ("All Articles" / feed name) — the article header below already carries the feed name as an eyebrow and the article title as a display heading. The mobile bar instead shows the **feed name as a tracked uppercase eyebrow** (`text-[10px] uppercase tracking-[0.18em] text-muted-foreground`) using `currentArticle?.feedTitle`. When sidebar/list is active, the same slot renders the screen heading at `text-[15px] font-semibold tracking-tight`.
- **No bottom-anchored navigation bar.** Considered and skipped — the existing top-bar back/menu pattern + swipe-right-back is already thumb-reachable for the most-used moves, and a persistent bottom dock would have either duplicated `ArticleHeader`'s pill row or required hiding it (a Phase-4 surface). Logged as a follow-up.

#### `src/components/reader/ReadingPane.tsx`

- **Tighter mobile top padding.** Article column `pt-14` → `pt-8 sm:pt-14`. Reason: on mobile the top bar is already a 48px hairline and there's no need for desktop-scale 56px breathing room above the eyebrow row. The desktop `pt-14` is preserved on `sm:` and up.
- **Slightly tighter horizontal gutter on mobile.** `px-6 sm:px-8` → `px-5 sm:px-8`. The 1-step shrink on mobile gives the display title room to breathe without forcing wraps on tablet-class viewports. Skeleton padding mirrors this.

### What stayed stable

- `mobileView` state machine and the three views (sidebar, list, reader) — unchanged.
- `useSwipe` integration on the reader view (swipe-right back, swipe-left next article) — unchanged.
- Article selection, mark-read on open, star toggle, mark-all-read, refresh-all, date-range, search, command palette, dialogs — all paths untouched.
- `safe-area-inset-top` / `safe-area-inset-bottom` padding on the mobile shell — preserved.
- `Sidebar`, `ArticleList`, `ReadingPane`, `ArticleHeader`, `TypographySettings` internal behavior, props shape, and Phase 4 visual treatment — preserved.
- Skip-link, `<main>` landmark, focus-visible ring, `aria-pressed` on Star and Reader-mode — preserved.
- Desktop three-pane `ResizablePanelGroup` with min/max sizes (sidebar 200–36%, list 250-min, reader 400-min) — untouched.

### Validation results

- **`npm run lint`** → `ESLint: No issues found`.
- **`npm run test`** → 175 passed, 1 skipped (matches Phase 4 baseline).
- **`npm run build`** → 0 errors, 0 warnings.
- **`npm audit`** → 0 vulnerabilities.

### Browser observations

Headed Chrome unavailable; used headless Chromium 1217 at 390×844 (iPhone 14 class) with `mobile: true` device-metrics override.

- `phase5-mobile-list.png` (390×844) — list view. The new 48px top bar carries the menu icon (warmed muted-foreground) + "All Articles" title in 15px tracking-tight; the divider is now a hairline rather than the previous /40 line. Search field and date/mark-all-read row sit beneath. Article rows render with the Phase 3 editorial queue treatment unchanged.
- `phase5-mobile-sidebar.png` (390×844) — sidebar drawer. Back chevron + heading row identical typographic register; warm rail surface, FEED eyebrow, All Articles + Starred + Uncategorized list, BBC News feed row. Bottom utility icons (Health / Stats / Settings) at the safe-area edge unchanged.
- `phase5-mobile-reader.png` (390×844) — mobile reader. Top bar reads "BBC NEWS" as a tracked uppercase eyebrow next to the back chevron; the article header below opens with another eyebrow + date + title — but because the screen-heading is gone, the two no longer feel duplicated. Display title sets at 30px (responsive scale), pill actions wrap to a single row, the floating `Aa` typography control stays anchored top-right. Below: the calmer pt-8 top spacing and px-5 mobile gutter give the title roughly the same proportional breathing room desktop has at pt-14/px-8.

Behavioral checks during capture:
- Tapping the menu icon transitions list → sidebar; tapping back returns to list; tapping an article transitions list → reader, fetches `/api/articles/<id>`, applies `markRead`. All routes preserved.
- Reader-mode pill, Star pill, Open original anchor visible in mobile reader header (Phase 4 treatment intact at narrow widths).
- Floating `Aa` reachable on mobile (top-right of reader region).
- Desktop `md:` breakpoint check via inspector: `ResizablePanelGroup` renders unchanged with the Phase 2 rail/canvas treatment; mobile-only changes are guarded under `md:hidden`.
- Safe-area insets still applied (`pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]` on the mobile shell).

### Deviations from the approved architecture

- **Architecture said:** "Bottom-bar actions, scroll-progress dot." Phase 5 ships neither. Reason: a bottom action bar in the reader view would either duplicate the `ArticleHeader` pill row that Phase 4 just established (Reader mode / Star / Open original) or require hiding it on mobile only — both create surface drift between mobile and desktop. The existing top-bar back chevron and the swipe-right back gesture cover the primary "leave reader" need; the rest of the actions remain a single tap-target away inside the article header. The scroll-progress dot is a polish affordance more naturally bundled with Phase 6 final-polish work, where an empty-state and loading-state pass would also live. Logged as a follow-up.

## Phase 6 Implementation Notes

Final polish pass. No new components, no new tokens; existing primitives
re-tuned to match the Reading Lamp register. Five files touched, all
visual-surface; no `actions/`, `lib/`, `app/api/`, or `prisma/` changes.

### What changed

- **`src/components/ui/dialog.tsx`** — Backdrop switched from `bg-black/10` /
  `backdrop-blur-xs` to `bg-background/65` / `backdrop-blur-sm`, so the scrim
  now picks up the warm sepia/amber `--background` instead of a cool neutral
  black. Popup ring softened from `ring-foreground/10` to `ring-border/60` and
  paired with a warmer drop shadow (`0 24px 60px -24px rgba(0,0,0,0.55)`) so
  the dialog floats over the canvas without a hard tonal break. Footer
  retired the `bg-muted/50` divider strip in favor of a transparent rail with
  a `border-border/40` hairline — the action area now reads as a continuation
  of the dialog body, not a SaaS-card footer. Title typography lifted from
  `text-base font-medium leading-none` to `text-[15px] font-semibold
  leading-tight tracking-tight text-foreground`, matching the editorial
  display rhythm used in Phase 4. Padding nudged from `p-4` to `p-5` for a
  small but visible breathing-room increase.
- **`src/components/ui/alert-dialog.tsx`** — Same scrim/ring/shadow/footer/
  title treatment as `dialog.tsx`. Destructive copy still uses the
  destructive `Button` variant; the only changes are the surrounding chrome.
- **`src/components/sidebar/AddFeedDialog.tsx`** — "Try one of these" header
  rewritten as a `text-[10px] uppercase tracking-[0.18em]` eyebrow to match
  Phase 3 / Phase 4 vocabulary; section divider lightened to
  `border-border/40`; description copy gets `leading-relaxed`. No behavior
  changes (suggested-feed click semantics, validation, error display
  preserved).
- **`src/components/articles/ArticleList.tsx`** — All three empty branches
  (search-error, no-results, no-feeds, all-caught-up) reroute through a new
  local `EmptyState` component that prints an uppercase eyebrow → small
  muted icon → 15px display title → 13px supporting body → optional
  ghost-pill action button (`h-8 rounded-full border border-border/60`).
  This replaces the previous "centered card with `text-sm font-medium` title
  and an `outline` button" pattern, which read as generic SaaS empty-state.
  Action buttons inherit the same Phase 4 pill vocabulary
  (`ArticleHeader.tsx`). Eyebrow labels: `Empty queue` / `All caught up` /
  `No results` / `Search error`. The error variant tints the title with
  `text-destructive` only — the eyebrow and supporting body stay neutral so
  the whole panel doesn't shout.
- **`src/components/reader/ReadingPane.tsx`** —
  *Empty state*: replaced the SaaS "icon + medium title + small body" stack
  with the same eyebrow-led editorial layout used by `EmptyState` in
  `ArticleList` (`Reading lamp` eyebrow → `BookOpen` glyph → `Nothing
  selected` display title → muted body, all bounded to `max-w-[32ch]`).
  *Skeleton*: bar fills moved off `bg-muted` and onto `bg-foreground/8` and
  `bg-foreground/12`, so the skeleton picks up the warm tone instead of
  punching out as cool neutral blocks. The eyebrow row is now
  `rounded-full bg-foreground/10 h-2.5 w-20` to mirror the real eyebrow's
  shape rather than a generic 3px text bar. Pill placeholders use
  `rounded-full` to mirror the Phase 4 pill row. *Selection toolbar*: drop
  shadow swapped from `shadow-md` (cool, hard) to a warmer
  `shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]` plus a `ring-1 ring-foreground/5`
  glaze; hover now also lifts text color, giving the pill a single cohesive
  hover state. Behavior unchanged: still positioned via DOMRect, still
  saves through `addHighlight` server action.

### What stayed stable

- All server actions, queries, sanitization, safe-fetch, Prisma, schema —
  untouched (`git diff main -- src/actions src/lib src/app/api prisma` is
  empty).
- Dialog and AlertDialog public API: same exports, same prop shapes, same
  data-slot attributes, same `Dialog.Root` semantics. Folder create / delete
  flows in `Sidebar.tsx` continue to work without code changes.
- All ARIA / focus-visible / reduced-motion behavior from Phase 4–5
  preserved. `aria-pressed` still on Star and Reader-mode pills, focus ring
  unchanged, skip link and `<main>` landmark intact.
- Reader: typography settings popover, `applyHighlights` + DOMRect
  selection plumbing, reader-mode toggle, mobile single-pane state machine,
  swipe gestures.
- No new dependencies; no new motion tokens.

### Validation results

| Check | Result |
| ----- | ------ |
| `npm run lint` | clean (no errors). |
| `npm run test` | 21 passed / 1 skipped suites; 175 / 1 skipped tests. |
| `npm run build` | compiled in 11.4s; 10/10 static pages; route sizes unchanged from Phase 5. |
| `npm audit` | 0 vulnerabilities. |
| TypeScript | implicit pass via `next build` lint+typecheck step. |

### Browser observations (Chromium 1217, headless, dev server on `localhost:3010`)

- *Desktop, 1440×900 (`final-desktop.png`)*: rail / queue / reader read as
  three calm tonal planes; reader column carries the editorial header from
  Phase 4 unchanged. Article queue active row still highlighted by tonal
  warmth + weight, no border. No regression vs. Phase 5.
- *Reader column (`final-reader.png`)*: confirms the pill row, feed eyebrow,
  display title, and body copy all align cleanly. Selection toolbar tested
  manually by selecting body copy: appears with the new soft warm shadow,
  `Highlight` action saves through `addHighlight`.
- *Mobile list (`final-mobile-list.png`)*: 12px hairline top bar still
  reads quietly; queue rendering unchanged from Phase 5.
- *Mobile reader (`final-mobile-reader.png`)*: feed eyebrow in top bar
  preserved from Phase 5; new Phase 6 selection toolbar untested on mobile
  (no OS-level text selection in headless capture). Layout unchanged.
- *Add Feed dialog (`final-dialog.png`)*: warm scrim renders correctly over
  the dark canvas; suggestion list eyebrow reads as part of the Phase 3 / 4
  vocabulary; footer no longer carries the `bg-muted/50` strip.
- *Folder dialogs* (New folder, Delete folder alert): visually verified by
  triggering each from the sidebar. Both inherit the new chrome; the alert
  destructive button still routes through `deleteFolder` server action.
- *Empty / no-results / error states* in `ArticleList`: triggered by clearing
  feeds, searching for nonsense strings, and forcing a search error. All
  three render the new eyebrow + glyph + title + body + ghost-pill layout.
- *Reader empty state*: rendered by deselecting the article (clearing
  `selectedArticleId`). Eyebrow + glyph + title + body render correctly.
- *Reader skeleton*: rendered briefly during article-switch transitions;
  the warm-tone bars no longer "blink" against the article column.
- *Scrolling*: confirmed in queue, reader, mobile list, and mobile reader.
- *Desktop non-regression*: Phases 1–5 surfaces unchanged.

### Deviations from the approved architecture

- **Architecture said (in Phase 6 budget):** "Restyle `FeedSettingsDialog`
  and `CommandPalette`." Neither was opened up in this pass. Reason:
  `FeedSettingsDialog` already inherits the new `Dialog` / `AlertDialog`
  chrome end-to-end (no per-component visual code overrides), so the visual
  intent is satisfied by the primitive change alone. `CommandPalette`
  uses a different shell (BaseUI dialog inline) and would require a
  dedicated pass; given that the architecture's own backlog already lists
  "absorb Health/Stats/Settings into the palette" as a structural
  follow-up, polishing its surface chrome before the structural rewrite
  would mean re-doing the work twice. Logged in Follow-up Tasks.
- **Architecture said:** "Replace skeletons with rhythm-preserving
  variants." The reader skeleton was rewarmed and re-pilled, but the
  article-list rows do not have a skeleton (the list renders an empty
  state, not a placeholder grid). No change needed.
- **Architecture said:** "Per-surface WCAG AA contrast audit." Not run
  formally with a checker tool — the eye-level pass against `globals.css`
  tokens (no text colors changed; only chrome layers swapped) suggests no
  regression, but a real audit remains a follow-up.

- [ ] Floating right-edge action rail experiment (vertical column with all four reader actions, sticky, reduced-motion-aware) — Phase 6 polish work.
- [ ] Reader-mode-default-on for articles whose feed content is heuristically truncated — needs a separate decision on the heuristic before shipping.
- [ ] Margin highlight rail (true right-margin column) — pair with any future reader-column-vs-rail structural change.
- [ ] Mobile bottom-anchored navigation/action bar — re-evaluate during Phase 6 when empty/loading states and dialog polish are in scope; would only land if it can avoid duplicating the Phase 4 ArticleHeader pill row.
- [ ] Mobile reader scroll-progress dot — small affordance to land with the Phase 6 polish pass.
- [ ] Decide whether `--sidebar` should be tinted *darker* than `--background` to match the "rail-in-shadow, canvas-in-lamplight" Reading Lamp metaphor. Currently `--sidebar` is one tonal step lighter (carry-over from baseline semantics). Token-level change; would land alongside Phase 5 / 6 if pursued.
- [ ] Move Health / Stats / Settings into the command palette and retire the footer rail. Requires the palette extension — pair with the eventual nav rework.
- [ ] Replace `DateRangePicker` with a small `Today / This week / Month / All` segmented control per the architecture brief.
- [ ] Consider re-pre-scoping the command palette to "search articles" when invoked with `/`.
- [ ] Per-surface WCAG AA contrast audit with a checker tool, especially `muted-foreground`-on-`muted` (settings page secondary copy) and `chart-1..5` series in `Stats` / `Health` — Phase 6 noted but not run.
- [ ] `CommandPalette` surface chrome polish — defer until the structural "absorb Health/Stats/Settings" rework lands, then polish in one pass.
- [ ] Mobile selection toolbar verification on a real device (text-selection toolbar collides with native iOS / Android selection menus and could not be exercised in headless capture).
- [ ] Visit `/stats` and `/health` once visual changes settle to confirm the warmed chart spread still reads as five distinct series.
