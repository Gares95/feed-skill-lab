# Feed Skill Lab — Concept Comparison

## Purpose

This document compares the four current public artifacts of Feed Skill
Lab so they can be evaluated side-by-side without re-reading every
concept doc:

- **`lab-polish-v1`** — the polished baseline.
- **Concept 01 / Reading Lamp** (`concept/01-impeccable-redesign`).
- **Concept 02 / Command Center** (`concept/02-command-center`).
- **Concept 03 / Today Edition** (`concept/03-today-edition`).

The goal is *comparison*, not selection. Selection is the next phase and
is described under [Next actions](#next-actions).

The current verdict on this set lives in
[`decision.md`](decision.md) — kept as a separate dated record so this
doc stays purely analytical.

## Baseline

`lab-polish-v1` is a careful, incremental polish of the original Feed
v1.0.0 UI. It is the reference point every radical concept is measured
against.

- Stable RSS reader behavior — data model, server actions, schema, API
  routes, sanitization, safe-fetch, OPML, retention all unchanged from
  canonical Feed.
- Improved typography (Geist), accessibility basics (skip link,
  focus-visible, `prefers-reduced-motion`), app chrome (sidebar density,
  divider system, header alignment).
- Reading-pane typography pass (measure, leading, code-block treatment).
- Mobile shell polish (safe-area insets, top-bar presence,
  `viewport-fit: cover`).
- Polished dialogs (Add Feed, Command Palette, settings panels).
- Subtle motion pass and consolidated button system.

The baseline is the right answer if the question is *"how good can the
existing three-pane shell get without changing the product's
identity?"*. The radical concepts each reject one of the baseline's core
identity choices.

## Concept matrix

| Direction | Branch | PR | Primary metaphor | Primary user mode | Main UI change | Strength | Risk | Best use case | Candidate status |
|---|---|---|---|---|---|---|---|---|---|
| Polished baseline | `lab-polish-v1` | — | Refined three-pane reader | Mixed reading + light triage | Token system, typography, motion, a11y on top of v1.0.0 shell | Stable, predictable, low-risk | Identity unchanged — does not test any radical hypothesis | Daily use today | Reference baseline |
| Reading Lamp | `concept/01-impeccable-redesign` | [#1](https://github.com/Gares95/feed-skill-lab/pull/1) | A reading lamp pooled around the article body | Deep reading | Warm sepia palette, recessed sidebar/list, lamp-lit reader, editorial register on dialogs and empty states | Calm, readerly, visually distinctive | Less structurally radical than 02 / 03 — keeps the three-pane shell | Long-form reading, slow consumption | Candidate finalist |
| Command Center | `concept/02-command-center` | [#2](https://github.com/Gares95/feed-skill-lab/pull/2) | Information cockpit / RSS operations console | Fast triage of many feeds | Mode-aware grid shell with context bar, nav rail, command palette as primary nav, dense article queue with multi-select, on-demand inspector, mobile bottom command bar | Fast, keyboard-first, scales to volume | Density and complexity; learning curve | High-volume triage, power users | Candidate finalist |
| Today Edition | `concept/03-today-edition` | [#3](https://github.com/Gares95/feed-skill-lab/pull/3) | Local daily edition / printed paper | Browse-first discovery | Magazine masthead, edition stamp, deterministic `composeIssue` engine picking a cover and section ribbons, full-width story detail, editorial empty states, edition date control on the front page | Inviting, browsable, source-transparent | Lower efficiency for power users; image-less feeds rely heavily on typography | Casual daily browsing, discovery | Candidate finalist |

## Concept 01 — Reading Lamp

- Driver: the **Impeccable** design workflow (`teach` → `document` →
  `shape` → seven implementation phases).
- Direction: **warm, editorial, reader-first** — sidebar and list
  recessed at the edge of the light; reader pooled in lamp-glow.
- Preserves the familiar three-pane RSS flow exactly. Data layer and
  navigation model untouched.
- Best for **deep reading** and **visual refinement** without
  destabilizing the product's mental model.
- Risk: less structurally radical than 02 and 03 — it improves the
  baseline rather than replacing it. The hypothesis it tests is
  *"editorial polish at the visual layer is enough"*, not *"the shell is
  wrong"*.

## Concept 02 — Command Center

- Driver: the project-local **`redesign-existing-projects`** skill, with
  visual critique passes from supporting design skills.
- Direction: **fast, keyboard-first, command-driven** — an *information
  cockpit* for processing many articles per session.
- Demotes the three-pane shell from identity to optional layout.
  Promotes the command palette from accessory to primary navigation.
- New surfaces: visible `⌘K` launcher pill, left **navigation rail**,
  context bar, status bar, scope-aware command palette (`>` commands,
  `@` feeds, `#` folders), **article queue** with multi-select and bulk
  toolbar, on-demand **inspector** reader with focus mode, and a
  **mobile bottom command bar** with a centered `⌘` trigger.
- Best for **fast triage** of high-volume feeds; clear-50-unread loops
  without leaving the keyboard.
- Risk: density and cognitive load. The cockpit invites cramming;
  whitespace and discoverability (rail + cheat-sheet + launcher pill)
  must be defended.

## Concept 03 — Today Edition

- Driver: the **`redesign-existing-projects`** skill with critique
  passes from **`design-taste-frontend`** and **`gpt-taste`**.
- Direction: **browse-first local daily edition** — printed-paper
  metaphor with a serif masthead, edition stamp (`№NNN · weekday,
  date`), a cover story, and a small set of secondary stories per
  issue.
- A deterministic `composeIssue` engine picks a cover and arranges
  stories into a small set of reusable section patterns. The front page
  is *generated* from the user's existing articles; sources stay
  visible.
- New surfaces: magazine masthead (desktop and mobile), full-width
  story detail with an *Up next* handoff, editorial empty-state
  register, and a concept-native **edition date control** (Today / This
  week / This month / All editions) on the front page itself.
- Best for **casual browsing and discovery** — the resting state where
  a reader skims rather than triages.
- Risk: lower efficiency for power users; image-less feeds require the
  typography to carry the layout; the deterministic composer must keep
  source transparency intact.

## What each concept proves

- **Reading Lamp** proves Feed can become much more refined and readerly
  without destabilizing architecture. The three-pane shell can absorb a
  full editorial visual pass.
- **Command Center** proves Feed can become a fast information cockpit
  — keyboard-first, palette-driven, multi-select-aware — without
  changing a single server action or schema.
- **Today Edition** proves Feed can become a browse-first editorial
  front page generated from the user's own RSS data, while preserving
  source transparency and local-first persistence.

The three together establish that Feed's data layer is **stable and
neutral enough** to support radically different surfaces. The choice
between them is a product/identity choice, not a technical one.

## What to mine from each

Even if no concept ships whole, each contributes pieces that could be
upstreamed into canonical Feed or into a future synthesis branch.

### From Reading Lamp

- Warm reader treatment (paper-tone surfaces, lamp-glow gradient).
- Calmer article typography (measure, leading, drop-cap option).
- Secondary-state polish (empty states, loading shimmer, error register
  in editorial voice).
- Editorial reader decisions (heading rhythm, blockquote treatment,
  inline-code chrome).

### From Command Center

- Visible command launcher pill in the chrome (not just a hidden ⌘K).
- Command palette improvements: typed scopes (`>` `#` `@`), command
  registry, contextual subcommands, recent-actions row.
- Article queue / bulk-selection model (multi-select with `x`,
  range-select with `Shift+j/k`, bulk-action toolbar).
- Status bar / mode-awareness pattern (current scope, item count,
  multi-key buffer).
- Inspector / focus split — reader as a slide-in pane with a separate
  focus mode rather than always-on.

### From Today Edition

- Magazine masthead (wordmark, edition stamp, eyebrow stamps).
- Source-transparent front page that never hides which feed an article
  came from.
- Deterministic `composeIssue` engine — a layout-grammar approach to
  arranging stories into reusable patterns from existing data.
- Full-width **story detail** view with *Up next* handoff.
- Mobile **edition shell** (single-column, masthead-led).
- Concept-native **date/range control** placed on the main surface
  rather than buried inside an article list.

## Recommendation

- **Do not merge any full concept into canonical Feed yet.** Each
  concept is a hypothesis, and merging one whole would prematurely
  collapse the design space.
- **Keep all three as candidate branches** with their PRs open as
  public artifacts.
- **The next step is a mining / selection phase**, not a merge. Decide
  per-piece what is reusable, what is finalist-only, and what is
  hypothesis-only.
- Identify the reusable pieces that can be upstreamed safely into
  canonical Feed (small, low-risk, doesn't shift identity) or staged on
  a future `lab-selected` (or `selection/...`) branch (larger, identity
  shifts, needs side-by-side validation).
- Resist the temptation to declare a "winner" before the mining pass —
  the cheapest wins are usually the cross-concept ones.

## Decision framework

Apply the following criteria when deciding whether a piece of any
concept should be upstreamed, kept on a finalist branch, or shelved:

- **Does it improve Feed's core RSS workflow?** (Add a feed, refresh,
  read, mark read, star, export.)
- **Does it preserve source transparency?** (The user must always know
  which feed an article came from.)
- **Does it remain local-first?** (No new network dependencies, no
  remote state.)
- **Does it scale to many articles?** (Hundreds of unread items, many
  feeds.)
- **Does it work without images?** (Image-less feeds are a first-class
  case, not an edge case.)
- **Is it accessible?** (WCAG AA contrast, keyboard parity,
  `prefers-reduced-motion`, focus-visible, screen-reader landmarks.)
- **Is it maintainable?** (No new runtime deps without justification;
  the canonical Feed maintainer can keep it alive.)
- **Would canonical Feed benefit from this whole concept or only
  parts?** (Identity-level changes upstream cautiously, if at all;
  component-level wins upstream eagerly.)

## Next actions

1. **Review screenshots side by side** — load the four gallery images
   (baseline + three concepts) in one view and capture first
   impressions before re-reading the concept docs.
2. **Decide whether to choose a single finalist or mine pieces.**
   Default to mining; require an explicit justification for any
   single-finalist call.
3. **Create a `selection/` or `lab-selected` branch only after the
   comparison pass is complete.** That branch should be additive (mined
   pieces) rather than a fork of any one concept.
4. **Avoid deployment until the selected direction is clearer.** A
   public deployment commits to an identity; the comparison phase is
   explicitly *not* the moment to commit.
5. **Keep PRs open as public artifacts.** Even concepts that aren't
   selected stay valuable as design references and as evidence of the
   skill-driven workflow.
