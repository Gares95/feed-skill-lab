import type { ArticleWithFeed } from "@/components/articles/ArticleList";

export interface EditionSection {
  feedTitle: string;
  items: ArticleWithFeed[];
}

export interface ComposedIssue {
  cover: ArticleWithFeed | null;
  seconds: ArticleWithFeed[];
  sections: EditionSection[];
  later: ArticleWithFeed[];
}

export interface ComposeOptions {
  dayOfYear: number;
  maxSeconds?: number;
  maxSectionItems?: number;
  minSectionItems?: number;
}

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

export function composeIssue(
  articles: readonly ArticleWithFeed[],
  options: ComposeOptions,
): ComposedIssue {
  const {
    dayOfYear: doy,
    maxSeconds = 3,
    maxSectionItems = 5,
    minSectionItems = 2,
  } = options;

  if (articles.length === 0) {
    return { cover: null, seconds: [], sections: [], later: [] };
  }

  const cover = articles[0];
  const seconds = articles.slice(1, 1 + maxSeconds);
  const rest = articles.slice(1 + maxSeconds);

  const groups = new Map<string, ArticleWithFeed[]>();
  for (const a of rest) {
    const list = groups.get(a.feedTitle);
    if (list) list.push(a);
    else groups.set(a.feedTitle, [a]);
  }

  const sectionsAll: EditionSection[] = [];
  const later: ArticleWithFeed[] = [];

  for (const [feedTitle, items] of groups) {
    if (items.length >= minSectionItems) {
      sectionsAll.push({ feedTitle, items: items.slice(0, maxSectionItems) });
      if (items.length > maxSectionItems) {
        later.push(...items.slice(maxSectionItems));
      }
    } else {
      later.push(...items);
    }
  }

  // Stable order: alphabetic by feedTitle, then rotated by day-of-year so
  // the issue's section sequence varies daily but is deterministic.
  sectionsAll.sort((a, b) => a.feedTitle.localeCompare(b.feedTitle));
  const sections =
    sectionsAll.length > 0
      ? rotate(sectionsAll, ((doy % sectionsAll.length) + sectionsAll.length) % sectionsAll.length)
      : [];

  later.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return { cover, seconds, sections, later };
}

function rotate<T>(arr: readonly T[], n: number): T[] {
  if (arr.length === 0) return [];
  const k = n % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}
