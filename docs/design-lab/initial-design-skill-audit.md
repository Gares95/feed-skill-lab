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

# 1. High-Impact Quick Wins

These are low-risk, high-reward, mostly surface-level improvements. Most live in `globals.css` plus a few component files.

---

## 1.1 Geist Font Is Loaded but Never Applied

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

## 1.6 Article List Toolbar Rhythm Is Choppy

**Issue**

There are three competing 12px-ish toolbars stacked at the top of the article list:

* Search row: `h-12`
* Filter row: `h-8`

This creates choppy visual rhythm.

**File(s)**

* `ArticleList.tsx:75-127`

**Fix Sketch**

Merge into a single `44px` header:

* Search inline-leading
* Count/range/mark-all cluster trailing
* Drop the second border

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

## 1.9 Sidebar Buttons Need Focus Rings

**Issue**

Keyboard-accessible feed and folder buttons in the sidebar use bare `<button>` elements without focus styles.

**File(s)**

* `Sidebar.tsx:181-216`

**Fix Sketch**

Add:

```tsx
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring/60
```

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

## Sidebar Header Is Overloaded

**Issue**

Seven icon buttons plus brand are packed into a `12px`-padded row that wraps at narrow widths.

**File(s)**

* `Sidebar.tsx:113-176`

The `flex-wrap` line break shows the row is over-budget.

**Recommendation**

Promote:

* New folder
* Refresh
* Add

Demote into a single overflow menu, or move to sidebar footer:

* Health
* Stats
* Settings

---

## Separator Overuse

**Issue**

The sidebar uses:

* Header `border-b`
* `Separator` between sections
* Folder dividers
* Row borders

Too many horizontal lines cost visual energy.

**File(s)**

* `Sidebar.tsx:218`

**Recommendation**

Remove the explicit `Separator` and lean on:

* Whitespace
* Existing uppercase folder label

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

## Replace `h-screen` with `h-dvh`

**Issue**

Current shell uses:

```tsx
h-screen w-screen
```

**File(s)**

* `AppShell.tsx:342`

This can cause iOS Safari viewport jump when the URL bar collapses.

**Recommendation**

Use:

```tsx
h-dvh w-screen
```

or:

```tsx
min-h-dvh w-screen
```

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
* Full icon-only button `aria-label` audit
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
design/01-tokens-and-fonts         # 1.1, 1.2, motion vars
design/02-app-chrome               # 1.3, 1.6, sidebar header overflow, h-dvh fix
design/03-article-row-typography   # 1.4, 1.5
design/04-reading-pane-typography  # Reader scale, balance/pretty
design/05-empty-and-loading        # 1.8, empty-state polish
design/06-confirm-dialogs          # 1.7
design/07-motion-pass              # Rows, panels, star, reader toggle
design/08-a11y-pass                # Focus rings, skip link, aria audit
design/09-button-system-prune      # Consolidate variants
design/10-mobile-shell-polish      # Safe-area, header height, swipe affordance
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