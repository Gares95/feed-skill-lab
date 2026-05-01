# Concepts

This directory documents the **radical UI concept** branches for the Feed
Skill Lab — the second experiment track after the polished-baseline pass.

## How to use

- Each concept lives on its own `concept/<slug>` branch (e.g. `concept/01-editorial-reader`).
- Each concept gets its own markdown file in this directory, copied from
  [`TEMPLATE.md`](./TEMPLATE.md) and named after the concept slug
  (e.g. `01-editorial-reader.md`).
- Screenshots for each concept go under
  `docs/design-lab/screenshots/<concept-slug>/`.

## Radical concepts

Concept branches are the **radical** track for the lab — they are explicitly
allowed to substantially change UI layout, visual structure, navigation model,
component composition, and interaction model.

- The original three-pane shell is **not sacred**. Concepts may collapse,
  replace, invert, or reinterpret it.
- Concepts do not have to share a creative method. Concept 01
  (Impeccable Redesign / Reading Lamp) was driven by the project-local
  Impeccable skill; Concept 02 (Command Center) is driven by the
  `redesign-existing-projects` skill. Future concepts may use other skills,
  audits, or manual direction.
- The backend / data contract (data model, server actions, Prisma schema,
  API routes, persistence model, RSS/Atom behavior, OPML semantics,
  sanitization pipeline, safe-fetch, reader/highlights/star/mark-read
  semantics) must be preserved unless a change is explicitly justified
  in the concept doc. UI is the experimental surface.
- Concepts are not expected to merge into `main`. They may be **mined for
  parts**, **discarded**, or **promoted to finalist** for side-by-side
  comparison.

## Expectations

- Concepts are **not expected to merge into `main`**. `main` continues to track
  the polished baseline (with selective fixes from canonical Feed via
  `upstream`). Concepts stay on their own branches.
- Concepts **must remain runnable locally** via `npm run setup && npm run dev`.
  Anything that breaks the local-first SQLite persistence model is out of scope.
- Each concept must end with:
  - desktop and mobile screenshots,
  - a completed validation checklist,
  - an explicit **Decision** (keep exploring / mine for parts / candidate
    finalist / discard / upstream selected pieces).

## Relationship to the rest of the repo

- The default branch [`README.md`](../../../README.md) is the public
  gallery/index — concepts surface there once they have a screenshot and a
  decision.
- The original polish-track audit lives in
  [`../initial-design-skill-audit.md`](../initial-design-skill-audit.md) and
  should be treated as the starting point each concept is reacting against.
- Stable surfaces (data model, server actions, Prisma schema, API routes, RSS
  parsing, sanitization, safe-fetch, reader/highlights/star/mark-read
  semantics) are defined in the project [`CLAUDE.md`](../../../CLAUDE.md) and
  inherited from canonical Feed (`upstream`). Concepts redesign the UI on top
  of those — they do not redesign them.
