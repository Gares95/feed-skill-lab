import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dateRangeToSince, isDateRange } from "./date-range";

describe("isDateRange", () => {
  it("accepts valid ranges", () => {
    expect(isDateRange("all")).toBe(true);
    expect(isDateRange("today")).toBe(true);
    expect(isDateRange("week")).toBe(true);
    expect(isDateRange("month")).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isDateRange(undefined)).toBe(false);
    expect(isDateRange("")).toBe(false);
    expect(isDateRange("bogus")).toBe(false);
    expect(isDateRange("ALL")).toBe(false);
  });
});

describe("dateRangeToSince", () => {
  // Pin to 2026-04-07 14:30:45 local
  const fixed = new Date(2026, 3, 7, 14, 30, 45);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixed);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined for 'all'", () => {
    expect(dateRangeToSince("all")).toBeUndefined();
  });

  it("returns midnight of current day for 'today'", () => {
    const result = dateRangeToSince("today")!;
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(7);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("returns exactly 7 days earlier for 'week'", () => {
    const result = dateRangeToSince("week")!;
    expect(fixed.getTime() - result.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("returns exactly 30 days earlier for 'month'", () => {
    const result = dateRangeToSince("month")!;
    expect(fixed.getTime() - result.getTime()).toBe(30 * 24 * 60 * 60 * 1000);
  });
});
