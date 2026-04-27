# Feed v1.0.1 — Design Audit

Audit complete. Below is a prioritized, read-only design audit grounded in the project-level skills:

- `redesign-existing-projects`
- `emil-design-eng`
- `minimalist-ui`
- `gpt-taste`
- `design-taste-frontend`

The audit is tied to specific files.

---

## Scope

Visual design, hierarchy, spacing, typography, interaction quality, motion, accessibility, responsiveness, and product feel.

No changes proposed to:

- Data layer
- Server actions
- Prisma
- Sanitization
- Safe-fetch
- Feature set

---

## Implementation Status

This audit started as a read-only design audit. Implementation is being done incrementally through small reviewable branches.

Completed:

- `design/01-tokens-and-fonts`
  - Fixed Geist font token mapping.
  - Refined dark theme tokens.
  - Added motion timing/easing variables for future branches.
  - Validation passed: lint, test, build, audit.

- `design/02-article-row-typography`
  - Polished article row hierarchy.
  - Added selected/hover indicator.
  - Added focus-visible state.
  - Improved title/meta typography.
  - Validation passed: lint, test, build, audit.

- `design/03-focus-and-a11y-basics`
  - Fixed shared Button cursor behavior.
  - Added sidebar and feed-item focus-visible states.
  - Improved reveal-on-focus parity.
  - Added missing aria-labels across sidebar, app chrome, article list, and typography settings.
  - Validation passed: lint, test, build, audit.

- `design/04-app-chrome`
  - Tightened article list toolbar rhythm.
  - Simplified sidebar header action density.
  - Moved Health, Stats, and Settings to a footer rail.
  - Removed an unnecessary sidebar separator.
  - Replaced `h-screen` with `h-dvh`.
  - Validation passed: lint, test, build, audit, browser verification.

Next:

- `design/05-reading-pane-typography`

# 1. High-Impact Quick Wins


These are low-risk, high-reward, mostly surface-level improvements. Most live in `globals.css` plus a few component files.

---

## 1.1 Geist Font Is Loaded but Never Applied

**Status:** Completed in `design/01-tokens-and-fonts`.

**Issue**

`layout.tsx:6` exposes `--font-geist-sans`, but `globals.css:11` declares:

```css
--font-sans: var(--font-sans);
````

This is a self-reference. The body uses `font-sans`, so Tailwind falls through to system UI.

**File(s)**

* `app/layout.tsx`
* `app/globals.css`

**Fix Sketch**

Map:

```css
--font-sans: var(--font-geist-sans);
```

Do the same for mono. This is the single biggest visible improvement.

---

## 1.2 Palette Feels Like Default Tailwind / shadcn

**Status:** Completed in `design/01-tokens-and-fonts`.

**Issue**

Pure neutral grays plus saturated indigo accent:

```css
oklch(0.65 0.15 250)
```

This reads as default Tailwind/shadcn. Saturation `0.15+` on a single hue across `primary`, `ring`, `chart-1`, and `sidebar-primary` creates the AI-fingerprint look flagged by the redesign skill.

**File(s)**

* `globals.css:91-124`

**Fix Sketch**

Pick one direction:

* Warmer charcoal:

  * Background: `oklch(0.14 0.005 60)`
  * De-saturated accent: `≤0.10` chroma
* Or commit to a colder steel palette.

Tint `border` and `input` slightly.

---

## 1.3 Background Is Too Flat

**Status:** Partially completed in `design/01-tokens-and-fonts`.

The surface tokens were refined and lightness deltas were widened. A noise overlay was intentionally not added.

**Issue**

The background is an unbroken flat dark surface.

`sidebar` uses `bg-card`; list and reader use `bg-background`, but the delta is only `0.04` lightness, which is barely visible.

**File(s)**

* `globals.css`
* `AppShell.tsx:442`
* `AppShell.tsx:468`
* `AppShell.tsx:494`

**Fix Sketch**

Either widen the lightness delta:

```text
background: 0.12
card:       0.16
popover:    0.21
```

Or add a subtle fixed `4%` noise overlay:

```css
pointer-events: none;
```

This breaks up the digital flatness.

---

## 1.4 Article Row Needs Better Interaction Feedback

**Status:** Completed in `design/02-article-row-typography`.

**Issue**

`ArticleRow` has no hover or active feedback beyond `bg-accent/50`.

It also lacks a visible focus ring for keyboard users. It is a `<button>`, but does not have `focus-visible` styling.

**File(s)**

* `articles/ArticleRow.tsx:33-41`

**Fix Sketch**

Add:

```tsx
focus-visible:ring-2
focus-visible:ring-ring
active:bg-accent
```

Also add a `1px` left border on hover and selected states to telegraph the selected article.

---

## 1.5 Article Row Typography Is Flat

**Status:** Completed in `design/02-article-row-typography`.

**Issue**

Current hierarchy is too compressed:

* Title: `text-sm`
* Meta: `text-xs`

There is not enough optical contrast between unread/read beyond weight and color.

**File(s)**

* `ArticleRow.tsx:42-61`

**Fix Sketch**

Use:

```tsx
text-[15px]
leading-[1.35]
tracking-[-0.005em]
```

For source metadata:

```tsx
text-[11px]
uppercase
tracking-wide
```

For date:

```tsx
font-mono
tabular-nums
```

This creates cleaner column rhythm.

---

## 1.6 Article List Toolbar Rhythm Is Choppy — DONE (`design/04-app-chrome`)

Resolved on `design/04-app-chrome`:

* Search row dropped from `h-12` to `h-11` and lost its `border-b`, so the two header rows now read as a single 80px header capped by one divider at the bottom.
* Meta row tightened to `h-9` with the article count pushed to `ml-auto` (smaller `text-[11px]`/`muted-foreground/80`) so the date-range picker reads as the primary affordance and count/mark-all cluster trailing.
* Search ellipsis now uses a real `…` glyph for typographic polish.
* The two-row structure was kept rather than fully merging; the search input needs full-width breathing room and the meta row functions as section header for the list scroll area.

---

## 1.7 Native Dialogs Break Product Feel

**Issue**

`window.prompt` and `window.confirm` are used for:

* New folder
* Delete folder

Native dialogs break dark mode and feel un-app-like.

**File(s)**

* `Sidebar.tsx:86-96`

**Fix Sketch**

Use existing primitives:

* `components/ui/dialog`
* `components/ui/alert-dialog`

---

## 1.8 Reader Shows Before Content Arrives

**Issue**

`onSelectArticle` shows the reader before content arrives.

The fetch to `/api/articles/[id]` is awaited inside the handler. There is no skeleton, so the pane appears to sit on the previous article.

**File(s)**

* `AppShell.tsx:186-208`
* `ReadingPane.tsx:184-191`

**Fix Sketch**

Add a loading state in `ReadingPane` that renders:

* Title skeleton
* Meta skeleton
* Body skeleton

Match the final geometry.

---

## 1.9 Sidebar Buttons Need Focus Rings — DONE (`design/03-focus-and-a11y-basics`)

Resolved on `design/03-focus-and-a11y-basics`:

* **Shared Button cursor behavior** — `components/ui/button.tsx`: added `cursor-pointer` + `disabled:cursor-not-allowed` to `buttonVariants`. Removed the redundant `disabled:pointer-events-none` so the disabled cursor actually shows. Fixes the asymmetry where `<Link>`-rendered actions (Health/Stats/Settings) showed a pointer but `<Button>`-rendered ones (New Folder, Refresh, Add feed, Import/Export) did not.
* **Sidebar focus-visible rings** — `Sidebar.tsx`: added `outline-none focus-visible:ring-2 focus-visible:ring-ring/60` to the bare buttons (All Articles, Starred, folder collapse toggle, rename, delete).
* **Feed item focus-visible / reveal-on-focus parity** — `FeedItem.tsx`: focus-visible ring on the `role="button"` row and on inner refresh / settings / delete icon buttons. Hover-only icon actions now also reveal on `focus-visible`.
* **`aria-label` improvements** across `AppShell.tsx` (mobile back / open-feeds), `ArticleList.tsx` (clear-search, mark-all-read), `TypographySettings.tsx` (toggle with `aria-expanded`, ± steppers labeled by row), `Sidebar.tsx` (folder rename/delete labeled with folder name, folder toggle exposes `aria-expanded`), and `FeedItem.tsx` (decorative icons set `aria-hidden`).
* **Validation:** `npm run lint`, `npm run test` (175 passed, 1 skipped), `npm run build`, `npm audit` (0 vulnerabilities) — all clean.

---

## 1.10 Lucide Icons Feel Cliché

**Issue**

Lucide icons are used everywhere. Every navigation action uses Lucide, which the redesign skill flags as an AI-default pattern.

**File(s)**

* Sidebar icons
* Header icons

**Fix Sketch**

Optional later improvement: swap Lucide for Phosphor.

Since no installs are desired right now, defer that. For now, audit stroke widths so the icons feel consistent. For example, `Newspaper` appears heavier than `Star` at `1.5px`.

---

# 2. Medium Design Improvements

These are bigger than a tweak but smaller than a redesign. They are multi-file but contained.

---

## Reading Pane Typographic Scale

Current article content scale:

```css
h1: 1.5rem
h2: 1.25rem
h3: 1.125rem
```

**File(s)**

* `globals.css:157-159`

For a reader, this is too compressed.

**Recommendation**

Move to a `1.2` modular scale with a real display `h1`, approximately `2rem` at a max width of `720px`.

Add:

```css
text-wrap: balance;
```

to `h1` and `h2`.

Add:

```css
text-wrap: pretty;
```

to paragraphs.

Also improve defaults:

* `maxWidth`: approximately `680px`
* `fontSize`: `17px`

---

## Article Header Hierarchy

**Issue**

`ArticleHeader.tsx:37-63` packs feed, author, date, and reading time into one bullet-separated line.

With long feed titles, this wraps awkwardly.

**Recommendation**

Restructure as:

1. Feed title as tiny eyebrow
2. Title as display
3. Meta row

Also remove the asymmetric button sizing mix:

* Reader-mode button: `size="sm"` / `h-8`
* Star button: `size="sm"` / `h-7`

---

## Sidebar Header Is Overloaded — DONE (`design/04-app-chrome`)

Resolved on `design/04-app-chrome`:

* Header now contains brand + four primary actions (New folder, Refresh, Add feed, Import/Export) on a single `h-11` row. `flex-wrap` removed since the row no longer overflows.
* Health, Reading stats, and Settings demoted to a new `border-t` footer rail at the bottom of the sidebar (`px-3 py-1.5`, `h-7` icon buttons, muted-foreground), with Settings pushed to `ml-auto` per platform convention.
* All actions, routes, and aria-labels preserved.

---

## Separator Overuse — DONE (`design/04-app-chrome`)

Resolved on `design/04-app-chrome`:

* Removed the explicit `Separator` between Starred and the feed list. Replaced with a 12px whitespace gap; the existing uppercase folder labels carry the section break.
* `Separator` import dropped from `Sidebar.tsx`.
* Header `border-b` and footer `border-t` retained — they bookend the scroll area and earn their visual weight.

---

## Button System Has Too Many Sizes

**Issue**

The button system has five sizes:

* `xs`
* `sm`
* `default`
* `lg`
* `icon-*`

Real usage in this app collapses mostly to:

* `h-7`
* `h-8`

**File(s)**

* `button.tsx:22-34`

**Recommendation**

Consolidate to:

* `xs`
* `sm`
* `default`

Remove dead variants to reduce future design decision surface.

---

## Three-Pane Proportions

**Issue**

Current sizes:

```tsx
defaultSize="28%/30%/50%"
```

This gives the sidebar more horizontal real estate than the article list at common widths.

**File(s)**

* `AppShell.tsx:439-494`

**Recommendation**

Try:

```tsx
22 / 28 / 50
```

Let users resize.

Also, `minSize="200px"` on a `240-280px` sidebar means the title row wraps below approximately `260px`.

---

## Empty and Zero-State Polish

**Issue**

`ArticleList.tsx:135-163` has functional empty states, but they are lean:

* Single icon
* One sentence

**Recommendation**

Compose a finished-feeling state such as:

* “Add your first feed”
* “All caught up”

Bind the primary CTA to the actual flow, such as opening `AddFeedDialog`.

---

## Highlights Affordance Is Hidden

**Issue**

The selection toolbar only appears on text selection and contains a single button.

**File(s)**

* `ReadingPane.tsx:256-269`

**Recommendation**

Create a selection toolbar that fades in with:

* `8ms` delay
* Opacity transition
* Slight `translateY`

Add a keyboard shortcut hint on hover.

---

## Date-Range Picker Chip

**Issue**

`DateRangePicker` lives inline with the count and Mark All action.

The relative weights are off: the filter is more meaningful than the count but visually subordinate.

**Recommendation**

Treat the date range as a primary chip. Tuck the count inside or nearby with lower visual weight.

---

## Extend `tabular-nums`

**Issue**

`tabular-nums` is already used correctly for unread counts.

**File(s)**

* `ArticleList.tsx:111`
* `Sidebar.tsx:194`

**Recommendation**

Extend `tabular-nums` to health and stats pages.

---

## Mobile Top Bar Needs More Presence

**Issue**

The mobile top bar is `48px` high with a `14px` title.

**File(s)**

* `AppShell.tsx:344-378`

**Recommendation**

Increase to `56px`.

Use a heavier title for thumb-zone hierarchy.

Add:

```css
padding-top: safe-area-inset-top;
```

to clear iOS notches.

---

## Replace `h-screen` with `h-dvh` — DONE (`design/04-app-chrome`)

`AppShell.tsx` outer wrapper changed from `h-screen w-screen` to `h-dvh w-screen`. iOS Safari URL-bar collapse no longer jumps the layout.

---

# 3. Larger Redesign Opportunities

These reframe a surface. Ship behind a branch and review side-by-side.

---

## Reading Pane Redesign

Today, the reading pane is a centered max-width article on the same neutral background as the list.

It could earn a distinct surface:

* Slight warmer or cooler tint
* Generous gutter
* Sticky toolbar that shrinks on scroll
* Paragraph-anchor links
* Progress indicator that mirrors `react-resizable-panels` width

This is where most user time is spent, so it deserves the most care.

---

## Command Palette as Primary Navigation

`CommandPalette.tsx` already exists.

Promote it visually with a permanent `⌘K` chip in the header bar.

This supports the trend toward fewer always-visible icons.

---

## Article List Density Toggle

Add two modes:

1. Comfortable
   Current style.

2. Compact
   Single-line title plus dot indicator.

Persist using the existing settings infrastructure.

---

## Sidebar Icon Shelf

Drop the always-visible icon strip.

Move it into a slide-down “shelf” toggled from a single `⋯` button.

Same actions, cleaner first impression. The skill calls out this exact dashboard pattern.

---

## Motion Language

Define a small motion vocabulary in CSS variables:

```css
--ease-out-quint
--ease-spring
--motion-fast: 120ms
--motion-base: 200ms
--motion-slow: 360ms
```

Apply to:

* Article-row selection:

  * Background fade
  * `1px` x-translate
* Pane resize:

  * No bounce
  * Cubic-bezier
* Reader-mode toggle:

  * Cross-fade
  * Slight body scale
* Star toggle:

  * Spring scale on icon

Reserve animation for reinforcing causality, never decoration.

---

## Accessibility Full Sweep

Add:

* Real “Skip to article list” link
* Full icon-only button `aria-label` audit — partially done on `design/03-focus-and-a11y-basics` (sidebar, app chrome mobile bar, article list toolbar, typography settings). Still to verify: reader pane controls, dialog close buttons, any `Menu` triggers not covered.
* Color contrast check after palette changes

The recent `v1.0.0` work added many labels, but this is worth re-auditing after redesign.

Current muted foreground note:

```css
oklch(0.55) on oklch(0.13)
```

This is approximately `4.6:1`, which is fine for large text but close on small text.

---

## Variants Playbook

Author two or three visual variants as Tailwind theme overrides:

* `Notion-warm`
* `Linear-cold`
* `Editorial-serif`

Future skills can A/B them with one `className` swap.

This aligns with how the README mentions “variants.”

---

# 4. Things Not to Change

Preserve these. They are correct and load-bearing.

* **Three-pane resizable layout**
  It is the product. Do not replace it with tabs or stacked views.

* **Mobile single-pane stacked navigation**
  `AppShell.tsx:344-429` uses the right pattern. Refine it, do not replace it.

* **Sanitization and `dangerouslySetInnerHTML` on `.article-content`**
  Styling hooks live in `globals.css`. Do not touch the security pipeline.

* **ArticleHeader information architecture**
  The title → meta → actions hierarchy is correct. Only refine the typography.

* **Optimistic mark-as-read on selection**
  `AppShell.tsx:191-193` has the right UX.

* **Keyboard shortcut surface**
  `use-keyboard-shortcuts.ts` is already a power-user differentiator. Keep all bindings. Consider adding a `?` cheatsheet overlay only.

* **Highlights feature**
  The selection-bubble UI is right. Only polish motion and positioning.

* **OPML, backup, and settings server actions/routes**
  Leave these untouched. Only their forms can be redesigned.

* **`tabular-nums` count style**
  Already correct everywhere.

* **Star color token as separate from primary**
  Good semantic signal. It is not just branding.

---

# 5. Suggested Branch Plan

Each branch is small, reviewable, and self-contained.

Order is intentional: tokens first, so later branches inherit them.

```text
design/01-tokens-and-fonts         # 1.1, 1.2, motion vars                          [DONE]
design/02-article-row-typography   # 1.4, 1.5                                       [DONE]
design/03-focus-and-a11y-basics    # 1.9 + cursor + initial aria sweep              [DONE]
design/04-app-chrome               # 1.6, sidebar header overflow, separator, h-dvh [DONE]
design/05-reading-pane-typography  # Reader scale, balance/pretty
design/06-empty-and-loading        # 1.8, empty-state polish
design/07-confirm-dialogs          # 1.7
design/08-motion-pass              # Rows, panels, star, reader toggle
design/09-a11y-pass                # Skip link, full aria audit, contrast check
design/10-button-system-prune      # Consolidate variants
design/11-mobile-shell-polish      # Safe-area, header height, swipe affordance
```

For each branch:

1. Branch from `main`.
2. Scope to the listed files only.
3. Run:

```bash
npm run lint && npm run test && npm run build
```

4. Merge with:

```bash
git merge --no-ff
```

This keeps the design history legible in:

```bash
git log --graph
```

5. Anything touching the following is out of scope:

```text
lib/
actions/
api/
prisma/
```

If a branch needs one of those areas, stop and check upstream first per the `CLAUDE.md` decision rule.

---

## Later Experiments

Three experiments can be run in parallel via the variants playbook:

```text
design/exp-warm
design/exp-cold
design/exp-editorial
```

Each should be a throwaway branch that only swaps `globals.css` tokens for side-by-side comparison.

---

No files modified. Ready for a starting branch when moving from audit to implementation.