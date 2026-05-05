import { describe, expect, it } from "vitest";
import { composeIssue, dayOfYear } from "./composeIssue";
import type { ArticleWithFeed } from "@/components/articles/ArticleList";

function mk(
  id: string,
  feedTitle: string,
  publishedAt: Date,
  isRead = false,
): ArticleWithFeed {
  return {
    id,
    title: `Article ${id}`,
    feedTitle,
    publishedAt,
    isRead,
    isStarred: false,
  };
}

const D = (s: string) => new Date(s);

describe("composeIssue", () => {
  it("returns empty issue for no articles", () => {
    const issue = composeIssue([], { dayOfYear: 0 });
    expect(issue.cover).toBeNull();
    expect(issue.seconds).toEqual([]);
    expect(issue.sections).toEqual([]);
    expect(issue.later).toEqual([]);
  });

  it("makes the first article the cover", () => {
    const arts = [mk("a", "Feed 1", D("2026-05-04T10:00:00Z"))];
    const issue = composeIssue(arts, { dayOfYear: 0 });
    expect(issue.cover?.id).toBe("a");
    expect(issue.seconds).toEqual([]);
  });

  it("fills seconds up to the cap", () => {
    const arts = Array.from({ length: 6 }, (_, i) =>
      mk(`a${i}`, "Feed 1", D(`2026-05-04T10:0${i}:00Z`)),
    );
    const issue = composeIssue(arts, { dayOfYear: 0, maxSeconds: 3 });
    expect(issue.cover?.id).toBe("a0");
    expect(issue.seconds.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
  });

  it("groups remaining by feed into sections (≥ minSectionItems)", () => {
    const arts = [
      mk("c1", "Cover", D("2026-05-04T12:00:00Z")),
      mk("s1", "Seconds", D("2026-05-04T11:00:00Z")),
      // Feed A has 3 in rest → section
      mk("a1", "Alpha", D("2026-05-04T10:00:00Z")),
      mk("a2", "Alpha", D("2026-05-04T09:00:00Z")),
      mk("a3", "Alpha", D("2026-05-04T08:00:00Z")),
      // Feed B has 1 in rest → goes to later
      mk("b1", "Beta", D("2026-05-04T07:00:00Z")),
    ];
    const issue = composeIssue(arts, {
      dayOfYear: 0,
      maxSeconds: 1,
      minSectionItems: 2,
    });
    expect(issue.sections).toHaveLength(1);
    expect(issue.sections[0].feedTitle).toBe("Alpha");
    expect(issue.sections[0].items.map((a) => a.id)).toEqual([
      "a1",
      "a2",
      "a3",
    ]);
    expect(issue.later.map((a) => a.id)).toEqual(["b1"]);
  });

  it("caps section items and pushes overflow to later", () => {
    const arts = [
      mk("c", "Cover", D("2026-05-04T12:00:00Z")),
      ...Array.from({ length: 8 }, (_, i) =>
        mk(`a${i}`, "Alpha", D(`2026-05-04T10:0${i}:00Z`)),
      ),
    ];
    const issue = composeIssue(arts, {
      dayOfYear: 0,
      maxSeconds: 0,
      maxSectionItems: 5,
    });
    expect(issue.sections[0].items).toHaveLength(5);
    expect(issue.later).toHaveLength(3);
  });

  it("rotates sections deterministically by dayOfYear", () => {
    const make = (feed: string, n: number) =>
      Array.from({ length: n }, (_, i) =>
        mk(`${feed}${i}`, feed, D(`2026-05-04T10:0${i}:00Z`)),
      );
    const arts = [
      mk("c", "Cover", D("2026-05-04T12:00:00Z")),
      ...make("Alpha", 2),
      ...make("Beta", 2),
      ...make("Gamma", 2),
    ];
    const day0 = composeIssue(arts, { dayOfYear: 0, maxSeconds: 0 });
    const day1 = composeIssue(arts, { dayOfYear: 1, maxSeconds: 0 });
    const day2 = composeIssue(arts, { dayOfYear: 2, maxSeconds: 0 });
    expect(day0.sections.map((s) => s.feedTitle)).toEqual([
      "Alpha",
      "Beta",
      "Gamma",
    ]);
    expect(day1.sections.map((s) => s.feedTitle)).toEqual([
      "Beta",
      "Gamma",
      "Alpha",
    ]);
    expect(day2.sections.map((s) => s.feedTitle)).toEqual([
      "Gamma",
      "Alpha",
      "Beta",
    ]);
    // dayOfYear 3 wraps back to day0 ordering.
    const day3 = composeIssue(arts, { dayOfYear: 3, maxSeconds: 0 });
    expect(day3.sections.map((s) => s.feedTitle)).toEqual(
      day0.sections.map((s) => s.feedTitle),
    );
  });

  it("sorts later by publishedAt desc", () => {
    const arts = [
      mk("c", "Cover", D("2026-05-04T12:00:00Z")),
      mk("x", "Solo1", D("2026-05-04T08:00:00Z")),
      mk("y", "Solo2", D("2026-05-04T11:00:00Z")),
      mk("z", "Solo3", D("2026-05-04T09:00:00Z")),
    ];
    const issue = composeIssue(arts, {
      dayOfYear: 0,
      maxSeconds: 0,
      minSectionItems: 2,
    });
    expect(issue.later.map((a) => a.id)).toEqual(["y", "z", "x"]);
  });
});

describe("dayOfYear", () => {
  it("returns 1 for January 1", () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(1);
  });
  it("monotonically increases", () => {
    const a = dayOfYear(new Date(2026, 4, 4));
    const b = dayOfYear(new Date(2026, 4, 5));
    expect(b).toBe(a + 1);
  });
});
