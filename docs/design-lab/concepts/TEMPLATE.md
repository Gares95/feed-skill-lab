# Concept Template

> Copy this file to `docs/design-lab/concepts/<concept-slug>.md` when starting a
> new radical UI concept branch. Fill it in as the concept evolves; the
> validation, screenshots, and decision sections should be complete before the
> concept is presented for review.

## Metadata

- Concept name:
- Branch:
- PR:
- Status:
- Created:
- Last updated from main:
- Baseline:
- Skills/tools explicitly used:
- Screenshot directory:

## Summary

Short explanation of the concept in 3–5 sentences.

## Product Metaphor

What should this interface feel like?

Examples:

- Editorial reading room
- Command center
- Dense pro dashboard
- Magazine-style discovery surface

## Design Intent

Explain:

- Who this concept is for.
- What feeling it should create.
- What problem it is trying to solve.
- What it intentionally challenges from the current UI.

## What Changes

For radical concepts, describe the new architecture explicitly. For polish
concepts, the existing surfaces below may be enough.

- **Interaction metaphor** — what the interface should *feel like* (e.g.
  reading room, command center, magazine, dashboard).
- **Primary user feeling** — what the user should feel at first use.
- **Layout architecture** — the shell. Three-pane / two-pane / single-pane /
  mode-aware grid / something else.
- **Navigation model** — how the user moves between feeds, search,
  commands, modes, and secondary surfaces (Health/Stats/Settings).
- Sidebar/navigation
- Article list
- Reader pane
- App chrome
- Typography
- Color/material direction
- Motion/interactions
- Mobile behavior

## What Must Stay Stable

Non-negotiables (inherited from canonical Feed via `upstream`):

- Data model
- Server actions
- Prisma schema
- API routes
- Persistence model (SQLite, local-first)
- Core RSS/Atom behavior
- OPML import/export behavior, unless explicitly documented
- Article fetching and sanitization pipeline (`safe-fetch`, DOMPurify)
- Reader/highlights/star/mark-read semantics, unless explicitly justified

## Affected Files / Surfaces

| Area | Expected files | Risk level | Notes |
| ---- | -------------- | ---------- | ----- |
|      |                |            |       |

## Screenshots

| View                     | Screenshot | Notes |
| ------------------------ | ---------- | ----- |
| Desktop overview         | TBD        |       |
| Desktop article selected | TBD        |       |
| Reader view              | TBD        |       |
| Mobile list              | TBD        |       |
| Mobile reader            | TBD        |       |
| Empty/loading state      | TBD        |       |

## Local Run Instructions

```bash
git checkout <branch-name>
npm run setup
npm run dev
```

## Validation Checklist

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm audit`
- [ ] Desktop screenshot captured
- [ ] Mobile screenshot captured
- [ ] Reader view checked
- [ ] Article list checked
- [ ] Sidebar/navigation checked
- [ ] Empty/loading states checked
- [ ] Keyboard navigation checked
- [ ] No data/API/schema changes unless explicitly documented

## Skills Usage Notes

Document how Claude Code / Claude Design / Claude Skills were used.

Include:

- Which skills were invoked explicitly.
- Which design recommendations shaped the concept.
- Whether the concept was generated from a prompt, audit, screenshot, or manual direction.
- Any notable skill failures or corrections.

## Comparison Against Polished Baseline

Explain:

- What is meaningfully different from the polished baseline?
- What improved?
- What got worse?
- What is still unresolved?

## Risks and Tradeoffs

List:

- UX risks
- Maintenance risks
- Accessibility risks
- Mobile risks
- Implementation risks

## Decision

Choose one:

- [ ] Keep exploring
- [ ] Mine for parts
- [ ] Candidate finalist
- [ ] Discard
- [ ] Upstream selected pieces to canonical Feed

Decision notes:

## Follow-up Tasks

- [ ] TBD
