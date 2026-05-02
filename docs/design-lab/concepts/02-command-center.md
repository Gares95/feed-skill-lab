# Concept 02 — Command Center

> Planning-phase concept doc. Architecture only — no implementation files have
> been touched. Status will move from **Planning** to **In progress** when the
> user approves the architecture below and Phase 2 (design-system foundation)
> begins.

## Metadata

- Concept name: **Command Center**
- Branch: `concept/02-command-center`
- PR: TBD
- Status: Planning
- Created: 2026-05-02
- Last updated from main: `ac30c39` — Merge Impeccable concept gallery entry
- Baseline: `lab-polish-v1`
- Skills/tools explicitly used:
  - `redesign-existing-projects` (primary driver)
  - Claude Code
  - Supporting design skills (`minimalist-ui`, `design-taste-frontend`,
    `gpt-taste`, `emil-design-eng`) for visual critique only
- Screenshot directory: `docs/design-lab/screenshots/concepts/02-command-center/`

## Summary

The second radical concept on the post-polish track, and an intentional
opposite-pole counterweight to Concept 01 (Reading Lamp). Where Reading
Lamp was warm, editorial, and reader-first, Command Center is fast,
keyboard-first, command-driven, and triage-first. The three-pane shell is
demoted from identity to optional layout. The command palette is promoted
from accessory to primary navigation surface. The reader is reframed as an
**inspector** that the user opens on demand, not the resting state of the
app. Inspired in interaction quality by Raycast, Linear, Superhuman, Arc
command palette, and pro developer tooling — without copying any single
one of them.

## Product Metaphor

**Information cockpit / RSS operations console.** The user is a pilot of
their feed inflow: gauges (counts, latency, stale feeds) at the edges, a
primary instrument (the article queue) in the center, a command surface
always one keystroke away, an inspector that opens on demand. Reading is
reachable as a *focus* state — the cockpit fades, prose takes over — but
it is not the resting position.

## Design Intent

- **Who this concept is for.** A power user who runs through 50–200 unread
  items per session, wants to triage fast, batch-act, and only enter
  focused reading for the rare keeper. The same single-user / local-first
  / keyboard-comfortable persona as the polished baseline, retargeted from
  reading toward processing.
- **What feeling it should create.** Fast, oriented, in control, powerful.
  The user can clear 50 unread in five minutes without touching the mouse.
  The user can jump to any feed, command, or search result in two
  keystrokes. The user can flip between *triage*, *focus*, and *search*
  modes without losing context. Never blocked by a modal that could have
  been a popover; never squinting at a row to find the title.
- **What problem it is trying to solve.** The polished baseline and the
  Reading Lamp concept are both optimised for *reading* the next article.
  Neither is optimised for *processing* a queue. Command Center asks: what
  if Feed treated unread items as an inbox, not as a library?
- **What it intentionally challenges.** The three-pane shell as identity;
  the always-visible sidebar tree; the always-visible reader; the
  command palette as a hidden helper; the modal-first dialog register;
  the "site that happens to read RSS" register. It also challenges the
  reading-room pole established by Concept 01.

## What Changes

### Interaction metaphor

Information cockpit. Triage console. The screen is an instrument panel,
not a reading nook.

### Primary user feeling

Fast. Oriented. In control. Powerful. The keystroke buffer is visible.
Counters update in tabular-nums. The palette is one key away.

### Layout architecture

Replace the rigid three-pane shell with a **mode-aware grid**:

- **Top — Context Bar** (~40px). Left: workspace breadcrumb (mode → scope
  → filter, e.g. *Inbox › All Feeds › Today*). Center: command-palette
  **launcher pill** ("⌘K Run a command…", always visible — clicking is
  identical to ⌘K). Right: status cluster (unread totals, last-refresh
  ago, stale-feed dot, refresh button, settings cog).
- **Left — Navigation Rail** (~52px collapsed by default, ~220px on
  hover/pin). Vertical stack of mode icons: **Inbox** (queue), **Starred**,
  **Search**, **Feeds** (the tree), **Health**, **Stats**. Active mode
  highlighted with a colored left edge. Add-feed sits at the bottom.
  Folders/feeds tree is reachable through the **Feeds** mode and through
  the palette — it is no longer permanently visible.
- **Center — Queue / Primary Surface**. Mode-dependent. *Inbox*: dense
  article queue redesigned for triage. *Feeds*: feed tree + per-feed list.
  *Search*: results surface with structured filters as command chips.
  *Health* / *Stats*: existing pages embedded.
- **Right — Inspector** (collapsible; default collapsed `<1280px`,
  default open on wide). The reader. Slides in from the right with a
  hairline divider. `.` toggles. When expanded full-width via `f` (focus),
  the cockpit chrome fades to a 1px outline and the reader takes the
  whole pane — Reading Lamp's editorial reader survives here, accessible
  on demand.
- **Bottom — Status Bar** (~28px). Hidden by default on small screens,
  optional on desktop. Shows current mode, item count, current keystroke
  buffer (`j…` while a multi-key shortcut is in progress, like Helix),
  and network state.

The new shell uses CSS Grid as the primary layout engine. `react-resizable-panels`
is **kept available** for the Inspector width drag (an existing dependency
— no new install). If it complicates accessibility on the new shell it
is dropped — that decision lives in Phase 3, not here. **No new runtime
dependencies are introduced.**

### Navigation model

- **⌘K opens the palette** — the canonical jump surface: feeds, folders,
  articles by title, modes (`> Inbox`, `> Starred`, `> Search`),
  commands (`> Refresh`, `> Mark all read`, `> Add feed`, `> Toggle reader`,
  `> Open original`, `> Star`, `> Toggle reading mode`), settings deeplinks
  (`> Health`, `> Stats`, `> Settings`, `> Import OPML`, `> Export OPML`).
- **Typed scopes (Raycast-style):** `>` scopes to commands; `#` scopes to
  folders; `@` scopes to feeds; bare query searches feeds + recent
  articles by title.
- **Existing keyboard shortcuts preserved verbatim:** `j`/`k`, `s`, `m`,
  `r`, `Shift+R`, `o`, `Enter`.
- **New shortcuts (UI-only, no server changes):**
  `g i` go inbox · `g s` go starred · `g f` go feeds · `g h` go health ·
  `g t` go stats · `f` toggle focus / full-reader · `.` toggle inspector ·
  `?` open shortcut cheat-sheet · `Esc` collapse inspector / clear
  selection / close palette · `x` toggle row in selection · `Shift+j/k`
  range-select.
- Sidebar actions (Health, Stats, Settings) are reachable through (a)
  the rail, (b) the palette, and (c) `g h` / `g t` / `> Settings`.
- Add Feed and Import/Export OPML are reachable through the palette and
  through the **Feeds** rail surface.

### Sidebar / navigation

The sidebar tree is no longer permanent chrome — it lives **inside the
Feeds mode** in the center surface. The nav rail replaces it as primary
chrome. Folder management (rename, move, delete) is preserved from the
existing `Sidebar` / `FeedItem` components but rerouted to the Feeds
mode. The footer rail (Health / Stats / Settings) collapses into the
nav rail and the palette.

### Article list

`ArticleList` is restyled into a **Queue** with a real selection model:

- **Row anatomy.** Leading checkbox/indicator · source dot · title (15px,
  font-medium when unread) · meta line (feed · author · age · read-time,
  Geist Mono for time and read-time) · trailing kbd-hint chip on hover.
- **Density.** Rows ~30–34px high (currently ~40px+).
- **Selection.** `x` toggles row selection; `Shift+j/k` extends; bulk
  toolbar appears at the top of the queue when selection is non-empty,
  exposing star / mark-read / open-original / clear-selection actions.
  All bulk actions map onto existing single-action server endpoints
  client-side; **no server-action changes**.
- **Empty / loading / error states** redesigned to match the cockpit
  register — eyebrow + glyph + display title + body + ghost CTA, dense
  rather than airy.

### Reader pane

`ReadingPane` lives inside the **Inspector**. Two density modes:

- **`inspect`** (default in Inspector). Dense header, slightly tighter
  prose measure, controls visible (reader-mode toggle, star, open
  original, typography settings).
- **`focus`** (toggled with `f`, full-width). The cockpit chrome fades to
  a 1px outline; the reader takes the whole pane and reads like Concept
  01 / Reading Lamp's editorial pane (warm typography survives, tones
  shift to the cool palette).

Highlights, typography settings, reader-mode (Readability extraction),
star, mark-read, open-original — all preserved verbatim. No server-side
changes.

### App chrome

Top context bar + left nav rail + bottom status bar. Hairline 1px borders
(`border-border/40`–`border-border/60`); no card-shadow soup; surfaces
read as planes, not cards. Surface hierarchy:
background → rail → queue → inspector, each one notch lighter; status bar
slightly darker than background.

### Typography

- **Geist Sans** stays for chrome and rows.
- **Geist Mono** (already shipped) is used heavily for kbd chips,
  counters, time-ago, IDs, and the keystroke buffer. The monospaced
  cluster becomes a visual signature that prevents the concept from
  reading as default-Lucide-AI.
- **No new font installed.**
- Display chrome uses tight tracking (`tracking-tight` / `-0.02em`); rows
  use neutral tracking; small-caps eyebrows use positive tracking.

### Color / material direction

- Cool dark slate base.
- **Single accent** — electric cyan around `oklch(0.78 0.13 220)` or a
  restrained `oklch(0.72 0.12 240)`. Final value is a Phase 2 decision
  validated against WCAG AA on chrome and accent.
- Success / warn / error use desaturated tints, not saturated reds and
  greens.
- **Anti-references:** indigo SaaS gradient, Reading Lamp's warm sepia,
  Linear's specific purple, Raycast's specific orange. Inspect those
  apps for *energy* and *interaction quality*; copy nothing literally.

### Motion / interactions

- Palette open/close: scale-in 96→100 + fade 0→1, 160ms `--ease-out-quint`.
  Closing 120ms.
- Mode switch: 120ms cross-fade of the queue surface only; rail and
  context bar do not move.
- Inspector toggle: width transition 220ms `--ease-out-quint` with
  `prefers-reduced-motion` falling to 0.
- Row selection: instant background swap + 1px left-edge bar opacity
  0→1 over 100ms (extending the existing pattern).
- Quick-action confirmation: kbd chip flashes accent for 140ms when its
  shortcut fires (visual feedback that the keystroke was received). No
  toast soup.
- Reduced motion: every transition above falls to a single fade,
  durations halved or zero. Status-bar buffer indicator is purely
  textual; no animation requirement.

All using existing CSS variables in `globals.css`. **No motion library
installed.**

### Mobile behavior

Not a squashed desktop:

- **Bottom Command Bar** (replaces the hamburger drawer): 56px high, four
  primary affordances — Inbox, Search, Star, Menu. Center button is a
  circular **⌘K** trigger that opens the full-screen palette.
- **Single-pane mode flow** (queue → reader) preserved, with horizontal
  swipe between articles preserved. Swiping right from anywhere brings
  up the palette as a portal overlay.
- **Reader** in full-screen with a top mini-bar (back, star, open
  original, more). Focus mode is implicit on mobile.
- **Quick actions** appear as a strip above the bottom bar when an
  article is open: Star, Mark read, Open original, Highlights.
- **Long-press** a queue row → multi-select mode (mobile equivalent of
  `x`).

## What Must Stay Stable

Inherited unchanged from canonical Feed (`upstream`) and the polished
baseline:

- Data model
- Server actions (`src/actions/`)
- Prisma schema and generated client
- API routes (`src/app/api/`)
- Persistence model (SQLite, local-first)
- Core RSS / Atom behavior
- OPML import / export semantics
- Article fetching and sanitization pipeline (`safe-fetch`, DOMPurify)
- Reader / highlights / star / mark-read / folder / search / settings /
  stats / health behavior
- `package.json`, `package-lock.json` — **no new runtime dependencies**

All existing keyboard shortcuts (`j`/`k`, `s`, `m`, `r`, `Shift+R`, `o`,
`Enter`, `Cmd/Ctrl+K`) continue to work.

## Affected Files / Surfaces

| Area | Expected files | Risk level | Notes |
| ---- | -------------- | ---------- | ----- |
| App shell | `src/components/layout/AppShell.tsx` (rewrite around grid + mode state) | High | Largest single rewrite. Hosts new ContextBar / NavRail / Inspector / StatusBar. |
| Command palette | `src/components/CommandPalette.tsx` (expand) + new `src/components/command/*` | High | Typed scopes, command registry, recent-actions row, contextual subcommands. |
| New UI primitives | `src/components/command/{ContextBar,NavRail,StatusBar,Kbd,CommandChip,QueueToolbar,CommandPaletteScopeBadge,ShortcutCheatsheet}.tsx` | Medium | All UI-only. No server interaction. |
| Sidebar (relocated) | `src/components/sidebar/{Sidebar,FeedItem,AddFeedDialog,OpmlActions,FeedSettingsDialog}.tsx` | Medium | Reused inside the Feeds mode. FeedItem rows get the dense pro-data treatment. |
| Article queue | `src/components/articles/{ArticleList,ArticleRow}.tsx` | High | Restyle + selection model + bulk toolbar + kbd-hint chips. |
| Reader / inspector | `src/components/reader/{ReadingPane,ArticleHeader,TypographySettings}.tsx` | Medium | Adapted for inspect-vs-focus densities. Highlight + reader-mode behavior preserved verbatim. |
| Tokens / CSS | `src/app/globals.css` | Medium | New cockpit accent, kbd-chip vars, density tokens, status-bar tokens. Existing motion tokens kept. |
| Dialogs | `src/components/sidebar/{AddFeedDialog,FeedSettingsDialog}.tsx`, `src/components/ui/{dialog,alert-dialog}.tsx` | Low–Medium | Restyled to the cockpit register; popovers/slide-overs preferred to modals where the action is non-modal. |
| Hooks | `src/hooks/use-keyboard-shortcuts.ts`, `src/hooks/use-command-palette.ts` | Medium | Extended for new shortcuts (`g i/s/f/h/t`, `f`, `.`, `?`, `x`). No server behavior changes. |
| Empty / loading / error states | Each surface above | Low–Medium | Eyebrow + glyph + display title + body + ghost CTA pattern. |

**Untouched** (hard constraint): `src/actions/`, `src/app/api/`,
`src/lib/`, `prisma/`, generated Prisma client, `package.json`,
`package-lock.json`.

## Implementation Phases

Each phase requires its own go-ahead.

1. **Concept architecture and docs** — ✅ Complete. Doc + scaffolding.
2. **Design-system / visual foundation** — ✅ Complete. See Phase 2
   Implementation Notes below.
3. **App shell + command surface skeleton** — ✅ Complete. See Phase 3
   Implementation Notes below.
3. **App shell + command surface** — new `AppShell` grid skeleton with
   ContextBar + NavRail + Inspector + StatusBar shells (queue still
   mounts the existing `ArticleList`). Mode state machine introduced.
4. **Command palette overhaul** — typed scopes, command registry,
   contextual subcommands, recent-actions row.
5. **Article queue / list redesign** — `ArticleList` + `ArticleRow` to
   dense queue with selection model, bulk-action toolbar, kbd-hint chips.
6. **Reader / inspector** — `ReadingPane` adapted to inspect-vs-focus
   densities, inspector slide animation.
7. **Mobile command-center layout** — bottom command bar, palette
   overlay, reader full-screen, gestures.
8. **Dialogs / empty / loading / secondary states** — Add Feed, OPML
   import/export, Health, Stats, Settings; all empty / loading flavors.
9. **Screenshots, validation, concept-doc closure** — capture the
   screenshot table, fill the validation checklist, write the Decision.

## Phase 2 Implementation Notes

Done on child branch `concept/02-command-center-02-tokens`. Scope: visual
foundation only — tokens + a `Kbd` primitive. No layout, no AppShell, no
CommandPalette behavior changes. Tokens are added additively so the rest
of the polished baseline keeps rendering until a later phase consumes
the new chrome.

**Palette commitments**

- Surface hue cooled from `250` (cool indigo) → `230` (cool slate)
  across both light and dark modes. Lightness deltas preserved so the
  background → card → popover plane separation remains.
- Single accent shifted from cool indigo `oklch(0.68 0.10 250)` → cool
  cyan `oklch(0.72 0.13 220)` (dark mode) and `oklch(0.55 0.13 220)`
  (light mode). `--ring` is a slightly brighter cyan
  `oklch(0.78 0.13 220)` for clear focus visibility.
- `--primary-foreground` in dark mode flipped from near-white
  `oklch(0.985 0 0)` → deep slate `oklch(0.18 0.005 230)` so primary
  buttons clear WCAG AA against the new lighter cyan background.

**New cockpit token blocks** (in `src/app/globals.css`)

- *Geometry:* `--cockpit-context-bar-h` (40px),
  `--cockpit-status-bar-h` (28px), `--cockpit-rail-w` (52px),
  `--cockpit-rail-w-pinned` (220px), `--cockpit-row-h-dense` (32px),
  `--cockpit-row-h-comfortable` (40px),
  `--cockpit-focus-ring-w` (1.5px), `--cockpit-hairline` (1px).
- *Surface aliases:* `--cockpit-bg`, `--cockpit-rail-bg`,
  `--cockpit-queue-bg`, `--cockpit-inspector-bg`,
  `--cockpit-status-bg`, `--cockpit-status-fg`,
  `--cockpit-buffer-fg`, `--cockpit-accent`,
  `--cockpit-accent-foreground`, `--cockpit-rail-active-edge`. Dark
  mode overrides at the end of the `.dark` block.
- *Keyboard chip:* `--kbd-bg`, `--kbd-fg`, `--kbd-border`,
  `--kbd-radius` (4px), `--kbd-font-size` (11px),
  `--kbd-min-w` (18px), `--kbd-h` (18px). Dark-mode overrides for
  bg/fg/border so chips read inset on rows but pop on the queue.

**New utilities**

- `.kbd` — the canonical keyboard-chip class. Inline-flex, monospaced,
  tabular-nums, 18px square minimum, hairline border.
  `data-pressed="true"` / `data-flash="true"` apply a transient
  accent-mix tint for visual feedback when the bound shortcut fires.
- `.cockpit-mono` — monospace + tabular-nums + neutral letter-spacing
  for counters, time-ago, IDs, and the keystroke buffer indicator.

**New UI primitive**

- `src/components/ui/kbd.tsx` — exports `Kbd` and `KbdGroup`.
  `Kbd` is a thin `<kbd>` wrapper around `.kbd` with optional
  `pressed` / `flash` props. `KbdGroup` is an inline-flex span for
  multi-cap clusters (e.g. `Shift J` rendered as two adjacent caps).
  Functional component pattern (no `forwardRef`) matching the existing
  shadcn primitives in this repo.

**Decisions deferred to later phases**

- Whether `react-resizable-panels` survives in the new shell — Phase 3.
- Whether the status bar is on by default on desktop — Phase 3.
- Whether to introduce a *light cockpit* mode at all (current Phase 2
  light-mode tokens are parity-only; the concept is dark-first).

## Phase 3 Implementation Notes

Done on child branch `concept/02-command-center-03-shell`. Scope:
shell + command surface skeleton only. The shell consumes the Phase 2
visual foundation (cool slate + cyan, kbd chips, density tokens,
cockpit surface aliases) and frames the existing article list and
reader without changing their behavior.

**New top-level chrome (in `src/components/command/`)**

- `ContextBar.tsx` — full-width 40px bar at the top. Left: breadcrumb
  (`Feed › Inbox` / `Feed › Starred` / `Feed › Feed › <name>`). Center:
  `CommandLauncher` pill with ⌘K Kbd chips (visible on `md+`). Right:
  refresh-all button. Hairline `border-border/60` separator.
- `NavRail.tsx` — left-side 52px vertical icon rail. Modes: Inbox
  (active when no feed selected), Starred (active in starred view),
  with unread/star counts. Subordinate views: Health, Stats links.
  Bottom: Add Feed (mounts the existing `AddFeedDialog` trigger),
  Settings link. Active mode shows a 2px cyan left-edge indicator and
  a tinted background. Hover/focus reveals a popover-style label.
  `aria-current="page"` on the active mode.
- `StatusBar.tsx` — full-width 28px bar at the bottom. Left:
  cyan-pulse dot (animates while refreshing) + uppercase mode label.
  Center: article count + unread count using `cockpit-mono`. Right:
  hidden on small screens; `Palette ⌘K` hint cluster on `sm+`.
  `role="status"` with `aria-live="polite"`.
- `CommandLauncher.tsx` — pill button showing a search icon,
  hint text, and `⌘ K` Kbd chips. Opens the existing palette via the
  shared `useCommandPalette` hook. Used in the desktop ContextBar and
  in the mobile top bar (compact variant, `hint="⌘K"`).

**`AppShell.tsx` rewrite**

- Desktop: outer flex column = ContextBar / middle band / StatusBar.
  Middle band = NavRail + ResizablePanelGroup(Sidebar | ArticleList |
  ReadingPane). Default panel sizes adjusted for the new rail
  (sidebar shrunk 28→22%, list 30→32%, reader 50→46%); the existing
  resize handles still work. Inspector panel uses the new
  `--cockpit-inspector-bg` token.
- Mobile: existing single-pane state machine
  (`sidebar` | `list` | `reader`) preserved verbatim. The top bar gains
  a compact `CommandLauncher` (just `⌘K`) so the palette is
  discoverable on touch too. Phase 7 will replace this with a bottom
  command bar; Phase 3 deliberately leaves the state machine intact.
- Skip-to-content link, focus management, and all existing keyboard
  shortcuts (`j`/`k`, `s`, `m`, `r`, `Shift+R`, `o`, `Enter`, `⌘K`)
  preserved.

**`Sidebar.tsx` reframed as the Feeds tree panel**

- Removed: `All Articles` and `Starred` row buttons (now Inbox /
  Starred in the rail), the bottom Health / Stats / Settings footer
  rail (now in the rail), the header `Refresh All` button (now in the
  ContextBar), the header `AddFeedDialog` (now at the bottom of the
  rail).
- Kept: header `New folder` button, `OpmlActions`, the full feed-tree
  with folder collapse / rename / delete / drag-to-folder behavior.
- Header `<h1>Feed</h1>` replaced with a small uppercase
  `Feeds` eyebrow that fits the cockpit register.
- Props slimmed: `totalUnread`, `starredCount`, `onSelectStarred`,
  `onRefreshAll`, `isRefreshing` no longer accepted (handled at the
  shell level by ContextBar / NavRail / StatusBar).

**Verification — browser smoke test**

Captured against a freshly built dev server at `localhost:3020` with a
single `BBC News` feed seeded.

- Desktop shell renders end-to-end: ContextBar visible at top, Nav
  Rail on left, Sidebar / Article List / Reader in the middle band,
  Status Bar at bottom.
- Command launcher opens the existing palette (⌘K from button, ⌘K
  from keyboard).
- Sidebar/nav actions remain reachable: Inbox / Starred via rail,
  Health / Stats / Settings via rail, Add Feed via rail bottom, New
  folder + OPML via sidebar header, feed-tree feed selection works.
- Article list and reader still work — selecting a feed updates the
  URL via `router.push` and the reader populates on row click.
- Resizable handles still drag between Sidebar / List / Reader.
- Mobile: top bar has hamburger / back chevron + heading + ⌘K
  launcher; underneath the existing list / sidebar / reader state
  machine continues to work.
- Keyboard focus: skip-to-content link visible on focus; rail icons
  receive focus rings; launcher pill receives focus rings; status bar
  is reachable as `role="status"`.

**Validation results**

- `npm run lint` — pass (0 issues)
- `npm run test` — pass (175 passed, 1 skipped, 22 files)
- `npm run build` — pass (10/10 static pages, no TS errors)
- `npm audit` — 0 vulnerabilities

**Deviations / follow-ups**

- The desktop shell still has the existing three resizable panels
  inside the rail. The architecture brief proposed an inspector that
  collapses on `<1280px` and a focus-mode reader; both are deferred
  to Phase 6 (reader / inspector).
- The rail does not yet include `Search` or a typed-scope launcher;
  those land in Phase 4 (palette overhaul).
- `AddFeedDialog`'s trigger button still uses the polish-baseline
  Plus icon; the icon styling in the rail context could be tuned to
  match the rail register in a Phase 3.1 polish pass if wanted.
- Status-bar buffer indicator (the Helix-style `j…` keystroke buffer)
  is wired as a static dot for now; the actual buffer state will
  arrive with Phase 4's command registry.
- Branch nesting note: the child branch is named
  `concept/02-command-center-03-shell` (dash-separated) because git
  refuses to create a branch ref nested under an existing ref of the
  same prefix.

## Screenshots

| View                     | Screenshot | Notes |
| ------------------------ | ---------- | ----- |
| Phase 3 desktop shell    | [`phase3-shell.png`](../screenshots/concepts/02-command-center/phase3-shell.png) | 1440×900. ContextBar, NavRail, Sidebar, ArticleList, ReadingPane (empty), StatusBar. Inbox active. |
| Phase 3 command palette  | [`phase3-command-open.png`](../screenshots/concepts/02-command-center/phase3-command-open.png) | 1440×900. ⌘K invoked from the launcher pill; existing palette dialog renders over the dimmed shell. |
| Phase 3 mobile check     | [`phase3-mobile-check.png`](../screenshots/concepts/02-command-center/phase3-mobile-check.png) | 390×844. Mobile top bar with hamburger + heading + compact ⌘K launcher. State machine preserved. |
| Desktop overview         | TBD (Phase 9) | Inbox mode, queue centered, inspector open. |
| Desktop article selected | TBD (Phase 9) | Inbox + inspector populated; bulk-action toolbar visible after multi-select. |
| Reader view              | TBD (Phase 9) | Focus mode (`f`), inspector full-width. |
| Mobile list              | TBD (Phase 9) | Bottom command bar, queue, status strip. |
| Mobile reader            | TBD (Phase 9) | Reader full-screen with top mini-bar. |
| Empty / loading state    | TBD (Phase 9) | Cockpit-register empty state. |

## Local Run Instructions

```bash
git fetch origin
git checkout concept/02-command-center
npm run setup
npm run dev
```

## Validation Checklist

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm audit`
- [ ] `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` is empty
- [ ] Desktop screenshot captured (Inbox, article selected, focus mode)
- [ ] Mobile screenshot captured (queue, reader)
- [ ] Reader view checked (inspector + focus)
- [ ] Article list / queue selection model checked
- [ ] Sidebar / Feeds mode + nav rail navigation checked
- [ ] Command palette typed scopes checked
- [ ] Empty / loading / error states checked
- [ ] Keyboard navigation checked: existing shortcuts, new `g _` shortcuts, `.`, `f`, `?`, `Esc`, `x`, `Shift+j/k`
- [ ] Skip-to-content link still works
- [ ] WCAG AA contrast holds on chrome and on the cockpit accent
- [ ] `prefers-reduced-motion: reduce` honored on every transition
- [ ] No data / API / schema / dependency changes

## Skills Usage Notes

- **`redesign-existing-projects`** is the primary driver. Its audit
  rubric (typography, color and surfaces, layout, interactivity and
  states, content, component patterns, iconography, code quality,
  strategic omissions) maps directly onto the cockpit register and is
  used as the per-phase checklist when implementation phases land.
- **Claude Code** is the execution shell.
- Supporting design skills (`minimalist-ui`, `design-taste-frontend`,
  `gpt-taste`, `emil-design-eng`) are available for visual critique
  passes only — they do not drive method.
- The Impeccable skill, used for Concept 01, is **not** used here. The
  two concepts are intentionally driven by different methods so that
  the lab tests *both* the skills and the directions.

## Comparison Against Polished Baseline

What is meaningfully different from `lab-polish-v1`:

- The three-pane shell is replaced by a mode-aware grid with a context
  bar, a nav rail, a queue, an inspector, and a status bar.
- The command palette is the primary navigation surface, not an
  accessory.
- The article list is a triage queue with a selection model and bulk
  actions, not a reading list.
- The reader is an on-demand inspector, not the resting state of the
  app.
- A single cool-cyan accent replaces the cool-indigo accent.
- Geist Mono becomes a visual signature via kbd chips and counters.

What we expect to improve:

- Time-to-clear-inbox.
- Discoverability of secondary features (Health, Stats, Settings,
  OPML, Add Feed) through palette + rail.
- Keyboard fluency.

What is at risk of getting worse:

- First-load orientation (the rail-only chrome may feel sparse before
  the palette is opened).
- One-handed mobile use (the bottom-bar palette overlay needs Phase 7
  validation).

What is unresolved at planning time:

- Final accent value (Phase 2 decision).
- Whether `react-resizable-panels` survives in the new shell (Phase 3
  decision).
- Whether the status bar is on by default on desktop (Phase 3 decision).

## Comparison Against Concept 01 / Reading Lamp

Reading Lamp and Command Center are intentionally opposite-pole concepts.

|                          | Concept 01 — Reading Lamp | Concept 02 — Command Center |
| ------------------------ | ------------------------- | --------------------------- |
| Method                   | Impeccable                | `redesign-existing-projects` |
| Metaphor                 | Reading lamp on a desk    | Information cockpit         |
| Primary loop             | Reading the next article  | Triaging the queue          |
| Resting state            | Reader open               | Inspector closed            |
| Palette role             | Accessory                 | Primary navigation          |
| Sidebar                  | Always-visible, recessed  | Demoted into Feeds mode     |
| Article list             | Editorial list            | Triage queue + selection    |
| Color                    | Warm sepia / amber        | Cool slate / single cyan    |
| Typography signature     | Editorial body, balance   | Mono kbd chips, tabular nums|
| Mobile chrome            | Hamburger drawer          | Bottom command bar          |
| First-glance feeling     | Calm, focused, quiet      | Fast, oriented, dense       |

## Risks and Tradeoffs

- **Density overshoot.** Cockpit aesthetic invites cramming — rows ≥30px
  and headlines ≥15px are non-negotiable; whitespace must be reserved
  even when density is high.
- **Keyboard-first overreach.** Mouse users must never hit a dead end.
  Every shortcut has an equivalent click target (palette, rail, button).
- **Palette overreach.** If too much lives only in the palette,
  discoverability collapses. Discoverability is defended by the rail,
  the visible launcher pill in the context bar, the recent-actions row
  inside the palette, and the `?` cheat-sheet.
- **Mobile complexity.** Bottom bar + palette overlay + gestures is a
  lot. Phase 7 must verify one-thumb operation; if it struggles, drop
  to a simpler "palette + back" model.
- **Hidden core RSS features.** Add Feed, OPML, folder management must
  be obvious from the rail and palette; not buried.
- **A11y regression vs `lab-polish-v1`.** Phase 9 must re-run the
  polish-track a11y checks (skip link, landmarks, aria-pressed,
  reduced-motion, focus-visible) plus new ones (combobox roles on the
  palette, `aria-current` on the rail, `aria-live` on the status-bar
  buffer indicator).
- **Scope creep into the data layer.** Multi-select UI is tempting to
  back with a true batch endpoint; resist. UI loops over existing
  single-action server endpoints client-side. If batching becomes a
  real bottleneck, that is a separate canonical-Feed proposal.

## Decision

(Filled at the end of Phase 9.)

- [ ] Keep exploring
- [ ] Mine for parts
- [ ] Candidate finalist
- [ ] Discard
- [ ] Upstream selected pieces to canonical Feed

Decision criteria the concept must clear:

1. Side-by-side, it reads as a **different product** from Reading Lamp
   (different metaphor, different first-glance feeling, different mental
   load).
2. A timed triage test (clear 30 unread) is faster than on
   `lab-polish-v1`. Informal benchmark, recorded here.
3. Backend behavior unchanged
   (`git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json`
   is empty).
4. WCAG AA contrast holds on chrome and accent.
   `prefers-reduced-motion` audit passes.
5. The palette is **discoverable without docs** — a first-time user
   lands on Inbox, sees the launcher pill, the rail, and the cheat-sheet
   hint, and finds Add Feed in under 30 s.
6. Does not read as generic SaaS dashboard slop. Single accent, mono
   kbd chips, intentional density, no card-shadow soup, no AI gradient.

## Follow-up Tasks

- [ ] Approve the architecture above before any code lands.
- [ ] On approval, decide whether Phases 2–9 land on this branch
      directly or split into child branches.
- [ ] Pick the final cockpit accent value in Phase 2 with a contrast
      audit attached.
- [ ] Decide in Phase 3 whether `react-resizable-panels` survives in
      the new shell or is removed (no replacement dependency).
- [ ] Decide in Phase 3 whether the status bar is on by default on
      desktop.
