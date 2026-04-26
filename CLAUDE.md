# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # First-time: install deps, generate Prisma client, run migrations
npm run dev         # Dev server with Turbopack on http://localhost:3000
npm run build       # Production build
npm run lint        # ESLint
npm run test        # Vitest test suite
npm run test:watch  # Vitest in watch mode
npx vitest run path/to/test.ts  # Run a single test file
npx prisma studio   # Browse database in GUI
npx prisma migrate dev --name <name>  # Create a new migration after schema changes
```

## Lineage

This repo is a design-skill experimentation lab seeded from
[Feed v1.0.0](https://github.com/Gares95/Feed) (canonical repo at
`~/projects/Feed`). It is **not** a fork: GitHub does not allow forking a
repo into the same owner account, so it was seeded by `git clone` + reset
to `v1.0.0` + new origin.

Divergence is **design-only**: visual styling, layout, component structure,
spacing, hierarchy, motion, polish, micro-interactions. Everything else —
data layer, Prisma schema, server actions, API routes, lib/ utilities,
sanitization, safe-fetch, dependency choices for non-UI packages — is
intentionally identical to canonical and stays in sync with it.

Canonical is reachable via the `upstream` remote
(`git@github.com:Gares95/Feed.git`).

### Where to fix a bug — decision rule

The default is **fix in canonical, pull here**. Only fix locally if the
bug is genuinely design-surface.

1. **Bug is in non-design code** (server actions, lib/, schema, API
   routes, sanitizer, safe-fetch, retention, feed parsing, search, any
   dependency canonical also uses):
   → Fix in canonical (`~/projects/Feed`) on a `fix/...` branch.
   → Tag a patch release there (e.g., `v1.0.1`).
   → `git fetch upstream --tags && git cherry-pick v1.0.1` here.
   → Rationale: this repo is supposed to mirror canonical on those
     surfaces. Fixing locally would create silent drift.

2. **Bug is design-surface only** (a hover state misbehaves, a transition
   janks, spacing collapses at a breakpoint, a recently applied design
   skill produced something inaccessible or visually broken):
   → Fix here directly. Do not touch canonical.

3. **Mixed — design change broke or misuses canonical logic** (e.g., a
   redesigned component drops a required ARIA attribute the canonical
   logic depends on, or wires up a server action incorrectly):
   → Fix here. The canonical logic is fine; the integration in this repo
     is what regressed.

When unsure, check `git diff upstream/main -- <file>`. If the file is
identical to upstream, the bug almost certainly belongs to case 1 — fix
upstream.

### Pulling canonical updates

For non-emergency canonical changes (refactors, dep bumps, new shared
features), periodically:
git fetch upstream
git log --oneline HEAD..upstream/main   # see what's new
git cherry-pick <sha>...                # pick what applies


Avoid `git merge upstream/main` wholesale — it will pull canonical's
design too, which defeats the purpose of this repo.

## Architecture

Feed is a local-first RSS/Atom reader. No auth, no cloud, no API keys. SQLite stores everything. Single-user, localhost only.

### Data Flow

```
Add feed URL -> POST /api/feeds -> server-side fetch RSS -> parse XML -> sanitize HTML -> store in SQLite
Read articles -> Server Components call lib/queries.ts -> render three-pane layout
Single article -> GET /api/articles/[id] -> Readability extraction -> full content for reading pane
Search -> lib/queries.ts#searchArticles -> SQLite FTS virtual table (ArticleFts) -> ranked results
Mutations (mark read/star/highlight) -> Server Actions -> update SQLite -> optimistic UI update
Images -> GET /api/image-proxy -> proxied to avoid mixed-content issues
OPML -> POST /api/opml (import) / GET /api/opml (export)
```

Additional pages: `/health` (feed health dashboard), `/stats` (reading statistics), `/settings` (app settings).

### Key Directories

- `src/app/` — Pages and API routes (App Router)
- `src/actions/` — Server Actions for mutations (feeds.ts, articles.ts, folders.ts, highlights.ts, reader.ts, retention.ts)
- `src/components/` — React components organized by feature (layout/, sidebar/, articles/, reader/, ui/); `CommandPalette.tsx` at this level is the global keyboard-driven palette
- `src/lib/` — Business logic: `queries.ts` (all read queries used by Server Components), `safe-fetch.ts` (SSRF-safe outbound HTTP), `feed-parser.ts`, `sanitize.ts`, `prisma.ts`, `fts-query.ts` (FTS builder), `feed-health.ts`, `feed-schedule.ts`, `highlights.ts`, `opml.ts`, `retention.ts`, `stats.ts`, `settings.ts`, `reading-time.ts`, `group-feeds.ts`, `discover-feed.ts`, `export-starred.ts`
- `src/hooks/` — Custom React hooks (keyboard shortcuts)
- `prisma/` — Schema and migrations

### Tech Stack

- Next.js 15 (App Router), React 19, TypeScript 5 (strict mode)
- Tailwind CSS v4, @base-ui/react (primitives wrapped in `src/components/ui/`), Lucide icons
- react-resizable-panels for three-pane layout
- Prisma 6 + SQLite (single file DB at prisma/dev.db)
- rss-parser for RSS/Atom parsing, dompurify + jsdom for server-side HTML sanitization
- date-fns for date formatting
- Vitest + React Testing Library

### Key Architectural Decisions

- **Server Components by default** — only add `"use client"` when interactivity or hooks are needed
- **Server Actions for mutations** — prefer over API routes; API routes are for complex operations like feed fetching/parsing
- **Server-side feed fetching only** — never fetch RSS from client (CORS/security)
- **Full article content stored in SQLite** — reading is instant, no network request needed
- **No client state management library** — React Context for UI state, Server Components for data
- **All feed HTML sanitized with DOMPurify before rendering** — never use `dangerouslySetInnerHTML` without prior sanitization; the sanitize pass also forces `rel="noopener noreferrer nofollow"` on every anchor
- **All outbound server-side HTTP goes through `lib/safe-fetch.ts`** — never call `fetch()` directly on attacker-controllable URLs (feed URLs, article links, image URLs, redirect targets). `safeFetch` resolves DNS, blocks loopback/RFC1918/link-local/cloud-metadata ranges, revalidates every redirect hop, and caps response size.
- **Upload routes must cap size before reading the body** — see `api/backup/route.ts` and `api/opml/route.ts` for the pattern (reject with 413 when `file.size` exceeds the cap)

### Design

Dark-mode-first. CSS variables use oklch color space. See `globals.css` for the full token system. Light mode is secondary.

Three-pane resizable layout: sidebar (feeds, 240-280px) | article list (300-400px) | reading pane (remaining).

## Hooks

PostToolUse hooks run automatically after every file edit:
- **Prettier** — auto-formats the changed file (no need to format manually)
- **TypeScript type checker** — runs `tsc` and reports errors immediately

## Code Conventions

- Named exports (not default), except `page.tsx` as required by Next.js
- `cn()` utility (clsx + tailwind-merge) for conditional classes
- Props interfaces defined in the same file as the component
- No prop drilling beyond 2 levels — use Context or Server Components
- Prisma client singleton in `lib/prisma.ts` — import from `@/generated/prisma` (custom output path)

## Git Workflow

### Branching Strategy

Always work on a dedicated branch — never commit directly to `main`.

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New functionality | `feature/add-feed-dialog` |
| `fix/` | Bug fixes | `fix/unread-count-off-by-one` |
| `hotfix/` | Urgent production fixes | `hotfix/crash-on-empty-feed` |
| `refactor/` | Code improvements (no behavior change) | `refactor/extract-feed-parser` |
| `chore/` | Tooling, config, deps | `chore/update-prisma-6` |

Merge to `main` when the branch work is complete and verified. Use `--no-ff` merges to preserve branch history.

### Commit Practices

- **Commit early, commit often** — each commit should represent one logical change
- **Stage and commit after each meaningful step** — don't batch unrelated changes
- Keep commits small and focused: separate new features, bug fixes, refactors, and config changes
- Write descriptive messages in imperative mood: "Add feed parser" not "Added feed parser"
- Format: short summary line (≤72 chars), blank line, optional body explaining *why*
- Never commit generated files (node_modules/, .next/, prisma/dev.db), secrets, or build artifacts

### Typical Flow

```bash
git checkout -b feature/my-feature    # Branch from main
# ... work and commit incrementally ...
git checkout main
git merge --no-ff feature/my-feature  # Merge when complete
git push
git branch -d feature/my-feature      # Clean up local branch
```

## Canonical role and downstream patch flow

This repo is the **canonical** Feed implementation. Other repos (currently
`feed-skill-lab` for design-skill experimentation) are seeded from `v1.0.0`
and treat this repo as their `upstream` remote. They cherry-pick logic /
security / dependency fixes from here; their own divergence is bounded
(e.g., design surface only).

**Implication when fixing bugs in shared surfaces** (server actions, lib/,
schema, API routes, sanitizer, safe-fetch, retention, feed parsing, search,
or shared dependency versions):

1. Land the fix on `main` via the normal `fix/...` branch + `--no-ff` merge flow.
2. Bump the patch version in `package.json` (`1.0.0` → `1.0.1`).
3. Add a `## [1.0.x] - YYYY-MM-DD` entry to `CHANGELOG.md` describing the fix.
4. Tag and push: `git tag -a v1.0.x -m "v1.0.x"` then `git push origin v1.0.x`.

Downstream repos pull the fix with `git fetch upstream --tags` and
`git cherry-pick v1.0.x`. The tag is what makes the fix discoverable and
unambiguous downstream — without it, downstream has to track SHAs by hand.

This applies to **fixes**, not features. New features stay untagged on `main`
unless the user explicitly asks for a release.

## Reference

See `PROJECT_BLUEPRINT.md` for full specification: phased roadmap, detailed design tokens, database schema, keyboard shortcuts, and UI/UX direction.
