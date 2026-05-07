# Feed Skill Lab — Concept Decision

**Date:** 2026-05-07
**Scope:** the first set of radical concepts (01 Reading Lamp, 02 Command
Center, 03 Today Edition) measured against the polished baseline
(`lab-polish-v1`).
**Companion document:** [`comparison.md`](comparison.md) — the
side-by-side analysis this decision rests on.

## Decision

**Preserve all three concepts as public experiments.**

- **No full concept will be merged into `main` right now.**
- **No concept will be upstreamed into canonical Feed right now.**
- Each concept stays on its branch with its draft PR open as a public
  artifact:
  - Concept 01 / Reading Lamp — `concept/01-impeccable-redesign` —
    [#1](https://github.com/Gares95/feed-skill-lab/pull/1)
  - Concept 02 / Command Center — `concept/02-command-center` —
    [#2](https://github.com/Gares95/feed-skill-lab/pull/2)
  - Concept 03 / Today Edition — `concept/03-today-edition` —
    [#3](https://github.com/Gares95/feed-skill-lab/pull/3)

## Why

Each concept tests a *different* hypothesis about Feed's identity:
editorial reader (01), keyboard cockpit (02), browse-first edition (03).
Picking a single finalist now would prematurely collapse a design space
that is still informative as a set. The cheapest, safest wins are
likely *cross-concept* — small reusable pieces — and identifying those
requires a deliberate mining pass, not a merge.

The data layer is stable across all three concepts (server actions,
schema, API routes, sanitization, safe-fetch, OPML, retention all
identical to canonical Feed). That means preservation is cheap: the
branches do not block canonical maintenance, and they can be revisited
at any time.

## What this decision is not

- **Not a rejection** of any concept. All three are candidate finalists.
- **Not a freeze.** Bug-fix-level patches and screenshot refreshes on a
  concept branch are still fine.
- **Not a permanent verdict.** This decision can be revisited once a
  selection/mining/synthesis phase is run, or once new evidence (e.g.
  user testing, a fourth concept) arrives.

## Next work, if any

If further work happens on this track, it should be a **separate
selection / mining / synthesis phase** — not a merge of any current
concept. That phase would:

1. Walk the *What to mine from each* section of `comparison.md` and
   tag each piece as **upstream candidate**, **finalist-only**, or
   **hypothesis-only**.
2. Stage upstream candidates on a dedicated `selection/...` or
   `lab-selected` branch, **additive** rather than forked from any one
   concept.
3. Apply the decision framework in `comparison.md` to every piece
   before promoting it to canonical Feed.

Until that phase begins, no further concept work is required.

## Status of related artifacts

- `main` — unchanged, carries the polished baseline.
- `lab-polish-v1` — unchanged, the reference baseline tag.
- Concept branches 01 / 02 / 03 — preserved, draft PRs open.
- Canonical Feed (`Gares95/Feed`) — unaffected. No upstreaming triggered
  by this decision.
