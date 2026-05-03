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
4. **Command palette overhaul** — ✅ Complete. See Phase 4 Implementation
   Notes below.
5. **Article queue / list redesign** — ✅ Complete. See Phase 5
6. **Reader / inspector** — ✅ Complete. See Phase 6
   Implementation Notes below.
6. **Reader / inspector** — `ReadingPane` adapted to inspect-vs-focus
   densities, inspector slide animation.
7. **Mobile command-center layout** — ✅ Complete. See Phase 7
   Implementation Notes below.
8. **Dialogs / empty / loading / secondary states** — ✅ Complete. See
   Phase 8 Implementation Notes below.
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

## Phase 4 Implementation Notes

**Status**: ✅ Complete on `concept/02-command-center-04-command-palette`.
The command palette is now the central, structured navigation surface
the architecture brief described.

### What changed

- **`src/components/CommandPalette.tsx`** rewritten end-to-end. Same file
  path, same hook entry-point (`useCommandPalette` / `⌘K`), but a much
  larger surface:
  - **Typed scopes** in the input: `>` commands, `#` folders, `@` feeds,
    `/` articles. The active scope shows as a cyan **uppercase badge**
    inside the input row, the icon at the left of the input switches to
    the scope's icon, and the placeholder text updates to match.
  - **Scope chip row** appears below the input when no query is typed —
    four pill buttons (`>` Command, `#` Folder, `@` Feed, `/` Article)
    that prefill the corresponding prefix. Discoverability without docs.
  - **Sectioned results** (`role="listbox"`) with sticky uppercase
    section headers: *Recent*, *Current article* (contextual, only when
    an article is selected), *Navigate*, *Actions*, *Folders*, *Feeds*,
    *Help*, *Articles*. Section order is stable; recent appears only on
    bare-empty queries.
  - **Contextual subcommands** when an article is selected:
    Star/Unstar, Mark read/unread, Open original. Wired to the same
    handlers used by `j/k/s/m/o` shortcuts. Hint chips show the
    matching keystroke.
  - **Recent commands** persisted in `localStorage` under
    `cmd-palette:recent-v1` (max 5 entries; UI-only, no backend).
  - **Kbd chips** for every shortcut hint, using the `Phase 2` `Kbd`
    primitive. `G I`, `G S`, `G H`, `G T`, `S`, `M`, `O`, `?`,
    `⇧ R`. Footer hints (`↑↓` navigate, `↵` select, `tab` cycle scope)
    use the same primitive.
  - **Result rows** redesigned: leading icon, title, breadcrumb-style
    sublabel after a chevron (folder for feeds, feed title for
    articles, "All articles" for Inbox, etc.), trailing hint, and an
    accent left-edge bar + cyan `»` glyph on the active row — matches
    the rail and queue active-row language from Phase 3.
  - **Empty state** is a centered icon + headline + subtext (instead of
    a bare "No results" line).
  - **Footer status bar** inside the dialog: nav hints on the left,
    live result count on the right (`cockpit-mono` tabular).
  - **Tab cycles scopes** (`all → command → folder → feed → article →
    all`), giving keyboard-only users a way to discover scopes without
    typing the prefix character.
  - **Combobox a11y**: `role="combobox"` on the input, `role="listbox"`
    on the result container, `role="option"` on each row,
    `aria-selected` on the active row, `aria-activedescendant` wired to
    the active row's id, `aria-autocomplete="list"`, `aria-expanded` set
    to true while open, `aria-controls` linking input → list. The
    invisible close button is suppressed with `showCloseButton={false}`
    because the dialog now has its own footer hints and `Esc` chip.
  - **Article scope**: capped at 60 entries to keep filtering snappy on
    large queues — this is a UI-only cap; `j/k` traversal still walks
    the full queue.

- **`src/components/layout/AppShell.tsx`** updated to pass the new
  props: `folders`, `articles` (the current `displayedArticles` cache),
  `selectedArticleId`, `currentArticleLink`, `currentArticleStarred`,
  `currentArticleRead`, plus `onSelectArticle`, `onToggleStar`,
  `onToggleRead`, and `onOpenOriginal`. All are derived from existing
  state — no new fetches, no new server actions, no new data flow.

- **`src/components/CommandPalette.tsx`'s old prop surface** is fully
  replaced; the only call-site is `AppShell.tsx`, so no consumer was
  broken.

### What stayed stable

- Trigger surface: still `⌘K` / `Ctrl+K`, still `useCommandPalette`,
  still the `CommandLauncher` pill in the ContextBar and the compact
  variant on mobile. No changes to `CommandLauncher`, `ContextBar`,
  `NavRail`, `StatusBar`, or `Kbd`.
- All existing keyboard shortcuts (`j k s m r ⇧R o`) continue to work
  outside the palette and are *also* exposed inside the palette as
  contextual commands when applicable.
- Backend untouched — zero diff under `src/actions/`, `src/app/api/`,
  `src/lib/`, `prisma/`, generated client, `package.json`,
  `package-lock.json`. No new dependencies.
- Mobile state machine (`mobileView`) preserved verbatim.

### Validation

- `npm run lint` — clean (0 problems).
- `npm run test` — 175 passed, 1 skipped.
- `npm run build` — production build succeeds; route `/` first-load
  size moves from 251 kB to 253 kB (≈ +2 kB for the expanded palette,
  no new bundles).
- `npm audit` — 0 vulnerabilities.
- Scope verification: `git diff --stat main..HEAD -- src/actions/
  src/app/api/ src/lib/ prisma/ package.json package-lock.json` is
  empty.

### Browser observations (1440×900 desktop, 414×896 mobile)

- ⌘K from anywhere opens the palette over the cockpit; clicking the
  ContextBar pill opens the same dialog. No visible flash, no console
  errors.
- Typing `>` → input badge flips to **COMMAND** with cyan tint, results
  filter to commands only, scope chip row hides.
- Typing `> ref` → narrows to "Refresh all feeds" + "Go to Settings"
  ("preferences" keyword match). Footer count updates live.
- Typing `@hac` filters feeds to "Hacker News".
- Typing `#` shows folder section only; selecting a folder navigates
  to its first feed.
- Typing `/` shows the article section; selecting an article calls
  `handleSelectArticle` and switches mobile to reader as expected.
- Selecting an article in the queue then opening ⌘K shows
  *Current article* section at the top with Star / Mark / Open
  original. Pressing `Enter` on Star fires `toggleStar` and the
  palette closes.
- `Tab` cycles through scopes and updates the input + badge.
- `Esc` closes the palette and returns focus to the previously
  focused element.
- Mobile width (414): palette renders full-width with the same scope
  chip row, sections, and kbd hints. Result rows truncate cleanly with
  the breadcrumb chevron.
- No console errors or warnings during any of the flows above.

### Known follow-ups (not in scope here)

- A dedicated `?` cheat-sheet popover is still pending; for now the
  palette's "Keyboard shortcuts" entry deeplinks to `/settings`.
  A real cheat-sheet is fine for Phase 8.
- Helix-style multi-key buffer (`g i`) display in the StatusBar is
  still a static dot — wiring the actual buffer state belongs with the
  shortcut handler refactor in Phase 5 / 8.
- Folder commands jump to the *first feed* in the folder, not a
  proper "filter to folder" mode, because the data model doesn't carry
  a folder filter today. A real folder filter would require a
  `lib/queries.ts` change, which is out of scope for a UI-only phase.
- Article scope cap is 60. If queues grow much larger we may want
  proper FTS-backed search inside the palette (`/`) — that would be a
  Phase 8/9 enhancement, gated on whether the queue redesign in
  Phase 5 changes how articles are paged.

## Phase 5 Implementation Notes

**Status**: ✅ Complete on `concept/02-command-center-05-article-queue`.
The article surface now reads as a queue/inbox: dense rows, hover-revealed
checkboxes, multi-select with cyan tint, and a bulk-action toolbar that
replaces the heading row when any item is checked. Bulk actions reuse
the existing single-id server actions (`markRead`, `markUnread`,
`toggleStar`) by looping client-side — no backend changes.

### What changed

- **`src/components/articles/ArticleRow.tsx`** rewritten:
  - Split prior `isSelected` into **`isCurrent`** (the article being
    read in the inspector) and **`isChecked`** (multi-select state).
    `selectionActive` (any checked) shifts the leading gutter into
    "always-show checkbox" mode so users don't have to hover-and-aim
    once they've started selecting.
  - Leading gutter is now a 28px column that holds either the cyan
    **read-state dot** (default) or a **3.5px square checkbox**. Hovering
    a row swaps the dot for the checkbox; checking persists it.
  - Body is a separate inner `<button>` that handles the open-article
    click — clicking the checkbox stops propagation so it never opens
    the article. `aria-checked` and `role="checkbox"` are on the
    checkbox; the body remains a regular button for keyboard `Enter`.
  - Density tightened: 14px title (was 15px), 10.5px mono meta line,
    `py-2` instead of `py-3`, divider opacity dropped to `border/40`.
    Time-ago renders without "ago" suffix and uses `cockpit-mono`.
  - Star moved out of the inline-title position into the trailing meta
    line (cleaner left margin, no jitter when toggled). Active-edge bar
    now uses `var(--cockpit-accent)` so it matches the rail and palette.
  - Checked-row tint is `color-mix(in oklch, var(--cockpit-accent) 10%,
    transparent)` — visible without being a saturated highlight.

- **`src/components/articles/ArticleList.tsx`** rewritten:
  - New props: `checkedIds: Set<string>`, `onToggleCheck`,
    `onClearSelection`, `onSelectAllVisible`, `onBulkMarkRead`,
    `onBulkMarkUnread`, `onBulkToggleStar`, `isBulkPending`.
  - When any item is checked, the heading row swaps for a **bulk
    toolbar** (`role="toolbar"`, cyan-tinted background, top border
    in cyan-mixed border color). Toolbar surfaces:
    - Select-all-visible checkbox (toggles between `Square` and
      `SquareCheck`).
    - Live `N selected` counter in `cockpit-mono`.
    - Mark Read / Mark Unread / Star (Star ↔ Unstar based on whether
      every checked row is starred). Each action disables itself when
      the operation would be a no-op (e.g., "Read" disabled when all
      checked are already read).
    - `esc clear` button with a Kbd chip — clicking it or pressing
      Escape clears the selection.
    - Spinner appears next to the clear button while `isBulkPending`.
  - When no items are checked, the prior heading row is preserved
    (date-range picker, "mark all read" icon, count) but the heading
    text is now a small-caps eyebrow (`uppercase tracking-[0.18em]`).
  - **Footer hint strip** below the queue surfaces the keyboard model:
    `J/K` navigate, `X` select, `S` star, `M` mark.
  - Local Escape handler scoped to this section: when selection is
    active, Escape clears it (and ignores Escape originating from
    inputs/textareas so it doesn't fight search clearing).

- **`src/components/layout/AppShell.tsx`**:
  - New state: `checkedIds: Set<string>`, `isBulkPending`,
    `lastCheckedIdRef` (for shift-click range select).
  - Effect that drops checked ids no longer present in the visible
    queue (e.g. after switching feeds, toggling starred view, changing
    date range, or after a refresh). Prevents stale selections.
  - `handleToggleCheck(id, event)` — toggle on plain click,
    **shift-click** range-selects between the last toggled row and the
    new one (using the displayed-articles index).
  - `handleClearSelection`, `handleSelectAllVisible`.
  - `handleBulkMarkRead` / `handleBulkMarkUnread` — optimistic update
    of local `articles` state, then `Promise.all` over the relevant ids
    using `markRead` / `markUnread`, then `clear` + `refresh`. Ids that
    are already in the target state are filtered out before the loop —
    we don't issue no-op writes.
  - `handleBulkToggleStar` — computes a coherent target state
    (`every(isStarred) ? false : true`) and only calls `toggleStar(id)`
    on the items whose state needs to flip. Uses the *existing*
    flip-state endpoint, no new "set-starred" action.
  - Wired to both the desktop and mobile `<ArticleList>` instances so
    the bulk model works in both layouts.
  - `selectedCount` plumbed into the StatusBar.

- **`src/components/command/StatusBar.tsx`**: added optional
  `selectedCount` prop. When > 0, renders a cyan-tinted
  `N SELECTED` chip between the mode label and the article counter,
  using the same `color-mix` accent treatment as the palette scope
  badge.

- **`src/hooks/use-keyboard-shortcuts.ts`**: added optional
  `onToggleSelectCurrent`. When set, pressing `x` toggles the checkbox
  on the currently-open article. Existing shortcuts (`j k s m r ⇧R o
  Enter`) untouched. Hook still skips events originating in inputs.

### What stayed stable

- All single-article behavior unchanged: clicking a row still opens
  it, optimistic mark-as-read in the reader path still fires, star
  toggle from the reader still works.
- Search, date range, load-more, empty/no-results states unchanged
  visually except for the eyebrow heading style.
- Mobile state machine (`mobileView: "sidebar" | "list" | "reader"`)
  preserved verbatim. Mobile queue gets the same selection model
  (long-press alternative isn't wired here — Phase 7 handles
  mobile-specific selection gestures).
- Backend untouched: zero diff under `src/actions/`, `src/app/api/`,
  `src/lib/`, `prisma/`, `package.json`, `package-lock.json`. No new
  dependencies, no new server actions, no new routes.
- All command-palette behavior unchanged.

### Validation

- `npm run lint` — clean.
- `npm run test` — 175 passed, 1 skipped.
- `npm run build` — production build succeeds; route `/` first-load
  unchanged at 253 kB. CSS bundle moves slightly (`16.2 kB`) due to
  new utility usages.
- `npm audit` — 0 vulnerabilities.
- Scope verification: `git diff --stat main..HEAD -- src/actions/
  src/app/api/ src/lib/ prisma/ package.json package-lock.json` is
  empty.

### Browser observations (1440×900 desktop, 414×896 mobile)

- Hovering a row reveals the checkbox in the leading gutter; the
  cyan unread dot fades out so the gutter stays a single 28px
  column. No layout shift.
- Clicking the checkbox toggles selection without opening the
  article. Clicking anywhere else on the row opens it as before.
- After 3 rows are checked, the heading swaps to the cyan bulk
  toolbar showing `3 selected · Read · Unread · Star · esc clear`.
  All three rows render with the cyan tint + accent left edge.
- StatusBar shows the cyan `3 SELECTED` chip between `INBOX` and
  the article counter; the chip disappears the moment selection
  clears.
- Pressing `Esc` clears selection and the heading row returns to
  the date-range picker. Pressing `X` while an article is open
  toggles its checkbox without affecting the open state.
- Bulk Read disables itself once every checked row is already read
  (and Unread / Star toggle their labels symmetrically).
- Shift-clicking a checkbox extends the selection range from the
  last toggled row to the new one. Confirmed against load-more —
  range select walks the full appended list, not just the initial
  page.
- Switching to the Starred mode clears any stale selections from
  the Inbox view (effect-driven cleanup, no flicker).
- Search mode + date range still operate normally; checking a row
  in search results works the same way.
- Mobile (414×896): queue renders dense, the leading gutter still
  reserves space for the checkbox so spacing is consistent. Bulk
  toolbar fits within the narrow header without truncation.
- No console errors during any flow.

### Known follow-ups

- **No keyboard for bulk select-all-visible**. The toolbar button
  works, but a `Cmd/Ctrl+A` shortcut scoped to the queue would round
  out the keyboard model. Deferred — adding a global `Cmd+A` handler
  needs care so it doesn't break native input behavior.
- **Long-press multi-select on mobile** is not wired. Mobile users
  can still tap each checkbox, but a long-press-to-enter-selection
  gesture is the natural mobile equivalent of `x`. Belongs in
  Phase 7's mobile redesign.
- **No bulk-delete or bulk-folder-move** exposed. Deliberately
  excluded — those would need either new server actions (forbidden
  this phase) or feel slow as a per-id loop on large selections. If
  the canonical Feed adds a real batch endpoint we can light them up
  here without further UI work.
- **StatusBar buffer indicator** is still a static dot. Wiring the
  Helix-style multi-key buffer remains a Phase 7/8 follow-up.
- **Row a11y nesting**: the row is now `<div>` containing a
  `<button role="checkbox">` and a `<button>` body. Both are keyboard
  reachable; the previous "single big button" model gave a slightly
  cleaner tab ring but couldn't host a second control. Verified
  with screen reader narration in the Chromium DevTools a11y panel —
  both controls announce correctly.

## Phase 6 Implementation Notes

**Status**: Complete — reader pane reframed as cockpit Inspector with a UI-only Focus mode.

**What changed**

- `ReadingPane.tsx` rewritten around an **Inspector toolbar** (`h-9`, hairline divider): a cyan dot + cockpit-mono `INSPECT` / `FOCUS` mode label, a `›` separator, the feed crumb in mono uppercase tracking, then a focus-toggle button (`Maximize2` / `Minimize2` icon + `F` Kbd chip) and the existing `TypographySettings` popover. Toolbar stays mounted in both modes; in focus it goes transparent so the reading surface dominates.
- New UI-only `focusMode` state inside `ReadingPane` (no persistence, no extraction). It's deliberately distinct from `readerMode` (which still controls Readability extraction). Focus mode bumps the article max-width by 80px (capped at 880px), grows vertical padding, and switches the header into editorial density.
- `ArticleHeader.tsx` rewritten with a `density` prop (`"inspect" | "focus"`).
  - **Inspect** (default): mono feed eyebrow at 10px / `0.18em`, 20–22px title, mono meta line (author · date · `Clock` reading-time), action strip with `h-7` buttons — `Reader`, `Star` + `S` Kbd hint, `Open original` + `O` Kbd hint. Reader-on state uses a cyan-tinted secondary fill instead of the generic shadcn `secondary` so it reads as "armed", not "selected".
  - **Focus**: editorial 28–32px title, larger spacing, same action strip stays compact.
- New **`f` keyboard shortcut** to toggle focus, registered locally inside `ReadingPane` (only when an article is mounted). Mirrors the existing `useKeyboardShortcuts` skip-when-typing logic so it doesn't fight inputs.
- Empty state replaced with a cockpit `InspectorEmptyState`: bordered cyan-tinted square with `Inspect` icon, mono `INSPECTOR IDLE` eyebrow, and a kbd-chip hint row (`J/K` navigate queue · `⌘K` palette).
- Skeleton restyled to match the new toolbar (cockpit-mono `Inspect` label with a pulsing dot) and the new dense header (smaller title bars, tighter action-strip placeholders, hairline border).
- Highlights list restyled: cockpit-mono `HIGHLIGHTS 03` heading with cyan `Highlighter` glyph, items get a 2px left edge in accent and a subtle accent-tinted card fill. Note textarea focus border switches to the cockpit accent.
- Highlight popover: rounded-sm, mono `HIGHLIGHT` label, cyan-tinted bg + accent text + accent border so it reads as a cockpit chip rather than a default shadcn button.

**What stayed stable**

- Article fetching, sanitization (`dangerouslySetInnerHTML` source unchanged), highlights data flow (`getHighlights`, `addHighlight`, `deleteHighlight`, `updateHighlightNote`), Readability extraction (`extractArticle`), star toggle, image-error hide effect, mouse-up selection / `rangeTextOffset` math.
- `readerMode` semantics (full extraction) preserved exactly — Reader button still calls `extractArticle`, still caches the result, still flips back to original on second press, still skips highlight application against the extracted DOM.
- `useTypography` storage key, defaults, and clamps untouched.
- `AppShell.tsx`, `StatusBar.tsx`, `globals.css`, and the keyboard shortcuts hook were **not** changed this phase (focus shortcut handled inside `ReadingPane` to keep the surface area minimal). Mobile `mobileView` state machine and reader swipe wiring untouched.

**Validation**

- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npm run test` — 175 passed, 1 skipped
- `npm run build` — succeeds; route sizes unchanged in shape (no measurable bundle impact)
- `npm audit` — 0 vulnerabilities
- `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` — empty

**Browser observations**

- Selecting an article from the queue mounts the inspector with the dense header and mono meta line; the cyan dot + `INSPECT` label make the right pane read as an instrument rather than a generic reader.
- `f` toggles focus from anywhere on the page (not just the inspector); the toolbar fades to transparent, max-width grows, the header reflows to editorial 32px. `f` again returns to inspect with no scroll loss.
- Reader mode on top of focus mode works — the cyan-armed Reader button is legible against either header density.
- Highlighting selection still pops the floating chip; it now reads as a cockpit affordance instead of a popover button. Save / delete / note-edit all functional. Highlights list at the bottom renders with the new cyan edge.
- Empty state is the right register for "no article selected" — no longer a soft `BookOpen` editorial nudge; it's a parked instrument with kbd hints.
- Mobile reader: same toolbar, kbd chips compress (some hide via `sm:` breakpoint, others stay) — the inspector frame still reads correctly at 390px.
- Command palette contextual article actions (Star / Mark read / Open original) still drive the reader because `ReadingPane` props were not changed.
- Console clean across mount, focus toggle, reader extraction, highlight create/delete.

**Deviations / follow-ups**

- The `f` shortcut listens at the document level inside `ReadingPane` rather than going through `useKeyboardShortcuts`. If we accumulate more reader-local shortcuts (`.` to collapse, `g` for go-to-top, etc.) it's worth promoting them into the central hook in a later phase.
- `readerMode` was not renamed to "Reader extraction" anywhere user-facing — the doc clarifies the distinction (Reader extraction vs Focus density) but the button still says "Reader". Renaming is a Phase 8 copy pass.
- Inspector currently shares the `ResizablePanel` with the rest of the layout; the doc-level proposal to fade cockpit chrome to a 1px outline when focus mode is on is **not** implemented in Phase 6 (would require AppShell changes). Focus density alone gave enough separation to be useful; chrome-fade can be re-evaluated when the reader/inspector behavior is reviewed against the Phase 9 timed-triage test.
- Mobile bottom command bar (Phase 7) will add a top mini-bar for the reader; current mobile reader still reuses the existing top bar and is left as-is for this phase.

## Phase 7 Implementation Notes

**Branch:** `concept/02-command-center-07-mobile` (child of `concept/02-command-center`).

### What changed

- New `src/components/command/MobileCommandBar.tsx` — bottom command bar with five primary surfaces: **Feeds** (sidebar), **Queue** (Inbox), elevated centered **⌘** palette trigger, **Starred**, **Reader**. Each non-elevated button has a 12×12 touch target, a Lucide glyph, a cockpit-mono label, an optional unread/starred count badge, and a 2px cyan top-edge bar that lights up when active. The center button is a 14×14 circular pill with a cyan radial wash and the Lucide `Command` glyph — discoverable, thumb-reachable, and visually anchored.
- Mobile section of `src/components/layout/AppShell.tsx` rewritten:
  - Top bar dropped from h-14 to h-12 and re-skinned in cockpit register: cockpit-mono mode badge (`QUEUE` / `STARRED` / `FEEDS` / `READER`) with a pulsing cyan dot when refreshing, a `·` separator, then the heading, then a refresh button on the right (hidden in reader mode where the inspector toolbar already exposes the relevant chrome).
  - Hamburger removed; primary navigation now lives entirely in the bottom command bar.
  - Back chevron only appears in reader mode (returns to queue/list).
  - The `mobileView` state machine ("sidebar" | "list" | "reader") is preserved verbatim — the bottom bar maps onto the existing handlers.
  - Mobile layout no longer adds `pb-[env(safe-area-inset-bottom)]` to the outer wrapper; the command bar applies `pb-[max(env(safe-area-inset-bottom),6px)]` itself, so the bar visually sits flush with the home indicator on iOS without a doubled gap.

### Mapping bottom-bar buttons to existing handlers

| Button | Behavior |
| --- | --- |
| Feeds | `setMobileView("sidebar")` |
| Queue | If currently in starred view: `handleSelectFeed(null)` (clears starred + jumps to list). Otherwise: `setMobileView("list")` (preserves the active feed filter). |
| ⌘ (centered) | `setPaletteOpen(true)` |
| Starred | `handleSelectStarred()` |
| Reader | `setMobileView("reader")` if there is a `selectedArticleId`; otherwise disabled (40% opacity, `disabled` attribute). |

This keeps Phase 5/6 selection + reader state intact: tapping Reader returns to the previously opened article, swipe-right on the reader still goes back to the list, and ⌘K opens the same scope-aware palette as desktop.

### What stayed stable

- No changes to `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`, generated client, `package.json`, `package-lock.json`. `git diff --stat main..HEAD` for those paths is empty.
- No new dependencies. The bar is built from existing Lucide icons + Tailwind + the cockpit token set.
- `mobileView` state machine, swipe gestures (`useSwipe` on the reader), keyboard shortcuts (`useKeyboardShortcuts`), command palette behavior, article fetching, sanitization — all untouched.
- Desktop shell (ContextBar + NavRail + StatusBar + ResizablePanelGroup) untouched; only the mobile branch of `AppShell` changed.

### Validation

| Gate | Result |
| --- | --- |
| `npm run lint` | Clean (no warnings, no errors). |
| `npm run test` | 175 passed, 1 skipped. |
| `npm run build` | Build succeeds. `/` route remains 143 kB / 257 kB First Load. |
| `npm audit` | 0 vulnerabilities. |
| Backend invariant | `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` is empty. |

### Browser observations (390×844)

- **Mobile queue**: top mode badge reads `· QUEUE · All Articles` with refresh on the right; queue density and unread dots from Phase 5 carry over; bottom bar shows `QUEUE` active (cyan top edge). 99+ unread badge renders on the Queue glyph; `2` starred badge renders on the Starred glyph.
- **Mobile inspector**: tapping an article switches the top bar to `· READER · All Articles` with back chevron, the Phase 6 inspector toolbar (cyan dot · `INSPECT` · feed crumb · `Focus F` · `AA`) appears below the top bar, and the bottom-bar Reader button takes the cyan active state.
- **Mobile palette**: tapping the centered ⌘ button opens the same Phase 4 scoped palette (typed `>`/`#`/`@`/`/` chips, kbd hints, result count footer). `Esc` closes it.
- **Star/unstar from reader**: the `Star` button in `ArticleHeader` works (still routed through `handleToggleStar`), as does `S` if a hardware keyboard is attached.
- **Multi-select**: Phase 5 row checkboxes remain visible at mobile width; long-press equivalents are still a Phase 7/8 follow-up (kept out of scope here).
- **Swipe gestures**: swipe-left advances to the next article, swipe-right returns to the queue (preserved from Phase 6).
- **Desktop smoke check**: ContextBar + NavRail + queue + inspector + StatusBar render unchanged at 1440×900; no console errors.

### Deviations and follow-ups

- **Reader/Star/Open original button row** in `ArticleHeader` already provides per-article actions; we did **not** add a duplicate quick-action strip above the bottom command bar. The original Phase 7 plan in the architecture brief calls out such a strip, but it would duplicate `ArticleHeader` and add visual noise on a 390-wide screen. Revisit if user testing shows the toolbar isn't discoverable enough.
- **Swipe-from-edge to open palette** was not implemented; the centered ⌘ button covered the discoverability brief without adding gesture surface area.
- **Long-press to multi-select** (mobile equivalent of `x`) is still deferred to Phase 8.
- **Helix-style multi-key buffer** indicator on the StatusBar still pending — desktop only, so unchanged for this phase.
- **Reader full-screen with chrome fade** (the doc-level proposal to fade cockpit chrome in focus mode) remains unimplemented; on mobile the inspector already takes the whole content area below the top bar.

## Phase 8 Implementation Notes

**Branch:** `concept/02-command-center-08-secondary-states` (child of `concept/02-command-center`).

### What changed

- **`src/components/articles/ArticleList.tsx`** — extracted a small `QueueEmptyState` helper (UI-only, file-local) used by all four secondary states: search-error, no-results, no-feeds, and all-caught-up. Each state now renders a square-bordered cyan-tinted (or destructive-tinted) glyph tile, a cockpit-mono uppercase eyebrow (`No matches`, `Search failed`, `Queue empty`, `All clear`), a balanced display title, a muted description, an outline action button, and an optional kbd-chip hints row (`⌘K open palette`, `⇧R refresh all`).
- **`src/components/sidebar/AddFeedDialog.tsx`** — re-skinned in cockpit register: cyan-on-slate `New feed` eyebrow with Lucide `Rss`, dense title, mono URL input with a `↵` Kbd hint pinned to the right edge, primary button uses `Plus` glyph and a `Loader2` spinner during submit, error rendered as a hairline destructive chip. The "Try one of these" list became a `Discover` cockpit-mono section with hairline-on-hover rows that reveal a cyan `Use →` indicator on the right. Footer strip with an `esc close` Kbd hint sits at the bottom of the dialog body.
- **`src/components/sidebar/FeedSettingsDialog.tsx`** — same eyebrow + cockpit-mono labels treatment; refresh interval input uses `font-mono` and a `· minutes` suffix in the label; error chip matches the AddFeed surface.
- **`src/components/sidebar/FeedItem.tsx`** — delete confirmation alert dialog gets a destructive cockpit-mono `Destructive` eyebrow with `Trash2`, tightened title typography, balanced description text. Behavior, focus order, and shadcn primitives unchanged.

### What stayed stable

- No changes to `src/actions/`, `src/app/api/`, `src/lib/`, `prisma/`, generated client, `package.json`, `package-lock.json`. Backend invariant `git diff --stat main..HEAD -- src/actions/ src/app/api/ src/lib/ prisma/ package.json package-lock.json` is empty.
- No new dependencies. Treatments use existing cockpit tokens (`--cockpit-accent`, `.cockpit-mono`), `Kbd`/`KbdGroup` primitives, and existing Lucide icons.
- Dialog primitives (`src/components/ui/dialog.tsx`, `src/components/ui/alert-dialog.tsx`) **not** edited — restyling is per-instance via `className` overrides so other consumers keep their look.
- All form behavior, validation, server-action calls, focus management, and dialog open/close semantics are byte-for-byte preserved.
- Reader empty / loading states from Phase 6 (`InspectorEmptyState`, `ReadingPaneSkeleton`) are already in cockpit register — left untouched.
- Bulk-selection toolbar from Phase 5 already cockpit-styled — left untouched.
- Highlight popover from Phase 6 already cockpit-styled — left untouched.

### Validation

| Gate | Result |
| --- | --- |
| `npm run lint` | Clean. |
| `npm run test` | 175 passed, 1 skipped. |
| `npm run build` | Build succeeds. |
| `npm audit` | 0 vulnerabilities. |
| Backend invariant | Empty diff vs `main` for backend paths. |

### Browser observations

- **Add Feed dialog (1440×900)**: cyan `RSS · NEW FEED` eyebrow, dense `Add a feed` title, mono URL placeholder with `↵` Kbd, "Add feed" primary button. `DISCOVER` section lists six suggested feeds with hover-only `Use →` cockpit-mono indicator. Footer line shows `ESC · CLOSE`. No console errors.
- **Empty / no-matches state (1440×900)**: queue center renders the new tile + `NO MATCHES` cyan eyebrow + `No results for "…"` title + `Clear search` button. Inspector still shows `INSPECTOR IDLE` (Phase 6 empty state); they read as a coherent cockpit pair.
- **Mobile no-matches (390×844)**: same treatment scaled down — square tile, cyan eyebrow, `Clear search` button, mobile command bar visible underneath with `QUEUE` active. Touch targets ≥ 40px.
- **Delete confirmation**: opens with `TRASH · DESTRUCTIVE` red-tinted eyebrow above the title; Cancel + destructive Delete buttons unchanged.
- **Feed settings dialog**: cockpit `Settings2 · FEED CONFIG` eyebrow, mono labels, mono interval input. Save / Cancel buttons unchanged.
- **No console errors** on any of the captured states.
- **Desktop smoke check**: no regression on the cockpit shell, queue, inspector, palette, or status bar.

### Deviations and follow-ups

- **OPML import/export surface** (`OpmlActions`) was not restyled — it lives behind a small button in the sidebar footer and didn't visually clash with cockpit register. Revisit only if Phase 9 visual review flags it.
- **Health / Stats / Settings pages** (`/health`, `/stats`, `/settings`) are full route pages, not dialogs. They are reachable via the rail and the palette but were left out of scope for this phase — they are listed in the architecture brief as Phase 8 candidates but the diff would be too large for a "secondary states" pass and would dilute the Phase 9 review. Marked as Phase 9 follow-up.
- **Loading skeleton variants** for the queue list (between filter switches) were not redesigned — the existing transition is essentially instantaneous on local data, so the placeholder isn't visible long enough to justify a treatment. Add a deliberate skeleton if Phase 9's perf audit shows otherwise.
- **`readerMode` rename copy pass** (Reader button → "Extract" or similar) deferred again — still not blocking, still a Phase 9 cleanup.
- **`cn` utility import** is required from the new `QueueEmptyState`; `ArticleList.tsx` already imports it from Phase 5, so no new imports were needed.

## Screenshots

| View                     | Screenshot | Notes |
| ------------------------ | ---------- | ----- |
| Phase 3 desktop shell    | [`phase3-shell.png`](../screenshots/concepts/02-command-center/phase3-shell.png) | 1440×900. ContextBar, NavRail, Sidebar, ArticleList, ReadingPane (empty), StatusBar. Inbox active. |
| Phase 3 command palette  | [`phase3-command-open.png`](../screenshots/concepts/02-command-center/phase3-command-open.png) | 1440×900. ⌘K invoked from the launcher pill; existing palette dialog renders over the dimmed shell. |
| Phase 3 mobile check     | [`phase3-mobile-check.png`](../screenshots/concepts/02-command-center/phase3-mobile-check.png) | 390×844. Mobile top bar with hamburger + heading + compact ⌘K launcher. State machine preserved. |
| Phase 4 command palette  | [`phase4-command-palette.png`](../screenshots/concepts/02-command-center/phase4-command-palette.png) | 1440×900. ⌘K open with sectioned results (Navigate, Actions, Feeds, Help, Articles), scope chip row, kbd hints, footer status. |
| Phase 4 command search   | [`phase4-command-search.png`](../screenshots/concepts/02-command-center/phase4-command-search.png) | 1440×900. Typed scope `> ref` activated — cyan **COMMAND** badge in input, filtered to matching commands only, result count in footer. |
| Phase 4 mobile palette   | [`phase4-mobile-command.png`](../screenshots/concepts/02-command-center/phase4-mobile-command.png) | 414×896. Same palette on mobile width — scope chips, sections, kbd hints all stack cleanly. |
| Phase 5 article queue    | [`phase5-article-queue.png`](../screenshots/concepts/02-command-center/phase5-article-queue.png) | 1440×900. Dense queue, cyan unread dots in the leading gutter, mono time-ago, eyebrow heading row, footer kbd-hint strip (`J/K`, `X`, `S`, `M`). |
| Phase 5 bulk selection   | [`phase5-bulk-selection.png`](../screenshots/concepts/02-command-center/phase5-bulk-selection.png) | 1440×900. Three rows checked — heading row replaced by cyan bulk toolbar (`3 selected · Read · Unread · Star · esc clear`). StatusBar shows cyan `3 SELECTED` chip. |
| Phase 5 mobile queue     | [`phase5-mobile-queue.png`](../screenshots/concepts/02-command-center/phase5-mobile-queue.png) | 414×896. Mobile queue with the same density and gutter; selection model carries over but is hidden until rows are tapped. |
| Phase 6 inspector        | [`phase6-inspector.png`](../screenshots/concepts/02-command-center/phase6-inspector.png) | 1440×900. Inspector toolbar (cyan dot · `INSPECT` · feed crumb · `Focus F` · `AA`), dense article header at 22px, mono meta line, action strip with `Reader`, `Star S`, `Open original O` Kbd chips. |
| Phase 6 focus reader     | [`phase6-focus-reader.png`](../screenshots/concepts/02-command-center/phase6-focus-reader.png) | 1440×900. After pressing `f` — toolbar goes transparent, label flips to cyan `FOCUS`, title grows to editorial 32px, content padding expands. |
| Phase 6 mobile reader    | [`phase6-mobile-reader.png`](../screenshots/concepts/02-command-center/phase6-mobile-reader.png) | 390×844. Mobile reader retains the inspector toolbar and dense header. |
| Phase 7 mobile queue     | [`phase7-mobile-queue.png`](../screenshots/concepts/02-command-center/phase7-mobile-queue.png) | 390×844. Top bar shows cyan dot + `QUEUE` mode badge + heading + refresh. Bottom command bar with five surfaces — `FEEDS`, active `QUEUE` (cyan top edge), elevated cyan `⌘` trigger, `STARRED`, `READER`. |
| Phase 7 mobile inspector | [`phase7-mobile-inspector.png`](../screenshots/concepts/02-command-center/phase7-mobile-inspector.png) | 390×844. After tapping an article. Top bar flips to `READER` badge with back chevron. Bottom command bar Reader button is active (cyan top accent). Inspector toolbar + article header stack cleanly above the bar. |
| Phase 7 mobile palette   | [`phase7-mobile-command.png`](../screenshots/concepts/02-command-center/phase7-mobile-command.png) | 390×844. Centered ⌘ button on the bottom bar opens the same scope-aware palette used on desktop, with kbd hints and result counts. |
| Phase 8 dialog           | [`phase8-dialog.png`](../screenshots/concepts/02-command-center/phase8-dialog.png) | 1440×900. Add-feed dialog with cockpit eyebrow (`RSS · NEW FEED`), mono URL input + `↵` Kbd, primary `Add feed` button, `DISCOVER` section listing six suggested feeds with hover-only cyan `Use →`, `ESC · CLOSE` footer strip. |
| Phase 8 empty state      | [`phase8-empty-state.png`](../screenshots/concepts/02-command-center/phase8-empty-state.png) | 1440×900. Search returning zero results — square cyan-bordered tile with `Search` glyph, `NO MATCHES` cockpit-mono eyebrow, balanced title `No results for "…"`, muted description, outline `Clear search` button. Inspector still shows Phase 6 idle state — they read as a coherent pair. |
| Phase 8 mobile empty     | [`phase8-mobile-empty.png`](../screenshots/concepts/02-command-center/phase8-mobile-empty.png) | 390×844. Same no-results treatment scaled down for mobile, sitting above the bottom command bar with `QUEUE` active. |
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
