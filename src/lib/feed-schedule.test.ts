import { describe, expect, it } from "vitest";
import { DEFAULT_REFRESH_MINUTES, isFeedDue } from "./feed-schedule";

const NOW = new Date(2026, 3, 7, 12, 0, 0).getTime();

function minutesAgo(min: number): Date {
  return new Date(NOW - min * 60_000);
}

describe("isFeedDue", () => {
  it("is due when lastFetched is null", () => {
    expect(
      isFeedDue({ lastFetched: null, refreshInterval: 60 }, NOW),
    ).toBe(true);
  });

  it("is not due when elapsed is less than interval", () => {
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(10), refreshInterval: 60 },
        NOW,
      ),
    ).toBe(false);
  });

  it("is due when elapsed exceeds interval", () => {
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(61), refreshInterval: 60 },
        NOW,
      ),
    ).toBe(true);
  });

  it("is due when elapsed equals interval exactly (>=)", () => {
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(60), refreshInterval: 60 },
        NOW,
      ),
    ).toBe(true);
  });

  it("falls back to defaultMinutes when refreshInterval is null", () => {
    // default=5, fetched 10 min ago → due
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(10), refreshInterval: null },
        NOW,
        5,
      ),
    ).toBe(true);

    // default=5, fetched 2 min ago → not due
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(2), refreshInterval: null },
        NOW,
        5,
      ),
    ).toBe(false);
  });

  it("per-feed refreshInterval overrides defaultMinutes", () => {
    // default=60 would say not-due, but feed override of 5 says due
    expect(
      isFeedDue(
        { lastFetched: minutesAgo(10), refreshInterval: 5 },
        NOW,
        60,
      ),
    ).toBe(true);
  });

  it("DEFAULT_REFRESH_MINUTES is 60", () => {
    expect(DEFAULT_REFRESH_MINUTES).toBe(60);
  });
});
