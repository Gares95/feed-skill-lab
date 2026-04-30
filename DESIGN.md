---
name: Feed Skill Lab — lab-polish-v1
description: Snapshot of the polished baseline visual system. Dark-first, tonally layered, Geist-typed RSS reader.
colors:
  background: "oklch(0.135 0.005 250)"
  foreground: "oklch(0.94 0.003 250)"
  card: "oklch(0.175 0.006 250)"
  popover: "oklch(0.215 0.007 250)"
  sidebar: "oklch(0.16 0.006 250)"
  muted: "oklch(0.21 0.006 250)"
  accent-surface: "oklch(0.235 0.008 250)"
  border: "oklch(1 0 0 / 7%)"
  input: "oklch(1 0 0 / 9%)"
  primary: "oklch(0.68 0.10 250)"
  primary-foreground: "oklch(0.985 0 0)"
  muted-foreground: "oklch(0.58 0.008 250)"
  destructive: "oklch(0.65 0.18 25)"
  star: "oklch(0.78 0.13 85)"
  highlight: "oklch(0.75 0.15 85 / 30%)"
typography:
  display:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.175rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  3xl: "1.375rem"
  4xl: "1.625rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  2xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 0.5rem"
    height: "2rem"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  input:
    backgroundColor: "{colors.input}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 0.625rem"
    height: "2rem"
  article-row-selected:
    backgroundColor: "{colors.accent-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
---

# Design System: Feed Skill Lab — lab-polish-v1

## 1. Overview

**Creative North Star: "The Calm Reading Room"**

`lab-polish-v1` is a single, dark-first room with quiet, tonally-layered cool surfaces and a single low-saturation indigo wayfinding accent. Reading is the centerpiece; chrome recedes. The baseline is what remains after ten incremental polish passes pulled the default shadcn vocabulary toward something more deliberate: tighter typographic scale, restrained accent, no decorative shadows, no decorative gradients, careful motion governed by `prefers-reduced-motion: reduce`.

The system explicitly rejects the generic-SaaS-dashboard reflex (icon-rail sidebars, hero-metric cards, AI-flavored card grids), and rejects the standard reader-app reflex (resizable three-pane chrome rendered as the entire identity). It is a product surface, not a marketing surface — design serves reading, it does not perform.

**Key Characteristics:**
- Dark mode is the primary experience; light mode is correct but secondary.
- Cool tinted neutrals (chroma ≈ 0.005 at hue 250) — never `#000` or `#fff`.
- One restrained accent, one warm-amber state color (star/highlight); everything else is tonal.
- Geist Sans across the UI, Geist Mono for code.
- Depth comes from lightness deltas across surfaces, not from `box-shadow`.
- Motion is honest: 120/200/360ms, exponential ease-out, spring only on the star toggle, fully neutralized when the user opts out.

## 2. Colors

A cool, low-saturation palette of tonally-stepped neutrals plus one indigo wayfinding accent and one warm amber for `star` / highlights. The dark mode is the primary experience; light mode mirrors the role assignments at higher lightness with a slightly more saturated accent (the dark-mode indigo would be too pale on a near-white surface).

### Primary
- **Quiet Indigo** (`oklch(0.68 0.10 250)` dark / `oklch(0.50 0.18 250)` light): The single wayfinding accent. Carries primary buttons, the focus ring, the article-row selection indicator, and the active state of sidebar items. Saturation pulled in from shadcn's default 0.15 → 0.10 in dark mode to step away from the generic indigo.

### Secondary
- **Warm Amber** (`oklch(0.78 0.13 85)` dark / `oklch(0.65 0.15 85)` light): The state color for `star` and the highlight wash (rendered at 30% alpha behind highlighted text). Used sparsely; it is the only warm note in the system.

### Neutral
- **Reading Surface** (`oklch(0.135 0.005 250)`): The dark-mode background. Cool charcoal, never `#000`.
- **Reading Foreground** (`oklch(0.94 0.003 250)`): Primary text. Off-white with a faint cool tint; never `#fff`.
- **Card Plane** (`oklch(0.175 0.006 250)`): One step lighter than background — articles, cards, settings panels.
- **Sidebar Plane** (`oklch(0.16 0.006 250)`): A whisper above background — separates the navigation column without a divider.
- **Popover Plane** (`oklch(0.215 0.007 250)`): Two steps above background. The brightest non-accent surface.
- **Muted Surface** (`oklch(0.21 0.006 250)`): Inputs, secondary buttons, code blocks.
- **Accent Surface** (`oklch(0.235 0.008 250)`): The selected article-row background. Bright enough to register; tonal enough not to shout.
- **Hairline Border** (`oklch(1 0 0 / 7%)`): A 7%-alpha white over the cool background. Borders disappear at distance, present at focus.
- **Quiet Foreground** (`oklch(0.58 0.008 250)`): Captions, metadata, byline text.

### Light Mode
The same role assignments apply with: background `oklch(0.985 0 0)`, foreground `oklch(0.15 0 0)`, card `oklch(1 0 0)`, primary `oklch(0.50 0.18 250)`, border `oklch(0.90 0 0)`. Light mode keeps neutrals truly neutral (chroma 0); the cool tint is a dark-mode-only choice.

### Named Rules

**The One Voice Rule.** Quiet Indigo is the only chromatic accent in the chrome. Warm Amber is reserved for `star` and highlights — both user-content states, not chrome decoration. Anything tinted in chrome is one of those two, or it is wrong.

**The No-Pure-Black Rule.** No `#000`, no `#fff`. Every neutral carries chroma ≥ 0.003 toward hue 250 (or zero in light mode). Pure-black or pure-white surfaces are forbidden because they break the tonal layering — they always read as a different system.

## 3. Typography

**Display Font:** Geist Sans (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Geist Sans (same family across the UI — there is no display/body split)
**Mono Font:** Geist Mono (with `ui-monospace, SFMono-Regular, monospace`)

**Character:** Single-family discipline. Geist Sans carries the full visual identity through scale + weight contrast, never through family contrast. The reader pane uses the same family as the chrome — there is no editorial-serif moment.

### Hierarchy

- **Display** (Geist Sans 600, 1.75rem, line-height 1.2, letter-spacing -0.02em): Article body `<h1>` inside the rendered article content. Balanced via `text-wrap: balance`.
- **Headline** (Geist Sans 600, 1.4rem, line-height 1.25, letter-spacing -0.015em): Article body `<h2>`. Section-level structure inside the reader.
- **Title** (Geist Sans 600, 1.175rem, line-height 1.3, letter-spacing -0.015em): Article body `<h3>`; settings page section titles; dialog titles.
- **Body** (Geist Sans 400, 1rem, line-height 1.7, letter-spacing normal): Article body. Reader settings persist user overrides for size and line-height; defaults are 17px / 1.7 / max-width 680px (~70ch). `text-wrap: pretty`, `hyphens: auto`.
- **Label** (Geist Sans 500, 0.75rem, letter-spacing 0.02em): Eyebrow text in `ArticleHeader` (feed name above article title); meta rows in article rows; sidebar group labels.
- **Mono** (Geist Mono 400, 0.875em): Inline `<code>` and `<pre>` blocks inside article content. Tabular-nums variant used for reading-time display.

### Named Rules

**The Single-Family Rule.** Geist Sans carries the entire UI. There is no serif-display moment, no editorial-magazine pivot. Hierarchy is built only from scale ratio (≥1.18) and weight contrast (400 / 500 / 600). Adding a second display family is a different design system, not a polish move.

**The 70-CH Rule.** Article body lines cap at ~70ch (max-width 680px at 17px). Wider lines were tested and rejected during `design/05-reading-pane-typography`.

## 4. Elevation

The system is **flat by tonal layering** — no `box-shadow` tokens. Depth across the four panes (background → sidebar → card → popover) comes from lightness deltas in OKLCH, stepping ~0.025 at a time. Borders are 7%-alpha hairlines that read as edges only when adjacent surfaces are the same lightness; mostly they are invisible.

The single visual hint of elevation in the live UI is the article-row selection indicator: a 2px Quiet Indigo bar on the leading edge of the selected row, with a tiny padding-left nudge keyed to motion tokens. It is structural state, not decoration.

### Named Rules

**The No-Shadow Rule.** Forbidden: `box-shadow` for decoration, hover lift, popover shelf, card lift, focus glow. Depth is tonal, never atmospheric. Adding a shadow pulls the system toward a different, busier register.

**The Hairline Border Rule.** When borders are needed (input outlines, table cells, separators), they are `oklch(1 0 0 / 7%)` in dark mode, `oklch(0.90 0 0)` in light. Never colored. Never thicker than 1px outside the article-row selection bar.

## 5. Components

### Buttons
- **Shape:** Rounded (8px radius via `--radius-md`).
- **Primary:** Quiet Indigo background, off-white foreground, 32px tall (`h-8`). Used sparingly — most chrome buttons are ghost.
- **Ghost:** Transparent background, foreground text, hover lifts via `accent-surface` background. The default chrome button.
- **Hover / Focus:** Background-color transitions at `--motion-fast` (120ms) with `--ease-out-quint`. Focus rings are 2px Quiet Indigo at 50% alpha. The focus ring is the same ring on every interactive surface.
- **Press:** `active:scale-95` on the star toggle for tactile feedback. No other button scales.

### Article Row (the signature component)
- A full-width button representing one article.
- **Default state:** Subtle hover background (`accent-surface`); title in foreground; metadata in muted-foreground.
- **Selected state:** `accent-surface` background, leading 2px Quiet Indigo bar, padding-left nudges from 16px → 18px keyed to `--motion-fast`. The bar is structural, not decorative.
- **Read state:** Title fades to 75% opacity; otherwise unchanged.
- **Star indicator:** Inline Warm Amber `<Star>` icon with spring transition on toggle.

### Cards / Containers
- **Corner Style:** 10px radius (`--radius-lg`).
- **Background:** `card` plane (one tonal step above background).
- **Shadow Strategy:** None. Depth is the lightness delta.
- **Border:** Hairline only when a card touches another card.
- **Internal Padding:** 16px (`spacing.lg`).

### Inputs / Fields
- **Style:** `input` background plane (white at 9% alpha over background), 8px radius, 32px tall.
- **Focus:** 2px Quiet Indigo ring at 50% alpha. No background color shift.
- **Disabled:** 50% opacity, no other treatment.

### Navigation (Sidebar)
- **Style:** Single column on `sidebar` plane (one tonal step above background, no divider). Vertical density: section labels (uppercase, 0.02em tracking, muted-foreground), group items (foreground), feed items (with unread badges).
- **Active state:** `accent-surface` background, foreground text, no separate accent stripe.
- **Footer rail:** Health / Stats / Settings on a low-density footer rail (introduced in `design/04-app-chrome`).
- **Mobile treatment:** Stacks into a single column with a 56px top bar, env-var safe-area padding, and a back button replacing the desktop pane resize handle.

### Article Reader (the signature surface)
- **Header:** Eyebrow (feed name, uppercase label), display-scale title with balanced wrap, byline row (author / date / reading-time using tabular-nums), action buttons (Reader mode, Star, Open original) all normalized to `h-8`.
- **Body:** `.article-content` rules (above) — balanced headings, hyphenated paragraphs, 70ch max width, Geist Mono in code, Warm Amber `feed-highlight` mark.
- **Skeleton:** 1.6s pulse (slowed from Tailwind's 2s default) matching the final article geometry to avoid layout shift on load.
- **Cross-fade:** Body element keyed by `${articleId}:${readerMode}` so switches animate via `animate-in fade-in-0` at `--motion-base`.

## 6. Do's and Don'ts

### Do:

- **Do** keep dark mode the primary experience and tune light mode to match role-by-role.
- **Do** use OKLCH for every color value. Hex sRGB is for export/lint compatibility only.
- **Do** lean on tonal lightness deltas for depth. Sidebar / list / card / popover are four distinct planes by ~0.025 lightness steps.
- **Do** use Quiet Indigo as the one wayfinding accent and Warm Amber strictly for `star` and highlight states.
- **Do** keep the article-row selection bar at exactly 2px and pad-nudge by exactly 2px. The motion is the affordance.
- **Do** honor `prefers-reduced-motion: reduce` globally — every transition collapses to ~0ms.
- **Do** cap article body at ~70ch, with `text-wrap: pretty` and `hyphens: auto` on paragraphs.

### Don't:

- **Don't** ship anything that reads as a generic SaaS dashboard — no icon-rail sidebars, no hero-metric cards, no AI-flavored repeated-card grids, no "stat tile" treatments of unread counts.
- **Don't** add `box-shadow` for decoration, lift, glow, or popover shelf. Depth is tonal.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent). The article-row 2px indicator is the one allowed exception, and it is structural state — not a decorative stripe on cards or alerts.
- **Don't** use gradient text (`background-clip: text` over a gradient). Emphasis is weight or size, never gradient.
- **Don't** introduce a second display font family. Geist Sans carries everything.
- **Don't** use `#000` or `#fff`. Every neutral carries cool chroma in dark mode, true neutral in light.
- **Don't** reach for a modal as the first answer — the polished baseline replaced `window.prompt` / `window.confirm` with in-app `Dialog` / `AlertDialog`, but new flows should still try inline progressive disclosure first.
- **Don't** use glassmorphism (`backdrop-filter: blur` decorative surfaces) anywhere.
