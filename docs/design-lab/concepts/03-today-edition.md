# Concept 03 — Today Edition

> Planning-phase document. No implementation files have been touched. Architecture below is the synthesis of three Claude Skills passes (redesign-existing-projects → design-taste-frontend critique → gpt-taste critique → revision). The Skills Usage Notes and Skill Critique Summary sections at the bottom record what each skill contributed and which recommendations were accepted or rejected.

## Metadata

- Concept name: **Today Edition**
- Branch: `concept/03-today-edition`
- PR: TBD
- Status: **Planning**
- Created: 2026-05-04
- Last updated from main: `5cca753` (Merge Command Center gallery entry)
- Baseline: `lab-polish-v1`
- Skills/tools explicitly used: `redesign-existing-projects` (primary, architecture), `design-taste-frontend` (critique — visual hierarchy, layout, frontend execution risk), `gpt-taste` (critique — taste, originality, anti-AI-tells), Claude Code. `minimalist-ui` deliberately not used. `emil-design-eng` deferred to a later interaction-polish phase.
- Screenshot directory: `docs/design-lab/screenshots/concepts/03-today-edition/`

## Summary

Feed becomes a **local-first daily edition** generated from the user's own RSS subscriptions. On each new day, the front page composes a single editorial spread: a lead well, two or three secondary wells, sections that mirror the user's existing folders, and a "later" tray for everything that did not earn a slot. The edition is *fixed for the day* — it does not re-shuffle on every refresh. Reading still happens in the canonical reader; the front page is the new entry experience. No AI summaries, no cloud personalization, no new backend data — everything composed from articles already in SQLite.

## Product Metaphor

**A daily issue of a small, well-bound paper that you publish to yourself every morning.** Not a feed, not a dashboard, not a command surface. A bound front page with hierarchy, sections, and a masthead. You open it, you read what is above the fold, you skim the inside pages, and you put the rest in the later tray. Tomorrow's edition is a different document.

Anchors: Apple News Today's lead well, Flipboard cover stories, NYT/Guardian/FT print front pages, Are.na boards, Read.cv editorial blocks. **Not** a card grid. **Not** a magazine-themed SaaS dashboard.

## Design Intent

- **Who.** A reader who subscribes to 20–80 sources and wants a *finite* daily reading session, not an infinite stream. Distinct from Concept 02's triage operator and Concept 01's quiet single-article reader.
- **Feeling.** Calm authority. Print confidence. Curated, but transparently so — every well, every section is composed from local SQLite using deterministic rules the user can read on the page, not from a hidden algorithm.
- **Problem.** RSS readers default to *infinite chronological list*; this is anxious, defeating, and treats every article as equal. Today Edition imposes *editorial hierarchy* on the same data: one lead, a few seconds, sections, the rest deferred.
- **Challenges to current UI.** The always-three-pane shell, the chronological list as the entire identity, the equal-row article register, and the dark-cool indigo palette. The reader is preserved; everything before the reader is rebuilt around the front page metaphor.

## Product Thesis

A daily edition is a **constraint**, not a generator. It does not invent content; it composes a fixed-for-the-day arrangement of articles already fetched. The arrangement uses signals already in the schema — recency, source, folder, star history, read state, feed health — combined deterministically by a date-seeded local routine. A user can audit *why* a given article led the issue ("from `@arstechnica`, posted 6h ago, in folder *Tech*, top of unread queue"). Originality lives in the layout grammar and the typographic register, not in a fake intelligence.

## What This Concept Is Testing

1. Whether **finite**, **dated** editions reduce reading anxiety vs. a chronological stream.
2. Whether an **editorial typographic register** (serif display headlines, asymmetric grid, drop caps, rule-divided sections) is viable without dragging in card-grid SaaS slop.
3. Whether layout variety can be *deterministic and explainable* (date-seeded), so the same input produces the same edition all day, but tomorrow's looks different.
4. Whether `redesign-existing-projects` plus a taste critique pass produces a concept distinguishable from a generic AI "magazine UI" output.

## Difference From `lab-polish-v1`, Concept 01, Concept 02

| Axis | `lab-polish-v1` | Concept 01 / Reading Lamp | Concept 02 / Command Center | **Concept 03 / Today Edition** |
| --- | --- | --- | --- | --- |
| Primary loop | Browse list → read | Read one article in lamp light | Triage queue, batch-act | Open today's edition → pick from spread |
| Identity surface | Three-pane shell | Reader pane pooled in warm light | Context bar + queue + palette | **Front-page spread** |
| Layout | Resizable three columns | Three-pane recessed, reader-first | Mode-aware grid shell | **Asymmetric editorial grid** (broken / masonry / split) per edition |
| List register | Dense rows | Editorial rows | Cockpit queue | **Hierarchy of wells**: lead, seconds, sections, later-tray |
| Color | Cool indigo dark | Warm sepia ink | Cool slate, single cyan | **Off-black ink on warm paper-tinted dark**, single deep accent (rust or oxblood) |
| Type register | Geist sans throughout | Geist sans, generous prose | Geist sans + heavy mono kbd chips | **Serif display headline (e.g. Newsreader / Source Serif), Geist sans body, Geist mono only for datelines and edition stamp** |
| Motion | Subtle fade | Lamp cross-fade | Mode cross-fade, palette spring | **Stagger-on-load entry per well**, then static; refresh = new edition transition |
| Mobile | Stacked single-pane | Same with reader-first | Bottom command bar | **Vertical issue scroll** (lead → seconds → sections), pull-to-refresh = new edition |

If the three siblings were rooms, `lab-polish-v1` is a study, Concept 01 is a reading nook, Concept 02 is a control room, and Concept 03 is the kitchen counter where the morning paper is folded open with coffee.

## Interaction Metaphor

**A bound daily issue.** The front page is composed once per local day (and on explicit refresh) and presented as a fixed document — not a live stream. Affordances inside the issue:

- **Cover well.** One article. Large display headline, source eyebrow, 1–3 line dek (RSS description, sanitized), optional hero image (already in canonical schema as `imageUrl`).
- **Seconds.** Two to three secondary stories. Smaller headline, terser dek, optional thumbnail.
- **Sections.** Each user folder becomes a section ribbon (e.g. *Tech*, *Politics*, *Reading*). Each ribbon shows 3–6 items in a typographic list — no boxed cards, only rules and whitespace. Folder-less feeds collapse into a *General* section.
- **Later tray.** Everything else that did not place. A small-print, dense list at the bottom of the issue. One click expands it inline. This is the explicit relief valve for completionists.
- **Masthead.** Edition number (day-of-year), local date, total unread, last-refresh, refresh action. The newspaper "nameplate" — small but real, not decorative.
- **Open an article.** Standard reader behavior preserved. Reader is its own page or slide-over (see Layout). Closing returns to the same edition with read-state visually marked (struck-through dek, read tag, dim color).
- **Refresh.** Pull-to-refresh on mobile / refresh in masthead on desktop. Triggers existing `refreshAllFeeds`; on completion, the edition can recompose if new articles outranked existing ones — this is **explicit**, not silent. A small "Edition refreshed" stamp animates in the masthead.

## Primary User Feeling

Calm, oriented, finite. *"I am reading today's paper. When I'm done with it, I'm done."* The opposite of doom-scroll. Editorial confidence, not algorithmic mystery. Print warmth in dark mode without becoming kitsch.

## Layout Architecture

Replace the three-pane resizable shell with a **single-column issue document** on the entry route, with the reader as a slide-over (desktop) or full-screen page (mobile).

**Desktop / wide (`≥ 1024px`):**

A 12-column CSS Grid with `grid-template-columns: repeat(12, minmax(0, 1fr))` and `grid-auto-flow: dense`, max-width `1280–1360px`, generous outer margins. Cell assignments come from a small **layout grammar** seeded by the local date — the same date deterministically picks one of N pre-defined spread patterns so the edition does not shape-shift mid-day:

- **Pattern A — Broadsheet.** Cover spans cols 1–8, full hero image at top of cover. Seconds stack on cols 9–12. Sections as full-width rule-divided ribbons below. Later tray as small-print final block.
- **Pattern B — Two-up.** Cover and one second share the top row (cols 1–7 / 8–12). Three further seconds across cols 1–12. Sections below as before.
- **Pattern C — Inverted spread.** Two seconds at the top (cols 1–6 / 7–12), cover below them spanning 1–12 with hero image dominant. Sections below.
- **Pattern D — Editorial vertical.** Cover left (cols 1–5), three seconds right (cols 6–12) stacked. Sections below.
- (Optional Pattern E reserved for low-volume days when there are not enough unread articles to fill A–D — single hero, no seconds, sections become the body of the issue.)

The pattern is selected by `dayOfYear % patternCount` against the user's local date, computed in the client component. **No new backend.**

**Sections** below the cover/seconds use the same 12-column grid but with simple rule-divided typographic lists (no card boxes). Each section ribbon: section title (small caps, deep accent), section dek (one-line description e.g. *6 unread, 2 starred-source, 1 trending*), then 3–6 items as headline + meta. A "see all in *Tech*" link routes to the canonical filtered list view (existing behavior).

**Later tray** is a single full-width band at the bottom of the issue. Closed by default — collapsed to "and N more →". Clicking expands to a tight 3-column typographic grid of remaining unread, sorted by recency.

**No always-visible sidebar.** Feed/folder management is reachable through:
- The masthead's "Manage feeds" link → routes to a dedicated `/feeds` page reusing the existing `Sidebar`/`FeedItem` components inside a single-pane editorial layout.
- The command palette (`⌘K` from Concept 02 — kept available, reused as-is).

**Reader** is preserved unchanged. It opens as a **slide-over from the right** on desktop (covering the issue) and as a **full-screen route** on mobile. The slide-over uses the existing `ReadingPane` component verbatim. Closing returns to exactly the same scroll position in the issue.

**Tablet (`768–1023px`):** Patterns A–D collapse to a 6-column grid with cover always full-width, seconds in a 2-up row, sections inline.

**Mobile (`< 768px`):** Strict single-column scroll. Cover → seconds (one per row) → sections (one per row, items as a typographic list) → later tray. No grid math at this width.

## Navigation Model

- `/` route renders the **Today Edition** (default).
- `/feeds` renders the feed-management page (existing sidebar components).
- `/article/[id]` (if needed for direct article links) reuses the reader; on the issue route the reader is a slide-over without changing the URL, only updating it via `router.replace` for shareability.
- `/health`, `/stats`, `/settings` unchanged.
- Command palette (`⌘K`) reused from Concept 02. Provides the keyboard escape hatch to all features. Keeps the issue from becoming a navigation dead-end.
- Existing keyboard shortcuts (`j/k`, `s`, `m`, `r`, `Shift+R`, `o`, Enter) preserved when the reader is open. New shortcuts on the issue surface: `1` jump to cover, `2` jump to seconds, `3..` jump to nth section, `Enter` open the focused item, `Esc` close reader.

## Component Architecture

| Component | Action | Notes |
| --- | --- | --- |
| `AppShell.tsx` | New shell rewrite — issue layout instead of three-pane. Hosts `Masthead`, `IssueGrid`, `LaterTray`, slide-over `ReadingPane`. | Three-pane resizable layout retired on `/`. `ResizablePanelGroup` may be reused on `/feeds` if useful, otherwise dropped. |
| `Sidebar.tsx`, `FeedItem.tsx`, `OpmlActions.tsx`, `FeedSettingsDialog.tsx`, `AddFeedDialog.tsx` | Reused inside `/feeds` page. Restyled lightly to match editorial register but functionally unchanged. | No structural change. |
| `ArticleList.tsx`, `ArticleRow.tsx`, `DateRangePicker.tsx` | Reused inside `/feeds` per-feed view (existing filtered list). | Not the primary surface anymore. |
| `ReadingPane.tsx`, `ArticleHeader.tsx`, `TypographySettings.tsx` | Reused verbatim inside the slide-over. | Existing reader preserved. |
| `CommandPalette.tsx` | Reused from Concept 02 (or polished baseline if we cherry-pick only `lab-polish-v1`'s palette). Updated entries to include "Open today's edition", "Refresh edition", "Show later tray", "Open `/feeds`". | Decision in Phase 2: which palette baseline to start from. |
| `globals.css` | New tokens: paper-tinted dark surfaces, deep accent (rust/oxblood), serif display var, editorial spacing scale, rule-thickness scale, drop-cap utility. | Existing motion vars retained. |
| **New UI-only components** under `src/components/edition/`: `Masthead`, `IssueGrid`, `CoverWell`, `SecondaryWell`, `SectionRibbon`, `SectionItem`, `LaterTray`, `EditionStamp`, `ReadStateMarker`, `Dek`, `Eyebrow`, `Rule`, `IssueSlideOver`. | All visual / compositional. None touches server actions, lib, or schema. |

**Local-only edition composer** (a pure client utility, e.g. `src/lib/edition.ts` — *new file, but client-only and read-only over existing data*; this is the one new lib file proposed and is in scope because it does no I/O and adds no dependency). Inputs: the same data the current home Server Component already loads (articles + feeds + folders + counts). Output: a structured edition object — `{ cover, seconds[], sections[], later[] }`. Selection rules are deterministic and documented inline:

1. **Cover:** highest-scoring unread article, where score = recency weight × source-trust weight × image-bonus. Source-trust derives from existing signals (low `errorCount`, presence of a starred article in last 7 days). Image-bonus when `imageUrl` is non-null. Fall back to "newest unread."
2. **Seconds:** next 2–3 unread articles, deduplicated by source so the cover and seconds are not all from the same feed.
3. **Sections:** group remaining unread by `folderId`; one section per folder with ≥ 1 unread, ordered by total unread descending. Folder-less unreads form a *General* section. Each section shows up to 6 items.
4. **Later tray:** the rest. No cap (or capped at 200 for performance, with "see all" linking to existing filtered list).
5. **Empty edition:** if there are zero unread, show a designed empty state — "You finished today's edition" + a link to *Yesterday* (last 24h read items, from existing data) and a refresh button.
6. **Recompose trigger:** only on (a) explicit refresh (b) crossing a local-day boundary (c) read-state changes (which only mark items struck-through, not reorder).

This composer must be reviewed in Phase 1 to confirm it stays read-only and adds no dependency. If `src/lib/` is considered off-limits per the hard constraint, the composer moves under `src/components/edition/edition.ts` instead.

## Visual Direction

Editorial, warm-dark, ink-on-paper. Carefully *not* a sepia clone of Concept 01.

- **Color (dark mode primary).** Background warm off-black with warm-gray tint (e.g. `oklch(0.16 0.008 60)` — a warmer neutral than the cool indigo of `lab-polish-v1`). Foreground near-paper-white at `oklch(0.94 0.005 60)`. Single deep accent — **rust** or **oxblood** at `oklch(0.55 0.13 35)` (deep red-orange). Used for masthead nameplate, section eyebrows, the read-state marker, and the cover-well dek's lead-in. Star color reused from canonical (`oklch(0.78 0.13 85)`). No second accent. No gradients. No glow.
- **Typography.**
  - **Display headlines:** Serif with editorial weight via a **system serif stack** for the concept phase: `ui-serif, "Iowan Old Style", "Charter", "Source Serif 4", "Newsreader", Georgia, serif`. **Decided 2026-05-04:** no Google Font addition during the concept — keep local-first, no network/font dependency. If Today Edition becomes a finalist and the serif identity proves essential, adding one Google Font (Newsreader / Source Serif 4) via `next/font/google` is captured as a finalization follow-up.
  - **Eyebrow / section labels:** Geist Sans, small caps, `tracking-[0.12em]`, `font-weight-500`, accent-colored.
  - **Dek and body:** Geist Sans, `text-[15.5px] leading-[1.55]`, `text-wrap: pretty`, max-width ~65ch.
  - **Datelines and edition stamp:** Geist Mono, tabular-nums, small. The mono is the "print-press" signature.
  - **No Inter.** Geist (already shipped) is the sans; the new serif is the only addition.
- **Material.** Hairline rules (1px `border-foreground/12`) divide sections. **No card boxes** — anywhere. The hierarchy comes from typography, scale, and rules — not from elevation. Tinted shadow only on the slide-over reader (subtle, hue-matched to background).
- **Drop cap.** The cover dek opens with a 3-line drop cap in the serif. One per issue. No drop caps elsewhere.
- **Imagery.** When an article has `imageUrl`, the cover well shows it as a wide hero (existing image-proxy route). Treatment: subtle warm-toned duotone or grayscale-to-warm filter via CSS only — no JS, no canvas, no new dependency. Aspect ratio 16:9 or 4:3 depending on pattern. Alt text from article title.
- **Grid texture.** A *very* faint paper-grain noise overlay on the body background (`fixed inset-0 pointer-events-none`, single SVG noise filter, ~3% opacity). Skip on `prefers-reduced-motion` and skip on mobile to avoid GPU cost. Pure CSS/SVG — no library.
- **Anti-AI signature.** No purple/blue accents, no rounded card grids, no neon glow, no AI gradient. A serif display + warm dark + rust accent + hairline rules + drop cap is the explicit fingerprint *against* default AI output.

## Motion / Interaction Direction

Restrained. Reading is the primary act; motion is choreography around the reader, not on top of it.

- **Edition entry (load).** The issue mounts with a staggered fade-in: masthead first, then cover (180ms `--ease-out-quint`), then seconds (cascading 60ms each), then sections (one block at a time, 90ms apart). Total ≤ 600ms. Pure CSS `animation-delay` cascade based on a `--index` variable on each well — no motion library.
- **Reader slide-over open.** 220ms transform translate from the right + opacity fade of the issue beneath to ~0.4. Close: reverse, 180ms. Existing `ReadingPane` reused.
- **Read-state strikethrough.** When an article is marked read inside the reader and the reader closes, the matching headline animates a 1px strike from left to right (140ms) and the dek dims to `text-foreground/40`. Pure CSS keyframe.
- **Refresh.** Masthead refresh button: subtle accent ring rotate while pending. On completion: a 1px rust-colored underline draws across the masthead's edition stamp left → right (200ms), then fades.
- **Hover.** Headlines underline on hover (1px), 80ms. Cover hero image: 600ms ease-out 1.02 scale on hover only on `min-width: 1024px` (taste cue, not bait).
- **`prefers-reduced-motion`.** All transitions collapse to a single 80ms opacity fade. Entry stagger disabled. Strikethrough becomes instant.
- **No scroll-jacking, no parallax, no perpetual loops, no GSAP.** The page holds still while you read.

## Mobile Strategy

The mobile experience is **the same edition, vertical**. Not a squashed grid; a real document.

- Single-column scroll. Cover at the top with hero image full-bleed. Seconds below, one per row, optional thumbnail at right. Sections as ribbons. Later tray expands inline.
- **Sticky masthead** on scroll: collapses to a thin bar showing edition number + accent dot when fresh. Tapping the bar scrolls back to the cover.
- **Pull-to-refresh.** Triggers `refreshAllFeeds`; on completion, masthead stamps "Edition refreshed". If the cover changes, a brief crossfade swaps the headline.
- **Reader = full screen.** Tapping any item routes to the canonical reader page. Back returns to exact scroll position.
- **Bottom tab bar** with three affordances only — *Today*, *Feeds*, *Search* — opens only on small screens. Center "search" tap opens the command palette as a full-screen overlay (reused from Concept 02 if available; otherwise a simpler mobile palette).
- **Gestures.** Swipe left from inside the reader → next article in the issue's reading order (cover → seconds → sections in display order). Swipe right → close reader.
- One-thumb operable: every interactive target ≥ 44px.

## Accessibility Strategy

- Skip-to-content link preserved (currently in `AppShell`).
- Semantic landmarks: `<header>` (masthead), `<main>` (issue), `<section>` per ribbon with `aria-labelledby`, `<article>` for cover, seconds, and items, `<aside>` for the later tray, `<nav>` if a bottom tab bar is added.
- Headline links: `<a>` with descriptive `aria-label` when the visible text is shortened.
- Cover hero image: real `alt` from article title; decorative noise overlay marked `aria-hidden`.
- Reader slide-over: `role="dialog"`, `aria-modal="true"`, focus trap, focus restored to the originating headline on close, `Esc` closes.
- Drop cap: `aria-hidden="true"` on the visual span; the full first letter still appears in the accessible string.
- Read-state strike: also expressed as `aria-label="(read)"` on the link, not only visual.
- Layout patterns A–D verified for keyboard tab order: top-to-bottom, left-to-right by visual reading order, even when the grid reflows visually.
- `prefers-reduced-motion` honored (see above).
- Contrast: rust-on-warm-dark accent verified WCAG AA at body and small sizes; Phase 9 audit gates on this.
- Tabular-nums on all datelines and edition stamps so they don't shift width.
- The deterministic-by-day routine documented inline in the layout source so a sighted user can read *why* this edition looks the way it does — accessibility of *intent*, not just of markup.

## What Must Stay Stable

`src/actions/`, `src/app/api/`, `src/lib/` (with the **single** documented exception of a new client-only read-only `lib/edition.ts` composer, to be reviewed in Phase 1; if rejected, the composer moves under `src/components/edition/`), `prisma/`, generated Prisma client, DB schema, persistence model, RSS/Atom behavior, OPML semantics, sanitization pipeline, safe-fetch, reader/highlights/star/mark-read/folder/search/settings/stats/health behavior, `package.json`, `package-lock.json`. **No new runtime dependencies under any phase.** The optional Google Font addition is captured as a finalization follow-up only — concept phases ship with a system-serif stack and zero dependency change.

## What Changes

- **Layout.** Three-pane resizable shell retired on `/`. New asymmetric editorial grid with day-seeded patterns A–D. `/feeds` is the new home for feed management.
- **Sidebar/navigation.** Sidebar removed from the home route; surfaced on `/feeds` and through the command palette.
- **Article list.** Replaced on `/` by the issue (cover + seconds + section ribbons + later tray). Original `ArticleList` reused on `/feeds` and on filtered routes.
- **Reader pane.** Reused verbatim. Hosted in a slide-over (desktop) or full-screen route (mobile).
- **App chrome.** Masthead replaces the toolbar. No persistent sidebar.
- **Typography.** Serif display introduced, Geist Sans body retained, Geist Mono limited to datelines and stamps, drop cap on cover.
- **Color/material.** Warm-dark off-black, single rust/oxblood accent, hairline rules, no card boxes.
- **Motion.** Stagger-on-load + slide-over reader + read-state strike. No perpetual motion, no GSAP.
- **Mobile behavior.** Vertical issue scroll, sticky masthead, pull-to-refresh, bottom tab bar.

## Affected Files / Surfaces

| Area | Expected files | Risk level | Notes |
| ---- | -------------- | ---------- | ----- |
| App shell (home route) | `src/components/layout/AppShell.tsx`, `src/app/page.tsx` (only if route shape needs to change) | High | Largest single change; Phase 3 commits to this. |
| Edition composer | `src/lib/edition.ts` *(new, client-only, read-only)* — or fallback `src/components/edition/edition.ts` | Medium | Read-only over existing data; no I/O; no dependency. Phase 1 reviews exact location. |
| Edition components | `src/components/edition/*` (new: `Masthead`, `IssueGrid`, `CoverWell`, `SecondaryWell`, `SectionRibbon`, `SectionItem`, `LaterTray`, `EditionStamp`, `ReadStateMarker`, `Dek`, `Eyebrow`, `Rule`, `IssueSlideOver`) | Medium | All visual; no server interaction. |
| Feeds page | `src/app/feeds/page.tsx` *(new)*, reusing existing `Sidebar.tsx`, `FeedItem.tsx`, `ArticleList.tsx` | Low | Wraps existing components in a single-pane editorial layout. |
| Tokens | `src/app/globals.css` | Medium | Add paper-tinted dark, rust accent, serif var, drop-cap utility, rule scale. |
| Reader | `src/components/reader/ReadingPane.tsx`, `ArticleHeader.tsx`, `TypographySettings.tsx` | None | Reused as-is in slide-over. |
| Palette | `src/components/CommandPalette.tsx` | Low | Add issue-specific entries. No structural change. |
| Mobile shell | inside `AppShell.tsx` | Medium | Bottom tab bar + sticky masthead behavior. |
| Server actions / API / Prisma / lib/* (excl. edition composer) | — | None | Untouched by mandate. |

## Implementation Phases

Phase 1 lands directly on `concept/03-today-edition` (docs only). Each subsequent phase lands on a **flat** child branch named `concept/03-today-edition-NN-<slug>` (flat, because nested names conflict with the parent ref). Per the project's concept-phase workflow: validate → review → commit on child → `git merge --no-ff` into `concept/03-today-edition` → delete local child branch.

| # | Branch | Scope |
| --- | --- | --- |
| 1 | `concept/03-today-edition` (this branch) | Concept architecture and docs — *this phase*. Doc + scaffolding only. |
| 2 | `concept/03-today-edition-02-foundation` | Design-system / visual foundation. Extend `globals.css` with paper-tinted warm-dark, rust accent, system-serif var, drop-cap utility, rule and editorial spacing scales. Add `Eyebrow`, `Rule`, `EditionStamp`, `Dek` primitives. No layout change yet. **No Google Font addition** — system serif stack only. **Status: implemented (uncommitted) on this branch.** |
| 3 | `concept/03-today-edition-03-shell` | Edition shell + masthead. Mount `EditionMasthead` above the existing layout on desktop; nameplate, edition stamp (date + day-of-year), counters (unread/starred/sources), command-palette launcher pill, refresh and mark-all actions, nav links to Starred/Health/Stats/Settings. Three-pane layout temporarily preserved beneath the masthead — content modules and `IssueGrid` are Phase 4. Edition composer + unit tests deferred to Phase 4. **Status: implemented (uncommitted) on this branch.** |
| 4 | `concept/03-today-edition-04-issue-grid` | Edition composer (component-local, pure client, read-only, deterministic) and issue content modules: `EditionIssue` with cover + seconds row + per-feed section ribbons (alphabetic + day-of-year rotation) + later tray. Unit tests for cover selection, seconds cap, section grouping, item-cap overflow, day-rotation wrap, later-sort. **Status: implemented (uncommitted) on this branch.** Patterns A–D layout grammar deferred to Phase 7; hero-image / duotone / drop cap on dek deferred (no description data in `ArticleWithFeed`). |
| 5 | `concept/03-today-edition-05-reader` | Edition-native article-detail surface (`EditionStoryDetail`) hosts existing `ReadingPane` verbatim, with sticky "Back to edition" bar, story-position stamp, "Up next" module, focus management, and Esc-to-back. `.edition-story` CSS scope re-skins `ArticleHeader` editorially without touching the shared component. **Status: implemented (uncommitted) on this branch.** `/feeds` page deferred to a later phase. |
| 6 | `concept/03-today-edition-06-mobile` | Mobile edition shell: compact `EditionMobileMasthead` (sticky, single-row nameplate + edition stamp + palette + refresh), `EditionMobileTabBar` (fixed bottom: Today / Search / Starred / Feeds / More), edition-native mobile flow that renders `EditionIssue` and `EditionStoryDetail` full-screen on phones, three-pane mobile fallback retained for filtered/starred/search. **Status: implemented (uncommitted) on this branch.** Pull-to-refresh deferred (would require a gesture/state controller; not in scope for the chrome pass). |
| 7 | `concept/03-today-edition-07-secondary-states` | Empty edition, low-volume Pattern E, error state, loading skeletons matching the issue grid. Palette entries updated. **Status: implemented (uncommitted) on this branch.** Editorial empty states for `no-feeds` (Vol. I · No. 1 onboarding) and `no-articles` (— FINIS — finished-edition reward); Pattern E light-edition colophon when total ≤ 2; collapsible Later tray (peek 4 + chevron toggle); editorial loading skeleton + `STOP PRESS` error state on `EditionStoryDetail`; new `.edition-skeleton-line` CSS utility honoring `prefers-reduced-motion`. Three-pane fallback for search/starred/feed-filter intentionally untouched. |
| 8 | `concept/03-today-edition-08-closure` | Full validation (lint, test, build, audit), browser review desktop+mobile, contrast audit on rust-on-warm-dark, reduced-motion audit, backend-invariant verification, screenshots, concept-doc decision. |

A possible **Phase 9 (`concept/03-today-edition-09-polish`)** invokes `emil-design-eng` for hover/focus/transition micro-polish *after* Phase 8 baseline screenshots exist — this is intentional sequencing so the polish skill operates on a real artifact, not on a sketch.

A possible **finalization step** (only if the concept becomes a finalist) adds the Google Font (Newsreader / Source Serif 4) via `next/font/google` as a deliberate identity move — captured as a follow-up, not a phase.

## Phase 2 Implementation Notes

Done on child branch `concept/03-today-edition-02-foundation`. Scope: visual foundation only — tokens and utilities — no layout, no shell changes, no component redesign.

### What changed

`src/app/globals.css` only.

- **Editorial token namespace `--edition-*`** introduced under both `:root` (light fallback) and `.dark` (primary). Defined in *parallel* with the existing palette so the current UI keeps rendering unchanged.
  - Surfaces: `--edition-paper`, `--edition-paper-elevated`, `--edition-ink`, `--edition-ink-muted`, `--edition-ink-faint` — warm neutrals at hue 60 (warm), distinct from the cool indigo (hue 250) of the polished baseline.
  - Hairline rules: `--edition-rule`, `--edition-rule-strong`. Single weight, two contrasts. No card boxes anywhere.
  - Single accent: `--edition-accent`, `--edition-accent-strong`, `--edition-accent-on` — rust/oxblood at hue 32–35, saturation < 0.18, intentionally below the AI-tells line.
  - Editorial spacing scale: `--edition-space-1..5` and `--edition-space-section` (`clamp(3rem, 6vw, 6rem)` — sections are real chapters per the gpt-taste massive-spacing rule).
  - Display scale: `--edition-display-cover` (`clamp(2.25rem, 4.6vw, 4.25rem)`), `--edition-display-second`, `--edition-display-section`. The cover scale is the encoded form of the 2-line iron rule from `gpt-taste`.
  - Drop cap: `--edition-drop-cap-size`, `--edition-drop-cap-leading`.
- **System serif stack** (`--font-serif-display`): `ui-serif, "Iowan Old Style", "Charter", "Source Serif 4", "Newsreader", Georgia, "Times New Roman", serif`. **No Google Font added.** Decision recorded in this doc; finalization-only follow-up.
- **Plain-CSS utilities** under the `.edition-*` namespace, defined at the end of the file:
  - `.edition-issue` — issue surface wrapper. Scopes warm-dark + ligature feature settings without overriding the global theme.
  - `.edition-display`, `.edition-display-cover`, `.edition-display-second` — serif headlines with tight tracking, balanced wrap.
  - `.edition-eyebrow` — small caps, `tracking-[0.12em]`, accent-colored.
  - `.edition-dek` — Geist sans body, `text-wrap: pretty`, `max-width: 65ch`.
  - `.edition-stamp` — Geist mono, tabular-nums, the print-press signature.
  - `.edition-rule`, `.edition-rule-strong` — hairline `<hr>` styles.
  - `.edition-drop-cap` — first-letter drop cap on the cover dek.
  - `.edition-surface` — cardless inner padding helper.
  - `.edition-stagger` — pure-CSS entry-stagger keyframe driven by `--edition-index` per child. No motion library. Honors `prefers-reduced-motion` via the existing global rule (which collapses transitions and animations to ~0ms).

No component file was modified. No new dependency. No new font network request. No primitive React component was added — Phase 2 is CSS-only foundation; primitives (`Eyebrow`, `Rule`, `EditionStamp`, `Dek`) will be introduced as small React wrappers in Phase 3+ when they actually have a consumer.

### What stayed stable

- All existing tokens (`--background`, `--foreground`, `--primary`, `--accent`, `--sidebar*`, motion tokens) untouched. Existing components render identically.
- No change to `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`, generated Prisma client, `package.json`, `package-lock.json`. Backend invariant holds.
- No new dependency installed.
- Existing dark-mode UI on `/`, `/health`, `/settings`, `/stats` rendered HTTP 200 and visually unchanged in spot-check.

### Validation results

- `npm run lint` — clean (eslint exits 0, no output).
- `npm run test` — **175 passed, 1 skipped**, 21 test files passed, 1 skipped. 7.46s.
- `npm run build` — succeeds. All routes generated. Shared CSS chunk grew slightly (CSS-only addition).
- `npm audit` — **found 0 vulnerabilities**.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty. Backend invariant holds.

### Browser observations (dev server, port 3001)

- `/` renders 200, baseline three-pane shell visually unchanged. No layout break, no contrast regression, scrolling intact.
- `/health`, `/settings`, `/stats` render 200, no regressions.
- Editorial tokens (`--edition-*`, `--font-serif-display`) confirmed shipped in the route CSS bundle (verified via `grep` on `/_next/static/chunks/*.css`).
- No console errors observed in the server log during the smoke test.

### Google Font deferred — note

Per the user's Phase 2 instruction (2026-05-04): no Google Font added during the concept phase. The `--font-serif-display` token uses a system serif stack with `Iowan Old Style` (macOS), `Charter` (macOS / iOS / various), `Source Serif 4` (if locally available), `Newsreader` (if locally available), `Georgia` (universal), `Times New Roman`, generic `serif` fallback. The font *identity* of Today Edition is therefore typeface-agnostic during the concept phase — what's tested is the editorial register (display weight, tracking, hierarchy, drop cap, eyebrow contrast), not a specific named typeface. If the concept becomes a finalist, the finalization follow-up adds one Google Font via `next/font/google`.

### Deviations from plan

- Phase 2 originally listed `Eyebrow`, `Rule`, `EditionStamp`, `Dek` as React primitives. They were instead introduced as plain-CSS utility classes under the `.edition-*` namespace. React wrappers are deferred to Phase 3+ where they will have actual consumers — adding empty wrapper components in Phase 2 would be premature abstraction without a caller.

### Follow-ups carried into later phases

- Phase 3+: introduce React primitives `Eyebrow`, `Rule`, `EditionStamp`, `Dek` only when consumed by `Masthead` / `IssueGrid` / `CoverWell`.
- Phase 8: contrast audit on `--edition-accent` (rust) over `--edition-paper` (warm-dark) at body and small sizes — Phase 2 did not gate on this because no foreground content yet uses the accent at small sizes.
- Phase 8: verify `prefers-reduced-motion` collapses `.edition-stagger` cleanly (the global rule already forces transitions/animations to ~0ms, so this should be a verification, not a fix).

## Phase 3 Implementation Notes

Done on child branch `concept/03-today-edition-03-shell`. Scope: edition frame and masthead only — no content-module work, no edition composer, no mobile redesign, no reader changes.

### What changed

- **New component** `src/components/edition/EditionMasthead.tsx` (client component). Editorial masthead displayed above the app shell on desktop (`hidden md:flex`):
  - Top row: serif **"Today"** nameplate (links to `/`), eyebrow weekday + Geist-mono **edition stamp** in the form `№124 · May 4, 2026` (day-of-year zero-padded), and a right cluster with the **command-palette launcher pill** (`⌘K`), refresh-all icon button, and mark-all-read icon button.
  - Lower row: `<dl>` of counters (Unread / Starred / Sources) using small-caps `.edition-eyebrow` labels and tabular-nums `.edition-stamp` values, plus an `aria-label`-ed `<nav>` with **Starred** (toggles starred view, `aria-pressed`), **Health**, **Stats**, **Settings** links.
  - Date computation lazy-initialized via `useEffect` to avoid hydration mismatch between server-time and client-time. The date span is also marked `suppressHydrationWarning` defensively. Updates every minute so the day-of-year flips on a session that crosses midnight.
  - Built entirely from Phase 2 tokens (`--edition-paper`, `--edition-ink*`, `--edition-rule*`, `--edition-accent`, `--font-serif-display`) and utility classes (`.edition-display`, `.edition-eyebrow`, `.edition-stamp`). No new tokens.
  - Uses `<button>` for actions (palette, refresh, mark-all, starred-toggle) and Next.js `<Link>` for routed nav. `role="banner"` on the `<header>`. `aria-pressed`, `aria-label`, `aria-hidden` applied appropriately. Focus-visible rings use the rust accent.
- **Modified** `src/components/layout/AppShell.tsx`:
  - Root container changed from `h-dvh w-screen overflow-hidden` to `edition-issue flex h-dvh w-screen flex-col overflow-hidden` so the masthead and main can stack as flex children.
  - `<EditionMasthead>` mounted between the skip-link and `<main>`, wired to the existing AppShell state: `totalUnread`, `starredCount`, `feeds.length`, `isRefreshing || isPending`, `isStarredView`, plus handlers `handleRefreshAll`, `handleMarkAllRead`, `setPaletteOpen`, `handleSelectStarred`.
  - `<main>` switched from `h-full` to `min-h-0 flex-1` so it fills the remaining viewport beneath the masthead. Both the mobile flex-column layout and the desktop `ResizablePanelGroup` continue to render unchanged inside.

### What stayed stable

- All routes, server actions, API endpoints, Prisma schema, lib utilities — untouched.
- Existing keyboard shortcuts, reader behavior, sidebar, article list, command palette dialog, search, date-range filter, refresh, mark-all-read, star toggle, swipe gestures — all still wired through the same handlers; the masthead only adds new entry points to the same actions.
- Mobile shell unchanged. Masthead is desktop-only; mobile keeps the existing hamburger + heading top bar (per the "do not redesign mobile deeply yet" constraint).
- Reader unchanged; still mounted in the desktop reading-pane and mobile `mobileView === "reader"` state.
- All existing tokens preserved; no dependencies added; no fonts added.

### Validation results

- `npm run lint` — clean.
- `npm run test` — **175 passed, 1 skipped** (22 files).
- `npm run build` — succeeds. `/` route grew slightly (+~1 kB) for the masthead client code.
- `npm audit` — **0 vulnerabilities**.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty. Backend invariant holds.

### Browser observations (dev server, port 3000)

- **Desktop `/`** renders the editorial masthead at the top: serif "Today" nameplate, "MONDAY" eyebrow, "№124 · May 4, 2026" mono stamp, palette pill, refresh + mark-all icon buttons, counters row (UNREAD 326 / STARRED 2 / SOURCES 2), nav (Starred / Health / Stats / Settings). Underneath, the existing three-pane sidebar/list/reader layout is preserved and fully functional.
- **Existing list/reader behavior** verified: feed selection, article selection, search, date-range filter, mark-all-read, refresh, star toggle still work through the masthead and the unchanged in-list controls.
- **Routes** `/health`, `/settings`, `/stats` all return 200. Settings reachable from masthead nav.
- **Command palette** opens via the masthead pill (in addition to `⌘K`); palette content unchanged.
- **Mobile** smoke at 414×820: existing layout intact (hamburger + heading + list). No regressions.
- **No console errors** reported by the dev server during the smoke; the `suppressHydrationWarning` on the date span prevents the expected SSR/CSR difference from logging.

### Screenshots

| File | Notes |
| --- | --- |
| `phase3-shell.png` | Desktop overview at 1440×900: masthead atop, three-pane preserved beneath. |
| `phase3-masthead.png` | Desktop masthead crop at 1440×200, after hydration: nameplate, weekday eyebrow, edition stamp, counters, palette pill, actions, nav. |
| `phase3-mobile-check.png` | Mobile at 414×820: existing chrome unchanged (masthead intentionally desktop-only this phase). |

(All under `docs/design-lab/screenshots/concepts/03-today-edition/`. The small "N" overlay at the lower-right of `phase3-shell.png` is the Next.js dev-mode devtools button, not part of the UI.)

### Deviations from plan

- The original Phase 3 listed `IssueGrid` skeleton, day-seeded patterns A–D, and the edition composer as in-scope. Those were **deferred to Phase 4** so this phase ships a focused, reviewable masthead+frame change without preempting the layout-grammar work. The Phase 4 row in the implementation table has been updated to absorb the composer + IssueGrid.
- The masthead is desktop-only (`hidden md:flex`). Mobile masthead is intentionally deferred to Phase 6 (mobile pass) per the explicit "do not redesign mobile deeply" constraint.

### Follow-ups carried into later phases

- Phase 4: build `IssueGrid` + composer + content modules; replace the three-pane content area beneath the masthead with the issue document.
- Phase 6: mobile masthead variant (compact single-row with nameplate + edition stamp + palette button).
- Phase 8: verify masthead contrast, focus rings, `prefers-reduced-motion`, and tab order across the new chrome.
- Optional refinement: the bottom counter row could move into the `IssueGrid` masthead-band in Phase 4, leaving the desktop masthead as a single thinner top bar. Decide once the issue document exists.

## Phase 4 Implementation Notes

Done on child branch `concept/03-today-edition-04-issue-grid`. Scope: the issue grid itself — composer + cover + seconds + section ribbons + later tray, mounted as the default desktop surface on `/`.

### Deterministic issue composition rule

`src/components/edition/composeIssue.ts`. Pure function over the article list already in `AppShell`. No backend, no new query, no external data. Given the server-supplied article order (publishedAt desc) and a `dayOfYear`:

1. **Cover** = `articles[0]`. Always exactly one.
2. **Seconds** = `articles[1..1+maxSeconds]` (default `maxSeconds = 3`).
3. **Sections** = remaining articles, grouped by `feedTitle`. A group becomes a section when it has at least `minSectionItems` (default 2). Each section caps at `maxSectionItems` (default 5). Items beyond the cap fall through to *Later*.
4. **Later** = everything else — singleton groups + per-section overflow — sorted by `publishedAt` desc.
5. **Section order** is alphabetic by `feedTitle`, then **rotated by `dayOfYear`** (`(dayOfYear % sections.length)`). Same dataset on the same calendar day → same edition; different day → predictably reshuffled section sequence. No randomness.

`dayOfYear` is computed client-side after hydration via `useEffect` (same approach as the masthead stamp) so SSR/CSR rendering doesn't disagree on the rotation.

Unit-tested in `composeIssue.test.ts` (9 cases): empty input, cover-only, seconds cap, group-into-section threshold, item-cap overflow into later, section rotation across `dayOfYear` 0/1/2/3 (wraps), later sorted desc, `dayOfYear` boundaries.

### What changed

- `src/components/edition/composeIssue.ts` (new) — composer + `dayOfYear`.
- `src/components/edition/composeIssue.test.ts` (new) — 9 unit tests, all passing.
- `src/components/edition/EditionIssue.tsx` (new) — the front page. Hosts `CoverStory`, `StoryCard` (variants `second` + `section`), `EditionSectionBlock`, `LaterTray`, `Dateline`, `RelativeTime`, and an inline `EditionEmpty` for the no-feeds / no-articles states. All composition done client-side from `AppShell`'s existing `articles`.
- `src/components/layout/AppShell.tsx` (+24 / −2) — desktop renders `<EditionIssue>` full-width when **unfiltered + nothing open** (`!selectedFeedId && !isStarredView && !search.results && !selectedArticleId`); otherwise the existing three-pane `ResizablePanelGroup` is shown. Mobile and reader behavior preserved verbatim.

### Editorial guardrails respected

- **No card boxes.** Modules separate via hairline rules (`--edition-rule` and `--edition-rule-strong`), section eyebrows, vertical rhythm.
- **No images required.** `ArticleWithFeed` has no image data, so the editorial fallback *is* the design — large serif headline + dateline + rule. Strongly intentional, not a stub.
- **Source transparency** on every module: feed name appears in the cover eyebrow, in every story-card eyebrow, on each later-tray row, and as the section header itself.
- **Read-state dimming** via `--edition-ink-muted` instead of strikethrough, preserving editorial tone.
- **No new dependency.** Uses existing `date-fns`, Lucide, `cn`. No font network call.
- **Backend invariant intact:** `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`, `package.json`, `package-lock.json` untouched.

### What stayed stable

- Sidebar feed selection, starred view, search results, article-open state all still flow through the existing three-pane layout. Nothing about the existing reader/list/sidebar wiring changed.
- Mobile layout untouched (Phase 6).
- Reader component untouched (Phase 5).
- Command palette, refresh, mark-all, OPML, feed management, /health, /stats, /settings all reachable as before.

### Validation results

- `npm run lint` — clean.
- `npm test` — 184 passed / 1 skipped across 22 files (added 9 composer tests).
- `npm run build` — succeeds; `/` first-load JS 252 kB (was 251 kB Phase 3).
- `npm audit` — 0 vulnerabilities.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty.

### Browser observations (1440×900 desktop, headless Chrome)

- `/` renders the Today Edition front page: rust **COVER · BBC News** eyebrow, large serif cover headline, mono dateline, hairline rule, three secondary stories in a `md:grid-cols-3` row, then a **HACKER NEWS** section ribbon below another rule. Reads as an editorial issue, not a card grid.
- `/health`, `/settings`, `/stats` all return HTTP 200 and visually unchanged.
- Mobile (414×820) returns the existing single-pane mobile layout — desktop EditionIssue is gated `hidden md:block` so phones still see the canonical mobile shell. Phase 6 will redesign mobile.
- Clicking a story selects the article (existing `handleSelectArticle`), which switches the desktop view to the three-pane reader as designed. Re-opening Today via the masthead nameplate (`/`) returns to the issue.

### Screenshots

- `phase4-issue-grid.png` — desktop unfiltered `/` showing masthead + cover + seconds row + section ribbon.
- `phase4-cover-story.png` — taller capture (1440×1400) showing the cover + seconds + first section in full.
- `phase4-mobile-check.png` — confirms mobile layout is unchanged at 414×820.

### Deviations from plan

- The original Phase 4 row mentioned hero images with duotone. `ArticleWithFeed` has no image field and the constraint forbids new server actions / API routes / lib changes, so images are intentionally not introduced. The editorial fallback (serif + rule + dateline) is the design. If images become a goal, that is a separate canonical-Feed proposal (extend the article shape upstream).
- `LaterTray` is rendered always-expanded, not collapsible. Collapsibility is a Phase 7 secondary-state polish, not Phase 4.
- Patterns A–D (layout grammar by `dayOfYear % patternCount`) collapsed to **one** pattern in this phase — the cover + seconds + section + later structure. The day-of-year rotation lives in section ordering instead. Multiple layout patterns are deferred to Phase 7.
- The default-desktop-only mounting strategy keeps the existing three-pane fully reachable: any feed click, starred toggle, search, or selected article falls back to the canonical layout. This was the simplest way to preserve the brief's "keep three-pane reachable" requirement without reskinning the reader (Phase 5).

### Phase 4 follow-up fixes

After review, two visual issues were caught in the masthead screenshot and fixed on this branch:

1. **Weekday localized to Spanish ("MARTES").** `EditionMasthead.computeStamp()` was calling `toLocaleDateString(undefined, …)`, which picked up the user's OS / browser locale. Pinned the locale to `"en-US"` (named constant `EDITION_LOCALE`) for both the weekday and the long date so the masthead always reads as an English-language edition stamp regardless of the runtime environment, keeping the issue deterministic.
2. **Bright white scrollbar against the warm-dark issue surface.** Added a scoped `.edition-scroll` utility in `globals.css` (Firefox `scrollbar-width` / `scrollbar-color`, WebKit `::-webkit-scrollbar*`). Thumb uses `color-mix(in oklch, var(--edition-rule-strong) 70%, transparent)` against a transparent track; brightens to `--edition-ink-faint` on hover/focus-within. Applied via class on the `<article>` scroll container in `EditionIssue.tsx`. Other concepts/pages keep their default browser scrollbars.

### Follow-ups carried into later phases

- Phase 5: open the reader as a slide-over **without** falling back to the three-pane, so the issue stays visible behind it.
- Phase 6: mobile issue layout (sticky masthead, bottom tab bar, vertical rhythm).
- Phase 7: secondary states — empty edition reward, low-volume Pattern E, error skeleton, loading skeleton, multi-pattern layout grammar.
- Phase 8: accessibility audit on the issue grid (landmarks, headings, focus order, contrast on rust on warm-dark).

## Phase 5 Implementation Notes

Done on child branch `concept/03-today-edition-05-reader`. Scope: article-detail surface — make opening a story from the issue feel native to Today Edition instead of dropping the user back into the canonical three-pane.

### What changed

- **New component** `src/components/edition/EditionStoryDetail.tsx` (client). Editorial detail surface that takes over the desktop main area when the user is in edition mode (`!selectedFeedId && !isStarredView && !search.results`) **and** an article is selected. Anatomy:
  - Sticky top bar inside the surface: small **"← Back to edition"** button on the left (rust accent on hover/focus, eyebrow type), a mono **`NN / TT` story-position stamp** on the right derived from the article's index in the displayed list. Bar uses `bg-[--edition-paper]/90 backdrop-blur` and a hairline `--edition-rule` divider.
  - Body: hosts the existing `<ReadingPane>` verbatim, wrapped in an `.edition-story` scope so internal scroll/chrome is neutralized and a single edition-styled scroll context is shared with the back-bar and the "Up next" module.
  - "Up next" module at the end of the article: editorial card with eyebrow + serif headline + feed dateline that selects the next article in the displayed list. Hidden when there is no next.
  - Focus management: the back button receives focus on mount via `useEffect` so keyboard users don't get stranded on the prior trigger. `Escape` (when not inside an input/textarea/contenteditable) returns to the edition.
- **New CSS scope** `.edition-story` in `src/app/globals.css`. Neutralizes the reader's internal `<ScrollArea>` (`height: auto; overflow: visible`), drops the typography-toolbar's hairline border (the back-bar already provides one), and re-skins `ArticleHeader` in the editorial register: serif `--font-serif-display` on `<h1>`, rust accent on the feed eyebrow, edition rule color on the header underline. Reader content adopts `--edition-ink`.
- **Modified** `src/components/layout/AppShell.tsx`. The desktop branching now:
  - Renders `<EditionIssue>` when in edition mode with no article selected.
  - Renders `<EditionStoryDetail>` (full-width, `hidden md:block`) when in edition mode with an article selected — passes `currentArticle`, `isArticleLoading`, `handleToggleStar`, `displayedArticles`, `selectedArticleId`, `handleSelectArticle`, and an `onBack` that clears `selectedArticleId` + `currentArticle`.
  - Falls back to the three-pane `ResizablePanelGroup` only for filtered/starred/search modes (`selectedFeedId || isStarredView || search.results`). Selecting an article in edition mode no longer drops the user into three-pane.

### What stayed stable

- `ReadingPane`, `ArticleHeader`, `TypographySettings`, highlight semantics, reader-mode extraction, star/open-original/highlight popover — all untouched. Their behavior survives intact inside the new wrapper.
- Article fetching (`/api/articles/[id]`), sanitization, `dangerouslySetInnerHTML` policy, server actions, Prisma, lib utilities, `package.json`, `package-lock.json` — untouched.
- Mobile layout unchanged. Mobile reader is still the existing single-pane flow; the deep mobile pass is Phase 6.
- Three-pane fallback fully reachable: clicking a sidebar feed, toggling Starred, or running a search restores the canonical three-pane shell. Nothing was removed.
- All existing keyboard shortcuts (`j`/`k`, `s`, `m`, `r`, `Shift+R`, `o`/Enter) still operate via the unchanged `useKeyboardShortcuts` hook. The new `Escape` handler only fires when no editable element has focus, so it does not collide with input UX.

### Validation results

- `npm run lint` — clean.
- `npm run test` — **184 passed, 1 skipped** (23 files).
- `npm run build` — succeeds. `/` route ~138 kB.
- `npm audit` — **0 vulnerabilities**.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty. Backend invariant holds.

### Browser observations (1440×900 desktop, headless Chrome)

- **Desktop edition view** unchanged from Phase 4 — masthead + issue grid render as before.
- **Click cover story** → the issue is replaced in-place by the editorial detail surface. Masthead stays. Back-bar appears with focus on the back button. Article title renders in serif (`--font-serif-display`), eyebrow is rust, dateline is mono — register matches the issue. Reader-mode toggle, Star, Open original, and the typography settings cog are all present and operable.
- **Reader-mode toggle** flips state without leaving the editorial surface. Same behavior as canonical (`extractArticle`, fade-in cross-fade) — no regression.
- **"Up next" module** at the end of the article correctly advances to the next article in the displayed list and re-mounts the detail surface for the new article.
- **Back to edition** button (and `Escape`) clears `selectedArticleId` + `currentArticle`, restoring the issue grid in place. Issue scroll position is reset (re-mount), which is acceptable for this concept; preserving exact scroll position is a Phase 9 polish item.
- **Three-pane fallback**: clicking the masthead "Starred" pill switches to the canonical sidebar/list/reader as before. Confirmed in `phase5-three-pane-fallback.png` (kept locally; not committed to the gallery).
- **No console errors** during the smoke. `suppressHydrationWarning` on relative-time spans continues to silence the expected SSR/CSR difference.

### Screenshots

| File | Notes |
| --- | --- |
| `phase5-story-detail.png` | Desktop story detail at 1440×900: masthead preserved, sticky back-bar with rust "Back to edition" + `01 / 100` story-position stamp, serif article title in editorial register, "Up next" module at bottom. |
| `phase5-story-detail-reader-mode.png` | Same surface with Reader mode toggled — verifies all reader-mode controls survive inside the editorial wrapper. |

(Both under `docs/design-lab/screenshots/concepts/03-today-edition/`.)

### Deviations from plan

- The brief allowed "slide-over, drawer, or full-width story view layered from the issue". Implemented as a **full-width takeover within the main area** rather than a layered slide-over. Reasons: (1) the masthead already provides the layered "frame" continuity; (2) full-width gives the reader content the comfortable measure that a side-drawer would compress; (3) the existing `ReadingPane` uses an internal `<ScrollArea>` that fights any nested scrolling we'd need for a true overlay. A literal slide-over with the issue dimmed beneath is still on the table for Phase 9 polish if the takeover feels too abrupt.
- `ArticleHeader` is restyled via `.edition-story` CSS scoping, not via a new `variant` prop. Keeps the shared component byte-identical and reversible — removing the `.edition-story` wrapper restores the canonical reader instantly.
- Issue scroll position is not preserved on Back. Cheap to add later (cache `scrollTop` in a ref on the issue container) but out of scope for this phase.

### Follow-ups carried into later phases

- Phase 6: mobile reader inherits Phase 5 affordances where they translate; bottom tab bar provides the "back to edition" gesture.
- Phase 7: empty/loading/error states for the detail surface (article fetch fails, reader extraction fails, etc.) styled to the editorial register.
- Phase 8: a11y audit specifically on the detail — Escape-to-back, focus restoration on Back, `aria-current` on Up Next, contrast of the rust accent at small sizes inside the back-bar.
- Optional Phase 9: preserve issue scroll position across Back; consider a literal slide-over with dimmed issue if the takeover feels jarring.
- Phase 7: secondary states — empty edition reward, low-volume Pattern E, error skeleton, loading skeleton, multi-pattern layout grammar.
- Phase 8: accessibility audit on the issue grid (landmarks, headings, focus order, contrast on rust on warm-dark).
- Optional Phase 9: `emil-design-eng` polish on hover transitions, focus-visible rings, drop-cap rendering on the cover dek (currently no dek paragraph because article descriptions aren't in `ArticleWithFeed`).

## Phase 6 Implementation Notes

Done on child branch `concept/03-today-edition-06-mobile`. Scope: the mobile edition experience — the chrome that surrounds the issue and detail surfaces on phones, plus the routing that decides which surface mounts.

### What changed

- **New component** `src/components/edition/EditionMobileMasthead.tsx` (`md:hidden`, sticky top). Compact single-row mobile masthead: serif **"Today"** nameplate at 1.6rem, mono edition stamp (`№NNN · Wkd, Mon D` — the short form so it fits 414px), and a right cluster with a circular palette button (⌘) and refresh icon. Built from the same `--edition-*` tokens as the desktop masthead. Backdrop-blurred warm-dark plane with `safe-area-inset-top` honored.
- **New component** `src/components/edition/EditionMobileTabBar.tsx` (`md:hidden`, fixed bottom). Five-cell tab bar: **Today / Search / Starred / Feeds / More**. Today/Starred reflect the active mode via rust accent + `aria-current="page"`. Search opens the command palette; Feeds toggles the mobile sidebar mode; More links to `/settings`. `safe-area-inset-bottom` honored.
- **Modified** `src/components/layout/AppShell.tsx`. Mobile rendering now branches on edition mode:
  - In edition mode (no feed filter, no starred view, no search results), mobile renders `EditionMobileMasthead` above the main, then either `Sidebar` (when the Feeds tab is active), `EditionStoryDetail` full-screen (when an article is selected), or `EditionIssue` (default). This is the same set of surfaces used on desktop, sized for phones — not a separate mobile-only design.
  - Outside edition mode (feed filter, starred, or active search), the mobile fallback keeps the original single-pane chrome (top toolbar with hamburger / list / reader). Bottom padding extended (`pb-[calc(env(safe-area-inset-bottom)+3.75rem)]`) so content doesn't sit under the new tab bar.
  - The bottom `EditionMobileTabBar` is rendered globally on mobile (outside `<main>`), so navigating between Today / Feeds / Starred / Search / More is one tap from anywhere.
- No CSS changes were required — mobile reuses the Phase 2 token set, `.edition-issue`, `.edition-scroll`, `.edition-story`, and the existing `--edition-*` namespace verbatim.

### What stayed stable

- Article fetching (`/api/articles/[id]`), sanitization, `dangerouslySetInnerHTML` policy, server actions, Prisma, lib utilities, `package.json`, `package-lock.json` — untouched. Backend invariant holds.
- `EditionIssue`, `EditionStoryDetail`, `EditionMasthead`, `composeIssue`, `ReadingPane`, `ArticleHeader`, `TypographySettings` — untouched in this phase. The mobile masthead is a sibling, not a fork; the desktop masthead remains `hidden md:flex`.
- All existing keyboard shortcuts (`j`/`k`, `s`, `m`, `r`, `Shift+R`, `o`/Enter, Esc) operate unchanged. The reader-pane swipe gestures (`useSwipe`) on the three-pane fallback still work where present.
- Three-pane mobile fallback is reachable: tapping a feed in the Feeds tab activates `handleSelectFeed` and the existing single-pane mobile shell takes over (top toolbar with hamburger + list + reader on tap). Nothing was removed.
- No new dependency, no Google Font, no motion library.

### Validation results

- `npm run lint` — clean.
- `npm run test` — 184 passed, 1 skipped (22 files).
- `npm run build` — succeeds; `/` first-load JS 253 kB (was 252 kB Phase 5; +~1 kB for the two new mobile components).
- `npm audit` — 0 vulnerabilities.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty.

### Browser observations (414×820 mobile, headless Chrome with iOS UA)

- `/` on mobile renders the Today edition front page: serif "Today" nameplate, "№125 · Tue, May 5" mono stamp, palette + refresh on the right; cover eyebrow ("COVER · BBC News" in rust), large serif cover headline, dateline, hairline rule, single-column section stories below; bottom tab bar with **TODAY** active in rust, plus SEARCH / STARRED / FEEDS / MORE.
- Tapping the cover opens the edition-native story detail full-screen: sticky **"← Back to Edition"** rust button (focused on mount, visible focus ring), `01 / 100` mono stamp, BBC NEWS eyebrow in rust, serif title, dateline, Reader-mode / Star / Open-original buttons, body text, "Up next" module at the bottom. Back-bar gesture (button or Esc-equivalent on hardware keyboards) returns to the issue.
- Tapping the **Feeds** tab swaps the main surface to the canonical `Sidebar` (All Articles, Starred, Uncategorized → BBC News + Hacker News, plus Health/Stats/Settings rail at the bottom) — the existing feed-management surface, reachable in one tap from anywhere.
- Bottom safe-area insets honored on the masthead and tab bar; `pb-24` on the issue scroll container ensures the last row clears the tab bar.
- No console errors observed.

### Screenshots

| File | Notes |
| --- | --- |
| `phase6-mobile-edition.png` | Mobile front page at 414×820: compact masthead, cover story, single-column section stories, bottom tab bar. |
| `phase6-mobile-story-detail.png` | Mobile story detail at 414×820: sticky back-bar focused, story-position stamp, edition-styled article header, body, "Up next" module. |
| `phase6-mobile-nav.png` | Mobile Feeds tab at 414×820: canonical sidebar (feed tree + Health/Stats/Settings rail) reachable inside the edition shell, **FEEDS** active in rust on the tab bar. |

(All under `docs/design-lab/screenshots/concepts/03-today-edition/`. The small "N" overlay at the lower-right is the Next.js dev-mode devtools button, not part of the UI.)

## Phase 7 Implementation Notes

Done on child branch `concept/03-today-edition-07-secondary-states`. Scope: secondary states, fallback surfaces, and issue polish — make every non-happy path read as part of the same edition, not a generic SaaS empty state or browser error page.

### What changed

- **`EditionEmpty` rewritten** in `src/components/edition/EditionIssue.tsx` from a centered two-line stub into two distinct editorial surfaces:
  - **No-feeds** ("Vol. I · No. 1"): editorial onboarding — small-caps eyebrow, large serif headline (`Your edition starts with a feed.`), Geist dek explaining the deterministic-issue metaphor, primary `Add your first feed` link to `/settings`, secondary `or press ⌘K to open the palette` hint. Hairline rule above the eyebrow keeps the issue grammar.
  - **No-articles** ("— Finis —"): finished-edition reward — same anatomy, with `You've finished today's edition.`, an explanation that the next issue arrives when sources publish, a `Refresh sources` action wired to `handleRefreshAll` (with disabled-spin while refreshing), and a `Manage feeds →` secondary link.
- **New `EditionColophon`** module rendered when the issue has very few articles (`articles.length <= 2` — Pattern E low-volume day). Eyebrow `Light edition`, dek (`Only N stories crossed the desk today. A short edition is still an edition.`), refresh action. Sits below the cover with the same hairline rhythm; replaces the usual seconds row + sections that would otherwise be empty rules.
- **`LaterTray` is now collapsible.** Default `open=true` so existing behavior is preserved; the toggle only appears when items > 4 (the `PEEK` constant). Header now carries a small-caps `Show all` / `Collapse` button with a rotating chevron and `aria-expanded`. Collapsed state shows the first 4 items plus a colophon line `N more held back. Use "Show all" to recover them.` so the count never disappears silently.
- **`EditionStoryDetail` gained editorial loading + error states** in `src/components/edition/EditionStoryDetail.tsx`:
  - **`EditionStorySkeleton`** (rendered while `isLoading && !article`): four hairline placeholder bars matching the issue typography rhythm — eyebrow, three headline lines (88 / 72 / 58% width), dateline, and four body lines — instead of falling through to `ReadingPane`'s SaaS-shape skeleton. Pulses via a slow opacity animation; collapses to a single static frame under `prefers-reduced-motion`. Has `role="status"` + `aria-live="polite"` + sr-only `Loading story…`.
  - **`EditionStoryError`** (rendered when fetch finishes with no article): `STOP PRESS` eyebrow, serif `This story didn't make it to print.`, dek explaining offline source / moved link / fetch failure, primary `Try again` (full reload) and secondary `Back to edition →` (calls `onBack`). `role="alert"`.
  - The existing `ReadingPane` is still rendered for the happy path, untouched.
- **New CSS utilities** in `src/app/globals.css`: `.edition-skeleton-line` (low-contrast hairline placeholder using the editorial rule color), `.edition-skeleton-headline` variant for serif-display lines, and the `edition-skeleton-pulse` keyframe (1.6s, `var(--ease-in-out-quint)`, opacity 0.55 ↔ 0.95). The global `prefers-reduced-motion` rule already forces these to a single static frame.
- **`AppShell` wiring**: `EditionIssue` now receives `onRefreshAll` and `isRefreshing` so the empty `Finis` state and the light-edition colophon can both trigger a real refresh from inside the issue.

### What stayed stable

- `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`, `package.json`, `package-lock.json` — untouched. Backend invariant holds.
- `EditionMasthead`, `EditionMobileMasthead`, `EditionMobileTabBar`, `composeIssue`, `ReadingPane`, `ArticleHeader`, `TypographySettings` — untouched in this phase. The new states are scoped to the issue and detail surfaces.
- The three-pane fallback (search / starred / feed-filter) — untouched. It uses the canonical `ArticleList` + `ReadingPane`, which already have their own loading/empty/error states; layering Phase 7 over those would have been scope creep with low return.
- `AddFeedDialog`, OPML dialogs, `Sidebar`, Health, Stats, Settings — untouched. Visited briefly during browser review; no clash with the edition register that warranted Phase 7 work.
- All keyboard shortcuts and the `Esc`-to-back wiring on the detail surface continue to work. Tab order through the new empty-state actions follows reading order: eyebrow → headline → dek → primary action → secondary link.
- No new dependency; no Google Font; no motion library. Skeleton pulse is a CSS-only keyframe.

### Validation results

- `npm run lint` — clean.
- `npm run test` — **184 passed, 1 skipped** (22 files). No new tests added because the new surfaces are pure presentational branches; `composeIssue` (the only logic with tests) was not touched.
- `npm run build` — succeeds. `/` first-load JS **254 kB** (was 253 kB Phase 6; +~1 kB for the new state components and CSS utility).
- `npm audit` — **0 vulnerabilities**.
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty.

### Browser observations (1440×900 desktop + 414×820 mobile, headless Chrome)

- **Default issue** — unchanged from Phase 4/6. Cover, seconds, section ribbons, and Later tray all render. The Later tray header now shows the `Collapse` toggle (chevron) when there are more than 4 items; clicking it folds the tray to 4 items + a "N more held back" line.
- **No-articles state** (forced via `?range=custom&from=2010-01-01&to=2010-01-02`, which yields zero articles in edition mode): the `Finis` surface renders with eyebrow, serif headline, dek, refresh button, and `Manage feeds →` link. The masthead and tab bar continue to anchor the chrome on both desktop and mobile.
- **Story-detail error** (forced via Fetch-domain interception of `/api/articles/[id]` returning 500): clicking the cover transitions to the editorial detail surface, the back-bar appears with focus on `Back to edition`, and the body renders the `STOP PRESS` error with `Try again` + secondary back link. The `Up next` module is preserved at the bottom so the reader can advance even when the current article failed.
- **Story-detail loading** — the editorial skeleton (eyebrow + three serif headline bars + dateline + body lines) flashes briefly during fetch on slow connections; on local dev the fetch resolves before the next paint, so the skeleton is mostly visible by throttling.
- **No-feeds state** — the editorial onboarding is verified by code path; the local DB has feeds, so reproducing it in the browser requires deleting all feeds. Layout matches the Finis state with the `Vol. I · No. 1` eyebrow + `Add your first feed` primary action.
- **Light edition (Pattern E)** — verified by code path; the local dataset has hundreds of articles so it never triggers in real use. Will be exercised in Phase 8 alongside the contrast / reduced-motion audit.
- **Mobile fallbacks** — same surfaces render at 414×820 with the bottom tab bar in place. The empty state's typography reflows to 2 lines as expected; CTAs wrap below the dek.
- No console errors during the smoke. Hydration-warning suppressions on relative-time spans continue to silence the expected SSR/CSR difference.

### Screenshots

| File | Notes |
| --- | --- |
| `phase7-empty-no-articles.png` | Desktop "Finis" state — `— FINIS —` eyebrow, serif `You've finished today's edition.`, dek, `Refresh sources` + `Manage feeds →`. |
| `phase7-story-error.png` | Desktop story-detail error — `STOP PRESS` eyebrow, serif `This story didn't make it to print.`, `Try again` + `Back to edition →`, `Up next` module preserved at the bottom. |
| `phase7-mobile-empty.png` | Mobile "Finis" state at 414×820 — same surface, two-line headline reflow, tab bar still anchored. |

(All under `docs/design-lab/screenshots/concepts/03-today-edition/`.)

### Deviations from plan

- **No `phase7-later-tray.png` captured.** The Later tray's collapse toggle is implemented and verified by code review + a manual click in the browser (state changes, items reduce to 4 + footer line), but the headless capture script could not deterministically scroll the inner article scroll container to the Later header in time for a clean shot. Logged as a tooling follow-up; the behavior itself is in code.
- **No-feeds and Pattern E (light edition) screenshots not captured.** Both render correctly per code review but require either an empty database or a 1–2 article dataset to trigger naturally; manufacturing the state would have required either DB resetting or a feature-flagged test override, both out of scope for a UI-only phase. Phase 8 (closure) will capture them as part of the formal validation pass.
- **Story-detail loading screenshot not captured.** The skeleton renders for ~50–150 ms on local dev — too short to deterministically time the headless capture. Behavior verified visually with the devtools network throttle. Phase 8 will retry under enforced throttling.
- **`Try again` is a `window.location.reload()` rather than a smart re-fetch.** The cleaner approach would be to re-trigger the article fetch with the existing `selectedArticleId`. Skipped because it would require lifting fetch state up to the parent (out of UI-polish scope). Logged as a follow-up; a hard reload still recovers correctly.

### Follow-ups carried into later phases

- **Phase 8 (closure):** capture `phase7-no-feeds.png`, `phase7-light-edition.png`, and `phase7-story-loading.png` under controlled fixtures; run the full a11y audit (skip-link, landmarks, `aria-current`, contrast on rust + warm-dark at body and small sizes, `prefers-reduced-motion`); verify the skeleton pulse honors reduced-motion; verify focus restoration on Try again / Back from the error state; document the Decision.
- **Optional Phase 9:** smart re-fetch on `Try again` (lift fetch state to parent so the error → retry round-trip doesn't reload the page); animated collapse on the Later tray (`details`-style with `prefers-reduced-motion` fallback); per-section "Save for later" affordance to move stories from the Later tray back into a section.
- **Tooling follow-up:** harden the headless-capture script's inner-scroll handling so per-section screenshots (Later tray, section ribbons, light edition) can be captured deterministically. Currently the script's `scrollContainer` action sets `scrollTop` but the React state doesn't always toggle reliably under simulated clicks; investigate `Input.dispatchMouseEvent` instead of `el.click()` for stateful UI.

### Deviations from plan

- **Pull-to-refresh deferred.** Implementing pull-to-refresh requires a gesture controller, an idle/loading state machine, and motion that respects `prefers-reduced-motion`. Out of scope for the chrome pass; users can refresh via the masthead refresh icon (and ⌘K → Refresh). Logged as a follow-up.
- **No mobile redesign of the desktop masthead.** Per the brief, desktop was preserved. The mobile masthead is a separate compact component, not a responsive collapse of the desktop masthead — the two surfaces have different information density needs.
- **Tab bar uses 5 cells (Today / Search / Starred / Feeds / More)** instead of the original brief's 3 (Today / Feeds / Search). Starred and Settings (More → `/settings`) earned dedicated slots because they are core RSS-reader affordances; burying them inside the palette would have hurt one-thumb operation. Single accent + small caps + Lucide icons keep the bar editorial, not SaaS.

### Follow-ups carried into later phases

- Phase 7: empty/loading/error states on the mobile flow — empty edition reward, low-volume "no cover yet" state, article-fetch error inside `EditionStoryDetail` on mobile.
- Phase 8: a11y audit on mobile — tab bar `role`/`aria-current`, masthead landmark conflict (two banners on the page when both desktop and mobile masthead mount in their respective `md:` gates — currently disjoint, but verify), focus order on tab bar, contrast at 414px, `prefers-reduced-motion` on backdrop-blur fallback.
- Optional Phase 9: pull-to-refresh on mobile, swipe-to-back gesture on `EditionStoryDetail`, swipe-between-stories on mobile (the desktop reader-pane already has it via `useSwipe` in the three-pane fallback; bring it to the edition flow).

## Risks and Tradeoffs

- **Magazine-pastiche risk.** The single biggest risk per `gpt-taste`. Mitigation: serif + drop cap + rust accent + hairline rules are *intentionally specific* and verified against Apple News / Flipboard *not* to copy them; layout grammar is bounded to four patterns; an "edition stamp" with the actual day-of-year is allowed (it is authentic) but no other meta-labels per the skill's ban.
- **Layout grammar staleness.** Four patterns may feel repetitive after weeks. Mitigation: reserve Pattern E and document a future Pattern F in follow-ups; do not over-engineer this in Phase 1.
- **Editorial-aesthetic vs. dashboard-app context.** `design-taste-frontend` rule explicitly bans serifs in dashboards. Mitigation: this is a reading product, not a dashboard, and this concept commits fully to the editorial register; `/feeds` page (the dashboard-shaped surface) keeps Geist sans only.
- **Determinism as a feature is unfamiliar.** Users may pull-to-refresh expecting reshuffle. Mitigation: explicit "Edition refreshed" stamp; the masthead shows last-refresh time; FAQ entry in settings.
- **Empty edition cliff.** When all unread are cleared, the "you're done" state must read as a reward, not a dead end. Mitigation: Phase 9 designs an empty state with the *Yesterday* link and the refresh button.
- **Mobile complexity.** Pull-to-refresh + sticky masthead + bottom tabs is real engineering. Mitigation: Phase 8 ships the simplest viable version; gestures only if cheap.
- **Server actions / lib unchanged.** The composer is the only new client-side code over existing data. Risk: temptation to add a query to "get today's edition" in `lib/queries.ts` for performance. **Forbidden** — keep composer pure-client; if it's slow, profile in Phase 9 first.
- **A11y regressions.** The issue grid and slide-over reader change DOM structure significantly. Phase 9 must re-run skip-link, landmarks, focus-restore, contrast, reduced-motion checks.
- **`/` route change.** The home route currently renders the three-pane shell. Changing it changes user expectations. The polished baseline still lives on `main` — this concept lives on its branch and is not auto-merged.

## Decision Criteria

The concept ships as a candidate finalist if:

1. Side-by-side, it reads as a **different product** from `lab-polish-v1`, Reading Lamp, and Command Center — different metaphor, different first-glance feeling, different reading rhythm.
2. The issue layout is identifiably *editorial* and not a card grid: hairline rules, no card boxes, drop cap on cover, hierarchy via type and scale.
3. Every backend behavior is unchanged: `git diff main..HEAD -- src/actions/ src/app/api/ prisma/ package-lock.json` is empty. `package.json` shows at most the optional Google Font addition (or no change).
4. WCAG AA contrast holds on warm-dark surface and rust accent at body and small sizes. `prefers-reduced-motion` audit passes.
5. The deterministic edition composer is documented inline and produces stable output for the same date and dataset.
6. Tested informally: a user opens the app on a typical morning, clears the cover and seconds, skims the sections, and feels *finished* — not surveilled.
7. It does not read as a generic SaaS magazine theme. Single accent, real drop cap, real serif, hairline rules — verifiable against the AI-tells lists in `redesign-existing-projects` and `gpt-taste`.

## Screenshots

| View                     | Screenshot | Notes |
| ------------------------ | ---------- | ----- |
| Desktop overview (issue grid) | `phase4-issue-grid.png` | Cover, seconds row, section ribbon below — Phase 4. |
| Desktop full cover + section | `phase4-cover-story.png` | Tall capture showing cover + seconds + section in one frame — Phase 4. |
| Mobile check (unchanged) | `phase4-mobile-check.png` | Mobile gated to existing layout; redesign in Phase 6. |
| Desktop overview (Pattern A — Broadsheet) | TBD (Phase 9) | Cover, seconds, two sections, later tray closed. |
| Desktop overview (Pattern D — Editorial vertical) | TBD (Phase 9) | Demonstrates layout grammar variety. |
| Reader slide-over open | `phase5-story-detail.png` | Edition-native detail surface — sticky back-bar, serif title, story-position stamp, "Up next" — Phase 5. |
| Reader detail in reader-mode | `phase5-story-detail-reader-mode.png` | Same surface with `extractArticle` reader-mode toggled on — Phase 5. |
| Section ribbon close-up | TBD (Phase 9) | Hairline rule, eyebrow, item list — no card boxes. |
| Later tray expanded | TBD (Phase 9) | Dense small-print recovery view. |
| Empty edition (desktop) | `phase7-empty-no-articles.png` | "— FINIS —" reward state with Refresh sources + Manage feeds → — Phase 7. |
| Empty edition (mobile) | `phase7-mobile-empty.png` | Same Finis surface at 414×820 with the bottom tab bar still anchored — Phase 7. |
| Story detail error | `phase7-story-error.png` | "STOP PRESS" editorial error with Try again + Back to edition → and "Up next" preserved — Phase 7. |
| Mobile edition front page | `phase6-mobile-edition.png` | Compact mobile masthead + cover + single-column sections + bottom tab bar — Phase 6. |
| Mobile story detail | `phase6-mobile-story-detail.png` | Edition-native full-screen story on mobile, sticky back-bar focused — Phase 6. |
| Mobile Feeds tab | `phase6-mobile-nav.png` | Sidebar reachable via Feeds tab from inside the edition shell — Phase 6. |
| `/feeds` page | TBD (Phase 9) | Existing sidebar components in editorial single-pane. |

## Local Run Instructions

```bash
git checkout concept/03-today-edition
npm run setup
npm run dev
```

(For each phase child branch, replace the branch name with that phase's branch.)

## Validation Checklist

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm audit`
- [ ] Desktop screenshot captured (at least two layout patterns)
- [ ] Mobile screenshot captured
- [ ] Reader view checked
- [ ] Issue cover, seconds, section ribbons checked
- [ ] Later tray expand/collapse checked
- [ ] `/feeds` page checked
- [ ] Empty/loading/error states checked
- [ ] Keyboard navigation checked (tab order matches reading order across all four patterns)
- [ ] `prefers-reduced-motion` checked
- [ ] WCAG AA contrast checked (rust accent on warm-dark, body and small sizes)
- [ ] Backend invariant: `git diff --stat main -- src/actions/ src/app/api/ prisma/ package-lock.json` is empty
- [ ] `package.json` change is at most the documented font addition (or empty)

## Skills Usage Notes

This concept was authored explicitly to test how three Claude Skills compose around a single architecture brief.

- **`redesign-existing-projects`** (primary). Used to scan the existing Feed app, identify generic patterns to avoid, and propose the initial Today Edition architecture. Drove the editorial-register decision (serif + sans pairing for creative/editorial products), the anti-card-grid stance, the warm-dark + single-accent palette, the drop-cap and broken-grid moves, the staggered-entry motion baseline, and the explicit ban on AI gradients, Inter, three-equal-cards, and pure black backgrounds.
- **`design-taste-frontend`** (secondary, critique). Used to audit the proposal for visual hierarchy quality, layout execution risk, frontend correctness, and AI tells. Confirmed serif headlines are permitted in editorial contexts (and only in editorial contexts — `/feeds` keeps sans). Pushed for `min-h-[100dvh]`, CSS Grid over flexbox math, hardware-accelerated motion, isolated client components for any animation. Pushed back on the skill's pull toward Framer-Motion-driven perpetual motion, magnetic hover, and Bento-2.0 archetypes — those rules apply to SaaS dashboards and were rejected as off-register for a reading product.
- **`gpt-taste`** (secondary, critique). Used to audit originality and surface potential AI-tells. Confirmed the 2-line headline iron rule, the meta-label ban, and the gapless-grid principle. Rejected its push toward GSAP scroll-jacking, kinetic marquees, inline-typography images, full Python RNG of layouts, and `<design_plan>` boilerplate — those would either drag in dependencies or fight the calm reading register.
- **`minimalist-ui`** (deliberately not used). Today Edition needs visual richness — drop caps, rules, hero imagery, hierarchy — that a flatten-everything pass would erode.
- **`emil-design-eng`** (deferred to optional Phase 10). Reserved for interaction polish (hover, focus, transitions) once the static surface exists.

The concept doc was not generated from a single prompt; it was assembled by running each skill against the prior output as a critique loop. The critique decisions are recorded below.

## Skill Critique Summary

### `redesign-existing-projects` — primary proposal

What it contributed:

- The metaphor: a daily, finite, editorially-arranged document instead of an infinite stream.
- Layout: editorial broken grid with day-seeded patterns; reject three-equal-cards; reject card-box materiality; rules and whitespace replace boxes.
- Typography: serif display + Geist sans body + Geist mono datelines; drop cap on cover; tighter tracking on display, balanced text-wrap.
- Color: warm-dark surface; single deep rust/oxblood accent; explicit anti-AI-gradient + anti-pure-black + anti-Inter stance.
- States: skeleton loaders matching layout shape, designed empty edition, real error states.
- Mobile: vertical issue, pull-to-refresh as a real metaphor.
- Imagery: tinted-shadow + duotone hero, no library-driven gradients.

### `design-taste-frontend` — critique and accepted/rejected

Critique highlights:

- **Accepted.** Serif permitted because this is editorial, not dashboard; `/feeds` page keeps strict sans pairing per the dashboard rule. CSS Grid (`grid-template-columns: repeat(12, ...)` with `grid-flow-dense`) over any flexbox-percent math. `min-h-[100dvh]` instead of `100vh`. Single accent, saturation < 80%. Hairline-rule grouping over generic card containers (skill explicitly bans card-overuse for medium-density data). Skeleton loaders in Phase 9. Tabular-nums on all numerics. Standardized stroke-weight on iconography (we keep Lucide for inertia but audit to one stroke). Mobile collapse to single column on `< 768px`.
- **Rejected.** Framer-Motion `useMotionValue`-based magnetic hover, perpetual infinite loop micro-animations, spring-physics on every interactive element, "Motion-Engine Bento Paradigm" with `layoutId` choreography. These belong to a marketing-page or SaaS-dashboard register and would drag in `framer-motion` (no new dep allowed) and would fight the calm reading register. Rejected the "diffusion shadow" cards because the concept commits to no card boxes anywhere except the slide-over reader.
- **Concept change after critique.** Added explicit `min-h-[100dvh]` rule. Added strict mobile single-column collapse. Added tabular-nums + stroke-audit notes. Pinned the no-card stance even harder. Removed any temptation to add Framer Motion; entry stagger is now a CSS `animation-delay` cascade. Confirmed `/feeds` keeps strict sans-only.

### `gpt-taste` — critique and accepted/rejected

Critique highlights:

- **Accepted.** 2-line iron rule on the cover headline (cap H1 at 2–3 lines via `clamp()` font scaling and wide containers). Massive vertical spacing between sections (sections are real chapters, not crammed rows). Anti-meta-label rule: no decorative section numbers — but the *real* edition stamp (date + day-of-year) is kept because it is authentic, not decorative. `grid-flow-dense` on the issue grid (already adopted from `redesign-existing-projects`). One accent only. AIDA's *attention → interest → desire → action* framing reinterpreted for editorial: cover is attention, seconds are interest, sections are desire, later tray is the controlled denouement. Hover-physics on cover hero (`scale-105` + 600ms ease-out). Real, contextual imagery via `picsum.photos` reserved only for skeleton/empty-state placeholders if needed in Phase 9 — production uses real article `imageUrl`.
- **Rejected.** GSAP ScrollTrigger pinning, scrubbing text reveals, locomotive-style scroll sequences, card-stacking-on-scroll. These would require adding GSAP — forbidden. Kinetic marquees, inline typography images embedded inside headlines, horizontal-accordion section components — all reject as gimmickry that fights reading. Forced Python-RNG-of-layouts boilerplate in the doc — rejected as ceremony; the layout grammar is selected by `dayOfYear % patternCount`, which is deterministic and explainable without simulating Python output. Mandatory `<design_plan>` block — rejected as not project-appropriate. Phosphor / Radix icon migration — deferred; we keep Lucide (already shipped, no new dep) and audit to a single stroke instead.
- **Concept change after critique.** Added the explicit 2-line cap on the cover headline using `clamp()`. Added massive `py-` spacing between sections. Added the stroke-width audit note. Reframed the day-seeded pattern selection as *layout grammar* (so it reads as deliberate, not random). Tightened the "no decorative meta-labels" rule and explicitly blessed the real edition-stamp dateline. Explicitly excluded GSAP and any new motion library from the implementation phases.

### Net effect

After both critique passes, the architecture moved from a generic "magazine UI" sketch toward a more specific, locally-warranted editorial register: serif + warm-dark + single rust accent + hairline rules + drop cap + day-seeded layout grammar + restrained CSS-only motion + dashboard-grade `/feeds` page, with no new motion library and at most one Google Font addition (itself optional). The most expensive rejections were Framer-Motion-driven perpetual motion (would compromise calm and add a dep) and GSAP scroll-choreography (would compromise reading and add a dep).

## Comparison Against Polished Baseline

- **Different.** The home surface is no longer a three-pane resizable shell; it is a finite editorial document that recomposes once per local day. The reading register is editorial (serif display, drop cap, hairline rules, warm-dark surface) instead of dashboard-cool. The list is replaced by hierarchical wells. Motion is restrained to entry stagger and a slide-over reader.
- **Improved (intent).** A finite "I'm done" state replaces the doom-scroll of an infinite list. Hierarchy is imposed by editorial rules rather than chronology. Sections finally make folders feel useful. The reader is preserved verbatim, so reading quality cannot regress.
- **Worse (intent).** Power-user triage gets harder than on `lab-polish-v1` and *much* harder than on Concept 02. Discoverability of feed-management actions decreases (now behind `/feeds` and the palette). Layout grammar may feel repetitive over months.
- **Unresolved (until later phases).** Whether four patterns is enough variety. Whether the deterministic edition reads as a feature or a bug. Whether warm-dark + rust is a fingerprint or a kitsch tone.

## Decision

- [ ] Keep exploring
- [ ] Mine for parts
- [ ] Candidate finalist
- [ ] Discard
- [ ] Upstream selected pieces to canonical Feed

Decision pending — to be set after Phase 9 implementation, screenshots, and validation. The architecture above is the planning-phase commitment.

## Follow-up Tasks

- [ ] Phase 3 review: confirm `lib/edition.ts` location (lib vs component-local) and that it stays read-only and dep-free.
- [ ] Phase 7: define Pattern E (low-volume day) and document it inline.
- [ ] Phase 6: decide whether the bottom tab bar surfaces a third affordance (Search) or only Today + Feeds.
- [ ] Phase 8: contrast audit on rust-on-warm-dark at body and small sizes; reduced-motion audit.
- [ ] Phase 9 (optional): invoke `emil-design-eng` against Phase 8 screenshots for hover/focus/transition micro-polish.
- [ ] Finalization (only if candidate finalist): add Google Font (Newsreader or Source Serif 4) via `next/font/google` as the serif identity move; remove the system-serif stack fallback or keep as graceful degradation.
- [ ] Decide whether `Pattern F` and beyond are worth the complexity, or whether to keep four patterns and lean on day-seeding.
- [ ] Decide post-comparison whether any element (drop cap, masthead, section ribbon) is worth mining into another concept or upstream.
